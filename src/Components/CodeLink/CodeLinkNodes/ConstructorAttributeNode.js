import {LiteGraph} from "litegraph.js";
import BufferSingleton from "../CodeLinkParsing/BufferSingleton";
import sharedBuffer from "../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "./NodeBase";
import { useDrag } from 'react-dnd';
import Path from '../../../utils/Path';
import NodeTransferData from './NodeTransferData'

const createConstructorAttributeNode = (currentClass, param, LCanvas, path) => {

    ConstructorAttributeNode.title = param["name"];
    ConstructorAttributeNode.description = param["name"];

    function ConstructorAttributeNode() {
        inheritNodeBase(ConstructorAttributeNode, this);
        this.addInput("Linked Class");
        this.addInput(param["name"] + "(" + param["type"] + ")");
        this.addOutput('value');

        this.setOutputData(0, this);
        this.properties = {precision: 1};
        this.isAlreadyComputed = false;
    }



    ConstructorAttributeNode.prototype.onConnectionsChange = function (type, index, isConnected, link, ioSlot) {
        if (!link)
            return;
        const node = LCanvas.graph.getNodeById(link.origin_id);

        // If it is the first input and that it is connected to the widget
        // Also check if it is a ClassNode
        if (isConnected && type === LiteGraph.INPUT &&
          index === 0 && node.nodeType === 'ClassNode') {
            this.title = `${node.varName}->${param['name']}`
        } else if (index === 0) {
            this.title = param['name']
        }

    };




    ConstructorAttributeNode.prototype.onExecute = function () {
        const linkedClass = this.getInputData(0).parent;
        const codeToAdd = this.getInputData(1).data.code;
        let buffer = "";


        if (linkedClass === undefined || codeToAdd === undefined)
            return;
        this.varName = `${linkedClass["varName"]}_${param["name"]}`;
        buffer = linkedClass["varName"] + '_' + param["name"] + " = " + codeToAdd + ';\n';
        sharedBuffer.addCode(buffer);
        this.setOutputData(0, new NodeTransferData(this, {code: this.varName}))
    };
    console.log(`Creation of attribute - ${path}`);
    LiteGraph.registerNodeType(`${path}`, ConstructorAttributeNode);
};
export default createConstructorAttributeNode

