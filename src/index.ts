
import * as debug from 'debug';
import App from './App';
import GameServer from './GameServer';

debug('ts-express:server');

// express 서버.
const app: App = new App();
app.init();
app.createServer();

// 게임의 진행을 담당하는 소켓서버이다.
const gameServer: GameServer = new GameServer();
gameServer.createSocketServer(app.server);