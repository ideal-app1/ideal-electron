import { LiteGraph } from 'litegraph.js';
import createMethodNode from './CodeLinkNodes/MethodNode';
import createFunctionNode from './CodeLinkNodes/FunctionNode';
import createValue from './CodeLinkNodes/ConstValueNode';
import createClassNode from './CodeLinkNodes/ClassNode';
import createConstructorAttributeNode from './CodeLinkNodes/ConstructorAttributeNode';

let LCanvas = null;


const getClass = (widget, data) => {
  return (data.find(classData => {
    return (classData['name'] === widget);
  }));
};

const getConstructor = (widget, data) => {
  const widgetData = getClass(widget, data);

  if (!widgetData) {
    console.log(`Error - The class ${widget} was not found.`);
    console.log(data);
    //TODO implement an error when the widget is not found.
    return;
  }
  return (widgetData['constructors'].find(constructorData => constructorData['isMainConstructor'] === 'true'));

};


const CodeLinkNodeLoader = {

  createMainWidget: (className) => {
    const mainWidget = LiteGraph.createNode('Classes/' + className);

    mainWidget.pos = [250, 250];
    LCanvas.graph.add(mainWidget);
    return mainWidget;
  },

  createAttributes: (widget, constructor, requiredOnly = true) => {
    const tmpPos = [widget.pos[0] + widget.size[0] + 50, widget.pos[1]];
    let previousAttribute = undefined;

    constructor.parameters.forEach((constructorParameter) => {
      let attribute = undefined;
      let offset = previousAttribute ? 50 : 0;

      if (requiredOnly === true && constructorParameter.isRequired !== 'true') {
        return;
      }
      attribute = LiteGraph.createNode(widget.name + ' constructor\'s attributes/' + constructorParameter['name']);
      tmpPos[1] += offset + (previousAttribute ? previousAttribute.size[1] : 0);
      LCanvas.graph.add(attribute);
      attribute.pos = [tmpPos[0], tmpPos[1]];

      //attribute.pos[1] += attribute.size[1] + 50;
      widget.connect(0, attribute, 0);
      previousAttribute = attribute
    });
  },

  registerLCanvas: canvasToRegister => {
    LCanvas = canvasToRegister;
  },


  loadClassAndAttributes: (variableName, className, parsed, id) => {
    const constructor = getConstructor(className, parsed['classes']);
    const specificClass = getClass(className, parsed['classes']);

    createClassNode(variableName, specificClass, LCanvas, 'Classes/');
    if (constructor) {
      constructor['parameters'].forEach((constructorParameter) => {
        createConstructorAttributeNode(className, constructorParameter, LCanvas, 'Current Flutter class attributes/');
      });
    }
  },

  loadEveryKnownNodes: (parsed, className, id) => {

    if (parsed === undefined)
      return;
    parsed['funcs'].forEach((data) => {
      createFunctionNode(data, LCanvas, 'Custom functions/');
    });
    parsed['constValues'].forEach((data) => {
      createValue(data, LCanvas, 'Custom const values/');
    });

    parsed['classes'].forEach((classObject) => {
      createClassNode(undefined, classObject, LCanvas, 'Custom class/');
      classObject['methods'].forEach((value) => {
        createMethodNode(value, classObject['name'], LCanvas, `Custom class/${classObject['name']}/`);
      });
    });
  },

  addMainWidgetToView: (widget, data) => {
    const constructor = getConstructor(widget, data);
    let mainWidget = undefined;

    if (!constructor) {
      console.log(`Error - The constructor of ${widget} was not found.`);
      //TODO implement an error when the main constructor is not found.
      return;
    }
    mainWidget = CodeLinkNodeLoader.createMainWidget(widget);
    //CodeLinkNodeLoader.createAttributes(mainWidget, constructor, mainWidget.pos);
  }
};


Object.freeze(CodeLinkNodeLoader);
export default CodeLinkNodeLoader;
