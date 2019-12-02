class Utils {

    static colCheck(shapeA, shapeB, preventMove = false) {
        let vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
            vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
            hWidths = (shapeA.width / 2) + (shapeB.width / 2),
            hHeights = (shapeA.height / 2) + (shapeB.height / 2),
            colDir = null
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
            let oX = hWidths - Math.abs(vX),
                oY = hHeights - Math.abs(vY)
            if (oX >= oY) {
                if (vY <= 0) {
                    colDir = "b";
                    if (!preventMove) shapeA.y -= oY
                } else {
                    colDir = "t";
                    if (!preventMove) shapeA.y += oY
                }
            } else {
                if (vX > 0) {
                    colDir = "l";
                    if (!preventMove) shapeA.x += oX
                } else {
                    colDir = "r";
                    if (!preventMove) shapeA.x -= oX
                }
            }
        }
        //if(colDir) console.log(colDir)//todo player sometimes get L col not B when walk on tiles
        return colDir
    }

    static snapToGrid(value, size) {
        return Math.round(value / size) * size
    }

    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    static getAngle(x1, y1, x2, y2) {
        return Math.atan2(y1 - y2, x1 - x2)
    }

    static line2rectIntersection(x1, y1, x2, y2, rect) {
        let p0 = {x: x1, y: y1}
        let p1 = {x: x2, y: y2}
        let p2, p3
        p2 = {x: rect.x, y: rect.y}
        p3 = {x: rect.x + rect.width, y: rect.y}
        if (this.line2lineIntersection(p0, p1, p2, p3)) {
            return 't'
        }
        p2 = {x: rect.x + rect.width, y: rect.y}
        p3 = {x: rect.x + rect.width, y: rect.y + rect.height};
        if (this.line2lineIntersection(p0, p1, p2, p3)) {
            return 'r'
        }
        p2 = {x: rect.x + rect.width, y: rect.y + rect.height}
        p3 = {x: rect.x, y: rect.y + rect.height}
        if (this.line2lineIntersection(p0, p1, p2, p3)) {
            return 'b'
        }
        p2 = {x: rect.x, y: rect.y + rect.height}
        p3 = {x: rect.x, y: rect.y}
        if (this.line2lineIntersection(p0, p1, p2, p3)) {
            return 'l'
        }

        return null;
    }

    static line2lineIntersection(p0, p1, p2, p3) {
        let unknownA = (p3.x - p2.x) * (p0.y - p2.y) - (p3.y - p2.y) * (p0.x - p2.x)
        let unknownB = (p1.x - p0.x) * (p0.y - p2.y) - (p1.y - p0.y) * (p0.x - p2.x)
        let denominator = (p3.y - p2.y) * (p1.x - p0.x) - (p3.x - p2.x) * (p1.y - p0.y)
        if (unknownA == 0 && unknownB == 0 && denominator == 0) return null
        if (denominator == 0) return null
        unknownA /= denominator
        unknownB /= denominator
        let isIntersecting = (unknownA >= 0 && unknownA <= 1 && unknownB >= 0 && unknownB <= 1)
        if (!isIntersecting) return null
        return ({
            x: p0.x + unknownA * (p1.x - p0.x),
            y: p0.y + unknownA * (p1.y - p0.y)
        });
    }

}


export default Utils
