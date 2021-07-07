const net = require('net');
const {ipcMain, dialog} = require('electron')

let socketClient = null;

const SocketIPC = () => {

    const connectToServer = () => {
        socketClient = net.connect({host: 'localhost', port: 41081}, () => {
            // 'connect' listener
            console.log('connected to server!');
        });

        socketClient.on('data', (data) => {
            try {
                console.log(data.toString());
                var person = JSON.parse(data);

                console.log('Hello ' + person.prenom + "!");
            } catch (a) {

            }

        });
        socketClient.on('error', () => {

        });

        socketClient.on('end', () => {
            console.log('disconnected from server');
        });
    }

    const enableIPC = () => {
        ipcMain.on('send-socket-message', (event, arg) => {
            console.log(arg);
            socketClient.write(JSON.stringify(arg));
        });
    }

    const start = () => {
        connectToServer();
        enableIPC();
    }
    start();
}

exports.SocketIPC = SocketIPC