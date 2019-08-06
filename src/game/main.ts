import { log } from "../../utils/utils";
import ScriptParser, { Script } from "./scriptParser";

export default class Game {
    private parser: ScriptParser = new ScriptParser();
    public broadcastFunc: Function;

    public async update(dt: number): Promise<void> {
    }

    // Run Script는 소켓 통신으로부터 온다. 전달받는데 걸리는 시간이 dt였으므로, dt만큼 더 움직여 줘야겠지?
    public runScript(script: string, dt: number): void {
        const parsedScript: Script = this.parser.parsing(script);

        if (typeof(this[parsedScript.script]) === 'function') {
            log({ text: `${parsedScript.script}(${parsedScript.args})`, ping: dt });
            this[parsedScript.script](dt, parsedScript.args);
        }
    }
}