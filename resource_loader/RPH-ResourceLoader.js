(function() {
    let rules = {
        "image":[],
        "image_regexp":[],
        "audio":[],
        "audio_regexp":[],
        "movie":[],
        "movie_regexp":[]
    };

    $modLoader.mods.forEach((v) => { 
        if(v.enabled) { 
            if (v.meta._resourceLoader) { 
                let rl = v.meta._resourceLoader;
                if (rl.image) rules.image.push(...rl.image);
                if (rl.image_regexp) rules.image_regexp.push(...rl.image_regexp);
                if (rl.audio) rules.audio.push(...rl.audio);
                if (rl.audio_regexp) rules.audio_regexp.push(...rl.audio_regexp);
                if (rl.movie) rules.movie.push(...rl.movie);
                if (rl.movie_regexp) rules.movie_regexp.push(...rl.movie_regexp);
            }
        }
    });

    function matcher(input, type) {
        let ruleSet = rules[type];
        let ruleSetReg = rules[type + "_regexp"];

        for (let rule of ruleSet) {
            if (input.includes(rule[0])) return [rule[1],true];
        }

        for (let rule of ruleSetReg) {
            let re = new RegExp(rule[0], "gim");
            let matches = input.match(re);
            if (matches && matches[0] === input) {
                return [rule[1],true];
            }
        }

        return [input,false];
    }

    let oldVideoLoader = PIXI.Texture.fromVideoUrl;

    PIXI.Texture.fromVideoUrl = function(url, scaleMode, crossorigin, autoplay) {
        return oldVideoLoader(matcher(url, "movie")[0], scaleMode, crossorigin, autoplay);
    }

    function audioResolver(url) {
        let matches = matcher(url, "audio");
        if (matches[1]) {
            if (WebAudio._context) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', matches[0]);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function() {
                    if (xhr.status < 400) {
                        this._onXhrLoad(xhr);
                    }
                }.bind(this);
                xhr.onerror = this._loader || function(){this._hasError = true;}.bind(this);
                xhr.send();
                xhr.wasOverriden = true;
            }
            return true;
        } else {
            return false;
        }
    }

    function bitmapResolver(url) { 
        let matches = matcher(url, "image");
        if (matches[1]) { 
            this._image = new Image();
            this._image.src = matches[0];
        
            this._loadingState = 'requesting';
            this._url = url;
            this._image.url = url;
    
            this._image.addEventListener('load', this._loadListener = Bitmap.prototype._onLoad.bind(this));
            this._image.addEventListener('error', this._errorListener = this._loader || Bitmap.prototype._onError.bind(this));
            console.log(url, matches);
            return true;
        } else { 
            return false; 
        }
    }


    let oldWebAudio = WebAudio;

    window.WebAudio = class extends oldWebAudio {
        _load(url) {
            if (!audioResolver.bind(this)(url)) {
                super._load(url);
            }
        }
        _onXhrLoad(xhr) {
            if (!xhr.wasOverriden) { 
                super._onXhrLoad(xhr); 
            } else{
                var array = xhr.response;
        
                this._readLoopComments(new Uint8Array(array));
                WebAudio._context.decodeAudioData(array, function(buffer) {
                    this._buffer = buffer;
                    this._totalTime = buffer.duration;
                    if (this._loopLength > 0 && this._sampleRate > 0) {
                        this._loopStart /= this._sampleRate;
                        this._loopLength /= this._sampleRate;
                    } else {
                        this._loopStart = 0;
                        this._loopLength = this._totalTime;
                    }
                    this._onLoad();
                }.bind(this));
            }
        }
    }

    let oldBitMap = Bitmap;

    window.Bitmap = class extends oldBitMap {
        _requestImage(url) {
            console.log(url);
            if (typeof url !== "string") super._requestImage(url);
            if (!bitmapResolver.bind(this)(url)) {
                super._requestImage(url);
            }
        }
    }

    window.m = matcher;
})();
