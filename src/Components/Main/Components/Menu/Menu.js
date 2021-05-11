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

import Loader from "react-loader-spinner";

const path = require('path');

export default function Menu() {

    const [LoaderState, setLoader] = React.useState(false);

    const newProject = async () => {
        const res = await window.require("electron").ipcRenderer.sendSync('runCommand');
        if (res.canceled)
            return;

        setLoader(true);
        Main.MainProjectPath = path.join(res.filePaths[0], 'idealproject');
        console.log(Main.MainProjectPath)
        Process.runScript("flutter create " + Main.MainProjectPath, () => {
            let copyCmd = 'cp'
            if (process.platform === "win32")
                copyCmd = 'copy'
            Process.runScript(copyCmd + " " + path.join('src', 'flutterCode', 'main.dart') + " " + path.join(Main.MainProjectPath, 'lib', 'main.dart'), () => {
                setLoader(false);
                JsonManager.saveThis({ProjectPathAutoSaved: res.filePaths[0]}, path.join('src', 'flutterCode', 'config.json'))
            });
        });
    }

    const runProject = (event) => {
        const jsonCode = JsonManager.get(path.join(Main.MainProjectPath, 'Ideal_config.json'));
        FlutterManager.witeCode(jsonCode, path.join(Main.MainProjectPath, 'lib', 'main.dart'));
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

    return (
        <div className="dropdown" style={{height: menuHeight}} ref={dropdownRef}>

            <CSSTransition
                in={activeMenu === 'main'}
                timeout={500}
                classNames="menu-primary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem leftIcon={<BoltIcon/>}>Help</DropdownItem>
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
                    <DropdownItem>Option 1</DropdownItem>
                    <DropdownItem>Option 2</DropdownItem>
                    <DropdownItem>Option 2</DropdownItem>
                    <DropdownItem>Option 3</DropdownItem>
                </div>
            </CSSTransition>
        </div>
    );
}

