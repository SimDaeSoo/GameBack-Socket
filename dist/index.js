/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/App.ts":
/*!********************!*\
  !*** ./src/App.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(/*! ../src/utils/utils */ "./src/utils/utils.ts");
const express = __webpack_require__(/*! express */ "express");
const logger = __webpack_require__(/*! morgan */ "morgan");
const bodyParser = __webpack_require__(/*! body-parser */ "body-parser");
const http = __webpack_require__(/*! http */ "http");
class App {
    constructor() {
        this.express = express();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.middleware();
            this.setNormalizePort();
        });
    }
    middleware() {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json({ limit: '10mb' }));
        this.express.use(bodyParser.urlencoded({ extended: false, limit: '10mb', parameterLimit: 1000000 }));
        // CORS 문제.
        this.express.use('/', (req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }
    setNormalizePort() {
        this.port = utils_1.normalizePort(3020);
    }
    createServer() {
        this.express.set('port', this.port);
        this.server = http.createServer(this.express);
        this.server.listen(this.port);
    }
}
exports.default = App;


/***/ }),

/***/ "./src/game/class/mapGenerator.ts":
/*!****************************************!*\
  !*** ./src/game/class/mapGenerator.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const define_1 = __webpack_require__(/*! ../define */ "./src/game/define.ts");
/*
    플레이어는 초당 30발의 armo를 생성 => 10명제한 => 300개의 Object
    타일은 총 600 * 150 => 900,000개의 Tile Object
    HitTest Object => 해당 오브젝트의 크기 * Vector 범위검사.
*/
class MapGenerator {
    constructor() {
    }
    // 600 * 150의 맵을 목표 => 9600px * 2400px => 9600px * 4000px 의 맵..
    // 60 * 15 => 960px * 240px => 960px * 1840px 의 맵.. => 화면에 보이는 크기만큼만 렌더링 할 수 있도록 해야할 것.
    // 하늘의 크기는 Default 100 tile 로 하자. (1600px)
    generate(width, height) {
        let map = {};
        const defaultSkyHeight = 25;
        for (let x = 0; x < width; x++) {
            for (let y = defaultSkyHeight; y < height + defaultSkyHeight; y++) {
                if (Math.random() < 0.4)
                    continue;
                const positionToIndex = x + (y - Math.round(x / 15)) * width;
                map[positionToIndex] = this.newTile(x, y);
            }
        }
        return {
            map: map,
            worldProperties: {
                width: width,
                height: height + defaultSkyHeight
            }
        };
    }
    // TODO 변경
    newTile(x, y) {
        const tileProperties = {
            class: 'dirt',
            objectType: 'tiles',
            size: { x: 16, y: 16 },
            health: 100,
            maxHealth: 100,
            weight: 1,
            movableRate: 0,
            position: { x: x * (define_1.TILE_SIZE.WIDTH), y: (y - Math.round(x / 15)) * (define_1.TILE_SIZE.HEIGHT) },
            vector: { x: 0, y: 0 },
            forceVector: { x: 0, y: 0 },
            flip: { x: false, y: false },
            rotation: 0,
            rotationVector: 0
        };
        return tileProperties;
    }
}
exports.default = MapGenerator;
// Map Generator -> Data -> TileMap Load -> Tile 하나하나 구성.


/***/ }),

/***/ "./src/game/define.ts":
/*!****************************!*\
  !*** ./src/game/define.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TILE_SIZE = {
    WIDTH: 16,
    HEIGHT: 16
};


/***/ }),

