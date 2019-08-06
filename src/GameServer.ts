import { NextFunction, Request, Response, Application } from 'express';
import { normalizePort, log, warn } from '../utils/utils';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as socketIO from 'socket.io';
import Game from './game/main';

class GameServer {
    public express: Application;
    public server: http.Server;
    public io: socketIO.Server;
    public port: string | number | boolean;
    public game: Game;

    constructor() {
        this.express = express();
    }

    public async init(): Promise<void> {
        this.middleware();
        this.setNormalizePort();
    }

    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json({ limit: '10mb' }));
        this.express.use(bodyParser.urlencoded({ extended: false, limit: '10mb', parameterLimit: 1000000 }));
        
        // CORS 문제.
        const cors = require('cors');
        this.express.use(cors());
        this.express.use('/', (req: Request, res: Response, next: NextFunction) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }

    public setNormalizePort(): void {
        this.port = normalizePort(3020);
    }

    public createServer(): void {
        this.express.set('port', this.port);

        this.server = http.createServer(this.express);
        this.server.listen(this.port);
    }
    
    public createSocketServer(): void {
        /*
            socket 의 id는 유동성 id이다. 즉 -> 고정적인 무엇인가를 받아서 -> 고정적 ID로 재 연결 해줄 수 있어야한다.
            이미 연결 중 이라면? -> Disconnect 시키고, connect한다.
            Game Flow, 게임접속 Flow 확립하자.
        */

        try {
            this.io = socketIO(this.server, { serveClient: false });
            this.io.on('connection', (socket: socketIO.Socket): void => {
                log({ text: `Connection: ${socket.id}` });

                socket.on('broadcast', (message: string, date: number): void => {
                    // log({ text: `Broadcast: ${message}`, ping: Date.now() - date });
                    this.io.emit('broadcast', JSON.stringify(message), date);
                    this.game.runScript(message, Date.now() - date);
                });

                socket.on('disconnect', (): void => {
                    log({ text: `Disconnect: ${socket.id}` });
                    
                    this.io.emit('broadcast', JSON.stringify(`deleteCharacter(${socket.id}, 1)`), Date.now());
                });
            });
        } catch(error) {
            warn({ text: `Error: ${error}` });
        }
    }

    public setGame(game: Game): void {
        game.broadcastFunc = this.broadcastFunc;
        this.game = game;
    }

    public broadcastFunc(): void {
        // this.io.emit('broadcast', ...)
    }
}
export default GameServer;