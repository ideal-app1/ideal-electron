import {LGraph, LGraphCanvas, LiteGraph, ContextMenu, IContextMenuItem} from "litegraph.js"
import inheritNodeBase from "./NodeBase";
import sharedBuffer from "../CodeLinkParsing/BufferSingleton";

const createMethodNode = (method, className, graph) => {
//your node constructor class
    function MethodNode() {
        inheritNodeBase(MethodNode)
        this.addInput("Linked class", LiteGraph.ACTION);
        method["parameters"].forEach((param) => {
            this.addInput(param["name"] + "(" + param["type"] + ")", param["type"]);
        })

        if (method["return"] !== "void") {
            this.addOutput(method["return"], method["return"]);
        }
        this.properties = {precision: 1};
        this.isAlreadyComputed = false;
        this.randomName = this.makeId(15);
    }

//name to show on the canvas
    MethodNode.title = method["name"];


    MethodNode.prototype.onConnectionsChange = function (type, index, isConnected, link, ioSlot) {
        console.log("Je suis connecté ? " + isConnected + " du type ? " + type)
        console.log(link)

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

    function startBuffer(linkedClass) {
        let buffer = undefined;

        if (linkedClass === undefined) {
            //TODO Handle if the user does not link the method with a class.
            return;
        }

        buffer = "const " + method["return"] + " " + this.randomName + " = this." +  linkedClass.randomName + "(";
        return (buffer);
    }

    MethodNode.prototype.onExecute = function () {
        const nbOfInputs = method["parameters"].length;
        const linkedClass = this.getInputData(0);
        let buffer = startBuffer(linkedClass);
        let node = undefined;

        console.log(nbOfInputs)
        for (let i = 1; i < nbOfInputs; i++) {
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
    LiteGraph.registerNodeType(className +" methods/" + method["name"], MethodNode);

}

export default createMethodNode