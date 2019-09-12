class Player {
    constructor(props) {
        this.id = props.id;
        this.game = props.game;
        this.x = props.x;
        this.y = props.y;
        this.name = props.name;
        this.jumping = props.jumping;
        this.grounded = props.grounded;
        this.hp = props.hp;
        this.velX = props.velX;
        this.velY = props.velY;
        this.frame = props.frame || 1;
        this.frames = props.frames || 11;
        this.frameTime = props.frameTime || new Date();
        this.frameDelay = props.frameDelay || 30;
    }

    update() {
        if (new Date().getTime() - this.frameTime > this.frameDelay) {
            this.frame++;
            this.frameTime = new Date();
        }
        if (this.frame > this.frames) {
            this.frame = 1;
        }
        if (Math.round(this.velY) !== 0) {
            this.frame = 3;
        }
        if (Math.round(this.velX) === 0) {
            this.frame = 8;
        }
    }

    draw() {
        let img = 'p3_walk0' + this.frame;
        if (this.velX < 0) {
            img = 'l' + img;
        }
        this.game.context.drawImage(this.game[img], this.x, this.y);
        this.game.context.fillStyle = 'black';

        this.game.context.font = "14px Consolas";
        this.game.context.fillStyle = 'BLUE';
        this.game.context.textAlign = "center";
        // this.game.context.fillText(this.name + ' [' + this.velX + '' + this.velY + ', ' + this.grounded + ', ' + this.frame + ']', this.x, this.y);
    }
}

export default Player;