import { NextFunction, Request, Response, Application } from 'express';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as ip from 'public-ip';
import GameServer from './game/server/gameServer';

class App {
    private MASTER_URL: string = 'http://ec2-13-124-180-130.ap-northeast-2.compute.amazonaws.com:8000';
    private IP: string;
    public express: Application;
    public server: http.Server;
    public port: number;
    public gameServer: GameServer = new GameServer();
    public requestJS: any;

    constructor() {
        this.requestJS = require('request');
        this.express = express();
    }

    public async initialize(): Promise<void> {
        this.IP = await ip.v4();
        this.middleware();
        this.port = 8080;
    }

    public createServer(): void {
        this.express.set('port', this.port);

        this.server = http.createServer(this.express);
        this.server.listen(this.port);
        this.server.once('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
                this.port++;
                this.server.close();
                this.createServer();
            }
        });
        this.server.once('listening', () => {
            this.gameServer.createSocketServer(this.server);
            this.applyServer();
        });
    }

    private applyServer(): void {
        const ping: any = () => {
            setTimeout(async (): Promise<void> => {
                const serverStatus: any = {
                    address: `http://${this.IP}:${this.port}`,
                    user: this.gameServer.roomManager.userCounting,
                    ups: this.gameServer.roomManager.averageUPS,
                    ping: this.gameServer.avgPing
                };

                this.requestJS.post(`${this.MASTER_URL}/server/status`, { body: { serverStatus }, json: true });
                ping();
            }, 2000);
        }

        ping();
    }

    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json({ limit: '10mb' }));
        this.express.use(bodyParser.urlencoded({ extended: false, limit: '10mb', parameterLimit: 1000000 }));

        // CORS 문제.
        this.express.all('*', (req: Request, res: Response, next: NextFunction) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
            res.header('Access-Control-Allow-Methods', 'POST,GET');
            next();
        });
    }
}
export default App;