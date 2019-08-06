import * as http from 'http';
import * as debug from 'debug';
import { Application } from "express";
import * as socketIO from 'socket.io';
import App from './App';
// import Game from './game/main';

debug('ts-express:server');

let server: http.Server;
const port = normalizePort(3020);

// const game = new Game();
// game.start();

const app = new App();
app.init().then(() => {
    const express: Application = app.express;
    express.set('port', port);

    server = http.createServer(express);
    server.listen(port);
    server.on('listening', onListening);

    try {
        const io: socketIO.Server = socketIO(server, { serveClient: false });
        io.on('connection', (socket: socketIO.Socket) => {
            console.log(`connection: ${socket.id}`);
            socket.on('broadcast', (message: string): void => {
                console.log(`broadcast: ${message}`);
                // game.runScript(message);
                io.emit('broadcast', JSON.stringify(message));
            });
        });
    } catch(error) {
        console.log(error);
    }
});

function normalizePort(val: number | string): number | string | boolean {
    const normalizedPort: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(normalizedPort)) {
        return val;
    } else if (normalizedPort >= 0) {
        return normalizedPort;
    } else {
        return false;
    }
}

function onListening(): void {
    const addr = server.address();
    const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
}