/***/ "./src/game/gameData.ts":
/*!******************************!*\
  !*** ./src/game/gameData.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class GameData {
    constructor() {
        this.worldProperties = {
            width: 0,
            height: 0
        };
        this.data = {
            tiles: {},
            objects: {},
            characters: {}
        };
        this.beGenerates = {
            tiles: [],
            objects: [],
            characters: []
        };
        this.beDeletes = {
            tiles: [],
            objects: [],
            characters: []
        };
        this.dirties = {
            tiles: [],
            objects: [],
            characters: []
        };
    }
    setData(id, data) {
        this.data[data.objectType][id] = data;
        this.dirty(id, data.objectType);
    }
    deleteData(id, type) {
        delete this.data[type][id];
        if (this.beDeletes[type].indexOf(id) < 0) {
            this.beDeletes[type].push(id);
        }
    }
    insertData(id, data) {
        this.data[data.objectType][id] = data;
        if (this.beGenerates[data.objectType].indexOf(id) < 0) {
            this.beGenerates[data.objectType].push(id);
        }
    }
    initGameData(data) {
        this.data = data;
        for (let type in this.data) {
            for (let id in this.data[type]) {
                if (id && this.beGenerates[type].indexOf(id) < 0) {
                    this.beGenerates[type].push(id);
                }
            }
        }
    }
    doneGenerate(id, type) {
        const index = this.beGenerates[type].indexOf(id);
        if (index >= 0) {
            this.beGenerates[type].splice(index, 1);
        }
    }
    doneDelete(id, type) {
        const index = this.beDeletes[type].indexOf(id);
        if (index >= 0) {
            this.beDeletes[type].splice(index, 1);
        }
    }
    dirty(id, type) {
        const index = this.dirties[type].indexOf(id);
        if (index < 0) {
            this.dirties[type].push(id);
        }
    }
    clean(id, type) {
        const index = this.dirties[type].indexOf(id);
        if (index >= 0) {
            this.dirties[type].splice(index, 1);
        }
    }
}
exports.default = GameData;


/***/ }),

