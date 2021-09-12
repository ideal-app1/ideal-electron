const net = require('net');
const {ipcMain, dialog} = require('electron')
const { startServer } = require('webpack-bundle-analyzer/lib/viewer');

let socketClient = null;

const SocketIPC = () => {

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
                'pathToIndex': 'C:\\Users\\ImPar\\OneDrive\\Documents\\codelink-dart-indexer\\lib\\testdir',
                'finalPath': 'C:\\Users\\ImPar\\OneDrive\\Documents\\result\\2',
                'verbose' : true
            }
        }
    ]

    const startServer = () => {
      indexTest()
    }

    const sendARequest = () => {
        if (valuesToSend.length > 0) {
            socketClient.write(JSON.stringify(valuesToSend[0]))
            valuesToSend.shift()
        }
    }

    const indexTest = () => {
        sendARequest();
    }

    const connectToServer = () => {
        socketClient = net.connect({host: 'localhost', port: 41081}, () => {
            // 'connect' listener
            console.log('connected to server!');
        });

        socketClient.on('data', (data) => {
            try {
                console.log(data.toString());
                let json = JSON.parse(data.toString())

                if (json['info'] === 'message received') {
                    sendARequest()
                }

            } catch (a) {

            }

        });
        socketClient.on('error', () => {

        });

        socketClient.on('end', () => {
            console.log('disconnected from server');
        });
        socketClient.on('drain', () => {
            console.log('drain');
            sendARequest();
        })
    }

    const enableIPC = () => {
        ipcMain.on('send-socket-message', (event, arg) => {
            console.log(arg);
            socketClient.write(JSON.stringify(arg));
        });
    }

    const start = () => {
        connectToServer();
        startServer();
        enableIPC();
    }
    start();
}

exports.SocketIPC = SocketIPC