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
        this.addInput(param["name"] + "(" + param["type"] + ")");

        this.properties = {precision: 1};
        this.isAlreadyComputed = false;
        this.randomName = this.makeId(15);
    }


    function parameterIsFunction(node, index, isConnect) {
        if (param["type"].toUpperCase().search("FUNC") == -1) {
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



    ConstructorAttributeNode.prototype.onConnectionsChange = function (type, index, isConnected, link, ioSlot) {
        const node = LCanvas.graph.getNodeById(link.origin_id);

        parameterIsFunction(node, index, isConnected);
        console.log("Je suis connecté ? " + isConnected + " du type ? " + type)
        console.log(link)
        console.log(type)
        console.log(ioSlot)
        console.log(LCanvas.graph.getNodeById(link.origin_id));
        console.log("mdr");

    }

    ConstructorAttributeNode.prototype.onExecute = function () {
        const linkedClass = this.getInputData(0);
        const linkedData = this.getInputData(1);
        let buffer = "";


        if (linkedClass === undefined || linkedData === undefined)
            return;
        console.log(linkedClass)
        buffer = linkedClass["varName"] + param["name"] + " = " + linkedData['randomName'] + ';';
        sharedBuffer.addCode(buffer);
    }
    console.log("Je crée " + currentClass + " constructor's attributes/" + param["name"])
    LiteGraph.registerNodeType(currentClass + " constructor's attributes/" + param["name"], ConstructorAttributeNode);
}
export default createConstructorAttributeNode