/***/ "./src/game/gameLogic.ts":
/*!*******************************!*\
  !*** ./src/game/gameLogic.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mapGenerator_1 = __webpack_require__(/*! ./class/mapGenerator */ "./src/game/class/mapGenerator.ts");
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
class GameLogic {
    makeWorldMap(width, height) {
        const mapGenerator = new mapGenerator_1.default();
        const worldMap = mapGenerator.generate(width, height);
        for (let key in worldMap.map) {
            this.gameData.insertData(key, worldMap.map[key]);
        }
        this.gameData.worldProperties = worldMap.worldProperties;
    }
    /* ----------------------- Logic ----------------------- */
    update(dt) {
        return __awaiter(this, void 0, void 0, function* () {
            this.hitTestAll(dt);
            this.applyVector(dt);
            this.applyForceVector(dt);
        });
    }
    hitTestAll(dt) {
        this.characterHitTest(dt);
        this.objectHitTest(dt);
    }
    hitTest(a, b, dt) {
        const yAxisHitTime = this.yAxisHitTest(a, b, dt);
        const xAxisHitTime = this.xAxisHitTest(a, b, dt);
        const base = { min: 0, max: 1 };
        const result = {
            isHit: false,
            time: 0,
            hitArea: {
                left: false,
                right: false,
                up: false,
                down: false
            }
        };
        if (utils_1.isBounded(base, xAxisHitTime) && utils_1.isBounded(base, yAxisHitTime) && utils_1.isNested(xAxisHitTime, yAxisHitTime)) {
            result.isHit = true;
            result.time = utils_1.max(xAxisHitTime.min, yAxisHitTime.min);
            if (result.time === xAxisHitTime.min) {
                if (a.position.x > b.position.x) {
                    result.hitArea.left = true;
                }
                else if (a.position.x < b.position.x) {
                    result.hitArea.right = true;
                }
            }
            if (result.time === yAxisHitTime.min) {
                if (a.position.y > b.position.y) {
                    result.hitArea.up = true;
                }
                else if (a.position.y < b.position.y) {
                    result.hitArea.down = true;
                }
            }
            result.time *= dt;
        }
        return result;
    }
    yAxisHitTest(a, b, dt) {
        const v = (a.vector.y * dt) - (b.vector.y * dt);
        const result = { min: 2, max: -1 };
        if (v === 0 && (a.position.y + a.size.y) - b.position.y > 0 && (b.position.y + b.size.y) - a.position.y > 0) {
            result.min = 0;
            result.max = 1;
        }
        else if (v > 0) {
            result.max = (a.position.y - (b.position.y + b.size.y)) / -v;
            result.min = ((a.position.y + a.size.y) - b.position.y) / -v;
        }
        else if (v < 0) {
            result.max = (b.position.y - (a.position.y + a.size.y)) / v;
            result.min = ((b.position.y - b.size.y) - a.position.y) / v;
        }
        result.min = result.min < 0 ? 0 : result.min;
        result.max = result.max > 1 ? 1 : result.max;
        return result;
    }
    xAxisHitTest(a, b, dt) {
        const v = (a.vector.x * dt) - (b.vector.x * dt);
        const result = { min: 2, max: -1 };
        if (v === 0 && (a.position.x + a.size.x) - b.position.x > 0 && (b.position.x + b.size.x) - a.position.x > 0) {
            result.min = 0;
            result.max = 1;
        }
        else if (v > 0) {
            result.min = (b.position.x - (a.position.x + a.size.x)) / v;
            result.max = ((b.position.x + b.size.x) - a.position.x) / v;
        }
        else if (v < 0) {
            result.min = (a.position.x - (b.position.x + b.size.x)) / -v;
            result.max = ((a.position.x + a.size.x) - b.position.x) / -v;
        }
        result.min = result.min < 0 ? 0 : result.min;
        result.max = result.max > 1 ? 1 : result.max;
        return result;
    }
    characterHitTest(dt) {
        for (let id in this.gameData.data['characters']) {
            const character = this.gameData.data['characters'][id];
            this.characterTileHitTest(character, dt);
            this.characterObjectHitTest(character, dt);
        }
    }
    getTiles(character) {
        const result = [];
        const pos = { x: Math.round(character.position.x / 16) - 1, y: Math.round(character.position.y / 16) - 1 };
        const size = { x: Math.round(character.size.x / 16 + 0.5) + 2, y: Math.round(character.size.y / 16 + 0.5) + 2 };
        for (let i = pos.x; i < pos.x + size.x; i++) {
            for (let j = pos.y; j < pos.y + size.y; j++) {
                if (this.gameData.data['tiles'][i + j * this.gameData.worldProperties.width]) {
                    result.push(this.gameData.data['tiles'][i + j * this.gameData.worldProperties.width]);
                }
            }
        }
        return result;
    }
    characterTileHitTest(character, dt) {
        // 캐릭터의 Vector 계산해서 Tile과 HitTest한다. -> 캐릭터의 위치값을 이용해서 Vector거리의 타일을 조금 구해오면 빠르게 연산 가능할 것이다.
        const tiles = this.getTiles(character);
        tiles.forEach((tile) => {
            const result = this.hitTest(character, tile, dt);
            if (result.isHit) {
                const command = {
                    script: 'setVector',
                    data: {
                        id: character.id,
                        objectType: 'characters',
                        position: character.position,
                        vector: character.vector
                    }
                };
                if (result.hitArea.left && character.vector.x <= 0) {
                    command.data.position.x = character.position.x + character.vector.x * result.time - character.vector.x * (dt + 4);
                }
                else if (result.hitArea.right && character.vector.x >= 0) {
                    command.data.position.x = character.position.x + character.vector.x * result.time - character.vector.x * (dt + 4);
                }
                else if (result.hitArea.up && character.vector.y <= 0) {
                    command.data.position.y = character.position.y + character.vector.y * result.time + 0.03 * dt;
                    command.data.vector.y = 0.001;
                }
                else if (result.hitArea.down && character.vector.y >= 0) {
                    command.data.position.y = character.position.y + character.vector.y * result.time - 0.03 * dt;
                    command.data.vector.y = -0.001;
                }
                this.setVector(command.data, 0);
            }
        });
    }
    characterObjectHitTest(character, dt) {
        // 이게 좀 복잡한데.. 캐릭터의 Vector와, Object의 Vector 둘 다 신경써야한다.. 어떻게 처리할까..?
    }
    objectHitTest(dt) {
        for (let id in this.gameData['objects']) {
            const object = this.gameData['objects'][id];
            this.objectTileHitTest(object, dt);
        }
    }
    objectTileHitTest(object, dt) {
        // 총알과 타일의 hitTest
    }
    applyForceVector(dt) {
        for (let type in this.gameData.data) {
            for (let id in this.gameData.data[type]) {
                if (this.gameData.data[type][id].forceVector.x !== 0 || this.gameData.data[type][id].forceVector.y !== 0) {
                    this.gameData.data[type][id].vector.x += dt * this.gameData.data[type][id].forceVector.x;
                    this.gameData.data[type][id].vector.y += dt * this.gameData.data[type][id].forceVector.y;
                    this.gameData.dirty(id, type);
                }
            }
        }
    }
    applyVector(dt) {
        for (let type in this.gameData.data) {
            for (let id in this.gameData.data[type]) {
                if (this.gameData.data[type][id].vector.x !== 0 || this.gameData.data[type][id].vector.y !== 0) {
                    this.gameData.data[type][id].position.x += dt * this.gameData.data[type][id].vector.x;
                    this.gameData.data[type][id].position.y += dt * this.gameData.data[type][id].vector.y;
                    this.gameData.dirty(id, type);
                }
            }
        }
    }
    setWorldProperties(worldProperties) {
        this.gameData.worldProperties = worldProperties;
    }
    /* ----------------------- Command ----------------------- */
    addCharacter(data, dt) {
        data.position.x += dt * data.vector.x;
        data.position.y += dt * data.vector.y;
        data.position.x += dt * dt * data.forceVector.x / 2;
        data.position.y += dt * dt * data.forceVector.y / 2;
        data.vector.x += dt * data.forceVector.x;
        data.vector.y += dt * data.forceVector.y;
        this.gameData.insertData(data.id, data);
    }
    deleteCharacter(data, dt) {
        this.gameData.deleteData(data.id, data.objectType);
    }
    setVector(data, dt) {
        data.position.x += dt * data.vector.x;
        data.position.y += dt * data.vector.y;
        this.gameData.data[data.objectType][data.id].position = data.position;
        this.gameData.data[data.objectType][data.id].vector = data.vector;
        this.gameData.dirty(data.id, data.objectType);
    }
    // setVector, addCharacter랑 통합해서 setState로 만들 수 있을 것 같다..
    setForceVector(data, dt) {
        data.position.x += dt * dt * data.forceVector.x / 2;
        data.position.y += dt * dt * data.forceVector.y / 2;
        data.vector.x += dt * data.forceVector.x;
        data.vector.y += dt * data.forceVector.y;
        this.gameData.data[data.objectType][data.id].position = data.position;
        this.gameData.data[data.objectType][data.id].vector = data.vector;
        this.gameData.data[data.objectType][data.id].forceVector = data.forceVector;
        this.gameData.dirty(data.id, data.objectType);
    }
    runCommand(command, date) {
        if (typeof (this[command.script]) === 'function') {
            const dt = Date.now() - date;
            this[command.script](command.data, dt);
        }
    }
}
exports.default = GameLogic;


