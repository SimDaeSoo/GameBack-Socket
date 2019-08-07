import { system, warn } from '../utils/utils';
import * as socketIO from 'socket.io';
import * as http from 'http';
import { RoomManager } from './roomManager';
import { Room } from './room';

class GameServer {
    public io: socketIO.Server;
    public roomManager: RoomManager = new RoomManager();
    
    public createSocketServer(server: http.Server): void {
        try {
            this.io = socketIO(server, { serveClient: false });
            this.io.on('connection', (socket: socketIO.Socket): void => {
                system({ text: `Connection: ${socket.id}` });
                const room: Room = this.roomManager.autoMapping(socket);
                room.setNamespace(this.io.to(room.name));
                room.initSocket(socket);

                socket.on('broadcast', (message: string, date: number): void => {
                    this.io.to(room.name).emit('broadcast', JSON.stringify(message), date);
                    room.gameLogic.runScript(message, date);
                });

                socket.on('disconnect', (): void => {
                    warn({ text: `Disconnect: ${socket.id}` });
                    this.roomManager.disconnect(socket);
                    
                    this.io.to(room.name).emit('broadcast', JSON.stringify(`deleteCharacter(${socket.id}, 1)`), Date.now());
                    room.gameLogic.runScript(`deleteCharacter(${socket.id}, 1)`, Date.now());
                });
            });
        } catch(error) {
            warn({ text: `Error: ${error}` });
        }
    }
}
export default GameServer;