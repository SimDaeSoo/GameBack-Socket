
import * as debug from 'debug';
import App from './App';
import Game from './game/main';

debug('ts-express:server');

const game = new Game();
game.start();

const app = new App();
app.init();
app.createServer();
app.createSocketServer();