import {LiteGraph} from "litegraph.js";
import sharedBuffer from "../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "./NodeBase";
import NodeTransferData from './NodeTransferData'

const convertDartTypeToLiteral = (type) => {
  const knownType = ['int', 'double', 'long', 'long long', 'long long int', 'double', 'float'];

  if (knownType.find((value) => value === type) !== undefined) {
    return ("number");
  }
  return ("string");
}


const createRValueNode = (type, defaultValue) => {

  function RValueNode() {

    inheritNodeBase(RValueNode, this)
    this.addOutput("value", type);
    this.widget = this.addWidget(type, "value", defaultValue, (v) => {
      this.value = v;
      this.mdr = v;
      this.setProperty("value", v)
    }, );
    this.widgets_up = true;
    this.varName = this.makeId(15);
    this.type = type;
  }


  RValueNode.prototype.onPropertyChanged = function(property, value, prevValue) {
    this.setProperty(property, value)
    this.widget.value = value
    this.value = value


  }


  RValueNode.prototype.onAdded = function () {


  }

  RValueNode.prototype.createNewNode = function() {

  }

  RValueNode.title = `Custom ${type}`
  RValueNode.desc = `Custom ${type}`

  function handleCaseString(type, value) {
    if (type.toUpperCase() === "STRING") {
      return (`'${value}'`);
    }
    return value
  }


  RValueNode.prototype.onExecute = function () {

    let buffer = `final ${this.varName} = ${handleCaseString(type, this.value)};\n`

    this.setOutputData(0, new NodeTransferData(this, {code: this.varName}));
    sharedBuffer.addCode(buffer);
  }

  RValueNode.prototype.getTitle = function() {
    if (this.flags.collapsed) {
      return this.properties.value;
    }
    return this.title;
  };

  

  RValueNode.prototype.setValue = function(v)
  {
    this.setProperty("value", v);
    this.value = v;
  }
  LiteGraph.registerNodeType(`RValues/${type}`, RValueNode);

}
export default createRValueNode