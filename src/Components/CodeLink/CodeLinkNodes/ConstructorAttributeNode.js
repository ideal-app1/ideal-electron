import {LiteGraph} from "litegraph.js";
import BufferSingleton from "../CodeLinkParsing/BufferSingleton";
import sharedBuffer from "../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "./NodeBase";

const createConstructorAttributeNode = (currentClass, param, LCanvas) => {

    ConstructorAttributeNode.title = param["name"];
    ConstructorAttributeNode.description = param["name"];

    function ConstructorAttributeNode() {
        inheritNodeBase(ConstructorAttributeNode)
        this.addInput("Linked Class", LiteGraph.ACTION);
        this.addOutput(param["name"] + "(" + param["type"] + ")");

        this.properties = {precision: 1};
        this.isAlreadyComputed = false;
        this.randomName = this.makeId(15);
    }



    ConstructorAttributeNode.prototype.onConnectionsChange = function (type, index, isConnected, link, ioSlot) {


    }

    ConstructorAttributeNode.prototype.onExecute = function () {

    }
    console.log("Je crée " + currentClass + " constructor's attributes/" + param["name"])
    LiteGraph.registerNodeType(currentClass + " constructor's attributes/" + param["name"], ConstructorAttributeNode);
}
export default createConstructorAttributeNode

