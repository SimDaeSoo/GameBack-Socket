export default class Game {
    constructor() {
        
    }

    public async start(): Promise<void> {
        let lastDate: number = Date.now();

        while(true) {
            const nowDate: number = Date.now();

            if (nowDate - lastDate < 10) continue;

            await this.update(nowDate - lastDate);
            lastDate = nowDate;
        }
    }

    public async update(dt: number): Promise<void> {
        if (dt !== 10) {
            console.log(`update ${dt}ms`);
        }
    }

    public async runScript(script: string): Promise<void> {
        console.log(script);
    }
}