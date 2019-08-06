export interface Script {
    script: string,
    args: any
};

export default class ScriptParser {
    constructor() {

    }

    public parsing(textScript: string): Script {

        return {
            script: '',
            args: []
        };
    }
}