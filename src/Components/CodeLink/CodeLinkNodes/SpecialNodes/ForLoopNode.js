import inheritNodeBase from '../NodeBase';
import { LiteGraph } from 'litegraph.js';
import sharedBuffer from '../../CodeLinkParsing/BufferSingleton';
import CodeLink from '../../CodeLink';

const createForLoopNode = (LCanvas) => {

  ForLoopNode.title = 'for loop';
  const linkedNodes = [];
  let connectionChangeInProgress = false;

  function ForLoopNode() {
    inheritNodeBase(ForLoopNode, this);
    this.addInput('From');
    this.addInput('To');
    this.addInput('Function to call')
    this.addOutput("", LiteGraph.ACTION);
    this.varName = this.makeId(15);
  }



  ForLoopNode.prototype.addDefaultFromTo = function () {
    const from = LiteGraph.createNode('RValues/number');
    const to = LiteGraph.createNode('RValues/number');


    LCanvas.graph.add(from);
    LCanvas.graph.add(to);
    from.pos = [this.pos[0] - (150 + this.size[0]), this.pos[1]];
    to.pos = [this.pos[0] - (150 + this.size[0]), this.pos[1] + 50 + from.size[1]];
    from.connect(0, this, 0);
    to.connect(0, this, 1);

  };

  ForLoopNode.prototype.onAdded = function () {
    if (this.varName === undefined) {
      this.varName = name;
    }
    if (CodeLink.deserializationDone === true)
      this.addDefaultFromTo();
  };

  ForLoopNode.prototype.getParameters = function () {
    const args = [];

    for (let i = 0; i < this.inputs.length; i++) {
      const tmp = this.getInputData(i);

      if (!tmp)
        return tmp;
      args.push(tmp);
    }
    return args;
  }

  ForLoopNode.prototype.onExecute = function () {
    let buffer;
    const iteratorName = `${this.varName}Iterator`;
    const args = this.getParameters();

    if (!args)
      return;

    buffer = `for (let ${iteratorName} = ${args[0].varName}; ${iteratorName} < ${args[1].varName}; ${iteratorName}++) {\n${args[2].callbackCode}();\n}`;

    sharedBuffer.addCode(buffer);
    this.setOutputData(0, this);
  };

  LiteGraph.registerNodeType(`Misc/ForLoop`, ForLoopNode);
};
export default createForLoopNode