import React, {useEffect, useRef, useState} from "react";

import Process from "./Tools/Process"
import "./Menu.css"
import "./Dropdrownmenu.css"

import Main from "../../Main";
import JsonManager from "../../Tools/JsonManager";
import FlutterManager from "../Phone/Tools/FlutterManager";
import BoltIcon from "../../../../../assets/icon.svg";
import CogIcon from "./Assets/Icons/cog.svg";
import PlusIcon from "./Assets/Icons/plus.svg";
import ChevronIcon from "./Assets/Icons/chevron.svg";
import CaretIcon from "./Assets/Icons/caret.svg";
import PlayIcon from "./Assets/Icons/play.svg";
import {CSSTransition} from "react-transition-group";
import authService from "../../../../service/auth-service";

import Phone from "../Phone/Phone";
import Modal from '../Dialog/Modal';
import CreateProject from '../Dialog/Components/CreateProject/CreateProject';
import FlutterSDK from '../Dialog/Components/FlutterSDK/FlutterSDK';

const fs = window.require('fs');

const mainDartCode = require("../../../../flutterCode/main.dart")

export default function Menu() {

    const phone = Phone.getInstance();
    const modal = Modal.getInstance()

    const newProject = async () => {
        if (!Main.FlutterSDK) {
            const project = await modal.current.createModal(<FlutterSDK/>);
            Main.FlutterSDK = project.dir + Main.Sep + "bin" + Main.Sep + "flutter";
        }
        const project = await modal.current.createModal(<CreateProject/>);
        modal.current.setLoading(true);
        Main.MainProjectPath = project.dir + Main.Sep + project.name;

        Process.runScript(Main.FlutterSDK + " create " + Main.MainProjectPath, () => {
            fs.writeFileSync(Main.MainProjectPath + Main.Sep + 'lib' + Main.Sep + 'main.dart', mainDartCode)
            fs.mkdirSync(Main.MainProjectPath + Main.Sep + 'codelink');
            JsonManager.saveThis({
                ProjectPathAutoSaved: Main.MainProjectPath,
                FlutterSDK: Main.FlutterSDK
            }, Main.IdealDir + Main.Sep + "config.json");
            phone.current.resetState();
            modal.current.setLoading(false);
        });
    }

    const runProject = (event) => {
        const jsonCode = JsonManager.get(Main.MainProjectPath + Main.Sep + 'Ideal_config.json');
        FlutterManager.writeCode(phone.current.deepConstruct(jsonCode.idList.list[0]), Main.MainProjectPath + Main.Sep + 'lib' + Main.Sep + 'main.dart');
        Process.runScript("cd " + Main.MainProjectPath + " && " + Main.FlutterSDK + " run ");
    }

    return (
        <div className={"new"}>
            <Navbar>
                <h1>IDEAL</h1>
                <NavItem icon={<PlusIcon onClick={newProject}/>}/>
                <NavItem icon={<ChevronIcon onClick={runProject} />}/>
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

