import {LiteGraph} from "litegraph.js";

const convertDartTypeToLiteral = (type) => {
    const knownType = ['int', 'double', 'long', 'long long', 'long long int', 'double', 'float'];

    if (knownType.find((value) => value === type) !== undefined) {
        return ("number");
    }
    return ("string");
}


const createValue = (constValue) => {

    function Value() {
        this.addOutput("value", constValue["type"]);
        this.addProperty("value", constValue["value"]);

        this.widget = this.addWidget(convertDartTypeToLiteral(constValue["type"]) ,"value",constValue["value"],"value");
        this.widgets_up = true;
        this.size = [180, 30];
    }

    Value.title = constValue["type"] + " " + constValue["name"];
    Value.desc = constValue["type"] + " " + constValue["name"];

    Value.prototype.onExecute = function () {
        console.log("Et alors ? " + this.title);
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