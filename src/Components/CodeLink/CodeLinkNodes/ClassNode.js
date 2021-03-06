import {LiteGraph} from "litegraph.js";
import sharedBuffer from "../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "./NodeBase";
import CodeLinkNodeLoader from '../CodeLinkNodeLoader';
import CodeLink from '../CodeLink';
import NodeTransferData from './NodeTransferData';

const createClassNode = (varName, NodeInfos, LCanvas, path) => {

    ClassNode.title = `class ${NodeInfos["name"]}${getClassName()}`;
    ClassNode.description = NodeInfos["name"];



    function ClassNode() {
        inheritNodeBase(ClassNode, this);
        this.addOutput(`Linked class ${NodeInfos['name']}`);

        this.properties = {precision: 1};
        this.varName = varName;
        this.name = NodeInfos['name'];

    }

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




    ClassNode.prototype.onAdded = function () {
        const mainConstructor = getMainConstructor();

        if (this.varName === undefined) {
            this.varName = this.makeId(15);
        }

        // Prevent deserialization from creating two new attributes each time
        // CodeLink is opened.
        console.log(`Done ? ${CodeLink.deserializationDone}`)
        if (CodeLink.deserializationDone) {
            CodeLinkNodeLoader.createAttributes(this, varName, mainConstructor);
        }
    };
    //View0/TextButton1/TextButton constructor's attributes/onPressed
    //View0/TextButton1/TextButton constructor's attributes/onPressed
    ClassNode.prototype.onExecute = function () {

        this.setOutputData(0, new NodeTransferData(this, {code: this.varName}));
        sharedBuffer.addImport(NodeInfos['import']);
    };
    console.log(`Creation of ${path}`);
    LiteGraph.registerNodeType(path, ClassNode);
};
export default createClassNode