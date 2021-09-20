const net = require('net');
const {ipcMain, dialog,} = require('electron');
const { startServer } = require('webpack-bundle-analyzer/lib/viewer');
const { spawn } = require( 'child_process' );
var kill  = require('tree-kill');

let socketClient = null;

const ProcessIPC = () => {

    let exe = null;

    const valuesToSend = [{
        'requestType': 'index',
        'parameters': {
            'pathToIndex': 'C:\\flutter\\packages\\flutter\\lib',
            'finalPath': 'C:\\Users\\ImPar\\OneDrive\\Documents\\result\\1',
            'verbose' : true
        }
    },
        {
            'requestType': 'index',
            'parameters': {
                'pathToIndex': 'C:\\Users\\Axel\\Desktop\\hehe\\lib',
                'finalPath': 'C:\\Users\\Axel\\Desktop\\New folder',
                'verbose' : true
            }
        }
    ];

    const setupEnv = () => {
      if (process.platform == 'win32') {

      } else {
          
      }
    };

    const startServer = () => {
      indexTest()
    };


    const sendARequest = () => {
        if (valuesToSend.length > 0) {
            socketClient.write(JSON.stringify(valuesToSend[0]));
            valuesToSend.shift()
        }
    };

    const indexTest = () => {
        sendARequest();
    };

    const execAProcess = (event, toExec) => {
        let dir;

        if (process.platform === 'win32') {
            toExec.unshift('/c');
            dir = spawn('cmd', toExec);
        } else {
            dir = spawn(toExec);
        }
        dir.stdout.on( 'data', ( data ) => console.log( `stdout: ${ data }` ) );
        dir.stderr.on( 'data', ( data ) => console.log( `stderr: ${ data }` ) );
        dir.on('close', () => event.sender.send('processEnd'));
    };

    const enableIPC = () => {
        ipcMain.on('processExec', (event, arg) => {
            execAProcess(event, arg);
            return;
            let dir = null;

            if (process.platform === 'win32') {
                dir = spawn('cmd', ['/c', 'dart', 'C:\\Users\\Axel\\Documents\\indexer\\bin\\Main.dart', 'indexer', JSON.stringify(valuesToSend[1])]);
            } else {
                dir = spawn('ideal_dart_code_handler');
            }

            setTimeout(() => {
                kill(dir.pid);
            }, 20000, "delete");
            dir.stdout.on( 'data', ( data ) => console.log( `stdout: ${ data }` ) );
            dir.stderr.on( 'data', ( data ) => console.log( `stderr: ${ data }` ) );
            dir.on( 'close', ( code ) => console.log( `child process exited with code ${code}` ) );
        })
    };

    const start = () => {
        enableIPC();
    };
    start();
};

exports.SocketIPC = ProcessIPC;