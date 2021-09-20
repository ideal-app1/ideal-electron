import React from "react";
import {Library} from "./Components/Library/Library";
import WidgetProperties from "./Components/WidgetProperties/WidgetProperties";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

import Project from "../Project/Project";
import Menu from "./Components/Menu/Menu";
import Phones from "./Components/Phones/Phones";
import Dialog from './Components/Dialog/Dialog';
import JsonManager from './Tools/JsonManager';
import Path from '../../utils/Path';

const app = window.require('electron').remote.app;

class Main extends React.Component {

    static IdealDir = "";
    static MainProjectPath = "";
    static FlutterSDK = "";
    static Sep = "/";
    static CopyCmd = "cp";
    static fs = window.require('fs');

    constructor(props) {
        super(props);

        Main.IdealDir = Project.IdealDir;
        Main.MainProjectPath = Project.ProjectPath;
        Main.FlutterSDK = Project.FlutterSDK;
        Main.Sep = Project.Sep;
        Main.CopyCmd = Project.CopyCmd;

        // if (window.navigator.platform === "Win32") {
        //     Main.CopyCmd = 'copy';
        //     Main.Sep = '\\';
        // }
        //
        // new Path();
        //
        // try {
        //     const path = Path.build(app.getPath('documents'), 'Ideal');
        //     console.log(path);
        //     const data = JsonManager.get(Path.build(path, 'config.json'));
        //     console.log(data);
        //     Main.MainProjectPath = data.ProjectPathAutoSaved;
        //     Main.FlutterSDK = data.FlutterSDK;
        //     Main.IdealDir = path;
        // } catch (e) {
        //     console.log('Config does not exist, trying to create Ideal folder');
        //     Main.IdealDir = Path.build(app.getPath('documents'), 'Ideal');
        //     if (!Main.fs.existsSync(Main.IdealDir))
        //         Main.fs.mkdirSync(Main.IdealDir);
        // }
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <Dialog ref={Dialog.getInstance()}/>
                    <DndProvider backend={HTML5Backend}>
                        <Library/>
                        <Phones/>
                        <WidgetProperties ref={WidgetProperties.getInstance()}/>
                        <Menu/>
                    </DndProvider>
                </header>
            </div>
        );
    }
}

export default Main
