import React, {useEffect, useRef, useState} from "react";

import Process from "./Tools/Process"
import "./Menu.css"
import "./Dropdrownmenu.css"

import Main from "../../Main";
import JsonManager from "../../Tools/JsonManager";
import FlutterManager from "../Phone/Tools/FlutterManager";
import {ReactComponent as BoltIcon} from "./icons/bolt.svg";
import {ReactComponent as CogIcon} from "./icons/cog.svg";
import {ReactComponent as ArrowIcon} from "./icons/arrow.svg";
import {ReactComponent as PlusIcon} from "./icons/plus.svg";
import {ReactComponent as ChevronIcon} from "./icons/chevron.svg";
import {ReactComponent as CaretIcon} from "./icons/caret.svg";
import {ReactComponent as PlayIcon} from "./icons/play.svg";
import {CSSTransition} from "react-transition-group";
import authService from "../../../../service/auth-service";

import Loader from "react-loader-spinner";
import Phone from "../Phone/Phone";

const path = require('path');
const fs = window.require('fs');

export default function Menu() {

    const [LoaderState, setLoader] = React.useState(false);

    const phone = Phone.getInstance();

    const newProject = async () => {
        const res = await window.require("electron").ipcRenderer.sendSync('runCommand');
        if (res.canceled)
            return;

        setLoader(true);

        Main.MainProjectPath = res.filePaths[0] + Main.FileSeparator + 'idealproject';

        Process.runScript("flutter create " + Main.MainProjectPath, () => {

            Process.runScript(Main.CopyCmd + " " + 'src' + Main.FileSeparator + 'flutterCode' + Main.FileSeparator + 'main.dart' + " " + Main.MainProjectPath + Main.FileSeparator + 'lib' + Main.FileSeparator + 'main.dart', () => {
                setLoader(false);
                fs.mkdirSync(Main.MainProjectPath + Main.FileSeparator + 'codelink');
                JsonManager.saveThis({ProjectPathAutoSaved: Main.MainProjectPath}, path.join('src', 'flutterCode', 'config.json'))
            });
        });
    }

    const runProject = (event) => {
        const jsonCode = JsonManager.get(Main.MainProjectPath + Main.FileSeparator + 'Ideal_config.json');
        FlutterManager.witeCode(phone.current.deepConstruct(jsonCode.idList.list[0]), Main.MainProjectPath + Main.FileSeparator + 'lib' + Main.FileSeparator + 'main.dart');
        Process.runScript("cd " + Main.MainProjectPath + " && flutter run ");
    }

    return (

        <div className={"new"}>

            <Navbar>
                <h1>IDEAL</h1>
                <NavItem icon={<PlusIcon onClick={newProject}/>}>

                </NavItem>
                {LoaderState ?
                    <Loader
                        className={"loader"}
                        type="TailSpin"
                        color="#FFF"
                        height={100}
                        width={100}
                        timeout={30000}
                    /> : ""}
                <NavItem icon={<ChevronIcon onClick={runProject}/>}/>
                <NavItem icon={<CaretIcon/>}>
                    <Dropdown/>
                </NavItem>
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
        const { shell } = window.require('electron');
        shell.openExternal('https://discord.gg/4T9DGFvA')
    }

    function Feedback() {
        const { shell } = window.require('electron');
        shell.openExternal('https://forms.gle/sQU17XHw3LiHXLdS6')
    }

    function DocumentationLink() {
        const { shell } = window.require('electron');
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

