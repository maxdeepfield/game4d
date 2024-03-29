import {EventEmitter} from "events"

interface Keys {
    w: number,
    a: number,
    s: number,
    d: number,
    _: number,
    mx: number,
    my: number,
    m1: number,
    m2: number,
    m3: number
}

class Player extends EventEmitter {
    private id: string
    public name: string
    public x: number
    public y: number
    public px: number
    public py: number
    public width: number
    public height: number
    public velX: number
    public velY: number
    public maxSpeed: number
    public hp: number
    public alive: boolean
    public frags: number
    public score: number
    public keys: Keys
    public socket
    public jumping: boolean
    public jumping_last: boolean
    public ladder: boolean//todo
    public grounded: boolean
    public platf: boolean
    public friction = 0.8//todo
    public gravity = 0.3
    public b = []
    public fire: boolean
    public spawnedAt: Date
    public created: Date

    constructor({name, socket}: { name: string, socket }) {
        super()

        this.id = socket.id
        this.name = name
        this.socket = socket
        this.keys = {
            w: 0, a: 0, s: 0, d: 0, _: 0, mx: 0, my: 0, m1: 0, m2: 0, m3: 0
        }
        this.frags = 0
        this.score = 0
        this.width = 69
        this.height = 97
        this.jumping = false
        this.jumping_last = false
        this.grounded = false
        this.platf = false
        this.ladder = false
        this.friction = 0.8
        this.gravity = 0.15
        this.maxSpeed = 4
        this.hp = 100//todo use this?
        this.b = []
        this.alive = true
        this.spawn()
        this.fire = false
        this.created = new Date()

        let player = this

        this.socket.on('keys', function (keys) {
            player.keys.w = keys.w || 0
            player.keys.s = keys.s || 0
            player.keys.a = keys.a || 0
            player.keys.d = keys.d || 0
            player.keys.mx = keys.mx || 0
            player.keys.my = keys.my || 0
            player.keys.m1 = keys.m1 || 0
            player.keys.m3 = keys.m2 || 0
            player.keys.m3 = keys.m3 || 0
        })

        this.socket.on('spawn', function () {
            player.spawn()
        })
    }

    spawn() {
        this.x = 455
        this.y = 100
        this.velX = 0
        this.velY = 0
        this.hp = 100
        this.score = 0
        this.spawnedAt = new Date()
        this.alive = true
        this.update()
    }

    rename(name) {
        this.name = name
    }

    update() {
        if (this.keys.w) {
            if (!this.jumping && this.grounded && !this.jumping_last) {
                this.jumping = true
                this.grounded = false
                this.velY = -this.maxSpeed * 2
                this.jumping_last = true
            }
        } else {
            this.jumping_last = false
        }
        if (this.keys.a) {
            if (this.velX > -this.maxSpeed) {
                this.velX--
            }
        }
        if (this.keys.d) {
            if (this.velX < this.maxSpeed) {
                this.velX++
            }
        }

        if (!this.platf) {//todo
            this.velX *= this.friction
            this.velY += this.gravity
            if (this.grounded) {
                this.velY = 0
            }
        }

        this.x += this.velX
        this.y += this.velY

        return this
    }
}

export default Player
