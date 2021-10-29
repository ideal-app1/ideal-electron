import {LiteGraph} from "litegraph.js";
import BufferSingleton from "../CodeLinkParsing/BufferSingleton";
import sharedBuffer from "../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "./NodeBase";

const createClassNode = (varName, NodeInfos, LCanvas, path) => {

    ClassNode.title = NodeInfos["name"];
    ClassNode.description = NodeInfos["name"];

    function ClassNode() {
        inheritNodeBase(ClassNode, this);
        this.addOutput("Linked class");

        this.properties = {precision: 1};
        this.varName = varName;
    }

    ClassNode.prototype.onAdded = function () {
        if (this.varName === undefined) {
            this.varName = this.makeId(15);
        }
    };

    ClassNode.prototype.onExecute = function () {
        this.setOutputData(0, this);
        sharedBuffer.addImport(NodeInfos['import']);
    };

    console.log(`Je créé ${path + NodeInfos["name"]}`);
    LiteGraph.registerNodeType(path + NodeInfos["name"], ClassNode);
};
export default createClassNode