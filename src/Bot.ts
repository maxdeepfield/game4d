class Bot {
    public id: number
    public name: string
    public x: number//todo use Locations, or [x,y] ?
    public y: number
    public sx: number//todo rename
    public sy: number
    public hp: number
    public velX: number
    public velY: number
    public width: number
    public height: number
    // public friction: number
    public gravity: number
    public grounded: boolean
    public alive: boolean
    // public distance: number
    // public moving: boolean
    // public lastmoving: boolean
    public dirleft: boolean
    public maxSpeed: number
    public statusChanged: number
    public statusTimeout: number
    public respawnTimeout: number
    public killedAt: number

    constructor(options) {
        this.id = options.id
        this.name = options.name
        this.x = options.x
        this.y = options.y
        this.sx = options.sx
        this.sy = options.sy
        this.hp = options.hp || 100
        this.width = options.width
        this.height = options.height
        this.alive = options.alive || true
        // this.friction = options.friction || 0.8
        this.gravity = options.gravity || 0.3
        this.grounded = options.grounded || false
        // this.distance = options.distance || 100
        // this.moving = options.moving || false
        this.dirleft = options.dirleft || false
        this.maxSpeed = options.maxSpeed || 1
        this.velX = options.velX || 1
        this.velY = options.velY || 0
        this.statusChanged = options.statusChanged || new Date().getTime()
        this.statusTimeout = options.statusTimeout || 5000
        this.respawnTimeout = options.respawnTimeout || 5000
        this.killedAt = new Date().getTime()////todo spawn function is this used?
    }

    update() {
        if (!this.alive) {
            if (new Date().getTime()-this.killedAt>this.respawnTimeout) {
                this.alive = true
                this.x = this.sx
                this.y = this.sy
            }
        }
        if (!this.alive) {
            this.velY += this.gravity
            this.y += this.velY
            return
        }
        if (new Date().getTime() - this.statusChanged > this.statusTimeout ) {
            this.dirleft = !this.dirleft
            this.statusChanged = new Date().getTime()
        }

        this.velY += this.gravity

        if (this.grounded) {
            this.velY = 0//todo if grounded to moving box then bot velx += box velx
        }

        if (this.grounded) {
            if (this.dirleft) {
                this.x -= this.velX
            } else {
                this.x += this.velX
           }
        }

        this.y += this.velY
    }
}

export default Bot