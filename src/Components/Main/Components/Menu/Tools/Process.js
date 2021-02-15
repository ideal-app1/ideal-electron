import React from "react";

class Process {

    static electron = window.require("electron");
    static fs = window.require('fs');
    static exec = window.require('child_process');


    static runScript(command) {

        Process.exec.exec(command, (err, stdout, stderr) => {
            if (err) {
                console.log(`stderr: ${stderr}`);
                return;
            }

            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
    }
}

export default Process