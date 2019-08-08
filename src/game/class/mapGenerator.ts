import { TILE_SIZE } from "../define";
import Tile from "./tile";

export default class MapGenerator {
    constructor() {

    }

    // 300 * 200
    public generate(width: number, height: number): void {
        let map: any = {};
        const groundY: number = Math.round(height / 2);

        for (let x=0; x<width; x++) {
            for (let y=groundY; y<height;y++) {
                const tile: Tile = new Tile({
                    objectType: 'tile',
                    position: {
                        x: x * TILE_SIZE.WIDTH,
                        y: y * TILE_SIZE.HEIGHT
                    },
                    vector: {
                        x: 0,
                        y: 0
                    },
                    flip: {
                        x: false,
                        y: false
                    },
                    rotation: 0,
                    rotationVector: 0,
                    stat: {

                    }
                });
            }
        }
    }
}

// Map Generator -> Data -> TileMap Load -> Tile 하나하나 구성.