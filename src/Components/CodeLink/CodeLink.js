import React, {useEffect, useState} from "react";
import { LiteGraph, } from "litegraph.js"
import './CodeLink.css';
import "./litegraph.css"
import CodeLinkNodeLoader from "./CodeLinkNodeLoader";
import {Box, Grid, Button, Typography} from "@material-ui/core";
import BufferSingleton from "./CodeLinkParsing/BufferSingleton";
import Main from "../Main/Main";
import Dialog from '../Main/Components/Dialog/Dialog';
import Modal from '../Main/Components/Dialog/Components/Modal/Modal';
import LoadCodeLinkBlocks from '../Main/Components/Dialog/Components/Modal/Components/LoadCodeLinkBlocks/LoadCodeLinkBlocks';
import CodeLinkWidgetList from "./CodeLinkWidgetList/CodeLinkWidgetList";
import JsonManager from '../Main/Tools/JsonManager';
import Path from '../../utils/Path';
import Phones from "../Main/Components/Phones/Phones";
import Process from '../Main/Components/Menu/Tools/Process';
const fs = window.require("fs");
const app = window.require('electron').remote.app;
const path = require('path');

import createSetStateNode from './CodeLinkNodes/SpecialNodes/SetStateNode';
import createInnerClassVariable from './CodeLinkNodes/SpecialNodes/InnerClassVariablesNode';
import createRValueNode from './CodeLinkNodes/RValueNode';
import createMakeListNode from './CodeLinkNodes/SpecialNodes/CreateList';
import Loading from '../Main/Components/Dialog/Components/Loading/Loading';
import CloseIcon from '@material-ui/icons/Close';
import createForLoopNode from './CodeLinkNodes/SpecialNodes/ForLoopNode';
import TemporaryFile from '../../utils/TemporaryFile';

