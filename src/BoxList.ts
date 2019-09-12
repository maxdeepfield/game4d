import Box from './Box'
import List from './List'

class BoxList extends List {
    items: Box[]
    constructor(items?: Box[]){
        super(items)
        this.items = items || []
        console.info('BoxList Class Init')
    }
}

export default BoxList