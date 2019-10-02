"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = require("./List");
class LevelList extends List_1.default {
    constructor(items) {
        super(items);
        this.items = items || [];
        console.info('LevelList Class Init');
    }
}
exports.default = LevelList;
//# sourceMappingURL=LevelList.js.map