import Text from './Text.js'

class Infocell extends Text {
    constructor(props) {
        if (!props) {
            props = {}
        }
        super(props)
        this.label = props.label || '?'
        this.context = props.context
    }
    draw(){
        this.context.fillStyle = this.background || 'rgba(1,1,1,0.9)'
        this.context.fillRect(this.x, this.y, this.width, this.height)
        this.context.textAlign = this.align
        this.context.fillStyle = this.color || 'rgba(255,255,255,0.8)'
        this.context.font = "10px Consolas"
        this.context.fillText(this.label, this.x + this.width / 2, this.y + this.height / 2 - 6)
        this.context.font = "15px Consolas"
        this.context.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2 + 5)
    }
    setValue(text){
        this.text = text
    }
}

export default Infocell