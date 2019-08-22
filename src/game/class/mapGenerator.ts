import { TILE_SIZE } from "../define";
import { changeTileNumber } from "../../utils/utils";

/*
    플레이어는 초당 30발의 armo를 생성 => 10명제한 => 300개의 Object
    타일은 총 600 * 150 => 900,000개의 Tile Object
    HitTest Object => 해당 오브젝트의 크기 * Vector 범위검사.
*/
// Map Generating 다시 볼 것.
export default class MapGenerator {
    // 600 * 150의 맵을 목표 => 9600px * 2400px => 9600px * 4000px 의 맵..
    // 60 * 15 => 960px * 240px => 960px * 1840px 의 맵.. => 화면에 보이는 크기만큼만 렌더링 할 수 있도록 해야할 것.
    // 하늘의 크기는 Default 100 tile 로 하자. (1600px)
    public generate(width: number, height: number): any {
        let map: any = {};
        const defaultSkyHeight: number = 17;

        for (let y=defaultSkyHeight; y<height+defaultSkyHeight; y++) {
            for (let x=0; x<width; x++) {
                if (!MapGenerator.isDeletedTile(x, y, defaultSkyHeight + 2)) {
                    if (Math.random() <= 0.91 - 1.1*(y / (20+defaultSkyHeight)) || (map[x + (y-1) * width] !== undefined && map[x-1 + y * width] !== undefined)) {
                        const positionToIndex: number = x + y * width;
                        map[positionToIndex] = this.newTile(x, y);
                    }
                    if (x > 0) {
                        if (Math.random() <= 0.91 - 1.1*(y / (20+defaultSkyHeight)) || (map[(width-x - 1) + (y-1) * width] !== undefined && map[(width-x) + y * width] !== undefined)) {
                            const positionToIndex = (width - x - 1) + y * width;
                            map[positionToIndex] = this.newTile((width - x - 1), y);
                        }
                    }
                }
            }
        }

        for (let y=height+defaultSkyHeight-2; y<height+defaultSkyHeight; y++) {
            for (let x=0; x<width; x++) {
                const positionToIndex: number = x + y * width;
                map[positionToIndex] = this.newTile(x, y);
            }
        }

        for (let key in map) {
            changeTileNumber(map, key, width);
            if (map[key].tileNumber === 15) {
                delete map[key];
            }
        }

        map['start'] = this.endTile(width * TILE_SIZE.WIDTH, 0, height+defaultSkyHeight * TILE_SIZE.HEIGHT);
        map['end'] = this.endTile(0, 0, height+defaultSkyHeight * TILE_SIZE.HEIGHT);

        return {
            map: map,
            worldProperties: {
                width: width,
                height: height + defaultSkyHeight
            }
        };
    }

    public static isDeletedTile(x: number, y: number, baseY: number): boolean {
        const HEIGHT: number = 3;
        const CYCLE: number = 60;
        const Y: number = Math.sin(Math.PI * 2 / CYCLE * (x + CYCLE / 4 * 3)) * HEIGHT / 2;

        return (y - baseY) < Y;
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

    // TODO 변경
    public endTile(x: number, y: number, height: number): any {
        const tileProperties: any = {
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
        }

        return tileProperties;
    }
}