/***/ }),

/***/ "./src/game/gameServer.ts":
/*!********************************!*\
  !*** ./src/game/gameServer.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
const socketIO = __webpack_require__(/*! socket.io */ "socket.io");
const roomManager_1 = __webpack_require__(/*! ./roomManager */ "./src/game/roomManager.ts");
class GameServer {
    constructor() {
        this.roomManager = new roomManager_1.RoomManager();
    }
    // TODO 여기 하단 한번 정리하자.
    createSocketServer(server) {
        try {
            this.io = socketIO(server, { serveClient: false });
            this.io.on('connection', (socket) => { this.connection(socket); });
        }
        catch (error) {
            utils_1.warn({ text: `Error: ${error}` });
        }
    }
    connection(socket) {
        const room = this.roomManager.autoMapping(socket);
        room.setNamespace(this.io.in(room.name));
        utils_1.log({ text: `Connection: ${socket.id}` });
        socket.on('init', () => { this.socketInit(socket, room); });
        socket.on('broadcast', (message, date) => { this.broadcast(socket, room, message, date); });
        socket.on('keydown', (keycode) => { this.keydown(socket, room, keycode); });
        socket.on('keyup', (keycode) => { this.keyup(socket, room, keycode); });
        socket.on('disconnect', () => { this.disconnect(socket, room); });
    }
    disconnect(socket, room) {
        const command = {
            script: 'deleteCharacter',
            data: {
                id: socket.id,
                objectType: 'characters'
            }
        };
        this.io.in(room.name).emit('broadcast', JSON.stringify(command), Date.now());
        room.gameLogic.runCommand(command, Date.now());
        utils_1.warn({ text: `Disconnect: ${socket.id}` });
        this.roomManager.disconnect(socket);
    }
    socketInit(socket, room) {
        socket.emit('initGameData', JSON.stringify(room.gameData.data));
        // TODO 제거.
        const command3 = {
            script: 'setWorldProperties',
            data: room.gameData.worldProperties
        };
        this.io.in(room.name).emit('broadcast', JSON.stringify(command3), Date.now());
        const command = {
            script: 'addCharacter',
            data: {
                id: socket.id,
                class: 'archer',
                objectType: 'characters',
                size: { x: 15, y: 15 },
                health: 100,
                maxHealth: 100,
                weight: 1,
                movableRate: 0,
                position: { x: (room.members.length - 1) * 16, y: 0 },
                vector: { x: 0, y: 0 },
                forceVector: { x: 0, y: 0.0005 },
                flip: { x: false, y: false },
                rotation: 0,
                rotationVector: 0
            }
        };
        this.io.in(room.name).emit('broadcast', JSON.stringify(command), Date.now());
        room.gameLogic.runCommand(command, Date.now());
    }
    broadcast(socket, room, message, date) {
        this.io.in(room.name).emit('broadcast', JSON.stringify(message), date);
        const command = JSON.parse(message);
        room.gameLogic.runCommand(command, date);
    }
    keydown(socket, room, keycode) {
        // console.log(`keyDown: ${keycode} / id: ${socket.id}`);
        if (keycode === 38) {
            const command2 = {
                script: 'setForceVector',
                data: {
                    id: socket.id,
                    objectType: 'characters',
                    position: room.gameData.data.characters[socket.id].position,
                    vector: { x: room.gameData.data.characters[socket.id].vector.x, y: -0.15 },
                    forceVector: { x: room.gameData.data.characters[socket.id].forceVector.x, y: 0.0002 }
                }
            };
            this.io.in(room.name).emit('broadcast', JSON.stringify(command2), Date.now());
            room.gameLogic.runCommand(command2, Date.now());
        }
        else if (keycode === 39) {
            const command2 = {
                script: 'setVector',
                data: {
                    id: socket.id,
                    objectType: 'characters',
                    position: room.gameData.data.characters[socket.id].position,
                    vector: { x: 0.1, y: room.gameData.data.characters[socket.id].vector.y }
                }
            };
            this.io.in(room.name).emit('broadcast', JSON.stringify(command2), Date.now());
            room.gameLogic.runCommand(command2, Date.now());
        }
        else if (keycode === 37) {
            const command2 = {
                script: 'setVector',
                data: {
                    id: socket.id,
                    objectType: 'characters',
                    position: room.gameData.data.characters[socket.id].position,
                    vector: { x: -0.1, y: room.gameData.data.characters[socket.id].vector.y }
                }
            };
            this.io.in(room.name).emit('broadcast', JSON.stringify(command2), Date.now());
            room.gameLogic.runCommand(command2, Date.now());
        }
    }
    keyup(socket, room, keycode) {
        // console.log(`keyup: ${keycode} / id: ${socket.id}`);
        if (keycode === 39 && room.gameData.data.characters[socket.id].vector.x > 0) {
            const command2 = {
                script: 'setVector',
                data: {
                    id: socket.id,
                    objectType: 'characters',
                    position: room.gameData.data.characters[socket.id].position,
                    vector: { x: 0, y: room.gameData.data.characters[socket.id].vector.y }
                }
            };
            this.io.in(room.name).emit('broadcast', JSON.stringify(command2), Date.now());
            room.gameLogic.runCommand(command2, Date.now());
        }
        else if (keycode === 37 && room.gameData.data.characters[socket.id].vector.x < 0) {
            const command2 = {
                script: 'setVector',
                data: {
                    id: socket.id,
                    objectType: 'characters',
                    position: room.gameData.data.characters[socket.id].position,
                    vector: { x: 0, y: room.gameData.data.characters[socket.id].vector.y }
                }
            };
            this.io.in(room.name).emit('broadcast', JSON.stringify(command2), Date.now());
            room.gameLogic.runCommand(command2, Date.now());
        }
    }
}
exports.default = GameServer;


