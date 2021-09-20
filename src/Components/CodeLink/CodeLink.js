import React, {useEffect, useState} from "react";
import { LiteGraph, ContextMenu, IContextMenuItem, serializedLGraph} from "litegraph.js"
import './CodeLink.css';
import "./litegraph.css"
import CodeLinkNodeLoader from "./CodeLinkNodeLoader";
import {Box, Grid, Button, ListItem} from "@material-ui/core";
import BufferSingleton from "./CodeLinkParsing/BufferSingleton";
import FlutterManager from "../Main/Components/Phone/Tools/FlutterManager";
import Project from "../Project/Project";
import CodeLinkWidgetList from "./CodeLinkWidgetList/CodeLinkWidgetList";

const { ipcRenderer } = window.require('electron')
const fs = window.require("fs")
const app = window.require('electron').remote.app;
const path = require('path');

function CodeLink(props) {

    let canvas = null;
    let graph = new LiteGraph.LGraph();
    let Lcanvas = null;
    let widget = null;
    let widgetList = null;

    const useConstructor = () => {
        const [hasBeenCalled, setHasBeenCalled] = useState(false);
        const project = Project.getInstance();

        widgetList = project.current.getWidgetIdList();

        if (hasBeenCalled) return;

        if (fs.existsSync(props.location.state.path) === false) {
            fs.mkdirSync(props.location.state.path);
        }
        widget = project.current.findWidgetByID(props.match.params.id);
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

    const init = () => {
        Lcanvas = new LiteGraph.LGraphCanvas(canvas, graph);
        CodeLinkNodeLoader.registerLCanvas(Lcanvas);
        let currentpath = path.join(props.location.state.path, props.match.params.id + ".json");
        console.log("PATH ? " + currentpath);
        const data = fs.readFileSync(currentpath, {encoding: 'utf8', flag: 'r'});

        if (data.length === 0) {
            LiteGraph.clearRegisteredTypes()
            fs.readFile('data.json', 'utf-8', (err, data) => {
                const parsed = JSON.parse(data);


                CodeLinkNodeLoader.loadEveryKnownNodes(parsed, props.match.params.id.replace(/[^a-z]+/g, ""));
            });
        } else {

            const buffer = JSON.parse(data)

            LiteGraph.clearRegisteredTypes()
            fs.readFile('data.json', 'utf-8', (err, data) => {
                const parsed = JSON.parse(data);

                CodeLinkNodeLoader.loadEveryKnownNodes(parsed, props.match.params.id.replace(/[^a-z]+/g, ""));
                CodeLinkNodeLoader.addMainWidgetToView("TextButton", parsed["classes"]);
            });
        }
    }

    const savegraph = (event) =>
    {
        let currentpath = props.location.state.path;

        let output = JSON.stringify(event, null, 4);
        fs.writeFileSync(path.join(props.location.state.path, props.match.params.id + '.json'), output);
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
        const variableName = props.match.params.id.replace(/[^a-z]+/g, "");
        writeCodeLinkData();
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
                                <Button variant="contained" color="primary" onClick={() => {props.history.push('/')}}>
                                    Phone view
                                </Button>
                            </Box>
                        </Grid>
                        <Grid className={"CodeLink-bar-item"}>
                            <Box marginTop={"1.25rem"}>
                                <Button variant="contained" color="secondary" onClick={() => {
                                    ipcEnabling();
                                }}>
                                    IPC
                                </Button>
                            </Box>
                        </Grid>
                        <Grid className={"CodeLink-bar-item"}>
                            <Box marginTop={"1.25rem"}>
                                <Button variant="contained" color="secondary" onClick={() => {
                                    setCounter(counter + 1);
                                }}>
                                    counter
                                </Button>
                            </Box>
                        </Grid>
                        <Grid className={"CodeLink-bar-item"}>
                            <Box marginTop={"1.25rem"}>
                                <Button variant="contained" color="secondary" onClick={() => {
                                    saveCodeLinkData();
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
                          direction="row"
                          alignItems="center"
                          justify="center"
                    >
                        { widgetList
                            ? <CodeLinkWidgetList widgetList={widgetList} />
                            : <p>No result</p>
                        }
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
