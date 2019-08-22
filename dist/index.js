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

/***/ "./src/game/class/collisionEngine.ts":
/*!*******************************************!*\
  !*** ./src/game/class/collisionEngine.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class CollisionEngine {
    static applyTilePhysics(objA, collisionResult) {
        const dt = collisionResult.time;
        const objB = collisionResult.object;
        // xAxis
        if (collisionResult.direction.left || collisionResult.direction.right) {
            const vectorA = objA.vector.x + objB.weight * (objB.vector.x - objA.vector.x) / (objA.weight + objB.weight) * 2;
            objA.position.x += objA.vector.x * dt + (collisionResult.direction.left ? 0.15 : -0.15);
            objA.vector.x = CollisionEngine.translateTinyValue(vectorA) * 0;
        }
        // yAxis
        if (collisionResult.direction.up || collisionResult.direction.down) {
            const vectorA = objA.vector.y + objB.weight * (objB.vector.y - objA.vector.y) / (objA.weight + objB.weight) * 2;
            objA.position.y += objA.vector.y * dt + (collisionResult.direction.up ? 0.15 : -0.15);
            objA.vector.y = CollisionEngine.translateTinyValue(vectorA) * 0;
            objA.land = collisionResult.direction.down;
        }
        return {
            objA: objA,
            objB: objB
        };
    }
    static applyPhysics(objA, collisionResult) {
        const dt = collisionResult.time;
        const objB = collisionResult.object;
        // xAxis
        if (collisionResult.direction.left || collisionResult.direction.right) {
            const vectorA = objA.vector.x + objB.weight * (objB.vector.x - objA.vector.x) / (objA.weight + objB.weight) * 2;
            const vectorB = objB.vector.x + objA.weight * (objA.vector.x - objB.vector.x) / (objA.weight + objB.weight) * 2;
            objA.position.x += objA.vector.x * dt;
            objB.position.x += objB.vector.x * dt;
            objA.vector.x = CollisionEngine.translateTinyValue(vectorA);
            objB.vector.x = CollisionEngine.translateTinyValue(vectorB);
        }
        // yAxis
        if (collisionResult.direction.up || collisionResult.direction.down) {
            const vectorA = objA.vector.y + objB.weight * (objB.vector.y - objA.vector.y) / (objA.weight + objB.weight) * 2;
            const vectorB = objB.vector.y + objA.weight * (objA.vector.y - objB.vector.y) / (objA.weight + objB.weight) * 2;
            objA.position.y += objA.vector.y * dt;
            objB.position.y += objB.vector.y * dt;
            objA.vector.y = CollisionEngine.translateTinyValue(vectorA);
            objB.vector.y = CollisionEngine.translateTinyValue(vectorB);
        }
        return {
            objA: objA,
            objB: objB
        };
    }
    static getHitObjects(objA, objects, dt) {
        let result = [];
        let time = Infinity;
        const tickInterpolation = 24;
        objects.forEach((objB) => {
            const hitTestResult = CollisionEngine.hitTest(objA, objB);
            if (hitTestResult.time <= dt && hitTestResult.time >= -tickInterpolation && time > hitTestResult.time) {
                result = [hitTestResult];
                time = hitTestResult.time;
            }
            else if (hitTestResult.time <= dt && hitTestResult.time >= -tickInterpolation && time === hitTestResult.time) {
                result.push(hitTestResult);
                time = hitTestResult.time;
            }
        });
        return result;
    }
    static hitTest(objA, objB) {
        const xAxis = CollisionEngine.xAxisHitTest(objA, objB);
        const yAxis = CollisionEngine.yAxisHitTest(objA, objB);
        const result = { direction: { left: false, right: false, up: false, down: false }, time: Infinity, object: null };
        // Collision
        if (xAxis.min < yAxis.max && xAxis.max > yAxis.min) {
            result.time = xAxis.min < yAxis.min ? yAxis.min : xAxis.min;
            result.direction.left = (xAxis.min === result.time) && (objB.vector.x - objA.vector.x > 0);
            result.direction.right = (xAxis.min === result.time) && (objB.vector.x - objA.vector.x < 0);
            result.direction.up = (yAxis.min === result.time) && (objB.vector.y - objA.vector.y > 0);
            result.direction.down = (yAxis.min === result.time) && (objB.vector.y - objA.vector.y < 0);
            result.object = objB;
        }
        return result;
    }
    static yAxisHitTest(objA, objB) {
        const vector = objB.vector.y - objA.vector.y;
        let timestamp = { min: Infinity, max: -Infinity };
        if (vector === 0) {
            if (objA.position.y + objA.size.y >= objB.position.y && objA.position.y <= objB.position.y + objB.size.y) {
                timestamp = { min: -Infinity, max: Infinity };
            }
        }
        else if (vector > 0) {
            timestamp.max = ((objA.position.y + objA.size.y) - objB.position.y) / vector;
            timestamp.min = (objA.position.y - (objB.position.y + objB.size.y)) / vector;
        }
        else if (vector < 0) {
            timestamp.max = (objA.position.y - (objB.position.y + objB.size.y)) / vector;
            timestamp.min = ((objA.position.y + objA.size.y) - objB.position.y) / vector;
        }
        return timestamp;
    }
    static xAxisHitTest(objA, objB) {
        const vector = objB.vector.x - objA.vector.x;
        let timestamp = { min: Infinity, max: -Infinity };
        if (vector === 0) {
            if (objA.position.x + objA.size.x >= objB.position.x && objA.position.x <= objB.position.x + objB.size.x) {
                timestamp = { min: -Infinity, max: Infinity };
            }
        }
        else if (vector > 0) {
            timestamp.max = ((objA.position.x + objA.size.x) - objB.position.x) / vector;
            timestamp.min = (objA.position.x - (objB.position.x + objB.size.x)) / vector;
        }
        else if (vector < 0) {
            timestamp.max = (objA.position.x - (objB.position.x + objB.size.x)) / vector;
            timestamp.min = ((objA.position.x + objA.size.x) - objB.position.x) / vector;
        }
        return timestamp;
    }
    static translateTinyValue(value) {
        return Math.abs(value) <= 0.00000000001 ? 0 : value;
    }
}
exports.default = CollisionEngine;


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
const utils_1 = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
/*
    플레이어는 초당 30발의 armo를 생성 => 10명제한 => 300개의 Object
    타일은 총 600 * 150 => 900,000개의 Tile Object
    HitTest Object => 해당 오브젝트의 크기 * Vector 범위검사.
*/
// Map Generating 다시 볼 것.
class MapGenerator {
    // 600 * 150의 맵을 목표 => 9600px * 2400px => 9600px * 4000px 의 맵..
    // 60 * 15 => 960px * 240px => 960px * 1840px 의 맵.. => 화면에 보이는 크기만큼만 렌더링 할 수 있도록 해야할 것.
    // 하늘의 크기는 Default 100 tile 로 하자. (1600px)
    generate(width, height) {
        let map = {};
        const defaultSkyHeight = 17;
        for (let y = defaultSkyHeight; y < height + defaultSkyHeight; y++) {
            for (let x = 0; x < width; x++) {
                if (!MapGenerator.isDeletedTile(x, y, defaultSkyHeight + 2)) {
                    if (Math.random() <= 0.91 - 1.1 * (y / (20 + defaultSkyHeight)) || (map[x + (y - 1) * width] !== undefined && map[x - 1 + y * width] !== undefined)) {
                        const positionToIndex = x + y * width;
                        map[positionToIndex] = this.newTile(x, y);
                    }
                    if (x > 0) {
                        if (Math.random() <= 0.91 - 1.1 * (y / (20 + defaultSkyHeight)) || (map[(width - x - 1) + (y - 1) * width] !== undefined && map[(width - x) + y * width] !== undefined)) {
                            const positionToIndex = (width - x - 1) + y * width;
                            map[positionToIndex] = this.newTile((width - x - 1), y);
                        }
                    }
                }
            }
        }
        for (let y = height + defaultSkyHeight - 2; y < height + defaultSkyHeight; y++) {
            for (let x = 0; x < width; x++) {
                const positionToIndex = x + y * width;
                map[positionToIndex] = this.newTile(x, y);
            }
        }
        for (let key in map) {
            utils_1.changeTileNumber(map, key, width);
            if (map[key].tileNumber === 15) {
                delete map[key];
            }
        }
        map['start'] = this.endTile(width * define_1.TILE_SIZE.WIDTH + 1, 0, height + defaultSkyHeight * define_1.TILE_SIZE.HEIGHT);
        map['end'] = this.endTile(-1, 0, height + defaultSkyHeight * define_1.TILE_SIZE.HEIGHT);
        return {
            map: map,
            worldProperties: {
                width: width,
                height: height + defaultSkyHeight
            }
        };
    }
    static isDeletedTile(x, y, baseY) {
        const HEIGHT = 3;
        const CYCLE = 60;
        const Y = Math.sin(Math.PI * 2 / CYCLE * (x + CYCLE / 4 * 3)) * HEIGHT / 2;
        return (y - baseY) < Y;
    }
    // TODO 변경
    newTile(x, y) {
        const tileProperties = {
            class: 'dirt',
            objectType: 'tiles',
            size: { x: define_1.TILE_SIZE.WIDTH, y: define_1.TILE_SIZE.HEIGHT },
            scale: { x: 1.5, y: 1.5 },
            health: 100,
            maxHealth: 100,
            weight: 10000000000000000000,
            movableRate: 0,
            tileNumber: 0,
            position: { x: x * (define_1.TILE_SIZE.WIDTH), y: y * (define_1.TILE_SIZE.HEIGHT) },
            vector: { x: 0, y: 0 },
            forceVector: { x: 0, y: 0 },
            flip: { x: false, y: false },
            rotation: 0,
            rotationVector: 0
        };
        return tileProperties;
    }
    // TODO 변경
    endTile(x, y, height) {
        const tileProperties = {
            class: 'dirt',
            objectType: 'tiles',
            size: { x: 1, y: height },
            scale: { x: 0, y: 0 },
            health: Number.MAX_VALUE,
            maxHealth: Number.MAX_VALUE,
            weight: 10000000000000000000,
            movableRate: 0,
            tileNumber: 0,
            position: { x: x, y: y },
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
    WIDTH: 24,
    HEIGHT: 24
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
const collisionEngine_1 = __webpack_require__(/*! ./class/collisionEngine */ "./src/game/class/collisionEngine.ts");
const define_1 = __webpack_require__(/*! ./define */ "./src/game/define.ts");
const events_1 = __webpack_require__(/*! events */ "events");
class GameLogic extends events_1.EventEmitter {
    makeWorldMap(width, height) {
        const mapGenerator = new mapGenerator_1.default();
        const worldMap = mapGenerator.generate(width, height);
        for (let key in worldMap.map) {
            this.gameData.insertData(key, worldMap.map[key]);
        }
        this.gameData.worldProperties = worldMap.worldProperties;
        this.emit('makeWorldMap');
    }
    /* ----------------------- Logic ----------------------- */
    update(dt) {
        return __awaiter(this, void 0, void 0, function* () {
            this.collision(dt);
            this.applyVector(dt);
            this.applyForceVector(dt);
        });
    }
    collision(dt) {
        this.characterCollision(dt);
    }
    characterCollision(dt) {
        for (let id in this.gameData.data['characters']) {
            const character = this.gameData.data['characters'][id];
            this.characterTileCollision(character, dt);
        }
    }
    characterTileCollision(character, dt) {
        const tiles = this.getTiles(character);
        const result = collisionEngine_1.default.getHitObjects(character, tiles, dt);
        if (result.length > 0) {
            result.forEach((collisionData) => {
                collisionEngine_1.default.applyTilePhysics(character, collisionData);
            });
        }
        else {
            character.forceVector.y = character.forceVector.y === 0 ? 0.0002 : character.forceVector.y;
        }
    }
    getTiles(character) {
        const result = [];
        const pos = { x: Math.round(character.position.x / define_1.TILE_SIZE.WIDTH) - 2, y: Math.round(character.position.y / define_1.TILE_SIZE.HEIGHT) - 2 };
        const size = { x: Math.round(character.size.x / define_1.TILE_SIZE.WIDTH + 0.5) + 4, y: Math.round(character.size.y / define_1.TILE_SIZE.HEIGHT + 0.5) + 4 };
        for (let i = pos.x; i < pos.x + size.x; i++) {
            for (let j = pos.y; j < pos.y + size.y; j++) {
                if (this.gameData.data['tiles'][i + j * this.gameData.worldProperties.width]) {
                    result.push(this.gameData.data['tiles'][i + j * this.gameData.worldProperties.width]);
                }
            }
        }
        return result;
    }
    applyForceVector(dt) {
        for (let type in this.gameData.data) {
            for (let id in this.gameData.data[type]) {
                if (this.gameData.data[type][id].forceVector.x !== 0 || this.gameData.data[type][id].forceVector.y !== 0) {
                    this.gameData.data[type][id].vector.x += dt * this.gameData.data[type][id].forceVector.x / this.gameData.data[type][id].weight;
                    this.gameData.data[type][id].vector.y += dt * this.gameData.data[type][id].forceVector.y / this.gameData.data[type][id].weight;
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
        this.emit('setWorldProperties');
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
        this.emit('addCharacter');
    }
    deleteCharacter(data, dt) {
        this.gameData.deleteData(data.id, data.objectType);
        this.emit('deleteCharacter');
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
                size: { x: 28, y: 76 },
                scale: { x: 1, y: 1 },
                health: 100,
                maxHealth: 100,
                weight: 1,
                movableRate: 0,
                land: false,
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
        this.io.in(room.name).emit('broadcast', message, date);
        const command = JSON.parse(message);
        room.gameLogic.runCommand(command, date);
    }
    keydown(socket, room, keycode) {
        // console.log(`keyDown: ${keycode} / id: ${socket.id}`);
        if (keycode === 38) {
            if (room.gameData.data.characters[socket.id].land) {
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
                room.gameData.data.characters[socket.id].land = false;
                this.io.in(room.name).emit('broadcast', JSON.stringify(command2), Date.now());
                room.gameLogic.runCommand(command2, Date.now());
            }
        }
        else if (keycode === 39) {
            const command2 = {
                script: 'setVector',
                data: {
                    id: socket.id,
                    objectType: 'characters',
                    position: room.gameData.data.characters[socket.id].position,
                    vector: { x: 0.15, y: room.gameData.data.characters[socket.id].vector.y }
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
                    vector: { x: -0.15, y: room.gameData.data.characters[socket.id].vector.y }
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
        this.gameLogic.makeWorldMap(200, 20);
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

Object.defineProperty(exports, "__esModule", { value: true });
const define_1 = __webpack_require__(/*! ../game/define */ "./src/game/define.ts");
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
function changeTileNumber(map, key, width) {
    const x = map[key].position.x / define_1.TILE_SIZE.WIDTH;
    const y = map[key].position.y / define_1.TILE_SIZE.HEIGHT;
    if ((map[(x - 1) + y * width] && x > 0) && (map[(x + 1) + y * width] && x < width - 1)) {
        map[key].tileNumber = 1;
    }
    else if (map[(x - 1) + y * width] && x > 0) {
        map[key].tileNumber = 2;
    }
    else if (map[(x + 1) + y * width] && x < width - 1) {
        map[key].tileNumber = 0;
    }
    else {
        map[key].tileNumber = 3;
    }
    if (map[x + (y - 1) * width] && map[x + (y + 1) * width]) {
        map[key].tileNumber += 4;
    }
    else if (map[x + (y - 1) * width]) {
        map[key].tileNumber += 8;
    }
    else if (map[x + (y + 1) * width]) {
        map[key].tileNumber += 0;
    }
    else {
        map[key].tileNumber += 12;
    }
}
exports.changeTileNumber = changeTileNumber;


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

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

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