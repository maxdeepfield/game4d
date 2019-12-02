class Box {
    constructor(props){
        this.id = props.id
        this.game = props.game
        this.name = props.name
        this.x = props.x
        this.y = props.y
        this.hollow = props.hollow;//todo
    }
    update() {
    }
    static data_to_box(data) {
        return {
            id: data[0],
            x: data[1],
            y: data[2],
            name: data[3],
            width: data[4],
            height: data[5],
        }
    }
    draw() {
        if (this.game.box_tiles[this.name] && this.game.box_tiles[this.name].loaded) {
            this.game.context.drawImage(this.game.box_tiles[this.name], Math.round(this.x), Math.round(this.y))//todo do math round on server ?
        }
    }
}

export default Box;
