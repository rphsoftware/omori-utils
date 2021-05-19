{
  let old_getOmori =Game_Party.prototype.getOmori ;
  Game_Party.prototype.getOmori = function () {
    let omori = old_getOmori.call(this);
    if( !omori) {
      return this.leader();
    }
    return omori;
  };
}
