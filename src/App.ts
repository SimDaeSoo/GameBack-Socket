import { NextFunction, Request, Response, Application } from 'express';
import { normalizePort } from '../src/utils/utils';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as http from 'http';

class App {
    public express: Application;
    public server: http.Server;
    public port: string | number | boolean;

    constructor() {
        this.express = express();
    }

    public async initialize(): Promise<void> {
        this.middleware();
        this.setNormalizePort();
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

    public setNormalizePort(): void {
        this.port = normalizePort(3020);
    }

    public createServer(): void {
        this.express.set('port', this.port);

        this.server = http.createServer(this.express);
        this.server.listen(this.port);
    }
}
export default App;