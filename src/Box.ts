class Box {
    public id: number;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public name: string;
    public hollow: boolean;
    constructor(options){
        this.id = options.id;
        this.name = options.name;
        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;
        this.hollow = options.hollow;
    }
}

export default Box;