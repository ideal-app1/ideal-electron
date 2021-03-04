import React from "react";

class JsonManager {


    static electron = window.require("electron");
    static fs = window.require('fs');
    static exec = window.require('child_process');

    static saveThis(toSave, path) {
        console.log(toSave);
        const json = JSON.stringify(toSave);
        console.log(json);
        JsonManager.fs.writeFileSync(path, json);
    }
}

export default JsonManager