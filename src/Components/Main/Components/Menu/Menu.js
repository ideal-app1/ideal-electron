import React from "react";

import Process from "./Tools/Process"
import "./Menu.css"

import New from "./Assets/new.png"
import Play from "./Assets/play.png"
import Main from "../../Main";
import JsonManager from "../../Tools/JsonManager";
import FlutterManager from "../Phone/Tools/FlutterManager";

class Menu extends React.Component {

    constructor(props) {
        super(props);

        this.folderInput = React.createRef();
    }



    newProject = (event) => {
        const theFiles = event.target.files;
        const relativePath = theFiles[0].webkitRelativePath;
        const folder = relativePath.split("/");
        const folderSelected = folder[0];

        const filePath = theFiles[0].path;
        const filePathSplit = filePath.split("\\");
        let finalPath = "";

        for (let i = 0; i < filePathSplit.length; i++) {
            finalPath += filePathSplit[i];
            finalPath += "\\";
            if (filePathSplit[i] === folderSelected) {
                break;
            }
        }

        Main.MainProjectPath = finalPath + "IdealProject";
        Process.runScript("flutter create " + Main.MainProjectPath, () => {
            Process.runScript("copy src\\flutterCode\\main.dart " + Main.MainProjectPath + "\\" + "lib\\main.dart");
        });
    }

    runProject = (event) => {
        console.log(Main.MainProjectPath);
        const jsonCode = JsonManager.get(Main.MainProjectPath + "\\Ideal_config.json");

        console.log(jsonCode);
        FlutterManager.witeCode(jsonCode, Main.MainProjectPath + "\\" + "lib\\main.dart");

        Process.runScript("cd " + Main.MainProjectPath + " && flutter run ");
    }


    render() {
        return (

            <div className={"new"}>
                <label for="new-input">
                    <img src={New}/>
                </label>
                <input
                    id="new-input"
                    type="file"
                    directory=""
                    webkitdirectory="true"
                    onChange={this.newProject}
                />
                <img src={Play} onClick={this.runProject}/>
            </div>
        );
    }
}


export default Menu









