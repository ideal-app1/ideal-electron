import {LiteGraph} from "litegraph.js";
import BufferSingleton from "../../CodeLinkParsing/BufferSingleton";
import sharedBuffer from "../../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "../NodeBase";
import NodeTransferData from '../NodeTransferData';

const createSetStateNode = () => {

  SetStateNode.title = "setState";
  SetStateNode.description = "setState";
  SetStateNode.nodeType = 'SetStateNode';

  function SetStateNode() {
    inheritNodeBase(SetStateNode, this);
    this.addInput(' do', '', {'shape': LiteGraph.ARROW_SHAPE});
    this.addInput("Function");
    this.addOutput('next', '', {'shape': LiteGraph.ARROW_SHAPE});




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

    this.setOutputData(0, new NodeTransferData(this, {code: this.varName}));
    //sharedBuffer.addImport(NodeInfos['import']);
  };

  LiteGraph.registerNodeType("Misc/setState", SetStateNode);
};
export default createSetStateNode