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
            this.io.on('connection', (socket: socketIO.Socket): void => {
                // connection
                const room: Room = this.roomManager.autoMapping(socket);
                room.setNamespace(this.io.in(room.name));
                log({ text: `Connection: ${socket.id}` });
                
                // init
                socket.on('init', (): void => {
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
                            objectType: 'characters',
                            position: { x: (room.members.length - 1) * 16, y: 0 },
                            vector: { x: 0, y: 0 },
                            forceVector: { x: 0, y: 0},
                            flip: { x: false, y: false },
                            rotation: 0,
                            rotationVector: 0,
                            movableRate: 0,
                            health: 100,
                            maxHealth: 100,
                            weight: 1,
                        }
                    };
                    this.io.in(room.name).emit('broadcast', JSON.stringify(command), Date.now());
                    room.gameLogic.runCommand(command, Date.now());

                    const command2 = {
                        script: 'setVector',
                        data: {
                            id: socket.id,
                            objectType: 'characters',
                            position: { x: (room.members.length - 1) * 16, y: 0 },
                            vector: { x: Math.random(), y: Math.random() }
                        }
                    };
                    this.io.in(room.name).emit('broadcast', JSON.stringify(command2), Date.now());
                    room.gameLogic.runCommand(command2, Date.now());
                });
                
                // this.io.to, this.io.in 나누어서 사용할 것, 서버 시간에 동기화 할것인가, 플레이어한테 맞출것인가.. 서버기준이 맞겠지?
                socket.on('broadcast', (message: string, date: number): void => {
                    this.io.in(room.name).emit('broadcast', JSON.stringify(message), date);
                    
                    const command: any = JSON.parse(message);
                    room.gameLogic.runCommand(command, date);
                });

                socket.on('disconnect', (): void => {
                    warn({ text: `Disconnect: ${socket.id}` });
                    this.roomManager.disconnect(socket);
                });
            });
        } catch(error) {
            warn({ text: `Error: ${error}` });
        }
    }
}
export default GameServer;