
import * as debug from 'debug';
import GameServer from './GameServer';
import Game from './game/main';
import Updater from './game/updater';

debug('ts-express:server');

const game = new Game();

const updater = new Updater();
updater.setGame(game);
updater.updateLoop();

const gameServer = new GameServer();
gameServer.init();
gameServer.createServer();
gameServer.createSocketServer();
gameServer.setGame(game);