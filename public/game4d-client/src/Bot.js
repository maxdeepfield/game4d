class Bot {
    constructor(props) {
        this.id = props.id
        this.game = props.game
        this.x = props.x
        this.y = props.y
        this.name = props.name
        this.alive = props.alive
        this.grounded = props.grounded
        this.hp = props.hp
        this.velX = props.velX
        this.dirleft = props.dirleft
        this.velY = props.velY
        this.frame = props.frame || 1
        this.frames = props.frames || 2
        this.frameTime = props.frameTime || new Date()
        this.frameDelay = props.frameDelay || 300
    }
    static data_to_bot(data) {
        return {
            id: data[0],
            x: Math.round(data[1]),
            y: Math.round(data[2]),
            velX: data[3],
            velY: data[4],
            alive: data[5],
            width: data[6],
            height: data[7],
            hp: data[8],
            frame: 1,
            frames: 2,
            frameTime: new Date(),
            frameDelay: 300,
            dirleft: false,
            grounded: false
        }
    }
    update() {
        if (!this.alive) {
            this.dirleft = false
            return
        }
        if (new Date().getTime() - this.frameTime > this.frameDelay) {
            this.frame++
            this.frameTime = new Date()
        }
        if (this.frame > this.frames) {
            this.frame = 1
        }
    }
    draw() {//more far away from player more transparent tile
        let img = 'bot_image' + this.frame
        if (this.dirleft) {
            img = 'l' + img
        }
        this.game.context.drawImage(this.game[img], this.x, this.y)//TODO this causes fatal when bot is killed
        this.game.context.font = "20px Consolas"
        this.game.context.fillStyle = 'white'
        this.game.context.textAlign = "center"
        this.game.context.fillText(`bot ${this.id}  [${this.hp} hp]`, this.x, this.y-20)
    }
}

export default Bot;
