import * as http from 'http';
import * as debug from 'debug';
import { Application } from "express";
import * as socketIO from 'socket.io';
import App from './App';
import { log, normalizePort } from '../utils/utils';
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

    try {
        const io: socketIO.Server = socketIO(server, { serveClient: false });
        io.on('connection', (socket: socketIO.Socket): void => {
            log(`Connection: ${socket.id}`);
            socket.on('broadcast', (message: string): void => {
                log(`Broadcast: ${message}`);
                // game.runScript(message);
                io.emit('broadcast', JSON.stringify(message));
            });

            socket.on('disconnect', (): void => {
                log(`Disconnect: ${socket.id}`);
            });
        });
    } catch(error) {
        log(`Error: ${error}`);
    }
});