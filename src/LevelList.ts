import Level from './Level'
import List from './List'

class LevelList extends List  {
    items: Level[]
    constructor(items?: Level[]){
        super(items)
        this.items = items || []
        console.info('LevelList Class Init')
    }
}

export default LevelList