class UI {
    constructor(props) {
        if (!props) {
            props = {};
        }
        this.items = props.items || [];
        this.context = props.context;
    }

    isMouseOver(me, x, y) {
        return me.x <= x && x <= me.x + me.width &&
            me.y <= y && y <= me.y + me.height;
    }

    add(item) {
        this.items.push(item);
    }

    update() {
        this.items.map(function (item) {
            if (item.update) {
                item.update();
            }
        });
    }

    draw() {
        this.items.map(function (item) {
            if (item.draw) item.draw();
        });
    }
}

export default UI;
