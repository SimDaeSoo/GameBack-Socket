import { TILE_SIZE } from "../define";

/*
    플레이어는 초당 30발의 armo를 생성 => 10명제한 => 300개의 Object
    타일은 총 600 * 150 => 900,000개의 Tile Object
    HitTest Object => 해당 오브젝트의 크기 * Vector 범위검사.
*/
export default class MapGenerator {
    constructor() {

    }

    // 600 * 150의 맵을 목표 => 9600px * 2400px => 9600px * 4000px 의 맵..
    // 60 * 15 => 960px * 240px => 960px * 1840px 의 맵.. => 화면에 보이는 크기만큼만 렌더링 할 수 있도록 해야할 것.
    // 하늘의 크기는 Default 100 tile 로 하자. (1600px)
    public generate(width: number, height: number): any {
        let map: any = {};
        const defaultSkyHeight: number = 17;

        for (let x=0; x<width; x++) {
            for (let y=defaultSkyHeight; y<height+defaultSkyHeight; y++) {
                if (Math.random() < 0.3) continue;
                const positionToIndex: number = x + y * width;
                map[positionToIndex] = this.newTile(x, y);
            }
        }

        for (let key in map) {
            MapGenerator.changeTileNumber(map, key, width);
        }

        return {
            map: map,
            worldProperties: {
                width: width,
                height: height + defaultSkyHeight
            }
        };
    }

    public static changeTileNumber(map: any, key: string, width: number): void {
        const x = map[key].position.x / TILE_SIZE.WIDTH;
        const y = map[key].position.y / TILE_SIZE.HEIGHT;
        if (map[(x-1)+y*width] && map[(x+1)+y*width]) {
            map[key].tileNumber = 1;
        } else if (map[(x-1)+y*width]) {
            map[key].tileNumber = 2;
        } else if (map[(x+1)+y*width]) {
            map[key].tileNumber = 0;
        } else {
            map[key].tileNumber = 3;
        }
        
        if (map[x+(y-1)*width] && map[x+(y+1)*width]) {
            map[key].tileNumber += 4;
        } else if (map[x+(y-1)*width]) {
            map[key].tileNumber += 8;
        } else if (map[x+(y+1)*width]) {
            map[key].tileNumber += 0;
        } else {
            map[key].tileNumber += 12;
        }
    }

    // TODO 변경
    public newTile(x: number, y: number): any {
        const tileProperties: any = {
            class: 'dirt',
            objectType: 'tiles',
            size: { x: TILE_SIZE.WIDTH, y: TILE_SIZE.HEIGHT },
            scale: { x: 1.5, y: 1.5},
            health: 100,
            maxHealth: 100,
            weight: 10000000000000000000,
            movableRate: 0,
            tileNumber: 0,

            position: { x: x * (TILE_SIZE.WIDTH), y: y * (TILE_SIZE.HEIGHT) },
            vector: { x: 0, y: 0 },
            forceVector: { x: 0, y: 0 },
            flip: { x: false, y: false },
            rotation: 0,
            rotationVector: 0
        }

        return tileProperties;
    }
}

// Map Generator -> Data -> TileMap Load -> Tile 하나하나 구성.