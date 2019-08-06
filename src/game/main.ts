import { log } from "../../utils/utils";
import ScriptParser, { IScript } from "./scriptParser";

export default class Game {
    private parser: ScriptParser = new ScriptParser();
    private lastUpdate: number;
    public roomName: string;
    public io: SocketIO.Namespace;

    private tempGameData: {
        [id: string]: {
            [id: string]: {
                position: {
                    x: number,
                    y: number
                },
                vector: {
                    x: number,
                    y: number
                }
            }
        }
    } = {};

    public async update(dt: number): Promise<void> {
        for (let key in this.tempGameData) {
            if (!this.tempGameData[key]) continue;
            for (let id in this.tempGameData[key]) {
                const character = this.tempGameData[key][id];
                character.position.x += character.vector.x * dt / 1000;
                character.position.y += character.vector.y * dt / 1000;
            }
        }
        this.lastUpdate = Date.now();
    }

    public connect(): void {

    }

    public disconnect(): void {

    }

    public moveCharacter(dt: number, token: string, id: number, vector: { x: number, y: number}): void {
        this.tempGameData[token][id].vector = vector;
        this.tempGameData[token][id].position.x += vector.x * (dt / 1000);
        this.tempGameData[token][id].position.y += vector.y * (dt / 1000);
    }
    
    public addCharacter(dt: number, token: string, id: number, position: { x: number, y: number }): void {
        if (!this.tempGameData[token]) {
            this.tempGameData[token] = {};
        }
        this.tempGameData[token][id] = {
            position: {
                x: position.x,
                y: position.y
            },
            vector: {
                x: 0,
                y: 0
            }
        };

        const date: number = Date.now();
        const message: string = `moveCharacter(${token},${id},{x: ${Math.random() - Math.random()}, y:${Math.random() - Math.random()}})`;
        this.io.emit('broadcast', message, date);
        this.runScript(message, date);
    }

    public deleteCharacter(dt: number, token: string, id: number): void {
        delete this.tempGameData[token];
    }

    // Run Script는 소켓 통신으로부터 온다. 전달받는데 걸리는 시간이 dt였으므로, dt만큼 더 움직여 줘야겠지?
    public runScript(script: string, date: number): void {
        const parsedScript: IScript = this.parser.parsing(script);
        if (typeof(this[parsedScript.script]) === 'function') {
            let dt: number = this.lastUpdate - date>0?this.lastUpdate - date:0;
            log({ text: `${parsedScript.script}(${parsedScript.args})(${dt}ms)`, ping: Date.now() - date });
            this[parsedScript.script](dt, ...parsedScript.args);
        }
    }
}