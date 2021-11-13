import {LiteGraph} from "litegraph.js";
import BufferSingleton from "../CodeLinkParsing/BufferSingleton";
import sharedBuffer from "../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "./NodeBase";
import createConstructorAttributeNode from './ConstructorAttributeNode';
import CodeLinkNodeLoader from '../CodeLinkNodeLoader';
import CodeLink from '../CodeLink';

const createClassNode = (varName, NodeInfos, LCanvas, path) => {

    ClassNode.title = `class ${NodeInfos["name"]}${getClassName()}`;
    ClassNode.description = NodeInfos["name"];
    let nodeHasBeenDeserialized = false;

    function getMainConstructor() {
        let mainConstructor = undefined;

        NodeInfos.constructors?.forEach((constructor) => {
            if (constructor.isMainConstructor === "true")
                mainConstructor = constructor;
        });
        return mainConstructor;
    }

    function getClassName() {
        if (varName !== undefined) {
            return ` ->  ${varName}`;
        }
        return '';
    }

    ClassNode.prototype.onConnectionsChange = function(type, slot, isConnected, link, ioSlot) {
        if (CodeLink.deserializationDone === false) {
            nodeHasBeenDeserialized = true;
        }
    }

    function ClassNode() {
        inheritNodeBase(ClassNode, this);
        this.addOutput(`Linked class ${NodeInfos['name']}`);

        this.properties = {precision: 1};
        this.varName = varName;
        this.name = NodeInfos['name'];

    }


    ClassNode.prototype.onAdded = function () {
        const mainConstructor = getMainConstructor();

        if (this.varName === undefined) {
            this.varName = this.makeId(15);
        }

        nodeHasBeenDeserialized = CodeLink.deserializationDone;
        // Prevent deserialization from creating two new attributes each time
        // CodeLink is opened.
        if (CodeLink.deserializationDone) {
            console.log('Deserialization is done');
            CodeLinkNodeLoader.createAttributes(this, mainConstructor);
        }
    };

    ClassNode.prototype.onExecute = function () {

        this.setOutputData(0, this);
        sharedBuffer.addImport(NodeInfos['import']);
    };

    LiteGraph.registerNodeType(path + NodeInfos["name"], ClassNode);
};
export default createClassNode