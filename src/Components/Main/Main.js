import React from "react";
import {Library} from "./Components/Library/Library";
import WidgetProperties from "./Components/WidgetProperties/WidgetProperties";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

import Menu from "./Components/Menu/Menu";
import Phones from "./Components/Phones/Phones";
import Modal from './Components/Dialog/Modal';
import JsonManager from './Tools/JsonManager';

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

        if (window.navigator.platform === "Win32") {
            Main.CopyCmd = 'copy';
            Main.Sep = '\\';
        }

        try {
            const path = app.getPath('documents') + Main.Sep + 'Ideal' + Main.Sep + 'config.json';
            console.log(path);
            const data = JsonManager.get(path);
            console.log(data);
            Main.MainProjectPath = data.ProjectPathAutoSaved;
            Main.FlutterSDK = data.FlutterSDK;
        } catch (e) {
            console.log('Config does not exist, trying to create Ideal folder');
            Main.IdealDir = app.getPath('documents') + Main.Sep + 'Ideal';
            if (!Main.fs.existsSync(Main.IdealDir))
                Main.fs.mkdirSync(Main.IdealDir);
        }
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <Modal ref={Modal.getInstance()}/>
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