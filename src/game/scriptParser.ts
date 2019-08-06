export interface IScript {
    script: string,
    args: any
};

export default class ScriptParser {
    constructor() {

    }

    public parsing(textScript: string): IScript {
        const re = /(\w+)\s*\((.*)\)\s*/g;
        const array = re.exec(textScript);
        
        return {
            script: array[1],
            args: array[2].split(/\s*\,\s*/)
        };
    }
}