import {LiteGraph} from "litegraph.js";
import BufferSingleton from "../../CodeLinkParsing/BufferSingleton";
import sharedBuffer from "../../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "../NodeBase";

const createInnerClassVariable = (name) => {

  InnerClassVariableNode.title = name;
  InnerClassVariableNode.description = name;


  function InnerClassVariableNode() {
    inheritNodeBase(InnerClassVariableNode, this);
    this.addOutput(name,);

  }

  InnerClassVariableNode.prototype.onAdded = function () {
    if (this.varName === undefined) {
      this.varName = name;
    }
  };

  InnerClassVariableNode.prototype.onExecute = function () {
    this.setOutputData(0, this);
  };

  LiteGraph.registerNodeType(`This/${name}`, InnerClassVariableNode);
};
export default createInnerClassVariable