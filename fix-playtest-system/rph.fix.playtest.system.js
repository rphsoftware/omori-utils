{
  let z = DataManager.onLoad;
  DataManager.onLoad = function(l) {
    if (l == $dataSystem) { $dataSystem.hasEncryptedAudio = true; $dataSystem.hasEncryptedImages = true; }
    z.call(this, l);
  }
}