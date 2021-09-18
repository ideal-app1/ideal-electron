import React, {useEffect, useState} from "react";
import { LiteGraph, ContextMenu, IContextMenuItem, serializedLGraph} from "litegraph.js"
import './CodeLink.css';
import "./litegraph.css"
import CodeLinkNodeLoader from "./CodeLinkNodeLoader";
import {Box, Grid, Button, Typography, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {Loop} from "@material-ui/icons";
import BufferSingleton from "./CodeLinkParsing/BufferSingleton";
import FlutterManager from "../Main/Components/Phone/Tools/FlutterManager";
import Main from "../Main/Main";
import Phone from "../Main/Components/Phone/Phone";
import Dialog from '../Main/Components/Dialog/Dialog';
import Modal from '../Main/Components/Dialog/Components/Modal/Modal';
import LoadCodeLinkBlocks from '../Main/Components/Dialog/Components/Modal/Components/LoadCodeLinkBlocks/LoadCodeLinkBlocks';
import JsonManager from '../Main/Tools/JsonManager';
import Path from '../../utils/Path';
const { ipcRenderer } = window.require('electron')
const fs = window.require("fs")
const app = window.require('electron').remote.app;
const path = require('path');


function CodeLink(props) {

    let canvas = null;
    let graph = new LiteGraph.LGraph();
    let Lcanvas = null;
    let widget = null;

    const dialog = Dialog.getInstance();

    const useConstructor = () => {
        const [hasBeenCalled, setHasBeenCalled] = useState(false);
        const phone = Phone.getInstance();

        if (hasBeenCalled) return;

        if (fs.existsSync(props.location.state.path) === false) {
            console.log("ca crée en premier connard")
            fs.mkdirSync(props.location.state.path);
        }
        widget = phone.current.findWidgetByID(props.match.params.id);
        setHasBeenCalled(true);
    }

    useEffect(() => {
        app.allowRendererProcessReuse = false;
        init();
    });

    useConstructor();

    const sendData = () => {
        const buffer = BufferSingleton.get();

        ipcRenderer.send('send-socket-message', {
            'request-type': 'creator',
            'parameters': {
                'imports': Array.from(buffer.import),
                'code': buffer.code
            }
        });
        //FlutterManager.writeCodeLink(buffer.code, Main.MainProjectPath + Main.FileSeparator + 'lib' + Main.FileSeparator + 'main.dart');
        //FlutterManager.writeCodeImport(buffer.import, Main.MainProjectPath + Main.FileSeparator + 'lib' + Main.FileSeparator + 'main.dart')
    }

    const loadEverything =  (name, forceLoadDefaultWidget) => {
        const dataJson = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
        const flutterJson = JSON.parse(fs.readFileSync('flutter.json', 'utf-8'));
        const safeID = props.match.params.id.replace(/[^a-z]+/g, "");

        [dataJson].forEach((jsonFile) => {
            CodeLinkNodeLoader.loadEveryKnownNodes(jsonFile, name, safeID);
        });
        CodeLinkNodeLoader.loadSpecificFlutterNode(name, flutterJson, safeID);
        if (forceLoadDefaultWidget)
            CodeLinkNodeLoader.addMainWidgetToView(name, flutterJson["classes"]);
    }

    const initNewFile =  (name, currentpath) => {
        LiteGraph.clearRegisteredTypes();
        loadEverything(name, true)
    }

    const loadCodeLinkSave =  (name, currentpath) => {
        LiteGraph.clearRegisteredTypes()

        loadEverything(name, false)
        graph.load(currentpath)


    }

    const init = () => {
        Lcanvas = new LiteGraph.LGraphCanvas(canvas, graph);
        CodeLinkNodeLoader.registerLCanvas(Lcanvas);
        let currentpath = path.join(props.location.state.path, props.match.params.id + ".json");
        console.log()

        if (fs.existsSync(currentpath)) {
            console.log('Load save')
            loadCodeLinkSave(props.location.state.name, currentpath)
        } else {
            console.log('new')
            initNewFile(props.location.state.name, currentpath)
        }
    }

    const savegraph = (event) =>
    {
        let currentpath = props.location.state.path;

        let output = JSON.stringify(event, null, 4);
        fs.writeFileSync(path.join(props.location.state.path, props.match.params.id + '.json'), output);
    }

    const generate = (element) => {
        return [0, 1, 2].map((value) =>
          React.cloneElement(element, {
              key: value,
          }),
        );
    }

    const writeCodeLinkData = () => {

        let CLPath = path.join(props.location.state.path, 'CodeLinkCode_' + props.match.params.id + '.json');
        let buffer = BufferSingleton.get();

        fs.writeFileSync(CLPath, JSON.stringify({
              'imports': Array.from(buffer.import),
              'function': {
                  'name': props.match.params.id.replace(/[^a-z]+/g, "") + 'CodeLink',
                  'code': buffer.code
              }
          }
        ));
    }


    const saveCodeLinkData = () => {

        BufferSingleton.erase();
        graph.runStep(1);
        writeCodeLinkData();
    }

    const loadCodeLinkBlocks = async () => {
        const codeLinkBlocks = await dialog.current.createDialog(<Modal modal={<LoadCodeLinkBlocks/>}/>);
        JsonManager.saveThis({codeLinkUserPath: codeLinkBlocks.dir}, Path.build(Main.MainProjectPath, 'Ideal_config.json'));
    }

    return (
        <div>
            <Dialog ref={Dialog.getInstance()}/>
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
                                <Button variant="contained" color="primary" onClick={() => {props.history.push('/')}}>
                                    Phone view
                                </Button>
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
                                   saveCodeLinkData();
                                }}>
                                    Exec
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => {
                                    savegraph(graph.serialize())
                                }}>
                                    Save
                                </Button>
                            </Box>
                        </Grid>
                        <Grid className={"CodeLink-bar-item"}>
                            <Box marginTop={"1.25rem"}>
                                <Button variant="contained" color="secondary" onClick={loadCodeLinkBlocks}>
                                    Load
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
