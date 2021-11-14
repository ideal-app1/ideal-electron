import {LiteGraph} from "litegraph.js";
import BufferSingleton from "../CodeLinkParsing/BufferSingleton";
import sharedBuffer from "../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "./NodeBase";
import { useDrag } from 'react-dnd';
import Path from '../../../utils/Path';

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
        if (!link)
            return;
        const node = LCanvas.graph.getNodeById(link.origin_id);

        parameterIsFunction(node, index, isConnected);

    };




    ConstructorAttributeNode.prototype.onExecute = function () {
        const linkedClass = this.getInputData(0);
        const linkedData = this.getInputData(1);
        const codeToAdd = this.getCallbackData(linkedData, param['type']);
        let buffer = "";


        if (linkedClass === undefined || linkedData === undefined)
            return;
        this.varName = `${linkedClass["varName"]}_${param["name"]}`;
        buffer = linkedClass["varName"] + '_' + param["name"] + " = " + codeToAdd + ';\n';
        sharedBuffer.addCode(buffer);
    };
    LiteGraph.registerNodeType(`${path}${currentClass} constructor's attributes/${param["name"]}`, ConstructorAttributeNode);
};
export default createConstructorAttributeNode