function CodeLink(props) {

    let canvas = null;
    let graph = new LiteGraph.LGraph();
    let LCanvas = null;
    let widget = null;
    let widgetList = null;

    // Static variable to know whether deserialization has been done
    CodeLink.deserializationDone = false;

    const dialog = Dialog.getInstance();

    const catchMountError = (func) => {
      try {
          func();
      } catch (e) {
          console.log(e)
          props.history.push('/')
      }
    };

   /* const loadOtherWidgets = (parsed) => {
        const firstWidget = Phones.phoneList[Main.selection].getWidgetIdList()?.[0]?.id;

        //Failed to load widgets
        if (!firstWidget)
            return;
        loadAWidget(firstWidget, parsed)
    }*/

    // Will be enabled when the reworking of the View system will works
    const loadOtherWidgets = (data, parsed) => {

            data.widgetList.forEach((widget) => {
                console.log(widget)
                CodeLinkNodeLoader.loadClassAndAttributes(widget.properties.name.value, widget.name, parsed, widget._id, `View0/`)

            })

    }

    const useConstructor = () => {
        const [hasBeenCalled, setHasBeenCalled] = useState(false);

        widgetList = []

        Phones.phoneList[Main.selection]?.getWidgetIdList().forEach(widget =>
            widgetList.push(Phones.phoneList[Main.selection].findWidgetByID(widget._id))
         );

        if (hasBeenCalled) return;


        if (fs.existsSync(props.location.state.path) === false) {
            fs.mkdirSync(props.location.state.path, {recursive: true});
        }

        widget = Phones.phoneList[Main.selection].findWidgetByID(props.match.params.id);

        setHasBeenCalled(true);
    };

    useEffect(() => {
        app.allowRendererProcessReuse = false;
        catchMountError(init);
    });


    catchMountError(useConstructor);

    const loadUserCode = () => {
      try {
          return (JsonManager.get(Path.build(Main.MainProjectPath, '.ideal_project', 'code_handler', 'indexer', 'user_sources', 'data.json')));
      } catch (_) {
          return undefined;
      }
    };
    const loadGenericViewAttributes = () => {
        const attribtues = ['this', 'context'];

        attribtues.forEach((attribute) => {
            createInnerClassVariable(attribute);
        });
    }



    const loadRValues = () => {
        const values = [{type: 'string', 'defaultValue': ''}, {type: 'number', 'defaultValue': 0}]

        values.forEach((value) => {
            createRValueNode(value.type, value.defaultValue);
        });
    }


    const loadEverything =  (variableName, className,  afterLoad) => {
        const dataJson = loadUserCode();
        const flutterJson = JSON.parse(fs.readFileSync(Path.build(Main.IdealDir, 'codelink', 'indexer', 'FlutterSDKIndex', 'data.json'), 'utf-8'));
        const safeID = props.match.params.id.replace(/[^a-z]+/g, "");

        if (dataJson) {
            CodeLinkNodeLoader.loadEveryKnownNodes(dataJson, className, safeID);
        }
        //CodeLinkNodeLoader.loadClassAndAttributes(variableName, className, flutterJson, safeID);

        loadOtherWidgets(Phones.phoneList[Main.selection].getData(), flutterJson);
        createSetStateNode();
        loadGenericViewAttributes();
        loadRValues();
        createMakeListNode(LCanvas);
        createForLoopNode(LCanvas);
        afterLoad(className, flutterJson);
    };

    const initNewFile =  (variableName, className, _) => {
        CodeLink.deserializationDone = true;
        loadEverything(variableName, className, (className, flutterJson) => {
            CodeLinkNodeLoader.addMainWidgetToView(className, variableName, flutterJson["classes"]);
        })
    };

    const loadCodeLinkSave =  (variableName, className, currentpath) => {
        loadEverything(variableName, className, (_, __) => {
            graph.load(currentpath);
            handleDeserialization();
        });

    };

    /*
       This function assume that the deserialization takes less than 1 second.
       This is the only way for nodes to know whether deserialization has happened
       ot not.
    */
    const handleDeserialization = () => {
        setTimeout(function () {
            CodeLink.deserializationDone = true;
        }, 1000);
    }




    const init = () => {
        const variableName = props.location.state.variableName.value;
        const className = props.location.state.name;
        const currentPath = path.join(props.location.state.path, props.match.params.id + ".json");

        CodeLink.deserializationDone = false
        LCanvas = new LiteGraph.LGraphCanvas(canvas, graph);
        //LCanvas.background_image = black
        LiteGraph.CANVAS_GRID_SIZE = -1
        console.log(LiteGraph.CANVAS_GRID_SIZE)
        CodeLinkNodeLoader.registerLCanvas(LCanvas);
        LiteGraph.clearRegisteredTypes();

        if (fs.existsSync(currentPath)) {
            loadCodeLinkSave(variableName, className, currentPath)
        } else {
            initNewFile(variableName, className, currentPath)
        }
    };

    const savegraph = (event) =>
    {
        let output = JSON.stringify(event, null, 4);
        fs.writeFileSync(path.join(props.location.state.path, props.match.params.id + '.json'), output);
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
        dialog.current.createDialog(<Loading/>);
        if (!codeLinkBlocks)
            return;
        JsonManager.saveThis({codeLinkUserPath: codeLinkBlocks.dir}, Path.build(Main.MainProjectPath, 'Ideal_config.json'));
        let indexerArguments = {
            'requestType': 'index',
            'parameters': {
                'pathToIndex': codeLinkBlocks.dir,
                'finalPath': Path.build(Main.MainProjectPath, '.ideal_project', 'code_handler', 'indexer', 'user_sources'),
                'verbose' : false
            }
        };

        indexerArguments = TemporaryFile.createSync(JSON.stringify(indexerArguments));

        const command = Main.debug ? 'dart C:\\Users\\axela\\IdeaProjects\\codelink-dart-indexer\\bin\\ideal_dart_code_handler.dart ' :  'dart pub global run ideal_dart_code_handler ';
        Process.runScript(command +  indexerArguments, () => {
            LiteGraph.clearRegisteredTypes();
            loadEverything(props.location.state.variableName.value, props.location.state.name, () => {});
            dialog.current.unsetDialog();
        }, {}, true);
    };

    return (
        <div>
            <Dialog ref={Dialog.getInstance()}/>
            <Grid container direction={'column'} className={"CodeLink-Content"}>
                <Grid container item alignItems={'center'} justifyContent={'space-between'} direction={'row'} className={"CodeLink-bar-menu"}>
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
                              justifyContent="center"
                        >
                            <Typography variant="h6" style={{paddingTop: '15px'}}>
                                Widget Menu
                            </Typography>
                            <div>
                                <CodeLinkWidgetList widgetList={widgetList} />

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
