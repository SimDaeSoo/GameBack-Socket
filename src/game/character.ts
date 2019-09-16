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
    startXAxis: number;
    startYAxis: number;
    endXAxis: number;
    endYAxis: number;
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
    baseStat: IStat;
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
    public dirty: boolean = false; // Renderer 날 보고 그려라
    public broadcast: boolean = false; // Server 날 보고 내 Packet을 전송해라

    constructor(data: IBaseObjectPacket) {
        this.packet = Object.assign({
            health: 0,
            position: { x: 0, y: 0 },
            vector: { x: 0, y: 0 },
            forceVector: { x: 0, y: 0 },
            flip: { x: false, y: false },
            rotation: 0,
            rotationVector: 0,
            customProperties: {}
        }, data);
    }

    public update(dt: number): void {
        // apply vector,
        // apply forcevector
        // mutation
    }

    public keyDown(keyCode: number): void {

    }

    public keyUp(keyCode: number): void {
        
    }

    // packet getter
    get id(): string { return this.packet.id; }
    get class(): string { return this.packet.class; }
    get objectType(): string { return this.packet.objectType; }
    get health(): number { return this.packet.health; }
    get position(): { x: number, y: number } { return this.packet.position; }
    get vector(): { x: number, y: number } { return this.packet.vector; }
    get forceVector(): { x: number, y: number} { return this.packet.forceVector; }
    get flip(): { x: boolean, y: boolean } { return this.packet.flip; }
    get rotation(): number { return this.packet.rotation; }
    get rotationVector(): number { return this.packet.rotationVector; }
    get costomProperties(): { [key: string]: any } { return this.packet.customProperties; }

    // packet setter
    set id(id: string) { this.packet.id = id; }
    set class(className: string) { this.packet.class = className; }
    set objectType(objectType: string) { this.packet.objectType = objectType; }
    set health(health: number) { this.packet.health = health; }
    set position(position: { x: number, y: number }) { this.packet.position = position; }
    set vector(vector: { x: number, y: number }) { this.packet.vector = vector; }
    set forceVector(vector: { x: number, y: number }) { this.packet.forceVector = vector; }
    set flip(flip: { x: boolean, y: boolean }) { this.packet.flip = flip; }
    set rotation(value: number) { this.packet.rotation = value; }
    set rotationVector(value: number) { this.packet.rotationVector = value; }
    set costomProperties(properties: { [key: string]: any }) { this.packet.customProperties = properties; }

    // Data getter
    get name(): string { return this.data.name; }
    get size(): { x: number, y: number } { return this.data.size; }
    get scale(): { x: number, y: number } { return this.data.scale; }
    get weight(): number { return this.data.weight; }
    get baseStat(): IStat { return this.data.baseStat; }

    // Data setter
    set name(name: string) { this.data.name = name; }
    set size(size: { x: number, y: number }) { this.data.size = size; }
    set scale(scale: { x: number, y: number }) { this.data.scale = scale; }
    set weight(weight: number) { this.data.weight = weight; }
    set baseStat(stat: IStat) { this.data.baseStat = stat; }

    // Data를 가공해서 만들 수 있는 것들. -> getter로만 접근가능한 것들을 만들어 둬야한다.
    get maxHealth(): number { return this.data.baseStat.maxHealth; }
}

export class Tile extends BaseObject {
    public packet: ITilePacket;
    public data: ITileData;

    constructor(data: ITilePacket) {
        super(data);
        this.packet = data;
        this.data = require(`../json/${this.packet.objectType}/${this.packet.class}.json`);
    }

    // Packet getter

    // Packet setter

    // Data getter

    // Data setter
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