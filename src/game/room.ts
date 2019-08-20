import GameLogic from "./gameLogic";
import Updater from "./updater";
import GameData from "./gameData";
import { log } from "../utils/utils";

export interface IRoom {
    name: string,
    members?: Array<string>,
    isPlaying?: boolean,
    maxMembers?: number,
}

export class Room {
    public name: string;
    public members: Array<string> = [];
    public isPlaying: boolean;
    public maxMembers: number;
    public gameLogic: GameLogic;
    public gameData: GameData;
    public updater: Updater;
    public io: SocketIO.Namespace;

    constructor(options?: IRoom) {
        let defaultOptions = Object.assign({
            name: '',
            members: [],
            isPlaying: false,
            maxMembers: 10
        }, options);

        for (let key in defaultOptions) {
            this[key] = defaultOptions[key];
        }

        this.gameLogic = new GameLogic();
        this.updater = new Updater();
        this.gameData = new GameData();
        this.gameLogic.gameData = this.gameData;

        // 임시로 추가. TODO: 제거할 것.
        log({ text: `Make World...` });
        this.gameLogic.makeWorldMap(132, 20);
        log({ text: `Done...` });
        
        this.updater.onUpdate(async (dt: number): Promise<void> => {
            await this.gameLogic.update(dt);
        });
    }

    public get joinable(): boolean {
        return this.members.length < this.maxMembers && !this.isPlaying;
    }

    public join(id: string): void {
        this.members.push(id);
    }

    public leave(id: string): void {
        const index: number = this.members.indexOf(id);

        if (index >= 0) {
            this.members.splice(index, 1);
        }
    }

    public destroy(): void {
        this.updater.stop();
    }

    public setNamespace(io: SocketIO.Namespace): void {
        this.io = this.gameLogic.io = io;
    }
};