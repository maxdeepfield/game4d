import UiElement from './UiElement.js'

class Button extends UiElement {
    constructor(props) {
        if (!props) {
            props = {}
        }
        super(props)
        this.background = props.background || 'rgba(0,0,0,0.7)'
        this.color = props.color || 'rgba(255,255,255,0.7)'
        this.align = props.align || "center"
        this.width = props.width || 100
        this.height = props.height || 30
        this.context = props.context
    }
    draw() {
        this.context.fillStyle = this.background
        this.context.fillRect(this.x, this.y, this.width, this.height)
        this.context.textAlign = "center"
        this.context.fillStyle = this.hover?'rgba(255,255,255,1)':'rgba(255,255,255,0.8)'
        this.context.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2)
    }
}

export default Button;