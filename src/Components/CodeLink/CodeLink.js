import React from "react";
import {LGraph, LGraphCanvas, LiteGraph, serializedLGraph} from "litegraph.js"
import {Link, Route} from "react-router-dom";
import "./litegraph.css"
import createNode from "./CodeLinkNodes/test"
import createBasicFunction from './CodeLinkNodes/BasicUserFunction'
import createValue from "./CodeLinkNodes/Value"
import createSplitter from "./CodeLinkNodes/Splitter";
import WidgetProperties from "./../Main/Components/WidgetProperties/WidgetProperties.js"

const fs = window.require("fs")

function Addition(a,b) {
    return a + b;
}

class CodeLink extends React.Component {

    #graph = new LGraph();

    constructor(props) {
        super(props)
        
        this.state = {
            urldata: this.props.orgs
        }
        console.log(this.props)
    }

        /*
            constructor(props) {
                super(props)

                const defaultFileType = "json";
                this.fileNames = {
                    json: "graph.json"
                }
                this.state = {
                    fileType: defaultFileType,
                    fileDownloadUrl: null,
                    status: "",
                    data: [
                        {id: "1", type:"boolen", name:"length", value:"0"}
                    ]
                }
                this.download = this.download.bind(this);
            }
        */
    
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

        this.Lcanvas = new LGraphCanvas(this.canvas, this.#graph);
        LiteGraph.clearRegisteredTypes()
       /* const node1 = LiteGraph.createNode("basic/const")
        node1.pos  = [100, 100];
        this.#graph.add(node1)

        const node2 = LiteGraph.createNode("basic/const");
        node2.pos = [200, 200];
        this.#graph.add(node2)

        var node_watch = LiteGraph.createNode("basic/watch");

        node_watch.pos = [0, 0];

        this.#graph.add(node_watch);
        this.addNodes()
        this.sum = LiteGraph.createNode("basic/sumation");
        this.sum.pos = [500, 500];

        node1.connect(0, this.sum, 0);
        node2.connect(0, this.sum, 1);
*/
        this.addNodes()
        this.sum = LiteGraph.createNode("basic/sumation");
        this.sum.pos = [500, 500];
        this.#graph.add(this.sum);
        fs.readFile('data.json', 'utf-8', this.createEveryNodes);
        //this.#graph.start()
    }

    /*
    download (event) {
        //event.preventDefault();
          // Prepare the file
        let output;
        if (this.state.fileType === "json") {
            output = JSON.stringify(event, 
              null, 4);
        }
        // Download it
        const blob = new Blob([output]);
        const fileDownloadUrl = URL.createObjectURL(blob);
        this.setState ({fileDownloadUrl: fileDownloadUrl}, 
          () => {
            this.dofileDownload.click(); 
            URL.revokeObjectURL(fileDownloadUrl);  // free up storage--no longer needed.
            this.setState({fileDownloadUrl: ""})
        })    
      }
      */

    render() {
        return (
            <div>
                <canvas id="mycanvas" height={1080} width={1920} ref={(canvas) => {
                    this.canvas = canvas;
                    
                    console.log("papapapap")
                    console.log(this.props.location)
                    console.log(this.props.orgs)
                    console.log(this.state.urldata)
                    console.log(this.state.orgs)
                    this.init()
                }
                }/>
                <button onClick={() => {
                    console.log("mdr")
                    this.#graph.runStep(1)

                }}>
                    EXEC
                </button>

                <button onClick={() => {
                    console.log("mdr")
                    console.log("saveyolo")
                    console.log(this.state.urldata)
                    console.log(this.#graph.serialize(serializedLGraph))

                }}>
                    SAVE
                </button>

                <button onClick={() => {
                    //this.props.SaveNode();
                    console.log("mdr")
                    console.log(typeof(this.#graph.serialize(serializedLGraph)))
                    this.download(this.#graph.serialize(serializedLGraph))

                }}>
                    DOWNLOAD
                </button>

            </div>

        );
    }
};


export default CodeLink