class UiElement {
    constructor(props) {
        if (!props) {
            props = {}
        }
        this.x = props.x
        this.y = props.y
        this.width = props.width
        this.height = props.height
        this.text = props.text
        this.color = props.color
        this.background = props.background
        this.onClick = props.onClick
        this.onUpdate = props.onUpdate
        this.hover = props.hover || false
        this.context = props.context
    }
    draw() {
        this.context.fillStyle = this.background || 'rgba(0,0,0,0.6)'
        this.context.fillRect(this.x, this.y, this.width, this.height)
        this.context.textBaseline = "middle"
    }
    update() {
        if (this.onUpdate) {//todo is this normaL? :D
            this.onUpdate(arguments)
        }
    }
}

export default UiElement