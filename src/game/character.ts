import { State } from "./class/state";

export interface IStat {
    maxHealth: number;
    mana: number;
    healthRecovery: number;
    manaRecovery: number;
    STR: number;
    INT: number;
    STA: number;
    AGI: number;
    critical: number;
    criticalDamage: number;
    speed: number;
    armor: number;
}

export interface ISkill {

}

export interface IAnimations {
    [animationName: string]: IAnimation;
}

export interface IAnimation {
    src: string;
    offset: { x: number, y: number };
    length: number;
    tick: Array<number>;
    loop: boolean;
}

export interface IEquipments {
    weapon: string;
    top: string;
    bottom: string;
    accessory: string;
}

export interface IBaseObjectPacket {
    id: string;
    class: string;
    objectType: string;
    health: number;

    position: { x: number, y: number };
    vector: { x: number, y: number };
    forceVector: { x: number, y: number };
    flip: { x: boolean, y: boolean };
    rotation: number;
    rotationVector: number;
    customProperties: { [key: string]: any };
}

export interface ITilePacket extends IBaseObjectPacket {
    tileNumber: number;
}

export interface ICharacterPacket extends IBaseObjectPacket {
    level: number;
    exp: number;
    equipments: IEquipments;

    land: boolean;

    state: {
        name: string;
        begin: number;
        end: number;
        loop: boolean;
        speed: number;
    };
}

export interface IBaseObjectData {
    name: string;
    size: { x: number, y: number };
    scale: { x: number, y: number };
    weight: number;
    baseStat: IStat
}

export interface ITileData extends IBaseObjectData {
    src: string;
}

export interface ICharacterData extends IBaseObjectData {
    movingSpeed: number;
    jumpForceVector: number;
    baseStat: IStat;
    levelStat: IStat;
    skills: ISkill;
    states: Array<string>;
    baseState: string;
    animations: IAnimations;
}

export class BaseObject {
    public packet: IBaseObjectPacket;
    public data: IBaseObjectData;
    public state: State = new State();

    constructor(data: IBaseObjectPacket) {
        this.packet = data;
    }
    /*
    id: string;
    class: string;
    objectType: string;
    health: number;

    position: { x: number, y: number };
    vector: { x: number, y: number };
    forceVector: { x: number, y: number };
    flip: { x: boolean, y: boolean };
    rotation: number;
    rotationVector: number;
    customProperties: { [key: string]: any };
     */

    // Packet getter, setter
    get position(): { x: number, y: number } { return this.packet.position; }
    set position(position: { x: number, y: number }) { this.packet.position = position; }
    get vector(): { x: number, y: number } { return this.packet.vector; }
    set vector(vector: { x: number, y: number }) { this.packet.vector = vector; }
    get id(): string { return this.packet.id; }
    set id(id: string) { this.packet.id = id; }
    get class(): string { return this.packet.class; }
    set class(className: string) { this.packet.class = className; }
    get objectType(): string { return this.packet.objectType; }
    set objectType(objectType: string) { this.packet.objectType = objectType; }
    get health(): number { return this.packet.health; }
    set health(health: number) { this.packet.health = health; }


    // Data getter, setter
    get size(): { x: number, y: number } { return this.data.size; }
    set size(size: { x: number, y: number }) { this.data.size = size; }
    get scale(): { x: number, y: number } { return this.data.scale; }
    set scale(scale: { x: number, y: number }) { this.data.scale = scale; }
    get weight(): number { return this.data.weight; }
    set weight(weight: number) { this.data.weight = weight; }
}

export class Tile extends BaseObject {
    public packet: ITilePacket;
    public data: ITileData;

    constructor(data: ITilePacket) {
        super(data);
        this.packet = data;
        this.data = require(`../json/${this.packet.objectType}/${this.packet.class}.json`);

        this.load();
    }

    private load(): void {

    }
}

export class Character extends BaseObject {
    public packet: ICharacterPacket;
    public data: ICharacterData;
    public state: State = new State();

    constructor(data: ICharacterPacket) {
        super(data);
        this.packet = data;
        this.data = require(`../json/${this.packet.objectType}/${this.packet.class}.json`);

        // this.load();
    }

    // private load(): void {
    //     // load state
    //     const stateData: {[name: string]: IState} = require('../states.json');
    //     this.data.states.forEach((state: string): void => {
    //         this.state.registState(stateData[state]);
    //     });
    //     this.state.setState(this.data.baseState);
    // }
}