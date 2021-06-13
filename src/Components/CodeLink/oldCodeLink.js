import React from "react";
import {LGraph, LGraphCanvas, LiteGraph, ContextMenu, IContextMenuItem, serializedLGraph} from "litegraph.js"
import './CodeLink.css';
import "./litegraph.css"
import CodeLinkNodeLoader from "./CodeLinkNodeLoader";
import {Box, Grid, Button, Typography, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {Loop} from "@material-ui/icons";
import BufferSingleton from "./CodeLinkParsing/BufferSingleton";
import FlutterManager from "../Main/Components/Phone/Tools/FlutterManager";
import Main from "../Main/Main";
import Phone from "../Main/Components/Phone/Phone";
const { ipcRenderer } = window.require('electron')


const fs = window.require("fs")
const app = window.require('electron').remote.app;

class OldCodeLink extends React.Component {
    graph = new LGraph();

    constructor(props) {
        const phone = Phone.getInstance();

        super(props);
        console.log(phone.current.findWidgetByID(this.props.match.params.id));
        console.log("PHONE?")
        console.log("codelink", this.props.match.params.id)
    }


    addNodes = () => {
        //LiteGraph.registerNodeType("basic/sumation", createNode() );
    }


    ipcEnabling = () => {
        ipcRenderer.send('send-socket-message', {"coucou": "mdr"});
    }

    init = () => {
        console.log("Ici commence Init function")
        this.Lcanvas = new LGraphCanvas(this.canvas, this.graph);
        CodeLinkNodeLoader.registerLCanvas(this.Lcanvas);
        let currentpath = this.props.location.state.path;
        console.log(currentpath)
        const data = fs.readFileSync(currentpath,
            {encoding:'utf8', flag:'r'});
  
        // Display the file data
        if (data.length === 0) {
            LiteGraph.clearRegisteredTypes()
            this.addNodes()
            fs.readFile('data.json', 'utf-8', CodeLinkNodeLoader.loadEveryKnownNodes);
        } else {
            const buffer = JSON.parse(data)
            this.graph.configure(buffer, false)
            LiteGraph.clearRegisteredTypes()
            this.addNodes()
            fs.readFile('data.json', 'utf-8', (err, data) => {
                const parsed = JSON.parse(data);

                CodeLinkNodeLoader.loadEveryKnownNodes(parsed, this.props.match.params.id.replace(/[^a-z]+/g, ""));
                CodeLinkNodeLoader.addMainWidgetToView("TextButton", parsed["classes"]);
            } );
        }
    }

    savegraph(event) {
        console.log("Début de la save")
        let currentpath = this.props.location.state.path;
        
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
                    <Grid item xs={12} className={"CodeLink-bar-menu"}>
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
                                <Button onClick={() => {
                                    this.ipcEnabling();
                                }
                                }>
                                    IPC
                                </Button>
                            </Grid>
                            <Grid className={"CodeLink-bar-item"}>
                                <Box marginTop={"1.25rem"}>
                                    <Button variant="contained" color="secondary" onClick={() => {
                                        console.log("Exec test Graph")
                                        console.log(this.graph)
                                        BufferSingleton.erase();
                                        this.graph.runStep(1);
                                        const variableName = this.props.match.params.id.replace(/[^a-z]+/g, "");
                                        const buffer = BufferSingleton.get();
                                        console.log("LE BUFFOS")
                                        console.log(buffer.import);
                                        FlutterManager.writeCodeLink(buffer.code, Main.MainProjectPath + Main.FileSeparator + 'lib' + Main.FileSeparator + 'main.dart');
                                        FlutterManager.writeCodeImport(buffer.import, Main.MainProjectPath + Main.FileSeparator + 'lib' + Main.FileSeparator + 'main.dart')
                                        console.log(BufferSingleton.get());
                                    }}>
                                        Exec
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={2} className={"CodeLink-widget-menu"}>
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
                            {/*    <List>*/}
                            {/*        {this.generate(*/}
                            {/*            <ListItem>*/}
                            {/*                <ListItemText*/}
                            {/*                    primary="Widget item Id"*/}
                            {/*                />*/}
                            {/*                <ListItemIcon>*/}
                            {/*                    <Loop />*/}
                            {/*                </ListItemIcon>*/}
                            {/*            </ListItem>,*/}
                            {/*        )}*/}
                            {/*    </List>*/}
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item xs={10} className={"CodeLink-canvas"}>
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

export default OldCodeLink