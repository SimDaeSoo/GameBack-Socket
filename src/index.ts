import * as debug from 'debug';
import App from './App';
debug('ts-express:server');

async function start(): Promise<void> {
    const app: App = new App();
    await app.initialize();
    app.createServer();
}

start();