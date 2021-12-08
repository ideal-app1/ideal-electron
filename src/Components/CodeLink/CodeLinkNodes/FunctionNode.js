import { INodeSlot, LiteGraph } from 'litegraph.js';
import BufferSingleton from '../CodeLinkParsing/BufferSingleton';
import sharedBuffer from '../CodeLinkParsing/BufferSingleton';
import inheritNodeBase from './NodeBase';
import NodeTransferData from './NodeTransferData';

const createFunctionNode = (func, LCanvas, path) => {

    FunctionNode.title = func['name'];
    FunctionNode.description = func['name'];
    FunctionNode.callbackCode = '';
    // Index of the next input
    FunctionNode.doIndex = 0
    // Index of the do and callback outputs
    FunctionNode.nextIndex = 0
    FunctionNode.callbackIndex = 1

    function FunctionNode() {
        inheritNodeBase(FunctionNode, this);
        this.handleInputsOutputs();
        this.properties = { precision: 1 };
        this.isAlreadyComputed = false;
        this.varName = this.makeId(15);
        this.isAPureCallback = true
    }

    FunctionNode.prototype.handleInputsOutputs = function() {
        let nbOfParameters = 0;

        this.addInput(' do', '', {'shape': LiteGraph.ARROW_SHAPE});
        func['parameters'].forEach((param) => {
            this.addInput(param['name'] + '(' + param['type'] + ')', ''/*param["type"]*/);
            nbOfParameters++;
        });


        this.addOutput('next', LiteGraph.OUTPUT,  {'shape': LiteGraph.ARROW_SHAPE });
        this.addOutput('callback(Function)', LiteGraph.OUTPUT, { 'shape': LiteGraph.CARD_SHAPE });

        if (func['return'] !== 'void')
            this.addOutput(func['return'], ''/*func["return"]*/);
    };


    function endBuffer(buffer) {
        if (buffer[buffer.length - 2] === ',') {
            buffer = buffer.slice(0, -2);
        }
        buffer += ');\n';
        return (buffer);
    }


    FunctionNode.prototype.verifyIfItIsACallback = function(link, isConnected) {
        const targetNode = LCanvas.graph.getNodeById(link.target_id);
        const name = targetNode.inputs[link.target_slot]?.name;


        if (name !== undefined && name.toLowerCase().search('func') === -1) {
            this.notACallbackCounter += isConnected ? 1 : -1;
        }
    };

    // Function is called only when the next output is connected
    FunctionNode.prototype.noOtherConnections = function() {
        const outputs = this.outputs;

        if (outputs.length <= 2) {
            return true
        }

        for (let i = 2; i < outputs.length; i++) {
            if (outputs[i].links !== null)
                return false
        }
        return true

    }

    FunctionNode.prototype.onConnectionsChange = function(type, index, isConnected, link, ioSlot) {
        if (!link || type === LiteGraph.INPUT)
            return;
        // If it is neither a callback or a next output
        // Set that the node is a pure callback or not depending of it is connected
        console.log(this.outputs)
        if (index > FunctionNode.callbackIndex)
            this.isAPureCallback = !isConnected
        else if (index === FunctionNode.nextIndex && isConnected) {
            this.isAPureCallback = false
        } else if (index === FunctionNode.nextIndex && isConnected === false && this.noOtherConnections()) {
            this.isAPureCallback = true
        }
    };

    FunctionNode.prototype.createCallback = function() {

        let buffer = 'const dynamic ' + this.varName + ' = ' + func['name'] + ';';
        sharedBuffer.addCode(buffer);
        this.setOutputData(0, this);
    };


    FunctionNode.prototype.onExecute = function() {

        let funcCall = 'final ' + this.varName + ' = ';
        let buffer = this.title + '(';
        const nbOfInputs = func['parameters'].length;
        let node = undefined;

        for (let i = FunctionNode.doIndex + 1; i <= nbOfInputs; i++) {
            node = this.getInputData(i); // Value should be a NodeTransferData instanc
            console.log(node)
            if (node === undefined) {
                buffer += `null,`;
            } else {
                buffer += `${node.data.code}, `;
            }
        }
        buffer += ');';
        this.callbackCode = `() {${buffer}}`;
        if (this.isAPureCallback === false) {
            sharedBuffer.addCode(funcCall + buffer);
        }
        this.setOutputData(0, null);
        this.setOutputData(1, new NodeTransferData(this, {code: this.callbackCode}))
        this.setOutputData(2, new NodeTransferData(this, {code: this.varName}))

        sharedBuffer.addImport(func['import']);
    };



    LiteGraph.registerNodeType(path + func['name'], FunctionNode);
};
export default createFunctionNode;
