let fs = require('fs')
let path = require('path')
import BoxList from './BoxList'
import Saveable from './Saveable'
class Level implements Saveable {
    id: string
    name: string
    loaded: boolean
    changed: boolean
    boxes: BoxList
    constructor(LevelOptions?){
        if (!LevelOptions) LevelOptions = {}
        this.boxes = LevelOptions.boxes || new BoxList()
        console.info('Level Class Init')
    }
    save():boolean{
        return fs.writeFileSync(path.join(__dirname, 'data/levels/'+this.id+'.json'), JSON.stringify({
            id: this.id,
            name: this.name,
            loaded: this.loaded,
            changed: this.changed,
            boxes: this.boxes
        }))
    }
    load():Level{
        this.loaded = true
        return this
    }
    unload(){
        this.loaded = false
    }
}

export default Level
