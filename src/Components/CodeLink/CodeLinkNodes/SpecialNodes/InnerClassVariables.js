import {LiteGraph} from "litegraph.js";
import BufferSingleton from "../../CodeLinkParsing/BufferSingleton";
import sharedBuffer from "../../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "../NodeBase";

const createInnerClassVariable = (name) => {

  InnerClassVariable.title = name;
  InnerClassVariable.description = name;

  function InnerClassVariable() {
    inheritNodeBase(InnerClassVariable, this);
    this.addOutput(name,);

  }

  InnerClassVariable.prototype.onAdded = function () {
    if (this.varName === undefined) {
      this.varName = name;
    }
  };

  InnerClassVariable.prototype.onExecute = function () {
    this.setOutputData(0, this);
  };

  LiteGraph.registerNodeType(`This/${name}`, InnerClassVariable);
};
export default createInnerClassVariable