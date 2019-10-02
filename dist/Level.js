"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let fs = require('fs');
let path = require('path');
const BoxList_1 = require("./BoxList");
class Level {
    constructor(LevelOptions) {
        if (!LevelOptions)
            LevelOptions = {};
        this.boxes = LevelOptions.boxes || new BoxList_1.default();
        console.info('Level Class Init');
    }
    save() {
        return fs.writeFileSync(path.join(__dirname, 'data/levels/' + this.id + '.json'), JSON.stringify({
            id: this.id,
            name: this.name,
            loaded: this.loaded,
            changed: this.changed,
            boxes: this.boxes
        }));
    }
    load() {
        this.loaded = true;
        return this;
    }
    unload() {
        this.loaded = false;
    }
}
exports.default = Level;
//# sourceMappingURL=Level.js.map