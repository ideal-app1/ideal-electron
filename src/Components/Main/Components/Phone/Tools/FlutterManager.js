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
            const regex = new RegExp(`(\/\\* ${props[key].codeFlag} \\*\/)`)
            code = code.replace(regex, props[key].value);
        });
        return code;
    }

    static getAllCode(widgetArray)
    {
        let child = null;
        let code = "";
        let valiablesNames = [];
        let codeInit = "";

        widgetArray.map((widget) => {
            if (widget.codePathFile) {
                let tmp = "";
                if ((tmp = FlutterManager.getCode(widget.codePathFile)) == null) {
                    tmp = FlutterManager.fs.readFileSync("src\\flutterCode" + "\\" + widget.codePathFile, 'utf8');
                    FlutterManager.FileCodeAlreadyOpen.push({file: widget.codePathFile, code: tmp});
                }

                tmp = FlutterManager.fillProperties(tmp, widget.properties);

                code += tmp;

                const initRegex = new RegExp(/(\/\* IDEAL_INITIALISATION_START \*\/)((.|\s)+?)(\/\* IDEAL_INITIALISATION_END \*\/)/gm);
                const found = code.match(initRegex);
                found[0] = found[0];
                code = code.replace(found[0], '');
                const regex = new RegExp(`(\/\\* IDEAL_VARIABLE_NAME \\*\/)`);
                const variableName = widget._id.replace(/[^a-z]+/g, "");
                valiablesNames.push(variableName);
                if (FlutterManager.RootVariableName === "") {
                    FlutterManager.RootVariableName = variableName;
                }
                code = code.replace(regex, variableName);
                codeInit += found[0].replace(regex, variableName);
                codeInit = codeInit.replace('\/\* IDEAL_INITIALISATION_START \*\/', '');
                codeInit = codeInit.replace('\/\* IDEAL_INITIALISATION_END \*\/', '');


                console.log(code);
                console.log(codeInit);
                if (widget.list && widget.list.length > 0) {
                    child = FlutterManager.getAllCode(widget.list);
                }
            }
        });

        if (child) {
            let variablesString = '';


            child.valiablesNames.map((variable) => {
                variablesString += variable + ',\n'
            })
            codeInit = codeInit.replace(/(\/\* IDEAL_CHILD \*\/)/gm, variablesString + "\n");
            code = child.code + code;
            codeInit = child.codeInit + codeInit;

        }



        return {code: code, valiablesNames: valiablesNames, codeInit: codeInit};
    }

    static witeCode(jsonData, path) {
        const code = FlutterManager.getAllCode([jsonData]);

        console.log(code.code);
        console.log(code.codeInit);
        let file = FlutterManager.fs.readFileSync(path, 'utf8');

        file = file.replace(/(\/\* IDEAL_VARIABLE_START \*\/)((.|\s)+?)(\/\* IDEAL_VARIABLE_END \*\/)/gm, "/* IDEAL_VARIABLE_START */\n" + code.code + "\n/* IDEAL_VARIABLE_END */\n");
        file = file.replace(/(\/\* IDEAL_INITIALISATION_START \*\/)((.|\s)+?)(\/\* IDEAL_INITIALISATION_END \*\/)/gm, "/* IDEAL_INITIALISATION_START */\n" + code.codeInit + "\n/* IDEAL_INITIALISATION_END */\n");


        file = file.replace(/(\/\* IDEAL_BODY_START \*\/)((.|\s)+?)(\/\* IDEAL_BODY_END \*\/)/gm, "/* IDEAL_BODY_START */\n" + FlutterManager.RootVariableName + "\n/* IDEAL_BODY_END */\n");


        FlutterManager.fs.writeFileSync(path, file);
        FlutterManager.RootVariableName = "";
    }


}

export default FlutterManager