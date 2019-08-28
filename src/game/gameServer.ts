import { warn, log } from '../utils/utils';
import * as socketIO from 'socket.io';
import * as http from 'http';
import { RoomManager } from './roomManager';
import { Room } from './room';

class GameServer {
    public io: socketIO.Server;
    public roomManager: RoomManager = new RoomManager();
    
    // TODO 여기 하단 한번 정리하자.
    public createSocketServer(server: http.Server): void {
        try {
            this.io = socketIO(server, { serveClient: false });
            this.io.on('connection', (socket: socketIO.Socket): void => { this.connection(socket); });
        } catch(error) {
            warn({ text: `Error: ${error}` });
        }
    }

    private connection(socket: socketIO.Socket): void {
        const room: Room = this.roomManager.autoMapping(socket);
        room.setNamespace(this.io.in(room.name));
        log({ text: `Connection: ${socket.id}` });
        
        socket.on('init', (): void => { this.socketInit(socket, room); });
        socket.on('broadcast', (message: string, date: number): void => { this.broadcast(socket, room, message, date); });
        socket.on('keydown', (keycode: number): void => { this.keydown(socket, room, keycode); });
        socket.on('keyup', (keycode: number): void => { this.keyup(socket, room, keycode); });
        socket.on('disconnect', (): void => { this.disconnect(socket, room); });
    }

    private disconnect(socket: socketIO.Socket, room: Room): void {
        const command = {
            script: 'deleteCharacter',
            data: {
                id: socket.id,
                objectType: 'characters'
            }
        };
        this.io.in(room.name).emit('broadcast', JSON.stringify(command), Date.now());
        room.gameLogic.runCommand(command, Date.now());

        warn({ text: `Disconnect: ${socket.id}` });
        this.roomManager.disconnect(socket);
    }

    private socketInit(socket: socketIO.Socket, room: Room): void {
        socket.emit('initGameData', JSON.stringify(room.gameData.data));

        // TODO 제거.
        const command3 = {
            script: 'setWorldProperties',
            data: room.gameData.worldProperties
        };
        this.io.in(room.name).emit('broadcast', JSON.stringify(command3), Date.now());

        const command = {
            script: 'addCharacter',
            data: {
                id: socket.id,

                class: 'archer',
                objectType: 'characters',
                size: { x: 28, y: 76 },
                scale: { x: 1, y: 1 },
                health: 100,
                maxHealth: 100,
                weight: 1,
                movableRate: 0,
                land: false,

                position: { x: (room.members.length - 1) * 16, y: 0 },
                vector: { x: 0, y: 0 },
                forceVector: { x: 0, y: 0.0005 },
                flip: { x: false, y: false },
                rotation: 0,
                rotationVector: 0
            }
        };
        this.io.in(room.name).emit('broadcast', JSON.stringify(command), Date.now());
        room.gameLogic.runCommand(command, Date.now());
    }

    private broadcast(socket: socketIO.Socket, room: Room, message: string, date: number): void {
        this.io.in(room.name).emit('broadcast', message, date);
        
        const command: any = JSON.parse(message);
        room.gameLogic.runCommand(command, date);
    }

    private keydown(socket: socketIO.Socket, room: Room, keycode: number): void {
        // console.log(`keyDown: ${keycode} / id: ${socket.id}`);
        if (keycode === 38) {
            if (room.gameData.data.characters[socket.id].land) {
                const command2 = {
                    script: 'setForceVector',
                    data: {
                        id: socket.id,
                        objectType: 'characters',
                        position: room.gameData.data.characters[socket.id].position,
                        vector: { x: room.gameData.data.characters[socket.id].vector.x, y: -0.35 },
                        forceVector: { x: room.gameData.data.characters[socket.id].forceVector.x, y: 0.001 }
                    }
                };
                room.gameData.data.characters[socket.id].land = false;
                this.io.in(room.name).emit('broadcast', JSON.stringify(command2), Date.now());
                room.gameLogic.runCommand(command2, Date.now());
            }
        } else if (keycode === 39) {
            const command2 = {
                script: 'setVector',
                data: {
                    id: socket.id,
                    objectType: 'characters',
                    position: room.gameData.data.characters[socket.id].position,
                    vector: { x: 0.15, y: room.gameData.data.characters[socket.id].vector.y }
                }
            };
            this.io.in(room.name).emit('broadcast', JSON.stringify(command2), Date.now());
            room.gameLogic.runCommand(command2, Date.now());
        } else if (keycode === 37) {
            const command2 = {
                script: 'setVector',
                data: {
                    id: socket.id,
                    objectType: 'characters',
                    position: room.gameData.data.characters[socket.id].position,
                    vector: { x: -0.15, y: room.gameData.data.characters[socket.id].vector.y }
                }
            };
            this.io.in(room.name).emit('broadcast', JSON.stringify(command2), Date.now());
            room.gameLogic.runCommand(command2, Date.now());
        }
    }

    private keyup(socket: socketIO.Socket, room: Room, keycode: number): void {
        // console.log(`keyup: ${keycode} / id: ${socket.id}`);
        if (keycode === 39 && room.gameData.data.characters[socket.id].vector.x > 0) {
            const command2 = {
                script: 'setVector',
                data: {
                    id: socket.id,
                    objectType: 'characters',
                    position: room.gameData.data.characters[socket.id].position,
                    vector: { x: 0, y: room.gameData.data.characters[socket.id].vector.y }
                }
            };
            this.io.in(room.name).emit('broadcast', JSON.stringify(command2), Date.now());
            room.gameLogic.runCommand(command2, Date.now());
        } else if (keycode === 37 && room.gameData.data.characters[socket.id].vector.x < 0) {
            const command2 = {
                script: 'setVector',
                data: {
                    id: socket.id,
                    objectType: 'characters',
                    position: room.gameData.data.characters[socket.id].position,
                    vector: { x: 0, y: room.gameData.data.characters[socket.id].vector.y }
                }
            };
            this.io.in(room.name).emit('broadcast', JSON.stringify(command2), Date.now());
            room.gameLogic.runCommand(command2, Date.now());
        }
    }
}
export default GameServer;