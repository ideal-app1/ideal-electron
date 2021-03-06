import {LiteGraph} from "litegraph.js";
import sharedBuffer from "../../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "../NodeBase";
import NodeTransferData from '../NodeTransferData';

const createMakeListNode = (LCanvas) => {

  MakeListNode.title = 'Make List';
  const linkedNodes = [];
  let connectionChangeInProgress = false;

  function MakeListNode() {
    inheritNodeBase(MakeListNode, this);
    this.addInput('Function 1');
    this.addOutput('Wrapped functions',);
    this.varName = this.makeId(15);

  }

  MakeListNode.prototype.removeANode = function(link)  {
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

  MakeListNode.prototype.addNewInput = function (newNode) {
    linkedNodes.push(newNode);

    // Prevent deserialization of the node from creating too much inputs
    if (this.inputs.length <= linkedNodes.length)
      this.addInput(`Function ${this.inputs.length + 1}`);
  }

  MakeListNode.prototype.onConnectionsChange = function (type, index, isConnected, link, _) {
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


  MakeListNode.prototype.onAdded = function () {
  };

  MakeListNode.prototype.onExecute = function () {
    let buffer = `final ${this.varName} = () {\n`;

    for (let i = 0; i < this.inputs.length; i++) {
      const node = this.getInputData(i);

      if (!node || node.nodeType.search('FunctionNode') === -1)
        continue;
      buffer += `${node.callbackCode};\n`;
    }
    buffer += '};\n'
    this.callbackCode = this.varName;
    sharedBuffer.addCode(buffer);
    this.setOutputData(0, new NodeTransferData(this, {code: this.varName}));
  };
  LiteGraph.registerNodeType(`Misc/${name}`, MakeListNode);
};
export default createMakeListNode