import { warn, log } from '../utils/utils';
import * as socketIO from 'socket.io';
import * as http from 'http';
import { RoomManager } from './roomManager';
import { Room } from './room';

class GameServer {
    public io: socketIO.Server;
    public roomManager: RoomManager = new RoomManager();
    
    // 여기 하단 한번 정리하자.
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
                    const addCharacterMessage: string = JSON.stringify({ script: 'addCharacter', data: { id: socket.id, position: {x:Math.random(),y:Math.random()} } });
                    this.io.in(room.name).emit('broadcast', addCharacterMessage, Date.now());
                    room.gameLogic.runCommand(JSON.parse(addCharacterMessage),Date.now());
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