import {LGraph, LGraphCanvas, LiteGraph, ContextMenu, IContextMenuItem} from "litegraph.js"
import inheritNodeBase from "./NodeBase";
import sharedBuffer from "../CodeLinkParsing/BufferSingleton";

const createMethodNode = (method, className, LCanvas, path) => {
//your node constructor class
    function MethodNode() {
        inheritNodeBase(MethodNode, this);
        this.addInput("Linked class", LiteGraph.ACTION);
        method["parameters"].forEach((param) => {
            this.addInput(param["name"] + "(" + param["type"] + ")", param["type"]);
        });

        if (method["return"] !== "void") {
            this.addOutput(method["return"], method["return"]);
        }
        this.properties = {precision: 1};
        this.isAlreadyComputed = false;
        this.varName = this.makeId(15);
    }

//name to show on the canvas
    MethodNode.title = method["name"];

    MethodNode.prototype.onConnectionsChange = function (type, index, isConnected, link, ioSlot) {
        console.log("Je suis connecté ? " + isConnected + " du type ? " + type);
        console.log(link)

    };

    function handleAParam(node, buffer) {
        buffer += node.varName + ", ";

        return (buffer);
    }

    function endBuffer(buffer) {
        if (buffer[buffer.length - 2] === ',') {
            buffer = buffer.slice(0, -2);
        }
        buffer += ");\n";
        return (buffer);
    }

    MethodNode.prototype.startBuffer = function(linkedClass) {
        let buffer = undefined;

        if (linkedClass === undefined) {
            //TODO Handle if the user does not link the method with a class.
            return;
        }

        buffer = "final " + this.varName + " = this." +  method['name'] + "(";
        return (buffer);
    };

    MethodNode.prototype.onExecute = function () {
        const nbOfInputs = method["parameters"].length;
        const linkedClass = this.getInputData(0);
        let buffer = this.startBuffer(linkedClass);
        let node = undefined;

        console.log(`For ${method['name']}, ${nbOfInputs} nb of inputs`);
        for (let i = 1; i <= nbOfInputs; i++) {
            node = this.getInputData(i);
            if (node === undefined) {
                console.log("In func " + this.title + ", arg nb " + i + ", is undef");
                continue;
            }
            buffer = handleAParam(node, buffer);
        }
        buffer = endBuffer(buffer);
        sharedBuffer.addCode(buffer);
        this.setOutputData(0, this);
    };
    LiteGraph.registerNodeType(path + className +" methods/" + method["name"], MethodNode);

};
/*
() => {
    const int btbKuqWdNISfeQg = 314;\n
    const int bgMnhSoYgwDwaRl = 314;\n
    hihi_onPressed = btbKuqWdNISfeQg;
    hihi_child = btbKuqWdNISfeQg;
    final oPBiFsHDlFvFVEJ = this.Int_Int__TemplateT(btbKuqWdNISfeQg, bgMnhSoYgwDwaRl);\n
}*/

export default createMethodNode