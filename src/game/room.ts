import GameLogic from './gameLogic';
import Updater from './updater';
import GameData from './gameData';
import { log } from '../utils/utils';

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

        this.updater = new Updater();
        this.gameData = new GameData();
        this.gameData.createWorldData(154, 24);
        this.gameLogic = new GameLogic();
        this.gameLogic.gameData = this.gameData;
        
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
};