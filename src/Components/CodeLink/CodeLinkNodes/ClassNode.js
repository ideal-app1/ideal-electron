import {LiteGraph} from "litegraph.js";
import BufferSingleton from "../CodeLinkParsing/BufferSingleton";
import sharedBuffer from "../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "./NodeBase";

const createClassNode = (NodeInfos, doRegister, LCanvas, varName) => {

    ClassNode.title = NodeInfos["name"];
    ClassNode.description = NodeInfos["name"];

    function ClassNode() {
        inheritNodeBase(ClassNode)
        this.addOutput("Linked class", LiteGraph.ACTION);

        this.properties = {precision: 1};
        this.randomName = this.makeId(15);
        this.varName = varName;
    }

    ClassNode.prototype.onExecute = function () {
        console.log("onExecute class");
        this.setOutputData(0, this);
        console.log("WHAT IS MY IMPORT ? " + NodeInfos['import']);
        sharedBuffer.addImport(NodeInfos['import']);
    }

    if (doRegister)
        LiteGraph.registerNodeType("Classes/" + NodeInfos["name"], ClassNode);
}
export default createClassNode