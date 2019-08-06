import { NextFunction, Request, Response, Application } from 'express';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

class App {
    public express: Application;

    constructor() {
        this.express = express();
    }

    public async init(): Promise<void> {
        this.middleware();
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
}

export default App;