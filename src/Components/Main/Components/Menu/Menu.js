import React, {useEffect, useRef, useState} from "react";

import Button from '@material-ui/core/Button';
import UiMenu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const {ipcRenderer} = window.require('electron');

import Process from "./Tools/Process"
import "./Menu.css"
import "./Dropdrownmenu.css"

const path = require('path');

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
import LoadProject from "../Dialog/Components/Modal/Components/LoadProject/LoadProject";
import FolderIcon from '@material-ui/icons/Folder';

const fs = window.require('fs');
const mainTemplateCode = require("../../../../flutterCode/Main.dart");
/*              icons               */
import BoltIcon from "../../../../../assets/icon.svg";
import CogIcon from "./Assets/Icons/cog.svg";
import PlusIcon from "./Assets/Icons/plus.svg";
import ChevronIcon from "./Assets/Icons/chevron.svg";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RefreshIcon from '@material-ui/icons/Refresh';
import StopIcon from '@material-ui/icons/Stop';
import moveFiles from './Tools/MoveFiles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import BufferSingleton from '../../../CodeLink/CodeLinkParsing/BufferSingleton';
import VersionHandler from '../../../../utils/VersionHandler';
import Phones from "../Phones/Phones";
import { Badge, Divider, Grid, InputLabel, Select } from '@material-ui/core';
//import PlayIcon from "./Assets/Icons/back-arrow.svg";
//import FlashIcon from "./Assets/Icons/flash.svg";
import DependenciesHandler from '../../../../utils/DependenciesHandler';
import IdealLogo from "../../../../../assets/icon.png";
import Emulators from './Components/Emulators';
import TemporaryFile from '../../../../utils/TemporaryFile';
import { keyCommands } from './Tools/FlutterCmd';
import { verbose } from 'electron-log';