/***/ }),

/***/ "./src/game/room.ts":
/*!**************************!*\
  !*** ./src/game/room.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameLogic_1 = __webpack_require__(/*! ./gameLogic */ "./src/game/gameLogic.ts");
const updater_1 = __webpack_require__(/*! ./updater */ "./src/game/updater.ts");
const gameData_1 = __webpack_require__(/*! ./gameData */ "./src/game/gameData.ts");
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
class Room {
    constructor(options) {
        this.members = [];
        let defaultOptions = Object.assign({
            name: '',
            members: [],
            isPlaying: false,
            maxMembers: 10
        }, options);
        for (let key in defaultOptions) {
            this[key] = defaultOptions[key];
        }
        this.gameLogic = new gameLogic_1.default();
        this.updater = new updater_1.default();
        this.gameData = new gameData_1.default();
        this.gameLogic.gameData = this.gameData;
        // 임시로 추가. TODO: 제거할 것.
        utils_1.log({ text: `Make World...` });
        this.gameLogic.makeWorldMap(132, 20);
        utils_1.log({ text: `Done...` });
        this.updater.onUpdate((dt) => __awaiter(this, void 0, void 0, function* () {
            yield this.gameLogic.update(dt);
        }));
    }
    get joinable() {
        return this.members.length < this.maxMembers && !this.isPlaying;
    }
    join(id) {
        this.members.push(id);
    }
    leave(id) {
        const index = this.members.indexOf(id);
        if (index >= 0) {
            this.members.splice(index, 1);
        }
    }
    destroy() {
        this.updater.stop();
    }
    setNamespace(io) {
        this.io = this.gameLogic.io = io;
    }
}
exports.Room = Room;
;


