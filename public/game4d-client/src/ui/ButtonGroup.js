import UiElement from "./UiElement.js";

class ButtonGroup extends UiElement {
    constructor(props) {
        if (!props) {
            props = {};
        }
        super(props);
        this.items = [];
        this.height = 50;
        this.count = 0;
        this.context = props.context;
    }

    add(item) {
        this.count++;
        item.x = this.x + (100 * this.count) - 100 + 10;
        this.width = 100 * this.count + 20;
        item.y = this.y + 10;
        this.items.push(item);
    }

    update() {
        this.items.map(function (item) {
            if (item.update) item.update();
        });
    }

    draw() {
        this.context.fillStyle = this.background || 'rgba(0,0,0,0.3)';
        this.context.fillRect(this.x, this.y, this.width, this.height);
        this.items.map(function (item) {
            if (item.draw) item.draw();
        });
    }
}

export default ButtonGroup;
