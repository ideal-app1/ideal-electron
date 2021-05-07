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


const createValue = (constValue) => {

    function Value() {

        inheritNodeBase(Value)
        this.addOutput("value", constValue["type"]);
        this.addProperty("value", constValue["value"]);

        this.widget = this.addWidget(convertDartTypeToLiteral(constValue["type"]) ,"value",constValue["value"],"value");
        this.widgets_up = true;
        this.size = [180, 30];
        this.randomName = this.makeId(15);
    }

    Value.title = constValue["type"] + " " + constValue["name"];
    Value.desc = constValue["type"] + " " + constValue["name"];


    function handleCaseString(type, value) {
        if (type.toUpperCase() == "String".toUpperCase()) {
            return ('"' + value + '"');
        }
        return value
    }


    Value.prototype.onExecute = function () {
        let buffer = "const " + constValue["type"] + " " + this.randomName + " = " +
            handleCaseString(constValue["type"], constValue["value"]) + ";\n";

        this.setOutputData(0, this);
        sharedBuffer.add(buffer);
    }

    Value.prototype.getTitle = function() {
        if (this.flags.collapsed) {
            return this.properties.value;
        }
        return this.title;
    };

    Value.prototype.setValue = function(v)
    {
        this.setProperty("value",v);
    }

    LiteGraph.registerNodeType("Custom/const/" + constValue["name"], Value);

}
export default createValue