/***/ }),

/***/ "./src/game/roomManager.ts":
/*!*********************************!*\
  !*** ./src/game/roomManager.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = __webpack_require__(/*! ./room */ "./src/game/room.ts");
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
class RoomManager {
    constructor() {
        this.userDict = {};
        this.rooms = [];
        this.count = 0;
    }
    autoMapping(socket) {
        let room;
        for (let key in this.rooms) {
            if (this.rooms[key].joinable) {
                room = this.rooms[key];
                break;
            }
        }
        if (!room) {
            room = this.makeRoom({ name: this.getRoomName() });
        }
        this.joinRoom(socket, room.name);
        return room;
    }
    makeRoom(options) {
        const newRoom = new room_1.Room(options);
        this.rooms.push(newRoom);
        utils_1.log({ text: `MakeRoom: ${newRoom.name}` });
        return newRoom;
    }
    deleteRoom(room) {
        const index = this.rooms.indexOf(room);
        if (index >= 0) {
            utils_1.warn({ text: `DeleteRoom: ${this.rooms[index].name}` });
            this.rooms.splice(index, 1);
            room.destroy();
        }
    }
    joinRoom(socket, roomName) {
        let result = false;
        for (let key in this.rooms) {
            if (this.rooms[key].name === roomName && this.rooms[key].joinable) {
                utils_1.log({ text: `JoinRoom: ${socket.id}, ${this.rooms[key].name}` });
                result = true;
                socket.join(this.rooms[key].name);
                this.rooms[key].join(socket.id);
                this.userDict[socket.id] = roomName;
                break;
            }
        }
        return result;
    }
    leaveRoom(socket, roomName) {
        let result = false;
        for (let key in this.rooms) {
            if (this.rooms[key].name === roomName) {
                utils_1.warn({ text: `LeaveRoom: ${socket.id}, ${this.rooms[key].name}` });
                result = true;
                socket.leave(this.rooms[key].name);
                this.rooms[key].leave(socket.id);
                delete this.userDict[socket.id];
                if (this.rooms[key].members.length <= 0) {
                    this.deleteRoom(this.rooms[key]);
                }
                break;
            }
        }
        return result;
    }
    disconnect(socket) {
        this.leaveRoom(socket, this.userDict[socket.id]);
    }
    getRoomName() {
        this.count++;
        return `Room${this.count}`;
    }
}
exports.RoomManager = RoomManager;


