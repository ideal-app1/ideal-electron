import React, { Fragment } from 'react';
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
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import { Grid } from '@material-ui/core';

const app = window.require('electron').remote.app;
const { ipcRenderer } = window.require('electron');

import DependenciesHandler from "../../utils/DependenciesHandler";

class Main extends React.Component {

    static IdealDir = "";
    static MainProjectPath = "";
    //TODO change this when the project handle several views.
    static CurrentView = 'Main';
    static FlutterSDK = "";
    static FlutterRoot = '';
    static FlutterDevice = 'none';
    static fs = window.require('fs');
    static debug = false;
    static selection = 0;
    static platform = window.navigator.platform;

    componentDidMount() {
        try {
            new VersionHandler().versionCheck();
        } catch (e) {
            console.log('Version handler error', e);
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            selection: 0,
        };

        try {
            const path = Path.build(app.getPath('documents'), 'Ideal');
            const data = JsonManager.get(Path.build(path, 'config.json'));
            Main.MainProjectPath = data.ProjectPathAutoSaved;
            const projectName = Main.MainProjectPath.split(Path.Sep).lastItem;
            ipcRenderer.send('update-window-title', projectName);
            Main.FlutterRoot = data.FlutterRoot;
            Main.FlutterSDK = data.FlutterSDK;
            Main.IdealDir = path;
        } catch (e) {
            console.log('Config does not exist, trying to create Ideal folder');
            Main.IdealDir = Path.build(app.getPath('documents'), 'Ideal');
            if (!Main.fs.existsSync(Main.IdealDir))
                Main.fs.mkdirSync(Main.IdealDir);
            Main.fs.mkdirSync(Path.build(Main.IdealDir, 'codelink', 'default'), {recursive: true});
        }

        // DependenciesHandler.addDependencyToProject(Main.MainProjectPath, '{"truc": "blabla"}')
    }

    render() {
        Main.selection = this.state.selection;
        return (
            <div className="App">
                <header className="App-header">
                    <Dialog ref={Dialog.getInstance()}/>
                    <DndProvider backend={HTML5Backend}>
                        {/*{ Main.fs.existsSync(Main.MainProjectPath)*/}
                        {/*    ? [*/}
                        {/*        <Library/>,*/}
                        {/*        <Phones/>,*/}
                        {/*        <WidgetProperties ref={WidgetProperties.getInstance()}/>,*/}
                        {/*        <Menu/>*/}
                        {/*    ]*/}
                        {/*    : [*/}
                        {/*        <Menu/>,*/}
                        {/*        <div>*/}
                        {/*            <h4>Please load or create a project</h4>*/}
                        {/*        </div>*/}
                        {/*    ]*/}
                        {/*}*/}

                        {Main.selection >= 0 ?
                            <Fragment>
                                <Library/>
                                <Grid
                                    container
                                    className={'phone-toolbar phone-w'}
                                    alignItems={'center'}
                                    justifyContent={'space-between'}>
                                    <ViewModuleIcon
                                        onClick={() => {
                                            this.setState({selection:-1});
                                        }}/>
                                    {'View ' + Main.selection}
                                    <MoreHorizIcon/>
                                </Grid>
                                <WidgetProperties ref={WidgetProperties.getInstance()}/>
                            </Fragment>
                             : <Fragment/>}
                        <Phones
                            phoneId={Main.selection >= 0 ? Main.selection : null} select={(key) => {
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
