"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class List {
    constructor(items) {
        this.items = items || [];
    }
    getItem(id) {
        return this.items.filter(function (item) {
            return item.id === id;
        })[0];
    }
    addItem(item) {
        item.id = new Date().getTime();
        this.items.push(item);
        return item.id;
    }
}
exports.default = List;
//# sourceMappingURL=List.js.map