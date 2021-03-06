import { Room, IRoom } from './room';
import { warn, log } from '../union/utils';
import * as socketIO from 'socket.io';

export class RoomManager {
    public userCounting: number = 0;
    public MAX_USER: number = 100;
    public userDict: { [id: string]: string } = {};
    public rooms: Array<Room> = [];
    public roomNumber: number = 0;

    public autoMapping(socket: socketIO.Socket): Room {
        let room: Room;

        for (let key in this.rooms) {
            if (this.rooms[key].joinable) {
                room = this.rooms[key];
                break;
            }
        }

        if (!room) {
            room = this.makeRoom({ name: this.getRoomName() });
        }
        this.joinRoom(socket, room.name);
        this.userCounting++;

        return room;
    }

    public makeRoom(options?: IRoom): Room {
        const newRoom: Room = new Room(options);
        this.rooms.push(newRoom);
        log({ text: `MakeRoom: ${newRoom.name}` });

        return newRoom;
    }

    public deleteRoom(room: Room): void {
        const index: number = this.rooms.indexOf(room);

        if (index >= 0) {
            warn({ text: `DeleteRoom: ${this.rooms[index].name}` });
            this.rooms.splice(index, 1);
            room.destroy();
        }
    }

    public joinRoom(socket: socketIO.Socket, roomName: string): boolean {
        let result: boolean = false;

        for (let key in this.rooms) {
            if (this.rooms[key].name === roomName && this.rooms[key].joinable) {
                log({ text: `JoinRoom: ${socket.id}, ${this.rooms[key].name}` });
                result = true;
                socket.join(this.rooms[key].name);
                this.rooms[key].join(socket.id);

                this.userDict[socket.id] = roomName;

                break;
            }
        }

        return result;
    }

    public leaveRoom(socket: socketIO.Socket, roomName: string): boolean {
        let result: boolean = false;

        for (let key in this.rooms) {
            if (this.rooms[key].name === roomName) {
                warn({ text: `LeaveRoom: ${socket.id}, ${this.rooms[key].name}` });
                result = true;
                socket.leave(this.rooms[key].name);
                this.rooms[key].leave(socket.id);

                delete this.userDict[socket.id];

                if (this.rooms[key].members.length <= 0) {
                    this.deleteRoom(this.rooms[key]);
                }

                break;
            }
        }

        return result;
    }

    public disconnect(socket: socketIO.Socket): void {
        this.leaveRoom(socket, this.userDict[socket.id]);
        this.userCounting--;
    }

    public getRoomName(): string {
        this.roomNumber++;
        return `Room${this.roomNumber}`;
    }

    public get averageUPS(): number {
        let avgUPS: number = 0;

        this.rooms.forEach((room) => {
            avgUPS += room.updater.ups / this.rooms.length;
        });

        return avgUPS;
    }
}