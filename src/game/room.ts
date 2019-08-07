import GameLogic from "./gameLogic";
import Updater from "./updater";

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
    public updater: Updater;
    public io: SocketIO.Namespace;

    constructor(options?: IRoom) {
        let defaultOptions = Object.assign({
            name: '',
            members: [],
            isPlaying: false,
            maxMembers: 2
        }, options);

        for (let key in defaultOptions) {
            this[key] = defaultOptions[key];
        }

        this.gameLogic = new GameLogic();

        this.updater = new Updater();
        this.updater.setGameLogic(this.gameLogic);
        this.updater.updateLoop();
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
        this.gameLogic.roomName = this.name;
    }

    public initSocket(socket: SocketIO.Socket): void {
        // this.gameLogic.getStatus();
    }
};