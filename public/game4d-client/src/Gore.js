class Gore {
    constructor(props) {
        this.id = props.id
        this.game = props.game
        this.x = props.x
        this.y = props.y
        this.angle = 0
    }
    static data_to_gore(data) {
        return {
            id: data[0],
            x: Math.round(data[1]),
            y: Math.round(data[2]),
        }
    }
    update() {
        this.angle+=1
    }
    draw() {
        return
        this.game.context.translate(this.x, this.y);
        this.game.context.rotate(this.angle);
        this.game.context.drawImage(this.game['gore_tile'], 0, 0, 10, 10);
        this.game.context.rotate(-this.angle);
        this.game.context.translate(-this.x, -this.y);
    }
}

export default Gore;
