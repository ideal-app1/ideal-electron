import {LiteGraph} from "litegraph.js";
import BufferSingleton from "../CodeLinkParsing/BufferSingleton";
import sharedBuffer from "../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "./NodeBase";

const createFunctionNode = (func, LCanvas) => {

    FunctionNode.title = func["name"];
    FunctionNode.description = func["name"];

    function FunctionNode() {
        inheritNodeBase(FunctionNode)
        func["parameters"].forEach((param) => {
            this.addInput(param["name"] + "(" + param["type"] + ")", ""/*param["type"]*/);
        })

        if (func["return"] !== "void") {
            this.addOutput(func["return"], ""/*func["return"]*/);
        }
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

    FunctionNode.prototype.onConnectionsChange = function (type, index, isConnected, link, ioSlot) {
        const node = LCanvas.graph.getNodeById(link.origin_id);

        isACallbackParameter(node, index, isConnected);
        console.log("Je suis connecté ? " + isConnected + " du type ? " + type)
        console.log(link)
        console.log(type)
        console.log(ioSlot)
        console.log(LCanvas.graph.getNodeById(link.origin_id));
        console.log("mdr");

    }

    FunctionNode.prototype.onExecute = function () {
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

    LiteGraph.registerNodeType("Custom Functions/" + func["name"], FunctionNode);
}
export default createFunctionNode

/*
import {LGraph, LGraphCanvas, LiteGraph, ContextMenu, IContextMenuItem} from "litegraph.js"

const createNode = () => {
//your node constructor class
    function MyAddNode() {
        this.addInput("Mdr", LiteGraph.ACTION);
        //add some input slots
        this.addInput("A", "int");
        this.addInput("B", "int");
        //add some output slots
        this.addOutput("A+B", "String");
        //add some properties
        this.properties = {precision: 1};
    }

//name to show on the canvas
    MyAddNode.title = "LaSommeHaha";


    MyAddNode.prototype.onConnectionsChange = function (type, index, isConnected, link, ioSlot) {
        console.log("Je suis connecté ? " + isConnected + " du type ? " + type)
        console.log(link)

    }
//function to call when the node is executed
    MyAddNode.prototype.onExecute = function () {
        var m = {
            'coucou': 1,
            'salut': "lol"
        }
        //retrieve data from inputs
        var A = this.getInputData(0);
        if (A === undefined)
            A = 0;
        var B = this.getInputData(1);
        if (B === undefined)
            B = 0;
        //assing data to otputs
        this.setOutputData(0, m);
        console.log("Result + " + (A + B));
        console.log(A)
    }

    return (MyAddNode)
}

export default createNode
 */