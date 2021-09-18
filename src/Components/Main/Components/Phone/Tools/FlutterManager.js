import React from "react";
import {v4 as uuid} from 'uuid';
import {TypeToGetValue} from "../../../../../utils/WidgetUtils";

class FlutterManager {

    static FileCodeAlreadyOpen = [];
    static RootVariableName = "";

    static electron = window.require("electron");
    static fs = window.require('fs');
    static exec = window.require('child_process');


    static initialization = "";

    static getCode(codePathFile) {
        let result = null;

        FlutterManager.FileCodeAlreadyOpen.map((tmp) => {
            if (tmp.file === codePathFile) {
                result = tmp.code;
            }
        });
        return result;
    }

    static getInitialisation(code)
    {
        const initRegex = new RegExp(/(\/\* IDEAL_INITIALISATION_START \*\/)((.|\s)+?)(\/\* IDEAL_INITIALISATION_END \*\/)/gm);
        const found = code.match(initRegex);

        return found[0];
    }

    static findProperties(properties, toFind)
    {
        let result = undefined;

        Object.keys(properties).map((key) => {
            if (properties[key].variableName === toFind) {
                result = properties[key];
            }
        });
        return result;
    }

    static declarationName(code, name, properties) {
        let result = [];
        const regexVariableName = new RegExp(`(var )(.+)(;)`);
        let match;

        while ((match = code.match(regexVariableName)) !== null) {
            let declaration = null;
            const find = FlutterManager.findProperties(properties, match[2]);

            if (find !== undefined) {
                declaration = TypeToGetValue[find.type](find.value);
            }

            let varName = name + "_" + match[2];
            if (result.length === 0) {
                varName = name;
            }

            result.push({
                before: match[2],
                name: varName,
                declaration:"var " + varName + (declaration !== null ? " = " + declaration : "") + ";"
            });
            code = code.replace(match[0], "");
        }
        return result;
    }

    static initName(code, nameList) {
        nameList.map((name) => {
            code = code.replaceAll(name.before, name.name);
        });

        return code;
    }

    static initChild(code, variablesName) {
        let result = code;
        const regex = new RegExp(`(\/\\* IDEAL_CHILD \\*\/)`);

        while (result.match(regex) !== null) {
            result = result.replace(regex, variablesName);
        }
        return result;
    }

    static getDeclarationAndSetInitialisation(code, name, properties)
    {
        let result = code;
        let initialisation = FlutterManager.getInitialisation(result);

        result = result.replace(initialisation, '');
        const declarationsInfo = FlutterManager.declarationName(result, name, properties);

        initialisation = FlutterManager.initName(initialisation, declarationsInfo);
        FlutterManager.initialization += initialisation + "\n";

        return declarationsInfo;
    }

    static getName(widget)
    {
        if (!widget.properties.name) {
            return uuid();
        }

        return widget.properties.name.value;
    }

    static getChildren(declaration)
    {
        declaration.shift();
        return (declaration);
    }

    static widgetToCodeHandlerFormat(widget)
    {
        let code = "";
        let declaration = [];
        let name = "";

        if ((code = FlutterManager.getCode(widget.codePathFile)) == null) {
            code = require("../../../../../flutterCode/" + widget.codePathFile);

            FlutterManager.FileCodeAlreadyOpen.push({file: widget.codePathFile, code: code});
        }

        name = FlutterManager.getName(widget);
        declaration = FlutterManager.getDeclarationAndSetInitialisation(code, name, widget.properties);

        return {declaration: declaration[0].declaration, name:declaration[0].name, children:FlutterManager.getChildren(declaration)};
    }

    static getAllCode(widgetArray)
    {
        let declarations = [];
        let childDeclarations;

        widgetArray.map((widget) => {
            if (widget.codePathFile) {
                declarations.push(FlutterManager.widgetToCodeHandlerFormat(widget));

                if (widget.list && widget.list.length > 0) {
                    childDeclarations = FlutterManager.getAllCode(widget.list);
                }
            }
        });

        if (childDeclarations) {
            let variablesString = "";
            childDeclarations.declarations.map((variable) => {

                variablesString += variable.name + ',\n'
            })
            FlutterManager.initialization = FlutterManager.initChild(FlutterManager.initialization, variablesString);

            declarations = [...declarations, ...childDeclarations.declarations]
        }


        return {declarations: declarations, initialization:FlutterManager.initialization};
    }

    static writeCodeLink(code, path) {
        let file = FlutterManager.fs.readFileSync(path, 'utf8');

        file = file.replace(/(\/\* IDEAL_INITIALISATION_CODELINK_START \*\/)((.|\s)+?)(\/\* IDEAL_INITIALISATION_CODELINK_END \*\/)/gm, "/* IDEAL_INITIALISATION_CODELINK_START */\n" + code + "\n/* IDEAL_INITIALISATION_CODELINK_END */\n");
        FlutterManager.fs.writeFileSync(path, file);
    }

    static writeCodeImport(code, path) {
        let file = FlutterManager.fs.readFileSync(path, 'utf8');

        file = file.replace(/(\/\* IDEAL_IMPORT_START \*\/)((.|\s)+?)(\/\* IDEAL_IMPORT_END \*\/)/gm, "/* IDEAL_IMPORT_START */\n" + code + "\n/* IDEAL_IMPORT_END */\n");
        FlutterManager.fs.writeFileSync(path, file);
    }

    static formatDragAndDropToCodeHandler(jsonData, path) {
        FlutterManager.initialization = "";
        const code = FlutterManager.getAllCode([jsonData]);


        console.log(code);
        return code;
    }


}

export default FlutterManager
