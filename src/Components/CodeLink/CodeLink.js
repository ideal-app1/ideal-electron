import React, {Fragment, useEffect, useState} from "react";
import { LiteGraph, ContextMenu, IContextMenuItem, serializedLGraph} from "litegraph.js"
import './CodeLink.css';
import "./litegraph.css"
import CodeLinkNodeLoader from "./CodeLinkNodeLoader";
import {Box, Grid, Button, Typography, List, ListItem, ListItemIcon, ListItemText, TextField} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import {Loop} from "@material-ui/icons";
import BufferSingleton from "./CodeLinkParsing/BufferSingleton";
import FlutterManager from "../Main/Components/Phone/Tools/FlutterManager";
import Main from "../Main/Main";
import Phone from "../Main/Components/Phone/Phone";
import ListSubheader from "@material-ui/core/ListSubheader";
import LibraryWidget from "../Main/Components/Library/Components/LibraryWidget/LibraryWidget";
import {WidgetType} from "../../utils/WidgetUtils";
const { ipcRenderer } = window.require('electron')
const fs = window.require("fs")
const app = window.require('electron').remote.app;
const path = require('path');


function CodeLink(props) {

    let canvas = null;
    let graph = new LiteGraph.LGraph();
    let Lcanvas = null;
    let widget = null;
    let phone = null;
    let searchQuery = '';

    const useConstructor = () => {
        const [hasBeenCalled, setHasBeenCalled] = useState(false);
        phone = Phone.getInstance();

        if (hasBeenCalled) return;

        if (fs.existsSync(props.location.state.path) === false) {
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
              'code': buffer.code
          }
        ));
    }


    const saveCodeLinkData = () => {

        BufferSingleton.erase();
        graph.runStep(1);
        const variableName = props.match.params.id.replace(/[^a-z]+/g, "");
        console.log('LE PATH ' + props.location.state.path);
        writeCodeLinkData();
    }

    const filterWidgets = (widgets, query) => {
        if (!query) {
            return widgets;
        }

        return widgets.filter((widget) => {
            const id = widget._id.toLowerCase();
            return id.includes(query);
        });
    };

    const setSearchQuery = (value) => {
        searchQuery = value;
    }

    const search = () => {
        return (
            <div>
                <input
                    id="header-search"
                    type="text"
                    placeholder="Search widgets"
                    value={searchQuery}
                    onChange={e => {
                        e.preventDefault();
                        setSearchQuery(e.target.value);
                    }}
                />
            </div>
        );
    }

    const printWidgetList = () => {
        if (Phone.getInstance().current == null)
            return;

        const widgetList = Phone.getInstance().current.getWidgetIdList();

        if (widgetList == null)
            return;

        const filteredWidgets = filterWidgets(widgetList, searchQuery);

        return (
            <Grid container
                  spacing={0}
                  direction="row"
                  alignItems="center"
                  justify="center"
            >
                <Fragment key={"Widget Menu"}>
                    <ListSubheader>{"Widget Menu"}</ListSubheader>
                    <br />
                    {search()}
                    <div className={"CodeLink-widget-content"}>
                    {
                        filteredWidgets.map(widget => (
                            <Fragment key={widget._id.toString()}>
                                <ListItem>
                                    <Button variant="contained" color="secondary" onClick={() => {}}>Load<br/>{widget._id}</Button>
                                </ListItem>
                                <Divider />
                            </Fragment>
                        ))
                    }
                    </div>
                </Fragment>
            </Grid>
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
                    {printWidgetList()}
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
