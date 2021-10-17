import React from "react";
import {Library} from "./Components/Library/Library";
import WidgetProperties from "./Components/WidgetProperties/WidgetProperties";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

import Menu from "./Components/Menu/Menu";
import Phones from "./Components/Phones/Phones";
import Dialog from './Components/Dialog/Dialog';
import JsonManager from './Tools/JsonManager';
import Path from '../../utils/Path';
import Phone from "./Components/Phone/Phone";
import Button from "@material-ui/core/Button";
import VersionHandler from '../../utils/VersionHandler';

const app = window.require('electron').remote.app;
const { ipcRenderer } = window.require('electron');

class Main extends React.Component {

    static IdealDir = "";
    static MainProjectPath = "";
    //TODO change this when the project handle several views.
    static CurrentView = 'Main';
    static FlutterSDK = "";
    static FlutterRoot = '';
    static fs = window.require('fs');

    static selection = null;

    constructor(props) {
        super(props);

        this.state = {
            selection: null,
        };

        try {
            const path = Path.build(app.getPath('documents'), 'Ideal');
            console.log(path);
            const data = JsonManager.get(Path.build(path, 'config.json'));
            console.log(data);
            Main.MainProjectPath = data.ProjectPathAutoSaved;
            const projectName = Main.MainProjectPath.split(Path.Sep).lastItem;
            ipcRenderer.send('update-window-title', projectName);
            Main.FlutterRoot = data.FlutterRoot;
            Main.FlutterSDK = data.FlutterSDK;
            console.log(`MainProject ${Main.MainProjectPath}`);
            Main.IdealDir = path;
            new VersionHandler().versionCheck();
        } catch (e) {
            console.log('Config does not exist, trying to create Ideal folder');
            Main.IdealDir = Path.build(app.getPath('documents'), 'Ideal');
            if (!Main.fs.existsSync(Main.IdealDir))
                Main.fs.mkdirSync(Main.IdealDir);
            Main.fs.mkdirSync(Path.build(Main.IdealDir, 'codelink', 'default'), {recursive: true});
        }
    }

    render() {
        if (this.state.selection !== null) {
            Main.selection = this.state.selection;
        }
        return (
            <div className="App">
                <header className="App-header">
                    <Dialog ref={Dialog.getInstance()}/>
                    <DndProvider backend={HTML5Backend}>
                        {Main.selection !== null && Main.selection >= 0 ?
                            <>
                                <Library/>
                                <Button variant="contained" color="secondary" onClick={() => {
                                    this.setState({selection:-1});
                                }}>
                                    Back
                                </Button>
                                <WidgetProperties ref={WidgetProperties.getInstance()}/>
                            </>
                             : ""}
                        <Phones
                            phoneId={Main.selection !== null && Main.selection >= 0 ? Main.selection : null} select={(key) => {
                            this.setState({selection:key});
                        }}/>
                        <Menu/>
                    </DndProvider>
                </header>
            </div>
        );
    }
}


export default Main