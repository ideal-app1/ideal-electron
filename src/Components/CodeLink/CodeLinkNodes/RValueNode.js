import {LiteGraph} from "litegraph.js";
import sharedBuffer from "../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "./NodeBase";

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
    this.addProperty("value", defaultValue);

    this.widget = this.addWidget(type, "value", defaultValue, (v) => {
      console.log(`called ${v}`);
      this.setProperty("value", v);
      this.value = v;}, );

    this.properties = {precision: 1};
    this.widgets_up = true;
    this.size = [180, 30];
    this.varName = this.makeId(15);
    this.value = defaultValue;
    this.type = type;
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

    this.setOutputData(0, this);
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

  console.log(`I create [RValues/${type}]`)
  LiteGraph.registerNodeType(`RValues/${type}`, RValueNode);

}
export default createRValueNode