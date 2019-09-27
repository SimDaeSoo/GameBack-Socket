import { NextFunction, Request, Response, Router } from 'express';
import GameServer from '../game/server/gameServer';

export class SocketServerRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private async routes(): Promise<void> {
        this.router.get('/status', this.status);
    }

    private async status(request: Request, response: Response, next: NextFunction): Promise<void> {
        response.send(GameServer.instance.roomManager.rooms);
    }
}