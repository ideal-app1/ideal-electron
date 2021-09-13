import {LiteGraph} from "litegraph.js";
import sharedBuffer from "../CodeLinkParsing/BufferSingleton";
import inheritNodeBase from "./NodeBase";

const convertDartTypeToLiteral = (type) => {
    const knownType = ['int', 'double', 'long', 'long long', 'long long int', 'double', 'float'];

    if (knownType.find((value) => value === type) !== undefined) {
        return ("number");
    }
    return ("string");
}


const createConstValueNode = (constValue, LCanvas, path) => {

    function ConstValueNode() {

        inheritNodeBase(ConstValueNode)
        this.addOutput("value", constValue["type"]);
        this.addProperty("value", constValue["value"]);

        this.widget = this.addWidget(convertDartTypeToLiteral(constValue["type"]) ,"value",constValue["value"],"value");
        this.widgets_up = true;
        this.size = [180, 30];
        this.randomName = this.makeId(15);
    }

    ConstValueNode.title = constValue["type"] + " " + constValue["name"];
    ConstValueNode.desc = constValue["type"] + " " + constValue["name"];


    function handleCaseString(type, value) {
        if (type.toUpperCase() == "String".toUpperCase()) {
            return ("'" + value + "'");
        }
        return value
    }


    ConstValueNode.prototype.onExecute = function () {

        console.log("wot")
        console.log(constValue)
        console.log("stopwot")
        let buffer = "const " + constValue["type"] + " " + this.randomName + " = " +
            handleCaseString(constValue["type"], constValue["value"]) + ";\n";

        this.setOutputData(0, this);
        sharedBuffer.addCode(buffer);
    }

    ConstValueNode.prototype.getTitle = function() {
        if (this.flags.collapsed) {
            return this.properties.value;
        }
        return this.title;
    };

    ConstValueNode.prototype.setValue = function(v)
    {
        this.setProperty("value",v);
    }

    LiteGraph.registerNodeType(path + constValue["name"], ConstValueNode);

}
export default createConstValueNode