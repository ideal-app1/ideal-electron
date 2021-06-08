import {LiteGraph} from "litegraph.js";
import BufferSingleton from "../CodeLinkParsing/BufferSingleton";
import sharedBuffer from "../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "./NodeBase";

const createFunctionNode = (func, LCanvas) => {

    FunctionNode.title = func["name"];
    FunctionNode.description = func["name"];




    function FunctionNode() {
        inheritNodeBase(FunctionNode);
        this.handleInputsOutputs();
        this.properties = {precision: 1};
        this.isAlreadyComputed = false;
        this.randomName = this.makeId(15);
    }

    FunctionNode.prototype.handleInputsOutputs = function ()  {
        let nbOfParameters = 0;

        func["parameters"].forEach((param) => {
            this.addInput(param["name"] + "(" + param["type"] + ")", ""/*param["type"]*/);
            nbOfParameters++;
        })
        this.nbOfParameters = nbOfParameters;
        this.addOutput(func["return"], ""/*func["return"]*/);
    }

    function handleAParam(node, buffer) {
        buffer += node.randomName + ", ";

        return (buffer);
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
        func.annotations.forEach((annotation) => {
            if (annotation.name === "CallbackParameter") {
                setInputCallbackProperty(node, index, isConnected, annotation);
            } else {
            }
        });
    }

    FunctionNode.prototype.onConnectionsChange = function (type, index, isConnected, link, ioSlot) {
        const node = LCanvas.graph.getNodeById(link.origin_id);

        isACallbackParameter(node, index, isConnected);

    }

    FunctionNode.prototype.createCode = function () {
        console.log("This is my tracker: ");
        console.log(this.callbackTracker);
        let buffer = "const " + func["return"] + " " + this.randomName + " = " + this.title + "(";
        const nbOfInputs = func["parameters"].length;
        let node = undefined;

        for (let i = 0; i < nbOfInputs; i++) {
            node = this.getInputData(i);
            if (node === undefined) {
                continue;
            }
            buffer = handleAParam(node, buffer);
        }
        buffer = endBuffer(buffer);
        sharedBuffer.addCode(buffer);
        this.setOutputData(0, this);
    }

    Function.prototype.createCallbackWrapper = function () {

        /*for (let i = 0; i < nbOfInputs; i++) {
             this.getInputData(i);
        }*/
    }

    FunctionNode.prototype.createCallback = function () {

        let buffer = 'const dynamic ' + this.randomName + ' = ' + func['name'] + ';'
        sharedBuffer.addCode(buffer);
        this.setOutputData(0, this);
    }

    FunctionNode.prototype.onExecute = function () {
        if (this.callbackTracker.find((val) => val === true) !== undefined) {
            console.log("goooo NOT UNDEF")
            this.createCallback();
        } else {
            console.log("UNDEF")
            console.log(this.callbackTracker)
            this.createCode();
        }
        console.log("WHAT IS MY FUNC IMPORT ? " + func['import']);
        sharedBuffer.addImport(func['import']);
    }

    LiteGraph.registerNodeType("Custom Functions/" + func["name"], FunctionNode);
}
export default createFunctionNode
