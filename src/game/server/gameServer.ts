import { warn, log } from '../union/utils';
import * as socketIO from 'socket.io';
import * as http from 'http';
import { RoomManager } from './roomManager';
import { Room } from './room';

class GameServer {
    public io: socketIO.Server;
    public roomManager: RoomManager = new RoomManager();
    public pings: Array<number> = [];
    private PING_TEST: number = 0;

    // TODO 여기 하단 한번 정리하자.
    public createSocketServer(server: http.Server): void {
        try {
            this.io = socketIO(server, { serveClient: false });
            this.io.on('connection', (socket: socketIO.Socket): void => { this.connection(socket); });
        } catch (error) {
            warn({ text: `Error: ${error}` });
        }
    }

    private connection(socket: socketIO.Socket): void {
        const room: Room = this.roomManager.autoMapping(socket);
        log({ text: `Connection: ${socket.id}` });

        socket.on('initialize', (): void => { this.socketInitialize(socket, room); });
        socket.on('broadcast', (message: string, date: number): void => { this.broadcast(socket, room, message, date); });
        socket.on('keydown', (keycode: number): void => { this.keydown(socket, room, keycode); });
        socket.on('keyup', (keycode: number): void => { this.keyup(socket, room, keycode); });
        socket.on('disconnect', (): void => { this.disconnect(socket, room); });
        socket.on('pingTest', (date: number): void => { this.ping(socket, date); });
    }

    public get avgPing(): number {
        let result: number = 0;

        this.pings.forEach((ping) => {
            result += ping / this.pings.length;
        });

        return result;
    }

    private ping(socket: socketIO.Socket, date: number): void {
        this.pings.push(Date.now() - date);
        if (this.pings.length > 100) {
            this.pings.splice(0, 1);
        }

        socket.emit('pingTest', Date.now());
    }

    private disconnect(socket: socketIO.Socket, room: Room): void {
        const command = {
            script: 'deleteCharacter',
            data: { id: socket.id, objectType: 'characters' }
        };
        this.broadcast(socket, room, JSON.stringify(command), Date.now());

        warn({ text: `Disconnect: ${socket.id}` });
        this.roomManager.disconnect(socket);
    }

    private socketInitialize(socket: socketIO.Socket, room: Room): void {
        socket.emit('initialize', JSON.stringify(room.gameData.data));

        // TODO 제거.
        const command3 = { script: 'setWorldProperties', data: room.gameData.worldProperties };
        socket.emit('broadcast', JSON.stringify(command3), Date.now());

        const command = {
            script: 'addCharacter',
            data: {
                id: socket.id,

                class: 'archer',
                objectType: 'characters',
                size: { x: 14, y: 68 },
                scale: { x: 1, y: 1 },
                weight: 1,
                land: false,

                position: { x: (room.members.length - 1) * 16, y: 0 },
                vector: { x: 0, y: 0 },
                forceVector: { x: 0, y: 0.001 },
                flip: { x: false, y: false },
                rotation: 0,
                rotationVector: 0,
            }
        };
        this.broadcast(socket, room, JSON.stringify(command), Date.now());
    }

    private broadcast(socket: socketIO.Socket, room: Room, message: string, date: number): void {
        setTimeout(() => {
            this.io.in(room.name).emit('broadcast', message, date);
        }, this.PING_TEST);
        const command: any = JSON.parse(message);
        room.gameLogic.runCommand(command, date);
    }

    private keydown(socket: socketIO.Socket, room: Room, keycode: number): void {
        if (keycode === 38) {
            if (room.gameData.data.characters[socket.id].land) {
                room.gameData.data.characters[socket.id].land = false;
                const command = {
                    script: 'setState',
                    data: Object.assign(room.gameData.data.characters[socket.id], {
                        vector: { x: room.gameData.data.characters[socket.id].vector.x, y: -0.35 },
                        forceVector: { x: room.gameData.data.characters[socket.id].forceVector.x, y: 0.001 }
                    })
                };
                this.broadcast(socket, room, JSON.stringify(command), Date.now());
            }
        } else if (keycode === 39) {
            const command = {
                script: 'setState',
                data: Object.assign(room.gameData.data.characters[socket.id], {
                    vector: { x: 0.15, y: room.gameData.data.characters[socket.id].vector.y }
                })
            };
            this.broadcast(socket, room, JSON.stringify(command), Date.now());
        } else if (keycode === 37) {
            const command = {
                script: 'setState',
                data: Object.assign(room.gameData.data.characters[socket.id], {
                    vector: { x: -0.15, y: room.gameData.data.characters[socket.id].vector.y }
                })
            };
            this.broadcast(socket, room, JSON.stringify(command), Date.now());
        }
    }

    private keyup(socket: socketIO.Socket, room: Room, keycode: number): void {
        if (keycode === 39 && room.gameData.data.characters[socket.id].vector.x > 0) {
            const command = {
                script: 'setState',
                data: Object.assign(room.gameData.data.characters[socket.id], {
                    vector: { x: 0, y: room.gameData.data.characters[socket.id].vector.y }
                })
            };
            this.broadcast(socket, room, JSON.stringify(command), Date.now());
        } else if (keycode === 37 && room.gameData.data.characters[socket.id].vector.x < 0) {
            const command = {
                script: 'setState',
                data: Object.assign(room.gameData.data.characters[socket.id], {
                    vector: { x: 0, y: room.gameData.data.characters[socket.id].vector.y }
                })
            };
            this.broadcast(socket, room, JSON.stringify(command), Date.now());
        }
    }
}
export default GameServer;