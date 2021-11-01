import {LiteGraph} from "litegraph.js";
import BufferSingleton from "../CodeLinkParsing/BufferSingleton";
import sharedBuffer from "../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "./NodeBase";

const createFunctionNode = (func, LCanvas, path) => {

    FunctionNode.title = func["name"];
    FunctionNode.description = func["name"];
    FunctionNode.callbackCode = "";

    function FunctionNode() {
        inheritNodeBase(FunctionNode, this);
        this.handleInputsOutputs();
        this.properties = {precision: 1};
        this.isAlreadyComputed = false;
        this.varName = this.makeId(15);
    }

    FunctionNode.prototype.handleInputsOutputs = function ()  {
        let nbOfParameters = 0;

        this.addInput("", LiteGraph.EVENT);
        func["parameters"].forEach((param) => {
            this.addInput(param["name"] + "(" + param["type"] + ")", ""/*param["type"]*/);
            nbOfParameters++;
        })
        this.nbOfParameters = nbOfParameters;
        if (func["return"] === "void") {
            this.addOutput("", LiteGraph.ACTION);

        } else {
            this.addOutput(func["return"], ""/*func["return"]*/);
        }
    }



    function endBuffer(buffer) {
        if (buffer[buffer.length - 2] === ',') {
            buffer = buffer.slice(0, -2);
        }
        buffer += ");\n"
        return (buffer);
    }



    FunctionNode.prototype.verifyIfItIsACallback = function (link, isConnected) {
        const targetNode = LCanvas.graph.getNodeById(link.target_id);
        const name = targetNode.inputs[link.target_slot]?.name;


        if (name !== undefined && name.toLowerCase().search('func') === -1) {
            this.notACallbackCounter += isConnected ? 1 : -1;
        }
    }

    FunctionNode.prototype.onConnectionsChange = function (type, index, isConnected, link, ioSlot) {
        if (!link || type === LiteGraph.INPUT)
            return
        this.verifyIfItIsACallback(link, isConnected);
    }


    Function.prototype.createCallbackWrapper = function () {

        /*for (let i = 0; i < nbOfInputs; i++) {
             this.getInputData(i);
        }*/
    }

    FunctionNode.prototype.createCallback = function () {

        let buffer = 'const dynamic ' + this.varName + ' = ' + func['name'] + ';'
        sharedBuffer.addCode(buffer);
        this.setOutputData(0, this);
    }

    FunctionNode.prototype.isAPureCallback = function () {
        return this.notACallbackCounter <= 0 && this.outputs[0]['links'] != null;
    };

    FunctionNode.prototype.handleAParam = function (node, buffer, inputIndex) {
        console.log(func);
        console.log(inputIndex);
        const inputName = func['parameters'][inputIndex - 1]['type'];
        const data = this.getCallbackData(node, inputName);

        buffer += data + ", ";
        return (buffer);
    }

    FunctionNode.prototype.onExecute = function () {

        let funcCall = "final "  + this.varName + " = ";
        let buffer = this.title + "(";
        const nbOfInputs = func["parameters"].length;
        let node = undefined;

        for (let i = 1; i <= nbOfInputs ; i++) {
            node = this.getInputData(i);
            if (node === undefined) {
                continue;
            }
            buffer = this.handleAParam(node, buffer, i);
        }
        this.callbackCode = buffer + ')';

        buffer = endBuffer(buffer);
        if (this.isAPureCallback() === false) {
            sharedBuffer.addCode(funcCall + buffer);
        }
        this.setOutputData(0, this);
        sharedBuffer.addImport(func['import']);
    }

    LiteGraph.registerNodeType(path + func["name"], FunctionNode);
}
export default createFunctionNode
