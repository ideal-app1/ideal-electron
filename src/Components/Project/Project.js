import React from "react";
import {HashRouter as Router, Route, Switch} from "react-router-dom";

import './Project.css'
import Main from "../Main/Main";
import CodeLink from "../CodeLink/CodeLink";
import JsonManager from '../Main/Tools/JsonManager';
import Path from '../../utils/Path';

const app = window.require('electron').remote.app;

class Project extends React.Component {

    static IdealDir;
    static ProjectPath;
    static FlutterSDK;
    static Sep = "/";
    static CopyCmd = "cp";
    static fs = window.require('fs');

    static instance = null;

    constructor(props) {
        super(props);

        if (window.navigator.platform === "Win32") {
            Project.CopyCmd = 'copy';
            Project.Sep = '\\';
        }

        new Path();

        try {
            const path = Path.build(app.getPath('documents'), 'Ideal');
            const data = JsonManager.get(Path.build(path, 'config.json'));
            Project.ProjectPath = data.ProjectPathAutoSaved;
            Project.FlutterSDK = data.FlutterSDK;
            Project.IdealDir = path;
        } catch (e) {
            console.log('Config does not exist, trying to create Ideal folder');
            Project.IdealDir = Path.build(app.getPath('documents'), 'Ideal');
            if (!Project.fs.existsSync(Project.IdealDir))
                Project.fs.mkdirSync(Project.IdealDir);
        }
    }

    static getInstance = () => {
        if (Project.instance == null) {
            Project.instance = React.createRef();
        }
        return Project.instance;
    }

    getWidgetIdList = () => {
        if (Project.ProjectPath !== "" && JsonManager.exist(Path.build(Project.ProjectPath, 'Ideal_config.json'))) {
            const jsonCode = JsonManager.get(Path.build(Project.ProjectPath, 'Ideal_config.json'));
            console.log("Json Code =", jsonCode);
            return jsonCode.idList.list;
        }
        return null;
    }

    findWidgetByID = id => {
        if (Project.ProjectPath !== "" && JsonManager.exist(Path.build(Project.ProjectPath, 'Ideal_config.json'))) {
            const jsonCode = JsonManager.get(Path.build(Project.ProjectPath, 'Ideal_config.json'));
            for (let i = 0; i < jsonCode.widgetList.length; i++) {
                if (jsonCode.widgetList[i]._id === id)
                    return jsonCode.widgetList[i]
            }
        }
        return null;
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Main />
                    </Route>
                    <Route exact path="/codelink/:id" component={CodeLink}/>
                </Switch>
            </Router>
        );
    }
}

export default Project
