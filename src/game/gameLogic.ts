import GameData from "./gameData";
import MapGenerator from "./class/mapGenerator";
import { TILE_SIZE } from "./define";

export default class GameLogic {
    public gameData: GameData;
    public io: SocketIO.Namespace;
    
    public async update(dt: number): Promise<void> {
        this.hitTest(dt);
        this.applyVector(dt);
    }

    public hitTest(dt: number) {
        for (let characterID in this.gameData.data.characters) {
            // Tile HitTest
            const obj = this.gameData.data.characters[characterID];
            const hitTile = this.getHitTile(obj, obj.vector, dt);
            if (hitTile !== undefined) {
                obj.vector = { x: 0, y: 0 };
                const command = { script: 'setVector', data: obj };
                this.io.emit('broadcast', JSON.stringify(command), Date.now());
                this.setVector(obj, Date.now());
            }

            // 총알 HitTest
        }

        // 총알과 타일의 HitTest
    }

    // 타일 맞았나 판정하기. 따로 뺀 이유는 => 타일은 절대 좌표로 반복문 다 안돌고 주변의 prop만 id로 뽑아서 빠르게 판정이 가능하거든.
    private getHitTile(object: any, vector: {x: number, y: number}, dt: number): any {
        let dist;
        let resultTile;
        let startIndex = this.translatePositionToTileID(object.position);
        let endIndex = this.translatePositionToTileID({x: object.position.x + dt * vector.x, y: object.position.y + dt * vector.y});
        [startIndex, endIndex] = startIndex>endIndex?[endIndex, startIndex]:[startIndex, endIndex];

        for (let id=startIndex; id<=endIndex; id++) {
            const tile = this.gameData.data.tiles[id];
            if (tile === undefined) continue;

            const compareDist = Math.sqrt((tile.position.x - object.position.x)**2 + (tile.position.y - object.position.y)**2);
            if (dist === undefined || dist > compareDist) {
                dist = compareDist;
                resultTile = tile;
            }
        }

        return resultTile;
    }

    private translatePositionToTileID (position: {x:number, y:number}) {
        const width = this.gameData.worldProperties.width;
        const x = Math.round(position.x / TILE_SIZE.WIDTH);
        const y = Math.round(position.y / TILE_SIZE.HEIGHT);

        return x + y * width;
    }

    public applyVector(dt: number): void {
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
    }

    /* ----------------------- Server ----------------------- */

    public makeWorldMap(width: number, height: number): void {
        const mapGenerator: MapGenerator = new MapGenerator();
        const worldMap: any = mapGenerator.generate(width, height);

        for (let key in worldMap.map) {
            this.gameData.insertData(key, worldMap.map[key]);
        }

        this.gameData.worldProperties = worldMap.worldProperties;
    }

    /* ----------------------- Command ----------------------- */

    /* addCharacter
        data: {

        }
    */
    public addCharacter(data: any): void {
        this.gameData.insertData(data.id, data);
    }

    /* deleteCharacter
        data: {
            id: string,
            objectType: string
        }
    */
    public deleteCharacter(data: any): void {
        this.gameData.deleteData(data.id, data.objectType);
    }

    /* setVector
        data: {
            type: string
            id: string,
            position: {
                x: number,
                y: number
            }
            vector: {
                x: number,
                y: number
            }
        }
    */
   public setVector(data: any, dt: number): void {
       data.position.x += dt * data.vector.x;
       data.position.y += dt * data.vector.y;
       this.gameData.data[data.objectType][data.id].position = data.position;
       this.gameData.data[data.objectType][data.id].vector = data.vector;
       this.gameData.dirty(data.id, data.objectType);
   }

    /* runCommand
        data : {
            script: string
            data: object
        }
    */
    public runCommand(command: any, date: number): void {
        if (typeof((this as any)[command.script]) === 'function') {
            (this as any)[command.script](command.data, Date.now() - date);
        }
    }
}