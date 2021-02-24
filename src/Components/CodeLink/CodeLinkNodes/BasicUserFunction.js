import {LiteGraph} from "litegraph.js";

const createBasicFunction = (func) => {

    function BasicFunction() {
        func["parameters"].forEach((param) => {
            this.addInput(param["name"] + "(" + param["type"] + ")", param["type"]);
        })
        if (func["return"] !== "void") {
            this.addOutput(func["return"], func["return"]);
        }
        this.properties = {precision: 1};
    }

    BasicFunction.title = func["name"];
    BasicFunction.description = func["name"];



    BasicFunction.prototype.onExecute = function () {
        console.log("Et alors ? " + this.title);
    }
    LiteGraph.registerNodeType("Custom Functions/" + func["name"], BasicFunction);
}
export default createBasicFunction