/***/ }),

/***/ "./src/game/updater.ts":
/*!*****************************!*\
  !*** ./src/game/updater.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
class Updater {
    constructor() {
        this.time = 0;
        this.updateCount = 0;
        this.GAME_UPDATE_MILLISEC = 8;
        this.AVERAGE_LOOPING = 30;
    }
    onUpdate(callback) {
        let lastTime = Date.now();
        this.updaterID = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            const dt = Date.now() - lastTime;
            this.performanceCheck(dt);
            yield callback(dt);
            lastTime += dt;
        }), this.GAME_UPDATE_MILLISEC);
    }
    performanceCheck(dt) {
        this.time += dt;
        this.updateCount++;
        // 125번 Update가 Maximum 성능이 20% 이상 다운되었을 경우 Warning Log띄우기.
        if (this.time >= 1000 * this.AVERAGE_LOOPING) {
            const ups = this.updateCount / this.AVERAGE_LOOPING;
            if (this.updateCount < 1000 / this.GAME_UPDATE_MILLISEC * this.AVERAGE_LOOPING * 0.8) {
                utils_1.warn({ text: `update: ${ups.toFixed(2)} ups (${(ups / (1000 / this.GAME_UPDATE_MILLISEC) * 100).toFixed(2)}%)` });
                if (this.updateCount < 1000 / this.GAME_UPDATE_MILLISEC * this.AVERAGE_LOOPING * 0.2) {
                    this.forceDisConnect ? this.forceDisConnect() : null;
                }
            }
            else {
                utils_1.system({ text: `update: ${ups.toFixed(2)} ups (${(ups / (1000 / this.GAME_UPDATE_MILLISEC) * 100).toFixed(2)}%)` });
            }
            this.time = this.updateCount = 0;
        }
    }
    stop() {
        clearInterval(this.updaterID);
    }
}
exports.default = Updater;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const debug = __webpack_require__(/*! debug */ "debug");
const App_1 = __webpack_require__(/*! ./App */ "./src/App.ts");
const gameServer_1 = __webpack_require__(/*! ./game/gameServer */ "./src/game/gameServer.ts");
debug('ts-express:server');
// express 서버.
const app = new App_1.default();
app.init();
app.createServer();
// 게임의 진행을 담당하는 소켓서버이다.
const gameServer = new gameServer_1.default();
gameServer.createSocketServer(app.server);


