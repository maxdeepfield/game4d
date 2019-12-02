import UiElement from './UiElement.js'

class Text extends UiElement {
    constructor(props) {
        if (!props) {
            props = {}
        }
        super(props);
        this.background = props.background || 'white'
        this.color = props.color || 'black'
        this.align = props.align || 'center'
        this.width = props.width || 100
        this.height = props.height || 30
        this.context = props.context
    }
    draw() {
        this.context.fillStyle = this.background || 'rgba(1,1,1,0.9)'
        this.context.fillRect(this.x, this.y, this.width, this.height)
        this.context.font = '15px Consolas'
        this.context.textAlign = this.align
        this.context.fillStyle = this.color || 'rgba(255,255,255,0.8)'
        this.context.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2)
    }
}

export default Text