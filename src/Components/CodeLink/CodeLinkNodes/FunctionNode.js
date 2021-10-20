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

    function setInputCallbackProperty(node, index, isConnected, annotation) {
        if (annotation.parameters.length !== 2 ||
            parseInt(annotation.parameters[0].value) !== index + 1) {
            return;
        }
        if (annotation.parameters[1].value === "true") {
            if (isConnected) {
                console.log("Je suis " + func["name"] + " Lets go add an entry")
                node.addNewEntry(true);
            } else {
                node.removeAnEntry(true);
            }
        } else {
            if (isConnected) {
                node.addNewEntry(false);
            } else {
                node.removeAnEntry(false);
            }
        }
    }

    function parameterIsFunction(node, index, isConnect) {
        if (func["parameters"][index]["type"].toUpperCase().search("FUNC") == -1) {
            if (isConnect) {
                node.addNewEntry(false);
            } else {
                node.removeAnEntry(false);
            }
        } else {
            if (isConnect) {
                node.addNewEntry(true);
            } else {
                node.removeAnEntry(true);
            }
        }

    }

    function isACallbackParameter(node, index, isConnected) {
        console.log(node);
        func.annotations.forEach((annotation) => {
            if (annotation.name === "CallbackParameter") {
                setInputCallbackProperty(node, index, isConnected, annotation);
            } else {
            }
        });
    }

    FunctionNode.prototype.verifyIfItIsACallback = function (link, isConnected) {
        const targetNode = LCanvas.graph.getNodeById(link.target_id);
        const name = targetNode.inputs[link.target_slot].name;

        if (name.toLowerCase().search('func') === -1) {
            this.notACallbackCounter += isConnected ? 1 : -1;
        }
    }

    FunctionNode.prototype.onConnectionsChange = function (type, index, isConnected, link, ioSlot) {
        if (!link)
            return
        const node = LCanvas.graph.getNodeById(link.origin_id);
        console.log(node.name);
        console.log(LCanvas.graph.getNodeById(link.target_id).name);
        console.log(index)
        console.log(link.target_slot);
        //isACallbackParameter(node, index, isConnected);
        this.verifyIfItIsACallback(link, isConnected);
        console.log(`How many ? ${this.notACallbackCounter}`);

    }



    /*FunctionNode.prototype.createCode = function () {
        let funcCall = "final "  + this.varName + " = ";
        let buffer = this.title + "(";
        const nbOfInputs = func["parameters"].length;
        let node = undefined;

        for (let i = 1; i < nbOfInputs; i++) {
            node = this.getInputData(i);
            if (node === undefined) {
                continue;
            }
            console.log('?')
            console.log('I ? ');
            console.log(i);
            buffer = handleAParam(node, buffer, i);
        }
        buffer = endBuffer(buffer);
        if (this.isNotAPureCallback()) {
            sharedBuffer.addCode(funcCall + buffer);
        }
        this.callbackCode = buffer;
        this.setOutputData(0, this);
    }*/

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

    FunctionNode.prototype.casePureCallback = function () {

    }

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
            console.log('Input ' + i);
        }
        this.callbackCode = buffer + ')';

        buffer = endBuffer(buffer);
        if (this.isAPureCallback() === false) {
            console.log('Is a pure callback!');

            sharedBuffer.addCode(funcCall + buffer);
        } else {
            console.log('Is NOT a pure callback!');
        }
        console.log(this);
        console.log('end');
        this.setOutputData(0, this);


        /*if (this.callbackTracker.find((val) => val === true) !== undefined) {
            console.log("goooo NOT UNDEF")
            this.createCallback();
        } else {
            console.log("UNDEF")
            console.log(this.callbackTracker)
            this.createCode();
        }
        console.log("WHAT IS MY FUNC IMPORT ? " + func['import']);*/
        sharedBuffer.addImport(func['import']);
    }

    LiteGraph.registerNodeType(path + func["name"], FunctionNode);
}
export default createFunctionNode
