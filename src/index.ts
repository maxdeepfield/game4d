const gameloop = require('node-gameloop')
const express = require('express')
const path = require('path')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const fs = require('fs')
import Player from './Player'
import Box from './Box'
import Bot from './Bot'
import Dot from './Dot'
import Gore from './Gore'
import Utils from './Utils'
import LevelList from './LevelList'
import Level from './Level'

const PORT = 9009
const FPS = 60

console.log('PORT', PORT, 'FPS', FPS)

let players = new Map()
let boxes = new Map()
let bots = new Map()
let dots = new Map()
let gores = new Map()

let boxes_count = 0
let bots_count = 0
let dots_count = 0
let gores_count = 0

let saved_boxes = require('./data/boxes.json')
saved_boxes.boxes.forEach((box: Box) => {
    let id = boxes_count++
    box.id = id
    boxes.set(id, new Box(box))
})
let saved_bots = require('./data/bots.json')
saved_bots.bots.forEach((bot: Bot) => {
    let id = bots_count++
    bot.id = id
    bots.set(id, new Bot(bot))
})

function load_scores(cb?) {

}

load_scores()

function save_boxes(callback: Function) {
    let b = []
    boxes.forEach((box) => {
        b.push(box)
    })
    fs.writeFile(path.join(__dirname, 'data/boxes.json'), JSON.stringify({boxes: b}), callback)
}

function save_bots(callback: Function) {
    let b = []
    bots.forEach((bot) => {
        bot.sx = bot.x
        bot.sy = bot.y
        b.push(bot)
    })
    fs.writeFile(path.join(__dirname, 'data/bots.json'), JSON.stringify({bots: b}), callback)
}

function save_scores(callback?: Function) {
    callback({scores: []})
}

io.on('connection', (socket) => {
    console.log('a user connected', socket.id)

    let player = new Player({name: socket.id.substr(0, 7), socket: socket})

    load_scores()

    players.set(socket.id, player)

    socket.on('msg', (res) => {
        socket.broadcast.emit('msg', player.name + ': ' + res)
        socket.emit('msg', player.name + ': ' + res)
    })
    socket.on('name', (res) => {
        player.rename(res)
        load_scores()
    })

    //todo use BoxList
    socket.on('box', (box) => {
        console.log('[box]', box)

        function boxPoint(x1, y1, w1, h1, x2, y2) {//todo do not repeat do existence check elsewhere universaly
            return x2 >= x1 && x2 <= x1 + w1 && y2 >= y1 && y2 <= y1 + h1
        }

        let deleted = false
        boxes.forEach((box) => {
            //  console.log(box)
            let col = boxPoint(box.x, box.y, box.width, box.height, player.keys.mx, player.keys.my)
            if (col) {
                boxes.delete(box.id)
                console.log('deleted box', box)
                deleted = true
            }
        })
        if (deleted) {
            return
        }
        let id = boxes_count++
        boxes.set(id, new Box({
            id: id,
            name: box.name,
            x: player.px,
            y: player.py,
            height: 70,
            width: 70,
            hollow: box.hollow
        }))

        save_boxes((err) => {
            console.log('boxes save error ' + err)
        })
    })

    let platf_from;
    let platf_to;

    socket.on('platf_from', () => {
        platf_from = [player.px,player.py]
        console.log('[platf_from]', platf_from)
    })
    socket.on('platf_to', () => {
        platf_to = [player.px,player.py]
        console.log('[platf_to]', platf_to)
    })
    socket.on('platf_make', () => {

        let id = boxes_count++
        boxes.set(id, new Box({
            id: id,
            name: 5,
            x: platf_from[0],
            y: platf_from[1],
            moving: true,
            tx: platf_to[0],
            ty: platf_to[1],
            height: 70,
            width: 70
        }))
        console.log('[platf_make]', platf_from, platf_to, boxes)
    })

    socket.on('pick_box', (req, cb) => {
        console.log('[pick_box]', req)

        function boxPoint(x1, y1, w1, h1, x2, y2) {
            return x2 >= x1 && x2 <= x1 + w1 && y2 >= y1 && y2 <= y1 + h1
        }

        let found
        boxes.forEach((box) => {
            let col = boxPoint(box.x, box.y, box.width, box.height, player.keys.mx, player.keys.my)
            if (col) {
                found = box
            }
        })
        if (found) {
            if (cb) cb(found.name)
        }

    })
    socket.on('bot', (bot) => {
        console.log('[bot]', bot)

        function botPoint(x1, y1, w1, h1, x2, y2) {
            return x2 >= x1 && x2 <= x1 + w1 && y2 >= y1 && y2 <= y1 + h1
        }

        let deleted = false
        bots.forEach((bot) => {
            let col = botPoint(bot.x, bot.y, bot.width, bot.height, player.keys.mx, player.keys.my)
            if (col) {
                bots.delete(bot.id)
                console.log('deleted bot', bot)
                deleted = true
            }
        })
        if (deleted) {
            return
        }
        let id = bots_count++
        bots.set(id, new Bot({
            id: id,
            name: bot.name,
            x: player.keys.mx,
            y: player.keys.my,
            sx: player.keys.mx,
            sy: player.keys.my,
            height: 36,
            width: 72
        }))

        save_bots((err) => {
            console.log('bots saved' + err)
        })
    })

    socket.on('disconnect', () => {
        players.delete(socket.id)
    })
})

