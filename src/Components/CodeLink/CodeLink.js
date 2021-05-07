import React from "react";
import {LGraph, LGraphCanvas, LiteGraph, serializedLGraph} from "litegraph.js"
import "./litegraph.css"
import createNode from "./CodeLinkNodes/test"
import createBasicFunction from './CodeLinkNodes/BasicUserFunction'
import createValue from "./CodeLinkNodes/Value"
import createSplitter from "./CodeLinkNodes/Splitter";

const fs = window.require("fs")
const app = window.require('electron').remote.app;


class CodeLink extends React.Component {

    #graph = new LGraph();

    constructor(props) {
        super(props)
        console.log("props de codelink")
        console.log(this.props.match.params.filepath)
        const codelinkfilepath = this.props.match.params.filepath;
    }    
    
    createConstValueNodes = (constValue) => {

        function ConstantNumber() {
            this.addOutput("value", constValue["type"]);
            this.addProperty("value", constValue["value"]);
            this.widget = this.addWidget(constValue["type"] === "int" ? "number" : constValue["type"],"value",constValue["value"],"value");
            this.widgets_up = true;
            this.size = [180, 30];
        }

        ConstantNumber.title = constValue["type"] + " " + constValue["name"];
        ConstantNumber.desc = constValue["type"] + " " + constValue["name"];

        ConstantNumber.prototype.onExecute = function() {
            this.setOutputData(0, parseFloat(this.properties["value"]));
        };

        ConstantNumber.prototype.getTitle = function() {
            if (this.flags.collapsed) {
                return this.properties.value;
            }
            return this.title;
        };

        ConstantNumber.prototype.setValue = function(v)
        {
            this.setProperty("value",v);
        }
        LiteGraph.registerNodeType("Custom/const/" + constValue["name"], ConstantNumber);
    }

    createEveryNodes = (err, data) => {
        const parsed = JSON.parse(data);

        parsed["funcs"].forEach(createBasicFunction);
        parsed["constValues"].forEach(createValue);
        createSplitter();

    }

    addNodes = () => {
        LiteGraph.registerNodeType("basic/sumation", createNode() );
    }

    init = () => {
        console.log("Ici commence Init function")
        this.Lcanvas = new LGraphCanvas(this.canvas, this.#graph);
        let currentpath = this.props.match.params.filepath;
        console.log(currentpath)
        const data = fs.readFileSync(currentpath,
            {encoding:'utf8', flag:'r'});
  
        // Display the file data
        if (data.length == 0) {
            LiteGraph.clearRegisteredTypes()
            this.addNodes()
            this.sum = LiteGraph.createNode("basic/sumation");
            this.sum.pos = [500, 500];
            this.#graph.add(this.sum);
            fs.readFile('data.json', 'utf-8', this.createEveryNodes);
        } else {
            const buffer = JSON.parse(data)
            this.#graph.configure(buffer, false)
            LiteGraph.clearRegisteredTypes()
            this.addNodes()
            this.sum = LiteGraph.createNode("basic/sumation");
            this.sum.pos = [500, 500];
            this.#graph.add(this.sum);
            fs.readFile('data.json', 'utf-8', this.createEveryNodes);
        }
    }

    savegraph(event) {
        console.log("Début de la save")
        let currentpath = this.props.match.params.filepath;
        
        let output = JSON.stringify(event, null, 4);
        fs.writeFileSync(currentpath, output);
    }

    render() {
        return (
            <div>
                <canvas id="mycanvas" height={1080} width={1920} ref={(canvas) => {
                    this.canvas = canvas;
                    this.init()
                }
                }/>
                <button onClick={() => {
                    this.#graph.runStep(1)

                }}>
                    EXEC
                </button>

                <button onClick={() => {
                    this.savegraph(this.#graph.serialize(serializedLGraph))
                }}>
                    SAVE
                </button>

            </div>

        );
    }
};


export default CodeLink