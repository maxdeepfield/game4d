"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Bot {
    constructor(options) {
        this.id = options.id;
        this.name = options.name;
        this.x = options.x;
        this.y = options.y;
        this.sx = options.sx;
        this.sy = options.sy;
        this.width = options.width;
        this.height = options.height;
        this.alive = options.alive || true;
        //    this.friction = options.friction || 0.8;
        this.gravity = options.gravity || 0.3;
        this.grounded = options.grounded || false;
        // this.distance = options.distance || 100;
        // this.moving = options.moving || false;
        this.dirleft = options.dirleft || false;
        this.maxSpeed = options.maxSpeed || 1;
        this.velX = options.velX || 1;
        this.velY = options.velY || 0;
        this.statusChanged = options.statusChanged || new Date().getTime();
        this.statusTimeout = options.statusTimeout || 5000;
        this.respawnTimeout = options.respawnTimeout || 5000;
        this.killedAt = new Date().getTime(); ////todo spawn function
    }
    update() {
        if (!this.alive) {
            if (new Date().getTime() - this.killedAt > this.respawnTimeout) {
                this.alive = true;
                this.x = this.sx;
                this.y = this.sy;
                console.log('respawned');
            }
        }
        if (!this.alive) {
            return;
        }
        if (new Date().getTime() - this.statusChanged > this.statusTimeout) {
            // this.moving = !this.moving;
            // this.lastmoving = this.moving;
            //  this.statusChanged = new Date().getTime();
        }
        if (new Date().getTime() - this.statusChanged > this.statusTimeout) {
            this.dirleft = !this.dirleft;
            this.statusChanged = new Date().getTime();
        }
        // this.velX *= this.friction;
        this.velY += this.gravity;
        if (this.grounded) {
            this.velY = 0; //todo if grounded to moving box then player velx = box velx
        }
        if (this.grounded) {
            if (this.dirleft) {
                this.x -= this.velX;
            }
            else {
                this.x += this.velX;
            }
        }
        this.y += this.velY;
    }
}
exports.default = Bot;
//# sourceMappingURL=Bot.js.map