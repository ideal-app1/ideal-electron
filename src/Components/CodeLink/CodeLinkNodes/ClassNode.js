import {LiteGraph} from "litegraph.js";
import BufferSingleton from "../CodeLinkParsing/BufferSingleton";
import sharedBuffer from "../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "./NodeBase";

const createClassNode = (NodeInfos, doRegister, LCanvas, varName, path) => {

    ClassNode.title = NodeInfos["name"];
    ClassNode.description = NodeInfos["name"];

    function ClassNode() {
        inheritNodeBase(ClassNode);
        this.addOutput("Linked class", LiteGraph.ACTION);

        this.properties = {precision: 1};
        this.randomName = this.makeId(15);
        this.varName = varName;
    }

    ClassNode.prototype.onExecute = function () {
        this.setOutputData(0, this);
        sharedBuffer.addImport(NodeInfos['import']);
    };

    if (doRegister)
        console.log(`Je créé ${path + NodeInfos["name"]}`);
        LiteGraph.registerNodeType(path + NodeInfos["name"], ClassNode);
};
export default createClassNode