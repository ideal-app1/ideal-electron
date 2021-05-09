import React from "react";
import {LGraph, LGraphCanvas, LiteGraph, ContextMenu, IContextMenuItem, serializedLGraph} from "litegraph.js"
import './CodeLink.css';
import "./litegraph.css"
import createNode from "./CodeLinkNodes/test"
import createBasicFunction from './CodeLinkNodes/BasicUserFunction'
import createValue from "./CodeLinkNodes/Value"
import createSplitter from "./CodeLinkNodes/Splitter";
import {Box, Grid, Button, Divider, Typography, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {Loop} from "@material-ui/icons";

const fs = window.require("fs")
const app = window.require('electron').remote.app;

class CodeLink extends React.Component {

    #graph = new LGraph();

    constructor(props) {
        super(props)
        console.log("props de codelink")
        console.log(this.props.match.params.filepath)
        console.log(this.props.match.params.idwidget)
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
        if (data.length === 0) {
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

    generate = (element) => {
        return [0, 1, 2].map((value) =>
            React.cloneElement(element, {
                key: value,
            }),
        );
    }

    render() {
        console.log("View codelink")
        return (
            <div>
                <Grid container className={"CodeLink-Content"}>
                    <Grid xs={12} className={"CodeLink-bar-menu"}>
                        <Grid container>
                            <Grid className={"CodeLink-bar-item"}>
                                <Box>
                                    <h2>CodeLink</h2>
                                </Box>
                            </Grid>
                            <Grid className={"CodeLink-bar-item"}>
                                <Box marginTop={"1.25rem"}>
                                    <Button variant="contained" color="primary" href="/">Phone view</Button>
                                </Box>
                            </Grid>
                            <Grid className={"CodeLink-bar-item"}>
                                <Box marginTop={"1.25rem"}>
                                    <Button variant="contained" color="secondary" onClick={() => {
                                        console.log("Exec test Graph")
                                        this.#graph.runStep(1)
                                    }}>
                                        Exec
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid xs={2} className={"CodeLink-widget-menu"}>
                        <Grid container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justify="center"
                        >
                            <Typography variant="h6">
                                Widget Menu
                            </Typography>
                            <div>
                                <List>
                                    {this.generate(
                                        <ListItem>
                                            <ListItemText
                                                primary="Widget item Id"
                                            />
                                            <ListItemIcon>
                                                <Loop />
                                            </ListItemIcon>
                                        </ListItem>,
                                    )}
                                </List>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid xs={10} className={"CodeLink-canvas"}>
                        <Box className={"CodeLink-canvas-Box"}>
                            <canvas id="myCanvas" width={1920} height={1080} ref={(canvas) => {
                                this.canvas = canvas;
                                this.init()
                            }}/>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default CodeLink
