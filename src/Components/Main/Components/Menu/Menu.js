import React, {useEffect, useRef, useState} from "react";

import Button from '@material-ui/core/Button';
import UiMenu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Process from "./Tools/Process"
import "./Menu.css"
import "./Dropdrownmenu.css"

import Main from "../../Main";
import JsonManager from "../../Tools/JsonManager";
import FlutterManager from "../Phone/Tools/FlutterManager";
import {CSSTransition} from "react-transition-group";
import authService from "../../../../service/auth-service";

import Phone from "../Phone/Phone";
import Dialog from '../Dialog/Dialog';
import Modal from '../Dialog/Components/Modal/Modal';
import CreateProject from '../Dialog/Components/Modal/Components/CreateProject/CreateProject';
import FlutterSDK from '../Dialog/Components/Modal/Components/FlutterSDK/FlutterSDK';
import Loading from '../Dialog/Components/Loading/Loading';

import Path from '../../../../utils/Path';
const fs = window.require('fs');
const mainDartCode = require("../../../../flutterCode/main.dart")

/*              icons               */
import BoltIcon from "../../../../../assets/icon.svg";
import CogIcon from "./Assets/Icons/cog.svg";
import PlusIcon from "./Assets/Icons/plus.svg";
import ChevronIcon from "./Assets/Icons/chevron.svg";
import CaretIcon from "./Assets/Icons/caret.svg";
import PlayIcon from "./Assets/Icons/back-arrow.svg";
import FlashIcon from "./Assets/Icons/flash.svg";

export default function Menu() {

    const phone = Phone.getInstance();
    const dialog = Dialog.getInstance();

    const newProject = async () => {
        if (!Main.FlutterSDK) {
            const project = await dialog.current.createDialog(<Modal modal={<FlutterSDK/>}/>);
            Main.FlutterSDK = Path.build(project.dir, "bin", "flutter");
        }
        const project = await dialog.current.createDialog(<Modal modal={<CreateProject/>}/>);
        dialog.current.createDialog(<Loading/>);
        Main.MainProjectPath = Path.build(project.dir, project.name);

        Process.runScript(Main.FlutterSDK + " create " + Main.MainProjectPath, () => {
            fs.writeFileSync(Path.build(Main.MainProjectPath, 'lib', 'main.dart'), mainDartCode)
            fs.mkdirSync(Path.build(Main.MainProjectPath, 'codelink'));
            JsonManager.saveThis({
                ProjectPathAutoSaved: Main.MainProjectPath,
                FlutterSDK: Main.FlutterSDK
            }, Path.build(Main.IdealDir, "config.json"));
            phone.current.resetState();
            dialog.current.unsetDialog();
        });
    }

    const getACodeLinkData = (fullData, file) => {
        const data =  JSON.parse(fs.readFileSync(file).toString());

        data.imports.forEach((elem) => fullData.imports.add(elem));
        fullData.functions.push(data.code);

    }

    const getEveryCodeLinkData = (fullData, dirPath) => {
        const filesInDirectory = fs.readdirSync(dirPath);
        for (const file of filesInDirectory) {
            const absolute = path.join(dirPath, file);
            if (fs.statSync(absolute).isDirectory()) {
                getEveryCodeLinkData(fullData, absolute);
            } else if (path.extname(absolute) === ".json" &&
                       path.basename(absolute).startsWith('CodeLinkCode_')) {
                getACodeLinkData(fullData, absolute);
            }
        }
    }

    const runProject = (event) => {
        const jsonCode = JsonManager.get(Path.build(Main.MainProjectPath, 'Ideal_config.json'));
        FlutterManager.writeCode(phone.current.deepConstruct(jsonCode.idList.list[0]), Path.build(Main.MainProjectPath, 'lib', 'main.dart'));
        Process.runScript("cd " + Main.MainProjectPath + " && " + Main.FlutterSDK + " run ");

        const data = {
            'imports': new Set(),
            'functions': [],
        }

        getEveryCodeLinkData(data, path.join(Main.MainProjectPath, '.ideal_project', 'codelink'));
        console.log(data);
        //FlutterManager.writeCode(phone.current.deepConstruct(jsonCode.idList.list[0]), Main.MainProjectPath + Main.FileSeparator + 'lib' + Main.FileSeparator + 'main.dart');
        Process.runScript("cd " + Main.MainProjectPath + " && flutter run ");
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const { shell } = window.require('electron');

    return (
        <div className={"new"}>
            <Navbar>
                <h1>IDEAL</h1>
                <NavItem icon={<PlusIcon onClick={newProject}/>}/>
                <NavItem icon={<ChevronIcon onClick={runProject} />}/>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    Settings
                </Button>
                <UiMenu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => {shell.openExternal('https://docs.idealapp.fr')}}>Documentation</MenuItem>
                    <MenuItem onClick={() => {shell.openExternal('https://forms.gle/sQU17XHw3LiHXLdS6')}}>Feedback</MenuItem>
                    <MenuItem onClick={() => {shell.openExternal('https://discord.gg/jUeEwq7Max')}}>Report Bug/Need help</MenuItem>
                    <MenuItem onClick={() => {authService.logout()}}>Logout</MenuItem>
                </UiMenu>
            </Navbar>
        </div>
    );
}

function Navbar(props) {
    return (
        <nav className="navbar">
            <ul className="navbar-nav">{props.children}</ul>
        </nav>
    );
}

function NavItem(props) {
    const [open, setOpen] = useState(false);

    return (
        <li className="nav-item">
            <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
                {props.icon}
            </a>

            {open && props.children}
        </li>
    );
}

