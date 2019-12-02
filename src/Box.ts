class Box {
    public id: number
    public x: number
    public y: number
    public width: number
    public height: number
    public name: string
    public hollow: boolean
    public moving: boolean
    public tx: number
    public ty: number
    public maxSpeed: number
    public velX: number
    public velY: number

    constructor(options) {
        this.id = options.id
        this.name = options.name
        this.x = options.x
        this.y = options.y
        this.width = options.width
        this.height = options.height
        this.hollow = options.hollow
        this.moving = options.moving || false
        if (this.moving) {
            this.tx = options.tx
            this.ty = options.ty
            this.maxSpeed = options.maxSpeed || 3
            this.velX = Math.cos(Math.atan2(this.ty - this.y, this.tx - this.x)) * this.maxSpeed
            this.velY = Math.sin(Math.atan2(this.ty - this.y, this.tx - this.x)) * this.maxSpeed
        }
    }

    update() {
        if (this.moving) {
            this.x += this.velX
            this.y += this.velY
        } else {
            this.velX = 0
            this.velY = 0
        }
    }
}

export default Box