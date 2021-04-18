import React from "react";

class FlutterManager {

    static FileCodeAlreadyOpen = [];

    static electron = window.require("electron");
    static fs = window.require('fs');
    static exec = window.require('child_process');

    static getCode(codePathFile) {
        let result = null;

        FlutterManager.FileCodeAlreadyOpen.map((tmp) => {
            if (tmp.file === codePathFile) {
                result = tmp.code;
            }
        });
        return result;
    }

    static getAllCode(widgetArray)
    {
        let child = null;
        const code = widgetArray.map((widget) => {
            if (widget.codePathFile) {
                let result = {code: ""};
                if ((result.code = FlutterManager.getCode(widget.codePathFile)) == null) {
                    result.code = FlutterManager.fs.readFileSync("src\\flutterCode" + "\\" + widget.codePathFile, 'utf8');
                    FlutterManager.FileCodeAlreadyOpen.push({file: widget.codePathFile, code: result.code});
                }
                if (widget.widgetList && widget.widgetList.length > 0) {
                    child = FlutterManager.getAllCode(widget.widgetList);
                }
                return result;
            }
        });
        console.log(code);

        const codeResult = code.reduce((result, item) => {
            if (child) {
                item.code = item.code.replace(/(\/\* IDEAL_CHILD \*\/)/gm, child + "\n");
            }
            return result + item.code + ",";
        }, "")
        return codeResult;
    }

    static witeCode(jsonData, path) {
        const code = FlutterManager.getAllCode(jsonData.widgetList);

        let file = FlutterManager.fs.readFileSync(path, 'utf8');
        console.log(file);
        console.log(code);
        file = file.replace(/(\/\* IDEAL_START \*\/)((.|\s)+?)(\/\* IDEAL_END \*\/)/gm, "/* IDEAL_START */\n" + code + "\n/* IDEAL_END */\n");
        console.log(file);
        FlutterManager.fs.writeFileSync(path, file);
    }


}

export default FlutterManager