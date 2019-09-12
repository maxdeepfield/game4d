import UiElement from "./UiElement.js";

class Input extends UiElement {
    constructor(props) {
        if (!props) {
            props = {};
        }
        super(props);
        this.on = false;
        this.laston = new Date();
        this.context = props.context;
    }

    update() {
        if (new Date().getTime() - this.laston.getTime() > 300) {
            this.on = !this.on;
            this.laston = new Date();
        }
    }

    draw() {
        this.context.fillStyle = this.background || 'rgba(0,0,0,0.5)';
        this.context.fillRect(this.x, this.y, this.width, this.height);
        this.context.font = "15px Consolas";
        this.context.fillStyle = this.color || 'rgba(255,255,255,0.8)';
        this.context.textAlign = this.align || "left";
        this.context.fillText(this.text, this.x + 5, this.y + 15);
        if (this.on) {
            this.context.fillRect(this.x + this.context.measureText(this.text).width + 7, this.y, 2, 30);
        }
    }
}

export default Input;