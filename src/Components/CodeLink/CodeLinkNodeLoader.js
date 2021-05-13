import {LiteGraph} from "litegraph.js";
import createMethodNode from "./CodeLinkNodes/MethodNode";
import createFunctionNode from "./CodeLinkNodes/FunctionNode";
import createValue from "./CodeLinkNodes/ConstValueNode";

let graph = null;

const CodeLinkNodeLoader = {
    registerGraph: graphToRegister => {
      graph = graphToRegister;
    },
    loadEveryKnownNodes: (err, data) => {
        const parsed = JSON.parse(data);

        parsed["funcs"].forEach((data) => {
            createFunctionNode(data, graph);
        });
        parsed["constValues"].forEach((data) => {
            createValue(data, graph);
        });
        parsed["classes"].forEach((classObject) => {
            classObject["methods"].forEach((value) => {
                createMethodNode(value, classObject["name"], graph);
            });
        });

    },

}



Object.freeze(CodeLinkNodeLoader);
export default CodeLinkNodeLoader;
