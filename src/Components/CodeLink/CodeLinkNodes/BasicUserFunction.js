import {LiteGraph} from "litegraph.js";
import BufferSingleton from "../CodeLinkParsing/BufferSingleton";
import sharedBuffer from "../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "./NodeBase";

const createBasicFunction = (func) => {

    BasicFunction.title = func["name"];
    BasicFunction.description = func["name"];

    function BasicFunction() {
        inheritNodeBase(BasicFunction)
        func["parameters"].forEach((param) => {
            this.addInput(param["name"] + "(" + param["type"] + ")", param["type"]);
        })

        if (func["return"] !== "void") {
            this.addOutput(func["return"], func["return"]);
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


    BasicFunction.prototype.onExecute = function () {
        let buffer = "const " + func["return"] + this.randomName + " = " + this.title + "(";
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

    LiteGraph.registerNodeType("Custom Functions/" + func["name"], BasicFunction);
}
export default createBasicFunction