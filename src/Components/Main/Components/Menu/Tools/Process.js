import React from "react";

class Process {

    static electron = window.require("electron");
    static fs = window.require('fs');
    static exec = window.require('child_process');


    static runScript(command, callback = null, options = {}) {

        console.log('start : ' + command);

        console.log('mdr');
        console.log(options);
        return Process.exec.exec(command,  options, (err, stdout, stderr) => {
            if (err) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                return;
            }

            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (callback) {
                callback(stdout, stderr);
            }
        },);
    }

    static runScriptBySpawn(command, args = [], options = {}) {
        const process = Process.exec.spawn(command, args,  options);
        process.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        return process;
    }
}

export default Process