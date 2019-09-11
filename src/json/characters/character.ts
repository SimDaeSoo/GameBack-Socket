export interface IBaseObjectData {
    id: string;
    class: string;
    objectType: string;

    position: { x: number, y: number };
    vector: { x: number, y: number };
    forceVector: { x: number, y: number };
    flip: { x: boolean, y: boolean };
    rotation: number;
    rotationVector: number;
}

export interface ICharacterData extends IBaseObjectData {
    level: number;
    health: number;

    land: boolean;

    state: {
        name: string;
        begin: number;
        end: number;
        loop: boolean;
    }
}

/* 통신 데이터.
    id: socket.id,
    class: 'ksj001',
    objectType: 'characters',
    land: false,

    position: { x: (room.members.length - 1) * 16, y: 0 },
    vector: { x: 0, y: 0 },
    forceVector: { x: 0, y: 0.001 },
    flip: { x: false, y: false },
    rotation: 0,
    rotationVector: 0,

    level: 1,
    health: 100
    state: {
        name: ''
    }
*/

// 통신 데이터를 이용해 실제로 사용할 데이터를 만든 뒤, 이것을 GameData에 만들어 넣은 후 사용한다.
export default class Character {

    constructor(data: ICharacterData) {

    }
    public load(data: ICharacterData): void {

    }

    public parse(data: ICharacterData): void {

    }
}