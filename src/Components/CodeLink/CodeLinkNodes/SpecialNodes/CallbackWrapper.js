import {LiteGraph} from "litegraph.js";
import BufferSingleton from "../../CodeLinkParsing/BufferSingleton";
import sharedBuffer from "../../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "../NodeBase";
import CodeLink from '../../CodeLink';

const createCallbackWrapper = (LCanvas) => {

  CallbackWrapperNode.title = 'Callback Wrapper';
  const linkedNodes = [];
  let connectionChangeInProgress = false;

  function CallbackWrapperNode() {
    inheritNodeBase(CallbackWrapperNode, this);
    this.addInput('Function 1');
    this.addOutput('Wrapped functions',);

  }

  CallbackWrapperNode.prototype.removeANode = function(link)  {
    let nbOfNodes = 0;
    let inputsLen = this.inputs.length;

    if (inputsLen === 1)
      return;

    connectionChangeInProgress = true;
    linkedNodes.splice(link.target_slot, 1);
    nbOfNodes = linkedNodes.length;
    for (let i = 0; i < inputsLen; i++) {
      this.disconnectInput(0);
      this.removeInput(0);
    }
    for (let i = 0; i < nbOfNodes; i++) {
      this.addInput(`Function ${i + 1}`);
      linkedNodes[i].connect(0, this, i);

    }
    this.addInput(`Function ${this.inputs.length + 1}`);
    connectionChangeInProgress = false;
  }

  CallbackWrapperNode.prototype.addNewInput = function (newNode) {
    linkedNodes.push(newNode);

    // Prevent deserialization of the node from creating too much inputs
    if (this.inputs.length <= linkedNodes.length)
      this.addInput(`Function ${this.inputs.length + 1}`);
  }

  CallbackWrapperNode.prototype.onConnectionsChange = function (type, index, isConnected, link, ioSlot) {
    if (!link || type === LiteGraph.OUTPUT || connectionChangeInProgress === true)
      return;

    if (isConnected) {
      this.addNewInput(LCanvas.graph.getNodeById(link.origin_id));
    } else {
      try {
        this.removeANode(link);
      } catch (e) {
        connectionChangeInProgress = false;
      }
    }

  }


  CallbackWrapperNode.prototype.onAdded = function () {
    if (this.varName === undefined) {
      this.varName = name;
    }
  };

  CallbackWrapperNode.prototype.onExecute = function () {
    let buffer = `final ${this.varName} = () {\n`;

    for (let i = 0; i < this.inputs.length; i++) {
      const node = this.getInputData(i);

      if (!node || node.nodeType.search('FunctionNode') === -1)
        continue;
      buffer += `${node.callbackCode};\n`;
    }
    buffer += '};\n'
    sharedBuffer.addCode(buffer);
    this.setOutputData(0, this);
  };

  LiteGraph.registerNodeType(`Misc/${name}`, CallbackWrapperNode);
};
export default createCallbackWrapper