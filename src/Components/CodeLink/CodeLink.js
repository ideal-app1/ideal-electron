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
import Phones from "../Main/Components/Phones/Phones";
import Process from '../Main/Components/Menu/Tools/Process';
const { ipcRenderer } = window.require('electron');
const fs = window.require("fs");
const app = window.require('electron').remote.app;
const path = require('path');

import CloseIcon from '@material-ui/icons/Close';


function CodeLink(props) {

    let canvas = null;
    let graph = new LiteGraph.LGraph();
    let Lcanvas = null;
    let widget = null;

    const dialog = Dialog.getInstance();

    const useConstructor = () => {
        const [hasBeenCalled, setHasBeenCalled] = useState(false);

        if (hasBeenCalled) return;

        if (fs.existsSync(props.location.state.path) === false) {
            fs.mkdirSync(props.location.state.path);
        }
        widget = Phones.phoneList[Main.selection].current.findWidgetByID(props.match.params.id);
        setHasBeenCalled(true);
    };

    useEffect(() => {
        app.allowRendererProcessReuse = false;
        init();
    });

    useConstructor();

    const loadUserCode = () => {
      try {
          return (JsonManager.get(Path.build(Main.MainProjectPath, '.ideal_project', 'code_handler', 'indexer', 'user_sources', 'data.json')));
      } catch (_) {
          return undefined;
      }
    };

    const loadEverything =  (variableName, className,  afterLoad) => {
        const dataJson = loadUserCode();
        const flutterJson = JSON.parse(fs.readFileSync('flutter.json', 'utf-8'));
        const safeID = props.match.params.id.replace(/[^a-z]+/g, "");

        if (dataJson) {
            CodeLinkNodeLoader.loadEveryKnownNodes(dataJson, className, safeID);
        }
        CodeLinkNodeLoader.loadSpecificFlutterNodes(variableName, className, flutterJson, safeID);
        afterLoad(className, flutterJson);
    };

    const initNewFile =  (variableName, className, currentpath) => {
        loadEverything(variableName, className, (className, flutterJson) => {
            CodeLinkNodeLoader.addMainWidgetToView(className, flutterJson["classes"]);
        })
    };

    const loadCodeLinkSave =  (variableName, className, currentpath) => {
        loadEverything(variableName, className, (_, __) => {
            graph.load(currentpath);
        });

    };

    const init = () => {
        const variableName = props.location.state.variableName.value;
        const className = props.location.state.name;
        const currentPath = path.join(props.location.state.path, props.match.params.id + ".json");

        Lcanvas = new LiteGraph.LGraphCanvas(canvas, graph);
        CodeLinkNodeLoader.registerLCanvas(Lcanvas);
        LiteGraph.clearRegisteredTypes();

        if (fs.existsSync(currentPath)) {
            loadCodeLinkSave(variableName, className, currentPath)
        } else {
            initNewFile(variableName, className, currentPath)
        }
    };

    const savegraph = (event) =>
    {
        let currentpath = props.location.state.path;

        let output = JSON.stringify(event, null, 4);
        fs.writeFileSync(path.join(props.location.state.path, props.match.params.id + '.json'), output);
    };

    const generate = (element) => {
        return [0, 1, 2].map((value) =>
          React.cloneElement(element, {
              key: value,
          }),
        );
    };

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
    };


    const saveCodeLinkData = () => {

        BufferSingleton.erase();
        graph.runStep(1);
        writeCodeLinkData();
    };

    const loadCodeLinkBlocks = async () => {
        const codeLinkBlocks = await dialog.current.createDialog(<Modal modal={<LoadCodeLinkBlocks/>}/>);

        if (!codeLinkBlocks)
            return;
        JsonManager.saveThis({codeLinkUserPath: codeLinkBlocks.dir}, Path.build(Main.MainProjectPath, 'Ideal_config.json'));
        const indexerArguments = {
            'requestType': 'index',
            'parameters': {
                'pathToIndex': codeLinkBlocks.dir,
                'finalPath': Path.build(Main.MainProjectPath, '.ideal_project', 'code_handler', 'indexer', 'user_sources'),
                'verbose' : false
            }
        };

        Process.runScript('dart pub global run ideal_dart_code_handler ' +  (new Buffer(JSON.stringify(indexerArguments)).toString('base64')), () => {
            LiteGraph.clearRegisteredTypes();
            loadEverything(props.location.state.variableName.value, props.location.state.name, () => {});
        });
    };

    return (
        <div>
            <Dialog ref={Dialog.getInstance()}/>
            <Grid container direction={'column'} className={"CodeLink-Content"}>
                <Grid container item alignItems={'center'} justify={'space-between'} direction={'row'} className={"CodeLink-bar-menu"}>
                    <Grid container item alignItems={'center'} className={"CodeLink-bar-item"}>
                        <CloseIcon style={{fontSize: '2.5rem', paddingRight: '20px'}} onClick={() => {props.history.push('/')}}/>
                        <h3>CODELINK</h3>
                    </Grid>
                    <Grid container item className={"CodeLink-bar-item"}>
                        <Grid item className={"CodeLink-bar-item"}>
                            <Box>
                                <Button variant="contained" color="primary" onClick={() => {
                                    saveCodeLinkData();
                                }}>
                                    Exec
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item className={"CodeLink-bar-item"}>
                            <Box>
                                <Button variant="contained" color="primary" onClick={() => {
                                    savegraph(graph.serialize())
                                }}>
                                    Save
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item className={"CodeLink-bar-item"}>
                            <Box>
                                <Button variant="contained" color="primary" onClick={loadCodeLinkBlocks}>
                                    Load blocks
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container item direction={'row'}>
                    <Grid item xs={2} className={"CodeLink-widget-menu"}>
                        <Grid container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justify="center"
                        >
                            <Typography variant="h6" style={{paddingTop: '15px'}}>
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
            </Grid>
        </div>
    );


}

export default CodeLink