//TODO renommer cette class
export default function Menu(props) {

    const [run, setRun] = React.useState(Main.flutterProcess);

    const handleRunState = (state) => {
        Main.flutterProcess = state;
        setRun(state);
    };

    const dialog = Dialog.getInstance();

    const createDirectories = () => {
        fs.mkdirSync(Path.build(Main.MainProjectPath, '.ideal_project', 'codelink'), {recursive: true});
        fs.mkdirSync(Path.build(Main.MainProjectPath, 'lib', 'codelink', 'user'), {recursive: true});
        fs.mkdirSync(Path.build(Main.MainProjectPath, 'lib', 'codelink', 'default'), {recursive: true});
        fs.mkdirSync(Path.build(Main.IdealDir, 'codelink', 'FunctionBlocks'), {recursive: true});
        fs.mkdirSync(Path.build(Main.IdealDir, 'codelink', 'Indexer', 'FlutterSDKIndex'), {recursive: true});
        fs.mkdirSync(Path.build(Main.IdealDir, 'codelink', 'Indexer', 'FunctionBlocksIndex'), {recursive: true});
    };

    const addDependencies = () => {
        const dependencies = ['http', 'url_launcher'];
        const object = {};

        dependencies.forEach((dependency) => {
            object[dependency] = 'any';
        });
        DependenciesHandler.addDependencyToProject(Main.MainProjectPath, object);
        Process.runScript(`${Main.FlutterSDK} pub get`, null, {'cwd': Main.MainProjectPath});
    };

    const createIdealProject = () => {
        Process.runScript(Main.FlutterSDK + " create " + Main.MainProjectPath, () => {
            fs.unlinkSync(Path.build(Main.MainProjectPath, 'lib', 'main.dart'));
            //fs.writeFileSync(Path.build(Main.MainProjectPath, 'lib', 'Main.dart'), mainTemplateCode);
            createDirectories();
            JsonManager.saveThis({
                ProjectPathAutoSaved: Main.MainProjectPath,
                FlutterRoot: Main.FlutterRoot,
                FlutterSDK: Main.FlutterSDK
            }, Path.build(Main.IdealDir, "config.json"));
            Phones.resetState();
            dialog.current.unsetDialog();
            addDependencies();
        });
    };

    const newProject = async () => {
        if (!Main.FlutterSDK) {
            const flutter = await dialog.current.createDialog(<Modal modal={<FlutterSDK/>}/>);
            Main.FlutterRoot = flutter.dir;
            Main.FlutterSDK = Path.build(flutter.dir, "bin", "flutter");
        }
        const project = await dialog.current.createDialog(<Modal modal={<CreateProject/>}/>);
        dialog.current.createDialog(<Loading/>);
        Main.MainProjectPath = Path.build(project.dir, project.name);
        ipcRenderer.send('update-window-title', project.name);
        createIdealProject();
    }

    const getACodeLinkData = (fullData, file) => {
        const data = JSON.parse(fs.readFileSync(file).toString());

        data.imports.forEach((elem) => {
            fullData.imports.add(elem);
        });
        fullData.functions.push(data.function);
    }

    const getEveryCodeLinkData = (fullData, dirPath) => {
        const filesInDirectory = fs.readdirSync(dirPath);

        for (const file of filesInDirectory) {
            const absolute = Path.build(dirPath, file);

            if (fs.statSync(absolute).isDirectory()) {
                getEveryCodeLinkData(fullData, absolute);
            } else if (path.extname(absolute) === ".json" &&
                path.basename(absolute).startsWith('CodeLinkCode_')) {
                getACodeLinkData(fullData, absolute);
            }
        }
    };

    const createCodeLinkInitFunc = (functions) => {
        let buffer = '';


        functions.forEach((func) => {
            buffer += `\t${func.name}();\n`;
        })
        buffer += '\n';
        functions.push({
            'name': 'CodeLinkInit',
            'code': buffer,
        });
    }

    const getCodeHandlerFormat = (jsonCodeView, index) => {
        const path = Path.build(Main.MainProjectPath, 'lib', 'Main.dart')
        const construct = Phones.phoneList[index].deepConstruct(jsonCodeView.idList.list[0]);

        return FlutterManager.formatDragAndDropToCodeHandler(construct, path);
    }

    const getAViewData = (jsonCode, data, index) => {
        const CodeLinkPath = Path.build(Main.MainProjectPath, '.ideal_project', 'codelink', `View${index}`)
        const codeHandlerFormat = getCodeHandlerFormat(jsonCode.view[index], index);
        const viewData = {
            'imports': new Set(),
            'functions': [],
            'declarations': codeHandlerFormat['declarations'],
            'initialization': codeHandlerFormat['initialization'],
        };

        if (Main.fs.existsSync(CodeLinkPath) === true) {
            getEveryCodeLinkData(viewData, CodeLinkPath);
        }
        createCodeLinkInitFunc(viewData['functions']);
        data.parameters.views.push(`View${index}`);
        data.parameters.viewsCode.push(viewData);

    }

    const generateData = (jsonCode) => {
        const data = {
            'requestType': 'creator',
            'parameters': {
                'path': Main.MainProjectPath,
                'views': [],
                'routes': Phones.getRoutes(),
                'viewsCode': []
            }
        };

        for (let i = 0; jsonCode.view[i] !== undefined; i++) {
            getAViewData(jsonCode, data, i);
            data['parameters']['viewsCode'][i]['imports'] = Array.from(data['parameters']['viewsCode'][i]['imports']);
        }
        return data;
    }

    const execCodeHandler = (jsonCode, data, keyCommand) => {
        moveFiles(jsonCode.codeLinkUserPath, Path.build(Main.MainProjectPath, 'lib', 'codelink', 'user'), 'dart');
        moveFiles(Path.build(Main.IdealDir, 'codelink', 'FunctionBlocks'), Path.build(Main.MainProjectPath, 'lib', 'codelink', 'src'), 'dart')
        if (Main.debug)
            Process.runScript('dart C:\\Users\\axela\\IdeaProjects\\codelink-dart-indexer\\bin\\ideal_dart_code_handler.dart ' + TemporaryFile.createSync(JSON.stringify(data)), () => {});
        else
            Process.runScript('dart pub global run ideal_dart_code_handler ' + TemporaryFile.createSync(JSON.stringify(data)), () => {
                if (jsonCode.view.length > 0) {
                    if (run.process) {
                        run.process.stdin.write(keyCommand + '\n');
                        handleRunState({...run, state: 'running'});
                        return;
                    }
                    const runOnDevice = Main.FlutterDevice !== "none" ? ["run", "-d", Main.FlutterDevice] : ['run'];
                    const process = Process.runScriptBySpawn(Main.FlutterSDK, runOnDevice,{cwd: Main.MainProjectPath}, true);
                    handleRunState({state: 'running', process: process});
                }
            });
    };

    const runProject = (keyCommand) => {
        if (!Main.fs.existsSync(Main.MainProjectPath))
            return;

        handleRunState({ ...run, state: 'building' });
        const jsonCode = JsonManager.get(Path.build(Main.MainProjectPath, 'Ideal_config.json'));
        const data = generateData(jsonCode);

        execCodeHandler(jsonCode, data, keyCommand);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const {shell} = window.require('electron');

    const loadProject = async () => {
        const project = await dialog.current.createDialog(<Modal modal={<LoadProject/>}/>);
        Main.MainProjectPath = project.dir;
        JsonManager.saveThis({
            ProjectPathAutoSaved: Main.MainProjectPath,
            FlutterSDK: Main.FlutterSDK
        }, Path.build(Main.IdealDir, "config.json"));
        Phones.phoneList[Main.selection].load();
    }

    const runProjectButton = () => {
        const states = {
            stopped: <PlayArrowIcon onClick={runProject} />,
            building: <RefreshIcon style={{fill: 'rgba(255,255,255,0.25)'}}/>,
            running: <RefreshIcon onClick={() => {runProject()}} />
        }
        return states[run.state];
    }

    const stopProject = () => {
        run.process.kill()
        handleRunState({ state: 'stopped', process: null });
    }

    const stopProjectButton = () => {
        const states = {
            stopped: <StopIcon style={{fill: 'rgba(255,255,255,0.25)'}}/>,
            building: <StopIcon style={{fill: 'rgba(255,255,255,0.25)'}}/>,
            running: <StopIcon style={{fill: '#e35c4c'}} onClick={stopProject}/>
        }
        return states[run.state];
    }

    const hotReloadButton = () => {
        const states = {
            stopped: <FlashOnIcon style={{fill: 'rgba(255,255,255,0.25)'}}/>,
            building: <FlashOnIcon style={{fill: 'rgba(255,255,255,0.25)'}}/>,
            running: <FlashOnIcon style={{fill: '#fad010'}} onClick={() => {
                runProject(keyCommands.HOT_RESTART)}}/>
        }
        return states[run.state];
    }

    return (
        <div className={"new"}>
            <Navbar>
                <Grid container direction={'row'} style={{width: 'auto'}} alignItems={'center'}>
                    <img src={IdealLogo} style={{marginRight: '5px'}} height={'24'} width={'24'} alt={'ideal logo'}/>
                    <h1>IDEAL</h1>
                </Grid>
                <Grid container direction={'row'} style={{width: 'auto'}} alignItems={'center'}>
                    <NavItem icon={<FolderIcon onClick={loadProject}/>}/>
                    <NavItem icon={<PlusIcon onClick={newProject}/>}/>
                    <Emulators/>
                    <NavItem icon={
                        <Badge color={'primary'} variant="dot" invisible={run.state === 'stopped'}>
                            {runProjectButton()}
                        </Badge>
                    }/>
                    <NavItem icon={hotReloadButton()}/>
                    <NavItem icon={stopProjectButton()}/>
                    <MoreVertIcon aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}/>
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
                </Grid>
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

function Dropdown() {
    const [activeMenu, setActiveMenu] = useState('main');
    const [menuHeight, setMenuHeight] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
    }, [])

    function calcHeight(el) {
        const height = el.offsetHeight;
        setMenuHeight(height);
    }

    function DropdownItem(props) {
        return (
            <a href="#" className="menu-item" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
                <span className="icon-button">{props.leftIcon}</span>
                {props.children}
                <span className="icon-right">{props.rightIcon}</span>
            </a>
        );
    }

    function Discord() {
        const {shell} = window.require('electron');
        shell.openExternal('https://discord.gg/4T9DGFvA')
    }

    function Feedback() {
        const {shell} = window.require('electron');
        shell.openExternal('https://forms.gle/sQU17XHw3LiHXLdS6')
    }

    function DocumentationLink() {
        const {shell} = window.require('electron');
        shell.openExternal('https://docs.idealapp.fr')
    }

    function DiscordButton(props) {
        return (
            <a href="#" className="menu-item" onClick={Discord}>
                <span className="icon-button">{props.leftIcon}</span>
                {props.children}
                <span className="icon-right">{props.rightIcon}</span>
            </a>
        );
    }

    function FeedbackButton(props) {
        return (
            <a href="#" className="menu-item" onClick={Feedback}>
                <span className="icon-button">{props.leftIcon}</span>
                {props.children}
                <span className="icon-right">{props.rightIcon}</span>
            </a>
        );
    }

    function DocButton(props) {
        return (
            <a href="#" className="menu-item" onClick={DocumentationLink}>
                <span className="icon-button">{props.leftIcon}</span>
                {props.children}
                <span className="icon-right">{props.rightIcon}</span>
            </a>
        );
    }

    function LogoutAuth() {
        authService.logout();
    }

    function LogoutButton(props) {
        return (
            <a href="#" className="menu-item" onClick={LogoutAuth}>
                <span className="icon-button">{props.leftIcon}</span>
                {props.children}
                <span className="icon-right">{props.rightIcon}</span>
            </a>
        );
    }

    return (
        <div className="dropdown" style={{height: menuHeight}} ref={dropdownRef}>
            <CSSTransition
                in={activeMenu === 'main'}
                timeout={500}
                classNames="menu-primary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    <LogoutButton leftIcon={<BoltIcon/>}>Logout</LogoutButton>
                    <DropdownItem
                        leftIcon={<CogIcon/>}
                        goToMenu="settings">
                        Settings
                    </DropdownItem>
                </div>
            </CSSTransition>


            <CSSTransition
                in={activeMenu === 'settings'}
                timeout={500}
                classNames="menu-secondary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem goToMenu="main" leftIcon={<PlayIcon/>}/>
                    <FeedbackButton>Feedback</FeedbackButton>
                    <DocButton>Documentation</DocButton>
                    <DiscordButton>Report bug / Need help</DiscordButton>
                </div>
            </CSSTransition>
        </div>
    );
}

