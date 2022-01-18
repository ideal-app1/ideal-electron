import { LiteGraph } from 'litegraph.js';
import createMethodNode from './CodeLinkNodes/MethodNode';
import createFunctionNode from './CodeLinkNodes/FunctionNode';
import createValue from './CodeLinkNodes/ConstValueNode';
import createClassNode from './CodeLinkNodes/ClassNode';
import createConstructorAttributeNode from './CodeLinkNodes/ConstructorAttributeNode';
import Path from '../../utils/Path';
import Main from '../Main/Main';

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

  createMainWidget: (variableName) => {


    const path = `View${Main.selection}/${variableName}`;
    console.log(`Try of ${path}`);
    const mainWidget = LiteGraph.createNode(path);

    mainWidget.pos = [250, 250];
    LCanvas.graph.add(mainWidget);
    return mainWidget;
  },

  createAttributes: (widget, parentName, constructor, requiredOnly = true) => {
    const tmpPos = [widget.pos[0] + widget.size[0] + 50, widget.pos[1]];
    let previousAttribute = undefined;

    constructor.parameters.forEach((constructorParameter) => {
      let attribute = undefined;
      let offset = previousAttribute ? 50 : 0;
      const path = `Classes attributes/${widget.name} attributes/${constructorParameter.name}`;//`View${Main.selection}/${parentName}/${widget.name} constructor's attributes/${constructorParameter['name']}`;

      if (requiredOnly === true && constructorParameter.isRequired !== 'true') {
        return;
      }
      console.log(`try to load ${path}`);
      attribute = LiteGraph.createNode(path);
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


  // Path parameter is where the node will be loaded on LiteGraph
  // It must be either empty or in this format: `path/to/something/`
  loadClassAndAttributes: (variableName, className, parsed, id, path = '') => {
    const constructor = getConstructor(className, parsed['classes']);
    const specificClass = getClass(className, parsed['classes']);

    path = `${path}${variableName}`;
    console.log(`Path ? ${path}`)
    createClassNode(variableName, specificClass, LCanvas, `${path}`);
    if (constructor) {
      path = `Classes attributes/${className} attributes`
      constructor['parameters'].forEach((constructorParameter) => {
        createConstructorAttributeNode(className, constructorParameter, LCanvas, `${path}/${constructorParameter.name}`);
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

  addMainWidgetToView: (widget, variableName, data) => {
    const constructor = getConstructor(widget, data);
    let mainWidget = undefined;

    if (!constructor) {
      console.log(`Error - The constructor of ${widget} was not found.`);
      //TODO implement an error when the main constructor is not found.
      return;
    }
    mainWidget = CodeLinkNodeLoader.createMainWidget(variableName);
    //CodeLinkNodeLoader.createAttributes(mainWidget, constructor,);
  }
};


Object.freeze(CodeLinkNodeLoader);
export default CodeLinkNodeLoader;
