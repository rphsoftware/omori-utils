var Imported = Imported || {};
var Archeia = Archeia || {};
Archeia.Steamworks = Archeia.Steamworks || {};
Archeia.Utils = Archeia.Utils || {};

var parameters = $plugins.filter(function (plugin) {
        return plugin.description.contains('<Archeia_Steamworks>');
    });
    if (parameters.length === 0) {
        throw new Error("Couldn't find the parameters of Archeia_Steamworks.");
    }

    Archeia.Steamworks.Parameters = parameters[0].parameters;
    Archeia.Steamworks.Param = {};

    Archeia.Steamworks.Param.debugMode = false

    // Store a copy of the user.
    Archeia.Steamworks.CachedUser = null;



    //================================================================================
    // DataManager
    //================================================================================


    Archeia.Steamworks.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        if (!Archeia.Steamworks.DataManager_isDatabaseLoaded.call(this)) return false;
        this.processSteamworksItemNotetags($dataItems);
        this.processSteamworksItemNotetags($dataWeapons);
        this.processSteamworksItemNotetags($dataArmors);
        this.processSteamworksClassNotetags($dataClasses);
        return true;
    };

    DataManager.processSteamworksItemNotetags = function(group) {
        for(let n = 1; n < group.length; n++) {
            let obj = group[n];
            obj.steamworks = {};
            obj.steamworks.achievementGrants = {};
            obj.steamworks.achievementClears = {};
        }
    };

    DataManager.processSteamworksClassNotetags = function(group) {
        for (var n = 1; n < group.length; n++) {
            let obj =  group[n];
            obj.steamworks = {};
            obj.steamworks.achievementGrants = {};
            obj.steamworks.achievementClears = {};
        }
    };

    //================================================================================
    // SceneManager - initializes the API.
    //================================================================================

    Archeia.Steamworks.SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize = function() {
        console.trace("ShreemWërks init");
        Archeia.Steamworks.SceneManager_initialize.call(this);
    };

    SceneManager.initSteamworks = function() {
        if (this.steamworksInitialized() == true) {
            console.info("#### Initialized Steamworks API ####");
        } else {
            console.warn("Steamworks failed to initialize.");
        }
    };

    SceneManager.steamworksInitialized = function() {
      return true;
    };


    //=============================================================================
    // SteamManager
    //=============================================================================
    function SteamManager() {
        throw new Error('This is a static class');
    }

     SteamManager.saveTextToCloud = function(file,contents,callback,errorcallback) {

      };
  
      SteamManager.readTextFromCloud = function(file,callback,errorcallback) {
 
      };
  
      SteamManager.isCloudSyncEnabledForUser = function() {
          return false;
      };
  
      SteamManager.isCloudEnabled = function() {
          return false;
      };
  
      SteamManager.enableCloud = function(flag) {
          return false;
      };
  
      SteamManager.getCloudQuota = function(callback,errorcallback) {

      };

    //================================================================================
    // Game_System
    //================================================================================

    Game_System.prototype.getSteamUserObject = function() {
            return null;
    };

    Game_System.prototype.getSteamName = function() {
        return "User";
    };

    Game_System.prototype.getSteamLevel = function() {
        return 1337;
    };

    Game_System.prototype.getSteamAccountId = function() {
        return 1;
    };

    Game_System.prototype.getSteamStaticAccountId = function() {
        return 1;
    };

    Game_System.prototype.getCachedSteamUser = function() {
       return null;
    };


    Game_System.prototype.unlockAchievement = function(achievement,callback,errorcallback) {

    };


    Game_System.prototype.forceUnlockAllAchievements = function() {

    };

    Game_System.prototype.getAchievements = function(){
            return [];
    };

    Game_System.prototype.getNumberOfAchievements = function() {
        return 70;
    };

    Game_System.prototype.clearAchievement = function(achievement,callback,errorcallback) {

    };

    Game_System.prototype.getAchievement = function(achievement,callback,errorcallback) {

    };

    Game_System.prototype.getCurrentGameLanguage = function() {
      return "en_US";
    };

    Game_System.prototype.getNumberOfPlayers = function(callback,errorcallback) {

    };

    Game_System.prototype.activateGameOverlay = function(option) {
      return true;
    };

    Game_System.prototype.isGameOverlayEnabled = function() {
        return false;
    };

    Game_System.prototype.activateGameOverlayToWebpage = function(url) {
        window.open(url);
    };

    Game_System.prototype.onAchievementUnlocked = function(achievement) {

    };

    Game_System.prototype.onAchievementCleared = function(achievement) {
        
    };

    //================================================================================
    // Game_Interpreter
    //================================================================================

    Archeia.Steamworks.GameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command,args) {
      if (command.toLowerCase() == "steamworks") {
          if (args.length < 1) return; // No action given.
          var action = args[0].toLowerCase();
          switch (action) {
              case "steamname":
              case "screenname":
              case "name":
                  if (args.length < 2) return; // No variable to put it in.
                  var steamname = $gameSystem.getSteamName();
                  if (steamname == null) steamname = -1; // failed to get name.
                  $gameVariables.setValue(parseInt(args[1]),steamname);
                  break;
              case "steamid":
              case "accountid":
              case "id":
                  if (args.length < 2) return; // No variable to put it in.
                  var steamid = $gameSystem.getSteamAccountId();
                  if (steamid == null) steamid = -1;
                  $gameVariables.setValue(parseInt(args[1]),steamid);
                  break;
              case "staticsteamid":
              case "staticid":
              case "staticaccountid":
                  if (args.length < 2) return; // No variable to put it in.
                  var statid = $gameSystem.getSteamStaticAccountId();
                  if (statid == null) statid = -1;
                  $gameVariables.setValue(parseInt(args[1]),statid);
                  break;
              case "level":
              case "steamlevel":
                  if (args.length < 2) return; // No variable to put it in.
                  var level = $gameSystem.getSteamLevel();
                  if (level == null) level = -1;
                  $gameVariables.setValue(parseInt(args[1]),level);
                  break;
              case "numofplayers":
              case "playercount":
                  if (args.length < 2) return; // No variable to put it in.
                  $gameSystem.getNumberOfPlayers(function(count) {
                      $gameVariables.setValue(parseInt(args[1]),count);
                  },function(err){
                      if (Archeia.Steamworks.Param.debugMode) {
                          console.error("[ARCHEIA STEAMWORKS] An error occurred when attempting to get player count. Is Steamworks Initialized?")
                      }
                      $gameVariables.setValue(parseInt(args[1]),-1);
                  });
                  break;
              case "numofachievements":
              case "achievementcount":
                  if (args.length < 2) return; // No variable to put it in.
                  var achievementcount = $gameSystem.getNumberOfAchievements();
                  if (achievementcount == null) achievementcount = -1;
                  $gameVariables.setValue(parseInt(args[1]),achievementcount);
                  break;
              case "overlayenabled":
              case "gameoverlayenabled":
              case "steamoverlayenabled":
                  if (args.length < 2) return; // No variable to put it in.
                  var overlayenabled = $gameSystem.isGameOverlayEnabled();
                  if (overlayenabled == null) overlayenabled = -1;
                  if (overlayenabled == true) overlayenabled = 1;
                  if (overlayenabled == false) overlayenabled = 0;
                  $gameVariables.setValue(parseInt(args[1]),overlayenabled);
                  break;
              case "openoverlay":
              case "opensteamoverlay":
              case "opengameoverlay":
                  if (args.length < 2) return; // No overlay option given.
                  $gameSystem.activateGameOverlay(args[1]);
                  break;
              case "openoverlaytourl":
              case "opengameoverlayurl":
              case "opensteamovertourl":
                  if (args.length < 2) return; // no url given.
                  args = args.splice(1,args.length - 1);
                  $gameSystem.activateGameOverlayToWebpage(args.join(''));
                  break;
              case "activateachievement":
              case "giveachivement":
              case "grantachievement":
                  if (args.length < 2) return; // no achievement name given.
                  args = args.splice(1,args.length - 1);
                  $gameSystem.unlockAchievement(args.join(''),$gameSystem.onAchievementUnlocked,null);
                  break;
              case "deactivateachievement":
              case "clearachievement":
                  if (args.length < 2) return; // no achievement name given.
                  args = args.splice(1,args.length - 1);
                  $gameSystem.clearAchievement(args.join(''),$gameSystem.onAchievementCleared,null);
                  break;
          }
      } else {
          Archeia.Steamworks.GameInterpreter_pluginCommand.call(this,command,args);
      }
    };

    //================================================================================
    // UTILS
    //================================================================================

    // The below is a string formatting function that gives me/js/people/anyone/stuff
    // the ability to use C#/C styled string formatting using {0},{1} for parameters.
    // I prefer this method, as it is what I'm used to.
    // - Liquidize
    if (!Archeia.Utils.sformat) {
        Archeia.Utils.sformat = function () {
            var theString = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
                var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
                theString = theString.replace(regEx, arguments[i]);
            }
            return theString;
        };
    }

Imported["Archeia_Steamworks"] = 1.00;