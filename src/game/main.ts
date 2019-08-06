import { log } from "../../utils/utils";
import ScriptParser, { IScript } from "./scriptParser";

export default class Game {
    private parser: ScriptParser = new ScriptParser();
    private lastUpdate: number;
    public roomName: string;
    public io: SocketIO.Namespace;

    public async update(dt: number): Promise<void> {
        this.lastUpdate = Date.now();
    }
    
    public addCharacter(dt: number, token: string, id: number): void {

    }

    public deleteCharacter(dt: number, token: string, id: number): void {

    }

    // Run Script는 소켓 통신으로부터 온다. 전달받는데 걸리는 시간이 dt였으므로, dt만큼 더 움직여 줘야겠지?
    public runScript(script: string, date: number): void {
        const parsedScript: IScript = this.parser.parsing(script);

        if (typeof(this[parsedScript.script]) === 'function') {
            let dt: number = this.lastUpdate - date>0?this.lastUpdate - date:0;
            log({ text: `${parsedScript.script}(${parsedScript.args}),(${dt}ms)`, ping: Date.now() - date });
            this[parsedScript.script](dt, parsedScript.args);
        }
    }
}