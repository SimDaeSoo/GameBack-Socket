import GameData from "./gameData";
import MapGenerator from "./class/mapGenerator";
import CollisionEngine from './class/collisionEngine';
import { TILE_SIZE } from "./define";
import { EventEmitter } from "events";

export default class GameLogic extends EventEmitter {
    public gameData: GameData;

    /* ----------------------- Server ----------------------- */
    public io: SocketIO.Namespace;

    public makeWorldMap(width: number, height: number): void {
        const mapGenerator: MapGenerator = new MapGenerator();
        const worldMap: any = mapGenerator.generate(width, height);

        for (let key in worldMap.map) {
            this.gameData.insertData(key, worldMap.map[key]);
        }

        this.gameData.worldProperties = worldMap.worldProperties;
        this.emit('makeWorldMap');
    }

    /* ----------------------- Logic ----------------------- */

    public async update(dt: number): Promise<void> {
        this.collision(dt);
        this.applyVector(dt);
        this.applyForceVector(dt);
    }

    private collision(dt: number): void {
        this.characterCollision(dt);
    }
    
    private characterCollision(dt: number): void {
        for (let id in this.gameData.data['characters']) {
            const character: any = this.gameData.data['characters'][id];
            
            this.characterTileCollision(character, dt);
        }
    }

    private characterTileCollision(character: any, dt: number): void {
        const tiles: Array<any> = this.getTiles(character);
        const result: Array<any> = CollisionEngine.getHitObjects(character, tiles, dt);

        if (result.length > 0) {
            result.forEach((collisionData) => {
                CollisionEngine.applyTilePhysics(character, collisionData);
            });
        } else {
            character.forceVector.y = character.forceVector.y === 0?0.0002:character.forceVector.y;
        }
    }

    private getTiles(character: any): Array<any> {
        const result: Array<any> = [];

        const pos = { x: Math.round(character.position.x / TILE_SIZE.WIDTH) - 2, y: Math.round(character.position.y / TILE_SIZE.HEIGHT) - 2 };
        const size = { x: Math.round(character.size.x / TILE_SIZE.WIDTH + 0.5) + 4, y: Math.round(character.size.y / TILE_SIZE.HEIGHT + 0.5) + 4 };

        for (let i = pos.x; i < pos.x + size.x; i++) {
            for (let j = pos.y; j < pos.y + size.y; j++) {
                if (this.gameData.data['tiles'][i + j * this.gameData.worldProperties.width]) {
                    result.push(this.gameData.data['tiles'][i + j * this.gameData.worldProperties.width]);
                }
            }
        }

        return result;
    }

    private applyForceVector(dt: number): void {
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

    private applyVector(dt: number): void {
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

    public setWorldProperties(worldProperties: any): void {
        this.gameData.worldProperties = worldProperties;
        this.emit('setWorldProperties');
    }

    /* ----------------------- Command ----------------------- */

    public addCharacter(data: any, dt: number): void {
        data.position.x += dt * data.vector.x;
        data.position.y += dt * data.vector.y;
        data.position.x += dt * dt * data.forceVector.x / 2;
        data.position.y += dt * dt * data.forceVector.y / 2;
        data.vector.x += dt * data.forceVector.x;
        data.vector.y += dt * data.forceVector.y;
        this.gameData.insertData(data.id, data);
        this.emit('addCharacter');
    }

    public deleteCharacter(data: any, dt: number): void {
        this.gameData.deleteData(data.id, data.objectType);
        this.emit('deleteCharacter');
    }

    public setVector(data: any, dt: number): void {
        data.position.x += dt * data.vector.x;
        data.position.y += dt * data.vector.y;
        this.gameData.data[data.objectType][data.id].position = data.position;
        this.gameData.data[data.objectType][data.id].vector = data.vector;
        this.gameData.dirty(data.id, data.objectType);
    }

    // setVector, addCharacter랑 통합해서 setState로 만들 수 있을 것 같다..
    public setForceVector(data: any, dt: number): void {
        data.position.x += dt * dt * data.forceVector.x / 2;
        data.position.y += dt * dt * data.forceVector.y / 2;
        data.vector.x += dt * data.forceVector.x;
        data.vector.y += dt * data.forceVector.y;
        this.gameData.data[data.objectType][data.id].position = data.position;
        this.gameData.data[data.objectType][data.id].vector = data.vector;
        this.gameData.data[data.objectType][data.id].forceVector = data.forceVector;
        this.gameData.dirty(data.id, data.objectType);
    }

    public runCommand(command: any, date: number): void {
        if (typeof((this as any)[command.script]) === 'function') {
            const dt: number = Date.now() - date;
            (this as any)[command.script](command.data, dt);
        }
    }
}