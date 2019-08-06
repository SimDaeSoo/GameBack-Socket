import { log, warn, system } from "../../utils/utils";

export default class Game {
    private updating: boolean = false;
    private avgUpdate: number = 0;
    private updateCount: number = 0;
    private GAME_UPDATE_MILLISEC: number = 8;

    constructor() {
    }

    public start(): void {
        this.gameLoop();
    }

    public gameLoop(): void {
        let lastTime: number = Date.now();
        setInterval(() => {
            const currentTime: number = Date.now();

            if (!this.updating) {
                this.updating = true;
                this.update(currentTime - lastTime);
                lastTime = currentTime;
            }
        }, this.GAME_UPDATE_MILLISEC);
    }

    public async update(dt: number): Promise<void> {
        this.performanceCheck(dt);

        // Update 완료된 후 flag false로 만든다.
        this.updating = false;
    }

    public async runScript(script: string, dt: number): Promise<void> {
        log({ text: `RunScript: ${script}`, ping: dt });
    }

    private performanceCheck(dt: number) {
        this.avgUpdate += dt;
        this.updateCount ++;

        // 125번 Update가 Maximum 성능이 20% 이상 다운되었을 경우 Warning Log띄우기.
        if (this.avgUpdate >= 5000) {
            if (this.updateCount < 500) {
                warn({ text: `(Update/Sec): ${this.updateCount / 5} UPS`});
            }

            this.avgUpdate = this.updateCount = 0;
        }
    }
}