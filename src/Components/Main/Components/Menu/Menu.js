import React from "react";

import Process from "./Tools/Process"



class Menu extends React.Component {

    static electron = window.require("electron");
    static fs = window.require('fs');
    static exec = window.require('child_process');

    constructor(props) {
        super(props);

        this.folderInput = React.createRef();
    }



    change = (event) => {
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


        console.log(finalPath);
        Process.runScript("flutter create " + finalPath + "IdealProject");
    }


    render() {
        return (

            <input
                type="file"
                directory=""
                webkitdirectory="true"
                onChange={this.change}
            />
        );
    }
}


export default Menu









