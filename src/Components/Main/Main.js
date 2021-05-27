import React from "react";
import {Library} from "./Components/Library/Library";
import WidgetProperties from "./Components/WidgetProperties/WidgetProperties";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

import Menu from "./Components/Menu/Menu";
import Phones from "./Components/Phones/Phones";
import Modal from './Components/Dialog/Modal';

class Main extends React.Component {

    static MainProjectPath = "";
    static FlutterSDK = ""
    static FileSeparator = "/";
    static CopyCmd = "cp";
    static fs = window.require('fs');

    constructor(props) {
        super(props);

        if (window.navigator.platform === "Win32") {
            Main.CopyCmd = 'copy';
            Main.FileSeparator = '\\';
        }

        try {
            var data = require('../../flutterCode/config.json');
            console.log(data);
            Main.MainProjectPath = data.ProjectPathAutoSaved;
            Main.FlutterSDK = data.FlutterSDK;
        } catch (e) {
            console.log('ok');
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