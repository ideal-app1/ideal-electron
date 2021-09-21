import {LiteGraph} from "litegraph.js";
import createMethodNode from "./CodeLinkNodes/MethodNode";
import createFunctionNode from "./CodeLinkNodes/FunctionNode";
import createValue from "./CodeLinkNodes/ConstValueNode";
import createClassNode from "./CodeLinkNodes/ClassNode";
import createConstructorAttributeNode from "./CodeLinkNodes/ConstructorAttributeNode";

let LCanvas = null;


const getClass = (widget, data) => {
  return (data.find(classData => {
    return (classData["name"] === widget);
  }));
}

const getConstructor = (widget, data) => {
    const widgetData = getClass(widget, data);

    if (!widgetData) {
        console.log(`Error - The class ${widget} was not found.`);
        console.log(data)
        //TODO implement an error when the widget is not found.
        return;
    }
    return (widgetData['constructors'].find(constructorData => constructorData['isMainConstructor'] === "true"));

}


const createMainWidget = (className) => {
    console.log("THE LENGTH");
    const mainWidget = LiteGraph.createNode("Classes/" + className);
    console.log(className)
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


    loadSpecificFlutterNodes: (variableName, className, parsed, id) => {
      const constructor = getConstructor(className, parsed['classes']);
      const specificClass = getClass(className, parsed['classes']);


      createClassNode(variableName, specificClass, LCanvas, 'Classes/');
      if (constructor) {
        constructor["parameters"].forEach((constructorParameter) => {
          createConstructorAttributeNode(className, constructorParameter, LCanvas, 'Current Flutter class attributes/');
        })
      }
    },

    loadEveryKnownNodes: (parsed, className, id) => {

        if (parsed === undefined)
          return;
        parsed["funcs"].forEach((data) => {
            createFunctionNode(data, LCanvas, 'Custom functions/');
        });
        parsed["constValues"].forEach((data) => {
            createValue(data, LCanvas, 'Custom const values/');
        });

        parsed["classes"].forEach((classObject) => {
                createClassNode(undefined, classObject, LCanvas,'Custom class/');
                classObject["methods"].forEach((value) => {
                    createMethodNode(value, classObject["name"], LCanvas, `Custom class/${classObject['name']}/`);
                });
        });
    },

    addMainWidgetToView: (widget, data) => {
        console.log("Im called")
        const constructor = getConstructor(widget, data);

        if (!constructor) {
            console.log(`Error - The constructor of ${widget} was not found.`);
            //TODO implement an error when the main constructor is not found.
            return;
        }
        createMainWidget(widget);
        createAttributes(widget, constructor);
    }
}



Object.freeze(CodeLinkNodeLoader);
export default CodeLinkNodeLoader;