http.listen(PORT, '0.0.0.0', () => {
    console.log('http://127.0.0.1:' + PORT)
    gameloop.setGameLoop(update, 1000 / FPS)
})

function update() {
    players.forEach((player) => {
        player.px = Utils.snapToGrid(player.keys.mx, 70) - 35
        player.py = Utils.snapToGrid(player.keys.my, 70) - 35
    })
    boxes.forEach((box) => {
        box.update()
    })
    gores.forEach((gore) => {
        gore.update()
    })

    bots.forEach((bot) => {
        bot.update()
        bot.grounded = false
        boxes.forEach((box) => {
            if (!box.hollow && bot.alive) {
                let dir = Utils.colCheck(bot, box)
                if (dir === "l" || dir === "r") {
                    bot.velX = 0
                    bot.jumping = false
                } else if (dir === "b") {
                    bot.grounded = true
                    bot.jumping = false
                    bot.velX = bot.maxSpeed
                } else if (dir === "t") {
                    bot.velY *= -1
                    bot.velX = bot.maxSpeed
                } else {
                    bot.velX = bot.maxSpeed
                }
            }
        })
    })

    dots.forEach((dot) => {

        bots.forEach((bot) => {
            let dir = Utils.colCheck(bot, dot, true)
            if (dot.alive && bot.alive && dir) {
                dot.velX = 0
                dot.velY = -2
                dot.alive = false
                bot.hp -= 10
                dot.player.socket.emit('blue',10)
                if (bot.hp < 0) {
                    bot.killedAt = new Date().getTime()
                    bot.alive = false
                    bot.hp = 100
                    dot.player.score -= 1000
                    dot.player.socket.emit('blue',60)
                }
                let velY = dot.velY
                velY+=dot.gravity;
                let tx = dot.tx
                tx += dot.velX
                let ty = dot.ty
                ty += velY
                gores.set(gores_count++, new Gore({
                    id: gores_count,
                    x: dot.x + dot.width / 2,
                    y: dot.y + dot.height / 2,
                    tx: tx,
                    ty: ty,
                    maxSpeed: Utils.getRandomInt(11, 11),
                    player: dot.player
                }))
            }
        })
        boxes.forEach((box) => {
            if (!box.hollow && dot.alive) {
                let dir = Utils.colCheck(dot, box, true)
                if (dir === "l") {
                    dot.velX = 0
                    dot.velY = -1
                } else if (dir === "r") {
                    dot.velX = 0
                    dot.velY = -1
                } else if (dir === "b") {
                    dot.velX = 0
                    dot.velY = -1
                } else if (dir === "t") {
                    dot.velX = 0
                    dot.velY = 1
                }
                if (dir) {
                    dot.alive = false
                }
            }
        })
        players.forEach((player) => {
            if (dot.player.id !== player.id) {
                if (dot.alive) {
                    let dir = Utils.colCheck(dot, player, true)
                    if (dir === "l") {
                        dot.velX = 0
                        dot.velY = -1
                    } else if (dir === "r") {
                        dot.velX = 0
                        dot.velY = -1
                    } else if (dir === "b") {
                        dot.velX = 0
                        dot.velY = -1
                    } else if (dir === "t") {
                        dot.velX = 0
                        dot.velY = 1
                    }
                    if (dir) {
                        dot.alive = false
                        player.hp -= 1
                        dot.player.socket.emit('blue',10)
                        player.socket.emit('red',10)
                        if (player.hp < 0) {
                            dot.player.socket.emit('blue',60)
                            player.socket.emit('red',60)
                            player.spawn()
                        }
                    }
                }
            }
        })
        dot.update()
    })

    players.forEach((player) => {
        player.grounded = false
        player.online = new Date().getTime() - player.created.getTime()
        boxes.forEach((box) => {
            if (box.name == 116) {//if finished
                let dir = Utils.colCheck(player, box, true)
                if (dir) {
                    let score = new Date().getTime() - player.spawnedAt.getTime() + player.score
                    if (player.score <= 0 || player.score > score) {
                        player.score = score
                    }
                }
            }
            if (box.name == 84 && player.alive) {//if lava
                let dir = Utils.colCheck(player, box, true)
                if (dir) {
                    player.hp -= 1
                }
            }

            if (!box.hollow) {
                let dir = Utils.colCheck(player, box)
                player.platf = false
                if (dir === "l" || dir === "r") {
                    player.velX = 0
                    player.jumping = false
                } else if (dir === "b") {
                    player.grounded = true
                    player.jumping = false
                    if (box.moving) {
                        player.velX = box.velX
                        player.velY = box.velY
                        player.platf = true
                    }
                } else if (dir === "t") {
                    player.velY = 0
                    if (box.name == 0) {
                        boxes.delete(box.id)//todo also respawn cooldown?
                    }
                }
            }
        })

        bots.forEach((bot) => {
            if (!bot.alive) return false
            let dir = Utils.colCheck(player, bot)
            if (dir === "l" || dir === "r") {
                bot.killedAt = new Date().getTime()
                bot.alive = false
                player.jumping = false
                player.hp -= 33 //todo do alive detect inside player loop not repeat every here
                player.velX = 0
                player.velY = -2
                player.grounded = false
                player.y -= 1
                player.socket.emit('red')
            } else if (dir === "b") {
                player.grounded = true
                player.jumping = false
                // bot.y += 26
                // console.log('KILL HIM')
                bot.killedAt = new Date().getTime()
                player.socket.emit('blue',60)//todo emit any color, start duration and speed ? on fire color
                bot.alive = false
                player.score -= 1000
            } else if (dir === "t") {
                // console.log('from bottom?')
                player.socket.emit('red')
                player.spawn()
            }
        })

        player.update()
        player.players = []
        player.boxes = []
        player.bots = []
        player.dots = []

        function dist(x1, y1, x2, y2) {
            function diff(num1, num2) {
                return num1 > num2 ? num1 - num2 : num2 - num1
            }

            return Math.sqrt(Math.pow(diff(x1, x2), 2) + Math.pow(diff(y1, y2), 2))
        }

        players.forEach((player) => {
            player.keys.my = Math.round(player.keys.my)
            player.keys.mx = Math.round(player.keys.mx)
            if (player.keys.m1) {
                if (!player.fire) {
                    player.fire = true;
                    setTimeout(function () {
                        player.fire = false;
                    }, 170);
                    dots.set(dots_count++, new Dot({
                        id: dots_count,
                        x: player.x + player.width / 2,
                        y: player.y + player.height / 2,
                        tx: player.keys.mx,
                        ty: player.keys.my,
                        maxSpeed: Utils.getRandomInt(11, 11),
                        player: player
                    }))

                }
            } else {
                player.fire = false;
            }

            players.forEach((players2) => {
                if (dist(players2.x, players2.y, player.x, player.y) < 600) {
                    if (!player.players) player.players = []
                    player.players.push([
                        players2.id,
                        players2.x,
                        players2.y,
                        players2.velX,
                        players2.velY,
                        players2.online,
                        players2.name,
                        players2.score,
                        players2.hp,
                        players2.width,
                        players2.height,
                    ])
                }
            })
            boxes.forEach((box) => {
                if (dist(box.x, box.y, player.x, player.y) < 600) {
                    if (!player.boxes) player.boxes = []
                    player.boxes.push([
                        box.id,
                        box.x,
                        box.y,
                        box.name,

                        box.width,
                        box.height,
                    ])
                }
            })
            bots.forEach((bot) => {
                if (dist(bot.x, bot.y, player.x, player.y) < 600) {
                    if (!player.bots) player.bots = []
                    player.bots.push([
                        bot.id,
                        bot.x,
                        bot.y,
                        bot.velX,
                        bot.velY,
                        bot.alive,

                        bot.width,
                        bot.height,
                        bot.hp,
                    ])
                }
            })
            dots.forEach((dot) => {
                if (dist(dot.x, dot.y, player.x, player.y) < 600) {
                    if (!player.dots) player.dots = []
                    player.dots.push([
                        dot.id,
                        dot.x,
                        dot.y,
                        dot.alive,
                    ])
                }
            })
            gores.forEach((gore) => {
                if (dist(gore.x, gore.y, player.x, player.y) < 600) {
                    if (!player.gores) player.gores = []
                    player.gores.push([
                        gore.id,
                        gore.x,
                        gore.y,
                    ])
                }
            })
        })

        player.socket.emit('players', player.players)
        player.socket.emit('boxes', player.boxes)
        player.socket.emit('bots', player.bots)
        player.socket.emit('dots', player.dots)
        //player.socket.emit('gores', player.gores)//todo this not wotk
    })

}
