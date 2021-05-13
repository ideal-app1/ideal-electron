import {LiteGraph} from "litegraph.js";
import BufferSingleton from "../CodeLinkParsing/BufferSingleton";
import sharedBuffer from "../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "./NodeBase";

const createConstructorAttributeNode = (param, graph) => {

    ConstructorAttributeNode.title = param["name"];
    ConstructorAttributeNode.description = param["name"];

    function ConstructorAttributeNode() {
        inheritNodeBase(ConstructorAttributeNode)
        this.addInput("Linked Class", LiteGraph.ACTION);
        this.addInput(param["name"] + "(" + param["type"] + ")");

        this.properties = {precision: 1};
        this.isAlreadyComputed = false;
        this.randomName = this.makeId(15);
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
            console.log("ciao ");
            console.log(annotation.parameters.length)
            console.log(annotation.parameters[0].value)
            console.log(index)
            console.log(annotation.parameters.length !== 2);
            console.log(parseInt(annotation.parameters[0].value) !== index + 1)
            return;
        }
        if (annotation.parameters[1].value === "true") {
            if (isConnected) {
                console.log("Lets go add an entry")
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

    function isACallbackParameter(node, index, isConnected) {
        func.annotations.forEach((annotation) => {
            if (annotation.name === "CallbackParameter") {
                console.log("Oui name")
                setInputCallbackProperty(node, index, isConnected, annotation);
            } else {
                console.log("Non. " + annotation.name)
            }
        });
    }

    ConstructorAttributeNode.prototype.onConnectionsChange = function (type, index, isConnected, link, ioSlot) {
        const node = graph.getNodeById(link.origin_id);

        isACallbackParameter(node, index, isConnected);
        console.log("Je suis connecté ? " + isConnected + " du type ? " + type)
        console.log(link)
        console.log(type)
        console.log(ioSlot)
        console.log(graph.getNodeById(link.origin_id));
        console.log("mdr");

    }

    ConstructorAttributeNode.prototype.onExecute = function () {
        console.log("This is my tracker: ");
        console.log(this.callbackTracker);
        let buffer = "const " + func["return"] + " " + this.randomName + " = " + this.title + "(";
        const nbOfInputs = func["parameters"].length;
        let node = undefined;

        console.log(nbOfInputs)
        for (let i = 0; i < nbOfInputs; i++) {
            node = this.getInputData(i);
            if (node === undefined) {
                console.log("In func " + this.title + ", arg nb " + i + ", is undef")
                continue;
            }
            buffer = handleAParam(node, buffer);
        }
        buffer = endBuffer(buffer);
        sharedBuffer.add(buffer);
        this.setOutputData(0, this);
    }

    LiteGraph.registerNodeType("Custom Functions/" + func["name"], ConstructorAttributeNode);
}
export default createConstructorAttributeNode

