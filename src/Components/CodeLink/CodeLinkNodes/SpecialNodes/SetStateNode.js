import {LiteGraph} from "litegraph.js";
import BufferSingleton from "../../CodeLinkParsing/BufferSingleton";
import sharedBuffer from "../../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "../NodeBase";

const createSetStateNode = () => {

  SetStateNode.title = "setState";
  SetStateNode.description = "setState";
  SetStateNode.nodeType = 'SetStateNode';

  function SetStateNode() {
    inheritNodeBase(SetStateNode);
    this.addInput("Function");
    this.addOutput("", LiteGraph.ACTION, {'color_on': '#FF7F7F'});



    this.properties = {precision: 1};
    //this.varName = varName;
  }

  SetStateNode.prototype.onAdded = function () {
    if (this.varName === undefined) {
      this.varName = this.makeId(15);
    }
  };

  SetStateNode.prototype.onExecute = function () {
    const data = this.getInputData(0);
    const code = `() => ${data.callbackCode}()`;

    sharedBuffer.addCode(code);
    this.setOutputData(0, null);
    //sharedBuffer.addImport(NodeInfos['import']);
  };

  /*console.log(`Je créé ${path + NodeInfos["name"]}`);*/
  LiteGraph.registerNodeType("Misc/setState", SetStateNode);
};
export default createSetStateNode