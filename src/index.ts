import * as debug from 'debug';
import ServerApp from './ServerApp';
debug('ts-express:server');

async function start(): Promise<void> {
    const app: ServerApp = new ServerApp();
    await app.initialize();
    app.createServer();
}

start();