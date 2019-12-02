import Ekran from './src/Ekran.js'
import Message from './src/Message.js'
import Player from './src/Player.js'
import Box from './src/Box.js'
import Bot from './src/Bot.js'
import Dot from './src/Dot.js'
import Gore from './src/Gore.js'

class Game {
    addr
    constructor(options) {
        let game = this
        game.addr = options.addr
        {
            game.c_img = {loaded: false}
            game.pick_box = false
            game.bot_creator = false
            game.box_tiles = []
            game.c = 0
            game.hollow = false
            game.hmodef = false
            game.boxer = false
            game.platf = false
            game.me = null
            game.canvas = document.getElementById('canvas')
            game.context = game.canvas.getContext('2d')
            game.canvas.width = document.body.clientWidth
            game.canvas.height = document.body.clientHeight
            game.canvas.oncontextmenu = function (e) {
                e.preventDefault()
            }
        }
        game.ekran = new Ekran({game:game})
        game.msgs = new Map()
        game.players = new Map()
        game.bots = new Map()
        game.dots = new Map()
        game.gores = new Map()
        game.boxes = new Map()
        game.load_assets()
        game.listen_io()
        game.listen_input()
        game.update()
    }
    load_assets(){
        let game = this
        let w = 1
        for (w = 1; w < 12; w++) {
            game['p3_walk0' + w] = new Image()
            game['p3_walk0' + w].src = './assets/Player/p3_walk/PNG/p3_walk0' + w + '.png'
        }
        for (w = 1; w < 12; w++) {
            game['lp3_walk0' + w] = new Image()
            game['lp3_walk0' + w].src = './assets/Player/p3_walk/PNG/l/p3_walk0' + w + '.png'
        }
        for (w = 1; w < 3; w++) {
            game['bot_image' + w] = new Image()
            game['bot_image' + w].src = './assets/Enemies/flyFly' + w + 'r.png'
            game['bot_image' + w].onload = function () {
                this.loaded = true
            }
        }
        for (w = 1; w < 3; w++) {
            game['lbot_image' + w] = new Image()
            game['lbot_image' + w].src = './assets/Enemies/flyFly' + w + '.png'
            game['lbot_image' + w].onload = function () {
                this.loaded = true
            }
        }
        game.bg_image = new Image()
        game.bg_image.src = './assets/bg2.png'
        game.bg_image.onload = function () {
            game.bg_image.loaded = true
        }
        game.bg_image3 = new Image()
        game.bg_image3.src = './assets/bg3.png'
        game.bg_image3.onload = function () {
            game.bg_image3.loaded = true
        }
        game.dot_tile = new Image()
        game.dot_tile.src = './assets/spike.png'
        game.dot_tile.onload = function () {
            game.dot_tile.loaded = true
        }
        game.dot_tile_dead = new Image()
        game.dot_tile_dead.src = './assets/spike_dead2.png'
        game.dot_tile_dead.onload = function () {
            game.dot_tile_dead.loaded = true
        }
        game.gore_tile = new Image()
        game.gore_tile.src = './assets/gore.png'
        game.gore_tile.onload = function () {
            game.gore_tile.loaded = true
        }
        for (let i = 1; i <= 162; i++) {
            let img = new Image
            img.src = './assets/boxes/box (' + i + ').png'
            img.onload = function () {
                img.loaded = true
                game.c_img = game.box_tiles[game.c]
            }
            game.box_tiles.push(img)
        }
    }
    listen_io(){
        let game = this
        game.socket = io(game.addr)
        game.socket.on('connect', function () {
            game.socket.emit('msg', 'hi there')
        })
        game.socket.on('players', (res) => {
            game.set_known(game.players, res, Player, Player.data_to_player)
        })
        game.socket.on('red', (opacity) => {
            game.ekran.red(opacity)
        })
        game.socket.on('blue', (opacity) => {
            game.ekran.blue(opacity)
        })
        game.socket.on('boxes', (res) => {
            game.set_known(game.boxes, res, Box, Box.data_to_box)
        })
        game.socket.on('bots', (res) => {
            game.set_known(game.bots, res, Bot, Bot.data_to_bot)
        })
        game.socket.on('dots', (res) => {
            game.set_known(game.dots, res, Dot, Dot.data_to_dot)
        })
        game.socket.on('gores', (res) => {
            game.set_known(game.gores, res, Gore, Gore.data_to_gore)
        })
        game.socket.on('msg', function (res) {
            let id = new Date().getTime()
            game.msgs.set(id, new Message({id: id, text: res}))
        })
    }
    listen_input(){
        let game = this
        game.keys = {w: 0, a: 0, s: 0, d: 0, _: 0, mx: 0, my: 0, xx: 0, xy: 0, m1: 0, m2: 0, m3: 0, m4: 0}
        document.addEventListener('mousemove', function (event) {
            game.keys.xx = event.clientX
            game.keys.xy = event.clientY
            game.ui.items.map(function (item) {
                item.hover = game.ui.isMouseOver(item, game.keys.xx, game.keys.xy)
                if (item.items) {//todo for buttongroup and its weird
                    item.items.map(function (item) {
                        item.hover = game.ui.isMouseOver(item, game.keys.xx, game.keys.xy)
                    })
                }
            })
        })
        document.addEventListener('mousedown', function (event) {

            game.keys['m' + (event.button + 1)] = 1
            let prevent = false
            game.ui.items.map(function (item) {
                if (game.ui.isMouseOver(item, game.keys.xx, game.keys.xy)) {
                    if (item.onClick) item.onClick()
                    prevent = true
                }
                if (item.items) {//todo for buttongroup and its weird
                    item.items.map(function (item) {
                        if (game.ui.isMouseOver(item, game.keys.xx, game.keys.xy)) {
                            if (item.onClick) item.onClick()
                            prevent = true
                        }
                    })
                }
            })

            if (prevent) return


            if (game.pick_box) {
                if (event.button === 0) {
                    game.socket.emit('pick_box', {}, function (res) {
                        game.c = res//todo get rid of "C"
                        game.c_img = game.box_tiles[game.c]
                    })
                }
                return
            }
            if (game.boxer) {
                if (event.button === 0) {
                    game.socket.emit('box', {
                        name: game.c,
                        hollow: game.hollow//todo depth (front of player)
                    })
                }
                return
            }
            if (game.platf) {
                if (event.button === 0) {
                    game.socket.emit('platf_from')
                    console.log('platf_from')
                }
                if (event.button === 1) {
                    game.socket.emit('platf_make')
                    console.log('platf_make')
                }
                if (event.button === 2) {
                    game.socket.emit('platf_to')
                    console.log('platf_to')
                }
                return
            }
            if (game.bot_creator) {
                if (event.button === 0) {
                    game.socket.emit('bot', {
                        name: new Date().getTime()
                    })
                }
            }

        })
        document.addEventListener('mouseup', function (event) {
            game.keys['m' + (event.button + 1)] = 0
        })
        document.addEventListener('keydown', function (event) {
            game.ui_keyhelper.setValue(event.keyCode)
            if (event.repeat) {
                return
            }
            if (event.keyCode === 38 || event.keyCode === 87) {
                game.keys.w = 1
            }
            if (event.keyCode === 37 || event.keyCode === 65) {
                game.keys.a = 1
            }
            if (event.keyCode === 39 || event.keyCode === 68) {
                game.keys.d = 1
            }
            if (event.keyCode === 40) {
                game.keys.s = 1
            }
        }, true)
        document.addEventListener('keyup', function (event) {
            if (event.repeat) {
                return
            }
            if (event.keyCode === 13) {
                game.socket.emit('msg', prompt('CHAT'))
            }
            if (event.keyCode === 113) {
                let name = prompt('NAME')
                game.socket.emit('msg', 'my new name is: ' + name)
                game.socket.emit('name', name)
            }
            if (event.keyCode === 38 || event.keyCode === 87) {
                game.keys.w = 0
            }
            if (event.keyCode === 37 || event.keyCode === 65) {
                game.keys.a = 0
            }
            if (event.keyCode === 39 || event.keyCode === 68) {
                game.keys.d = 0
            }
            if (event.keyCode === 40) {
                game.keys.s = 0
            }
        }, true)
    }
    update() {
        let game = this

        game.context.clearRect(0, 0, game.canvas.width, game.canvas.height)


        if (game.bg_image.loaded && game.me) {
            game.context.drawImage(game.bg_image, Math.round(0 - game.me.velX * 10 - 1020), Math.round(0 - game.me.velY * 3 - 100), 4800, 1900)
        }

        game.context.save()

        game.players.forEach(function (player) {
            if (game.socket.id === player.id) {
                game.me = player
            }
        })

        if (game.me) {
            game.context.translate(-(game.me.x - Math.round(game.canvas.width / 2)), -(game.me.y - Math.round(game.canvas.height / 2)))
        }

        game.boxes.forEach(function (box) {
            box.update()
            box.draw()
        })

        game.bots.forEach(function (bot) {
            bot.update()
            bot.draw()
        })

        game.gores.forEach(function (gore) {
            gore.update()
            gore.draw()
        })

        game.dots.forEach(function (dot) {
            dot.update()
            dot.draw()
        })

        let score_rows = []
        let playerlist = []
        game.players.forEach(function (player) {
            player.update()
            player.draw()
            playerlist.push({
                name: player.name,
                time: player.online,
                hp: player.hp,
                x: Math.round(player.x),
                y: Math.round(player.y),
                score: player.score
            })
        })
        game.ui_playerlist.setData(playerlist)
        game.ui_scoreboard.setData(score_rows)//todo?

        if (game.keys.m1) {
            game.context.fillStyle = 'blue'
        }
        if (game.keys.m2) {
            game.context.fillStyle = 'red'
        }
        if (game.keys.m3) {
            game.context.fillStyle = 'pink'
        }

        if (game.c_img.loaded && game.me && game.boxer) {
            game.context.save()
            game.context.globalAlpha = 0.5
            game.context.drawImage(game.c_img, game.me.px, game.me.py)
            game.context.restore()
        }

        if (game.me) {
            game.keys.mx = game.keys.xx - game.canvas.width / 2 + game.me.x
            game.keys.my = game.keys.xy - game.canvas.height / 2 + game.me.y
        }

        game.context.restore()
        game.ui.update()
        game.ui.draw()

        if (game.online_text) {
            game.online_text.setValue(game.players.size)
        }

        let max_msg = 20
        let msg_y = game.canvas.height - 15 * (max_msg + 1) + 4 - 20
        let msg_x = 10
        game.context.fillStyle = 'rgba(0,0,0,0.4)'
        game.context.fillRect(msg_x, msg_y, 300, 15 * (max_msg + 1) + 4)
        game.context.font = "10px Consolas"
        game.context.fillStyle = 'white'
        game.context.textBaseline = 'top'
        game.context.textAlign = 'left'
        let allmsgs = []
        game.msgs.forEach(function (msg) {
            allmsgs.push(msg)
        })
        allmsgs.reverse()
        allmsgs.forEach(function (msg, i) {
            msg.update()
            if (i > max_msg) {
                return false
            }
            game.context.fillText(msg.created.toISOString().split('T')[1].split('.')[0] + '] ' + msg.text, msg_x + 5, msg_y + 6)
            msg_y += 15//TODO use ui table for that
        })

        if (game.me) {
            let a = 10
            game.context.fillStyle = 'white'
            game.context.fillRect(game.keys.xx, game.keys.xy, a, 2)
            game.context.fillRect(game.keys.xx, game.keys.xy, 2, a)
            game.context.fillRect(game.keys.xx - a, game.keys.xy, a, 2)
            game.context.fillRect(game.keys.xx, game.keys.xy - a, 2, a)
        }

        game.socket.emit('keys', game.keys)

        game.ekran.update()
        game.ekran.draw()

        requestAnimationFrame(()=>{game.update()})
    }
    set_known(existing, updating, classmaker, data_convert_func) {
        //todo any entity creator as mega module wtd
        let game = this
        let got = []
        let notfound = []
        if (!updating) {
            return
        }
        updating.forEach((item) => {
            got.push(data_convert_func(item));
        })
        existing.forEach((existing) => {
            let found = false
            got.forEach((item) => {
                if (existing.id === item.id) {
                    found = true
                }
            })
            if (!found) {
                notfound.push(existing.id)
            }
        })
        notfound.forEach((id) => {
            existing.delete(id)
        })
        got.map((item) => {
            let found = existing.get(item.id)
            if (found) {
                Object.keys(found).map(key => {
                    found[key] = item[key]
                })
            } else {
                let obj = new classmaker(item);
                item.game = game
                existing.set(item.id, obj)
            }
        })
        existing.forEach((item) => {
            item.game = game
        })
    }
}

export default Game