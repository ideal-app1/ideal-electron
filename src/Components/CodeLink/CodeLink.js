import React, {useEffect, useState} from "react";
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

function CodeLink(props) {

    let canvas = null;
    let graph = new LGraph();
    let Lcanvas = null;
    const [counter, setCounter] = useState(0);


    const useConstructor = () => {
        const [hasBeenCalled, setHasBeenCalled] = useState(false);
        const phone = Phone.getInstance();

        if (hasBeenCalled) return;

        setHasBeenCalled(true);
    }

    useEffect(() => {
        app.allowRendererProcessReuse = false;
        console.log("EFFECT! " + counter);
        init();
    });
    const addNodes = () => {
        //LiteGraph.registerNodeType("basic/sumation", createNode() );
    }


    const ipcEnabling = () => {
        ipcRenderer.send('send-socket-message', {"coucou": "mdr"});
    }

    const init = () => {
        console.log("Ici commence Init function")
        Lcanvas = new LGraphCanvas(canvas, graph);
        CodeLinkNodeLoader.registerLCanvas(Lcanvas);
        let currentpath = props.location.state.path;
        console.log(currentpath)
        const data = fs.readFileSync(currentpath,
            {encoding: 'utf8', flag: 'r'});

        // Display the file data
        if (data.length === 0) {
            console.log("NO DATA");
            LiteGraph.clearRegisteredTypes()
            addNodes()
            fs.readFile('data.json', 'utf-8', CodeLinkNodeLoader.loadEveryKnownNodes);
        } else {
            console.log("DATA");
            const buffer = JSON.parse(data)
            console.log("DATA2");

            //graph.configure(buffer, false)
            LiteGraph.clearRegisteredTypes()
            console.log("DATA3");

            addNodes()
            console.log("DATA4");

            fs.readFile('data.json', 'utf-8', (err, data) => {
                console.log("LOADING BEFORE")
                const parsed = JSON.parse(data);
                console.log("LOADING")
                console.log(parsed);
                CodeLinkNodeLoader.loadEveryKnownNodes(parsed, props.match.params.id.replace(/[^a-z]+/g, ""));
                CodeLinkNodeLoader.addMainWidgetToView("TextButton", parsed["classes"]);
            });
        }
    }

    const savegraph = (event) =>
    {
        console.log("Début de la save")
        let currentpath = props.location.state.path;

        let output = JSON.stringify(event, null, 4);
        fs.writeFileSync(currentpath, output);
    }

    const generate = (element) => {
        return [0, 1, 2].map((value) =>
            React.cloneElement(element, {
                key: value,
            }),
        );
    }

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
                                ipcEnabling();
                            }
                            }>
                                IPC
                            </Button>
                            <Button onClick={() => {    setCounter(counter + 1);}}>
                                counter
                            </Button>
                        </Grid>
                        <Grid className={"CodeLink-bar-item"}>
                            <Box marginTop={"1.25rem"}>
                                <Button variant="contained" color="secondary" onClick={() => {
                                    console.log("Exec test Graph")
                                    console.log(graph)
                                    BufferSingleton.erase();
                                    graph.runStep(1);
                                    const variableName = props.match.params.id.replace(/[^a-z]+/g, "");
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
                        <canvas id="myCanvas" width={1920} height={1080} ref={(canvasRef) => {
                            canvas = canvasRef;
                            //init()
                        }}/>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );


}

export default CodeLink