/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
*/
Object.defineProperty(exports, "__esModule", { value: true });
function gameLog(data) {
    if (data.ping) {
        if (data.ping > 100) {
            console.log('[\x1b[33m%s\x1b[0m] %s \x1b[31m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        }
        else if (data.ping > 50) {
            console.log('[\x1b[33m%s\x1b[0m] %s \x1b[37m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        }
        else {
            console.log('[\x1b[33m%s\x1b[0m] %s \x1b[32m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        }
    }
    else {
        console.log('[\x1b[33m%s\x1b[0m] %s', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text);
    }
}
exports.gameLog = gameLog;
function log(data) {
    if (data.ping) {
        if (data.ping > 100) {
            console.log('[\x1b[36m%s\x1b[0m] %s \x1b[31m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        }
        else if (data.ping > 50) {
            console.log('[\x1b[36m%s\x1b[0m] %s \x1b[37m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        }
        else {
            console.log('[\x1b[36m%s\x1b[0m] %s \x1b[32m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        }
    }
    else {
        console.log('[\x1b[36m%s\x1b[0m] %s', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text);
    }
}
exports.log = log;
function warn(data) {
    if (data.ping) {
        if (data.ping > 100) {
            console.log('[\x1b[31m%s\x1b[0m] %s \x1b[31m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        }
        else if (data.ping > 50) {
            console.log('[\x1b[31m%s\x1b[0m] %s \x1b[37m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        }
        else {
            console.log('[\x1b[31m%s\x1b[0m] %s \x1b[32m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        }
    }
    else {
        console.log('[\x1b[31m%s\x1b[0m] %s', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text);
    }
}
exports.warn = warn;
function system(data) {
    if (data.ping) {
        if (data.ping > 100) {
            console.log('[\x1b[32m%s\x1b[0m] %s \x1b[31m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        }
        else if (data.ping > 50) {
            console.log('[\x1b[32m%s\x1b[0m] %s \x1b[37m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        }
        else {
            console.log('[\x1b[32m%s\x1b[0m] %s \x1b[32m(%s ms)\x1b[0m', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text, data.ping);
        }
    }
    else {
        console.log('[\x1b[32m%s\x1b[0m] %s', format(new Date(), 'yyyy년MM월dd일HH:mm:ss'), data.text);
    }
}
exports.system = system;
function normalizePort(val) {
    const normalizedPort = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(normalizedPort)) {
        return val;
    }
    else if (normalizedPort >= 0) {
        return normalizedPort;
    }
    else {
        return false;
    }
}
exports.normalizePort = normalizePort;
function isNested(a, b) {
    if (a.min <= b.max && a.max >= b.min) {
        return true;
    }
    else {
        return false;
    }
}
exports.isNested = isNested;
function isBounded(a, b) {
    if (a.min <= b.min && a.max >= b.max) {
        return true;
    }
    else {
        return false;
    }
}
exports.isBounded = isBounded;
function max(a, b) {
    return a > b ? a : b;
}
exports.max = max;
function min(a, b) {
    return a < b ? a : b;
}
exports.min = min;
function format(date, format) {
    const weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    let h;
    return format.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
        switch ($1) {
            case "yyyy": return date.getFullYear();
            case "yy": return (date.getFullYear() % 1000).toString().slice(0, 2);
            case "MM": return (date.getMonth() + 1).toString().slice(0, 2);
            case "dd": return date.getDate().toString().slice(0, 2);
            case "E": return weekName[date.getDay()];
            case "HH": return (date.getHours() < 10 ? '0' + date.getHours() : date.getHours().toString()).slice(0, 2);
            case "hh": return ((h = date.getHours() % 12) ? h : 12).toString().slice(0, 2);
            case "mm": return (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes().toString()).slice(0, 2);
            case "ss": return (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds().toString()).slice(0, 2);
            case "a/p": return date.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
}
;


/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/index.ts */"./src/index.ts");


/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map