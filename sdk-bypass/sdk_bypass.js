window.navigator.plugins.namedItem = function() {
    return null;
}

Scene_OmoriFile.prototype.saveGame = function() {
    // On Before Save
    $gameSystem.onBeforeSave();
    // Get Save File ID
    var saveFileid = this.savefileId();
    // Get File Window
    var fileWindow = this._fileWindows[this._saveIndex];
    // Save Game
    if (DataManager.saveGame(saveFileid)) {
    SoundManager.playSave();
    StorageManager.cleanBackup(saveFileid);
    var world;
    if($gameSwitches.value(448) && $gameSwitches.value(447)) {
        world = 449 // Special Flag When both the switches are on;
    }
    else if ($gameSwitches.value(448)) {
        world = 448;
    } else if ($gameSwitches.value(447)) {
        world = 447;
    } else if ($gameSwitches.value(446)) {
        world = 446;
    } else if ($gameSwitches.value(445)) {
        world = 445;
    } else if ($gameSwitches.value(444)) {
        world = 444;
    } else {
        world = 0
    }
    DataManager.writeToFileAsync(world.toString(), "TITLEDATA", () => {
        fileWindow.refresh();
        // Deactivate Prompt Window
        this._promptWindow.deactivate();
        this._promptWindow.close();
        // Set Can select Flag to false
        this._canSelect = true;
        // Update Save Index Cursor
        this.updateSaveIndexCursor();
    });
    //   console.log(world); 
    } else {
    SoundManager.playBuzzer();
    // Deactivate Prompt Window
    this._promptWindow.deactivate();
    this._promptWindow.close();
    // Set Can select Flag to false
    this._canSelect = true;
    // Update Save Index Cursor
    this.updateSaveIndexCursor();
    };
};