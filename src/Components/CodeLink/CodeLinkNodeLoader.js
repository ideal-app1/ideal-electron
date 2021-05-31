import {LiteGraph} from "litegraph.js";
import createMethodNode from "./CodeLinkNodes/MethodNode";
import createFunctionNode from "./CodeLinkNodes/FunctionNode";
import createValue from "./CodeLinkNodes/ConstValueNode";
import createClassNode from "./CodeLinkNodes/ClassNode";
import createConstructorAttributeNode from "./CodeLinkNodes/ConstructorAttributeNode";

let LCanvas = null;

const getConstructor = (widget, data) => {
    const widgetData = data.find(classData => {
        return (classData["name"] === widget);

    });

    if (!widgetData) {
        console.log("Error - The class was not found.");
        //TODO implement an error when the widget is not found.
        return;
    }
    return (widgetData['constructors'].find(constructorData => constructorData['isMainConstructor'] === "true"));

}

const createMainWidget = (className) => {
    console.log("THE LENGTH");
    const mainWidget = LiteGraph.createNode("Classes/" + className);
    mainWidget.pos = [250, 250];
    LCanvas.graph.add(mainWidget);
}


const createAttributes = (widget, constructor, requiredOnly = true) => {

    const pos = [500, 250];

    constructor.parameters.forEach((constructorParameter) => {
        const tmpPos = [pos[0], pos[1]];
        if (requiredOnly === true && constructorParameter.isRequired !== "true") {
            return;
        }
        const attribute = LiteGraph.createNode(widget + " constructor's attributes/" + constructorParameter["name"]);
        attribute.pos = tmpPos;
        LCanvas.graph.add(attribute);
        pos[1] += attribute.size[1] + 50;
    });
}

const CodeLinkNodeLoader = {
    registerLCanvas: canvasToRegister => {
      LCanvas = canvasToRegister;
    },

    //TODO remove varName to something more clever
    loadEveryKnownNodes: (parsed, varName) => {

        const constructor = getConstructor('TextButton', parsed["classes"]);

        parsed["funcs"].forEach((data) => {
            createFunctionNode(data, LCanvas);
        });
        parsed["constValues"].forEach((data) => {
            createValue(data, LCanvas);
        });
        if (constructor) {
            constructor["parameters"].forEach((constructorParameter) => {
                createConstructorAttributeNode('TextButton', constructorParameter, LCanvas);
            })
        }

        parsed["classes"].forEach((classObject) => {
            if (classObject["name"] === "TextButton") {
                createClassNode(classObject, true, LCanvas, varName);
                classObject["methods"].forEach((value) => {
                    createMethodNode(value, classObject["name"], LCanvas);
                });
            }
        });
    },
    addMainWidgetToView: (widget, data) => {
        console.log("Im called")
        const constructor = getConstructor(widget, data);

        if (!constructor) {
            console.log("Error - The constructor was not found.");
            //TODO implement an error when the main constructor is not found.
            return;
        }
        createMainWidget(widget);
        createAttributes(widget, constructor);
    }
}



Object.freeze(CodeLinkNodeLoader);
export default CodeLinkNodeLoader;
