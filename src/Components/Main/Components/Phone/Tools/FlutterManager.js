import React from "react";

class FlutterManager {

    static FileCodeAlreadyOpen = [];
    static RootVariableName = "";

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

    static fillProperties(code, props)
    {
        Object.keys(props).map((key) => {
            const regex = new RegExp(`(\/\\* ${props[key].codeFlage} \\*\/)`)
            code = code.replace(regex, props[key].value);
        });
        return code;
    }

    static getAllCode(widgetArray)
    {
        let child = null;
        let code = "";
        console.log(widgetArray);
        widgetArray.map((widget) => {
            console.log(widget);
            if (widget.codePathFile) {
                let tmp = "";
                if ((tmp = FlutterManager.getCode(widget.codePathFile)) == null) {
                    tmp = FlutterManager.fs.readFileSync("src\\flutterCode" + "\\" + widget.codePathFile, 'utf8');
                    FlutterManager.FileCodeAlreadyOpen.push({file: widget.codePathFile, code: tmp});
                }

                tmp = FlutterManager.fillProperties(tmp, widget.properties);
                if (widgetArray.length > 1) {
                    tmp += ",\n";
                }
                code += tmp;

                const regex = new RegExp(`(\/\\* IDEAL_VARIABLE_NAME \\*\/)`);
                const variableName = widget._id.replace(/[^a-z]+/g, "");
                if (FlutterManager.RootVariableName == "") {
                    FlutterManager.RootVariableName = variableName;
                }
                code = code.replace(regex, variableName);

                if (widget.widgetList && widget.widgetList.length > 0) {
                    child = FlutterManager.getAllCode(widget.widgetList);
                }
            }
        });

        console.log(code);
        if (child) {
            code = code.replace(/(\/\* IDEAL_CHILD \*\/)/gm, child + "\n");
        }



        return code;
    }

    static witeCode(jsonData, path) {
        const code = FlutterManager.getAllCode(jsonData.widgetList);

        console.log(code);
        let file = FlutterManager.fs.readFileSync(path, 'utf8');

        file = file.replace(/(\/\* IDEAL_VARIABLE_START \*\/)((.|\s)+?)(\/\* IDEAL_VARIABLE_END \*\/)/gm, "/* IDEAL_VARIABLE_START */\n" + code + "\n/* IDEAL_VARIABLE_END */\n");


        file = file.replace(/(\/\* IDEAL_BODY_START \*\/)((.|\s)+?)(\/\* IDEAL_BODY_END \*\/)/gm, "/* IDEAL_BODY_START */\n" + FlutterManager.RootVariableName + "\n/* IDEAL_BODY_END */\n");


        FlutterManager.fs.writeFileSync(path, file);
        FlutterManager.RootVariableName = "";
    }


}

export default FlutterManager