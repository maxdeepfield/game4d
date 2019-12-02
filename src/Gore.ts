class Gore {
    public id: number
    public x: number
    public y: number
    public tx: number
    public ty: number
    public width: number
    public height: number
    public gravity: number
    public maxSpeed: number
    public velX: number
    public velY: number
    public player

    constructor(options) {
        this.id = options.id || Math.random()
        this.x = options.x || 0
        this.y = options.y || 0
        this.tx = options.tx || 0
        this.ty = options.ty || 0
        this.width = options.width || 2
        this.height = options.height || 2
        this.gravity = options.gravity || 0.04
        this.maxSpeed = options.maxSpeed || 25
        this.velX = Math.cos(Math.atan2(this.ty-this.y, this.tx-this.x)) * this.maxSpeed
        this.velY = Math.sin(Math.atan2(this.ty-this.y, this.tx-this.x)) * this.maxSpeed
    }

    update() {
        this.velY+=this.gravity;
        this.x += this.velX
        this.y += this.velY
    }
}

export default Gore