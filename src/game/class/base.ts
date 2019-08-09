export default class Base {
    public objectType: string;
    public position: { x: number, y: number };
    public vector: { x: number, y: number };
    public forceVector: { x: number, y: number };
    public flip: { x: boolean, y: boolean };
    public rotation: number;
    public rotationVector: number;
    public movableRate: number;
    public stat?: Stat;

    constructor(data: any) {
        this.objectType = data.objectType;
        this.position = data.position;
        this.vector = data.vector;
        this.forceVector = data.forceVector;
        this.flip = data.flip;
        this.rotation = data.rotation;
        this.movableRate = data.movableRate;
        this.rotationVector = data.rotationVector;
        this.stat = data.stat;
    }
}

interface Stat {
    health?: number;
    maxHealth?: number;
    mana?: number;
    maxMana?: number;
    speed?: number;
    strength?: number;
    intellect?: number;
    agillity?: number;
    stemina?: number;
    weight?: number;
}