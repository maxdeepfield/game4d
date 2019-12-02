class Switch {
    public id: number
    public name: string
    public x: number
    public y: number
    public width: number
    public height: number
    public on: boolean

    constructor(options) {
        this.id = options.id
        this.name = options.name
        this.x = options.x
        this.y = options.y
        this.width = options.width
        this.height = options.height
        this.on = options.on || false
    }

    update() {
        //todo need overlap events but where to put them
    }

    make_on(){
        this.on = true
    }

    make_off(){
        this.on = false
    }
}

export default Switch