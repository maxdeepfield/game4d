class Player {
    constructor(props) {
        this.id = props.id;
        this.game = props.game;
        this.x = props.x;
        this.y = props.y;
        this.name = props.name;
        this.jumping = props.jumping;
        this.alive = props.alive;
        this.grounded = props.grounded;
        this.hp = props.hp;
        this.velX = props.velX;
        this.dirleft = props.dirleft;
        this.velY = props.velY;
        this.frame = props.frame || 1;
        this.frames = props.frames || 2;
        this.frameTime = props.frameTime || new Date();
        this.frameDelay = props.frameDelay || 300;
    }

    update() {
        if (!this.alive) {
            // /this.frame = 3;
            this.dirleft = false;
            return;
        }
        if (new Date().getTime() - this.frameTime > this.frameDelay) {
            this.frame++;
            this.frameTime = new Date();
        }
        if (this.frame > this.frames) {
            this.frame = 1;
        }
    }

    draw() {
        let img = 'bot_image' + this.frame;
        if (this.dirleft) {
            img = 'l' + img;
        }
        this.game.context.drawImage(this.game[img], this.x, this.y);//TODO this causes fatal when bot is killed
        this.game.context.font = "20px Consolas";
        this.game.context.fillStyle = 'white';
        this.game.context.textAlign = "center";
        //this.game.context.fillText(this.x, this.x, this.y);
    }
}

export default Player;
