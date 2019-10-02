"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = require("./List");
class BoxList extends List_1.default {
    constructor(items) {
        super(items);
        this.items = items || [];
        console.info('BoxList Class Init');
    }
}
exports.default = BoxList;
//# sourceMappingURL=BoxList.js.map