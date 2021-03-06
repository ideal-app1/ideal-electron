import React from "react";

class JsonManager {


    static electron = window.require("electron");
    static fs = window.require('fs');
    static exec = window.require('child_process');

    static saveThis(toSave, path) {
        if (JsonManager.exist(path)) {
            let file = JsonManager.get(path);
            toSave = {...file, ...toSave}
        }
        const json = JSON.stringify(toSave);
        JsonManager.fs.writeFileSync(path, json);
    }

    static get(path) {
        if (!JsonManager.exist(path)) {
            return null;
        }
        let file = JsonManager.fs.readFileSync(path, 'utf8');
        const result = JSON.parse(file);
        return result;
    }

    static exist(path) {
        return JsonManager.fs.existsSync(path);

    }
}

export default JsonManager