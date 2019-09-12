class List {
    items: any[]
    constructor(items: any[]){
        this.items = items || []
    }
    
    getItem(id: string) {
        return this.items.filter(function (item) {
            return item.id === id
        })[0]
    }
        
    addItem(item: any) {
        item.id = new Date().getTime()
        this.items.push(item)
        return item.id
    }
}

export default List