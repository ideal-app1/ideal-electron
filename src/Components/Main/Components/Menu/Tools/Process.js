import React from "react";

class Process {

    static electron = window.require("electron");
    static fs = window.require('fs');
    static exec = window.require('child_process').exec;
    static spawn = window.require('child_process').spawn;


    static runScript(command, callback = null, options = {}) {

        console.log('start : ' + command);

        console.log('mdr');
        console.log(options);
        return Process.exec(command,  options, (err, stdout, stderr) => {
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
        //command = [command, ...args,].join(' ');
        options = {...options, shell: true}

        const process = Process.spawn(command, args, options);

        process.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        return process;
    }
}

export default Process