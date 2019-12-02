class Player {
    constructor(props) {
        this.id = props.id
        this.game = props.game
        this.x = props.x
        this.y = props.y
        this.name = props.name
        this.score = props.score
        this.online = props.online
        this.jumping = props.jumping
        this.grounded = props.grounded
        this.hp = props.hp
        this.velX = props.velX
        this.velY = props.velY
        this.frame = props.frame || 1
        this.frames = props.frames || 10
        this.frameTime = props.frameTime || new Date()
        this.frameDelay = props.frameDelay || 30
    }
    //s
    static data_to_player(data) {
        return {
            id: data[0],
            x: data[1],
            y: data[2],
            velX: data[3],
            velY: data[4],
            online: data[5],
            name: data[6],
            score: data[7],
            hp: data[8],
            width: data[9],
            height: data[10],
            frame: 1,
            frames: 2,
            frameTime: new Date(),
            frameDelay: 300,
            dirleft: false,
            grounded: false,
        }
    }
    update() { // todo animations elsewhere, maybe inherited
        if (new Date().getTime() - this.frameTime > this.frameDelay) {
            this.frame++
            this.frameTime = new Date()
        }
        if (this.frame > this.frames) {
            this.frame = 1
        }
        if (Math.round(this.velY) !== 0) {
            this.frame = 3
        }
        if (Math.round(this.velX) === 0) {
            this.frame = 8
        }
    }
    draw() {
        let img = 'p3_walk0' + this.frame
        if (this.velX < 0) {
            img = 'l' + img
        }
        this.game.context.drawImage(this.game[img], this.x, this.y)
        this.game.context.font = "14px Consolas"
        this.game.context.fillStyle = 'white'
        this.game.context.textAlign = "center"
        this.game.context.fillText(`${this.name} [${this.hp} hp]`, this.x + 26, this.y - 10)
    }
}

export default Player;
