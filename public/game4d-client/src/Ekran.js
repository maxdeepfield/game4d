import UI from './ui/UI.js'
import UiElement from './ui/UiElement.js'
import Button from './ui/Button.js'
import ButtonGroup from './ui/ButtonGroup.js'
import Table from './ui/Table.js'
import Infocell from './ui/Infocell.js'

class Ekran {


    constructor(props) {
        this.id = props.id
        this.game = props.game

        let game = this.game

        game.context.font = "13px Arial"
        game.ui = new UI({context: game.context})//todo  use Game somehow?
        game.ui_scoreboard = new Table({
            x: 340,
            y: 200,
            width: 400,
            height: 300,
            background: 'rgba(0,0,0,0.2)',
            data: [],
            context: game.context
        })
        game.ui.add(game.ui_scoreboard)
        game.ui_playerlist = new Table({
            x: game.canvas.width - 470,
            y: 60,
            width: 450,
            height: 0,
            background: 'rgba(110,0,0,0.2)',
            data: [],
            context: game.context
        })
        game.ui.add(game.ui_playerlist)
        game.ui.add(new UiElement({
            x: 0,
            y: 0,
            width: 2000,
            height: 50,
            background: 'rgba(0,0,0,0.2)',
            context: game.context
        }))
        // game.ui.add(new Input({x: 10, y: 250, width: 200, height: 30, text: 'vasja', context: game.context}))
        let levelDrawButtons = new ButtonGroup({x: 10, y: 60, context: game.context})

        levelDrawButtons.add(new Button({
            text: 'PLATF OFF',
            onClick: function () {
                game.platf = !game.platf
                if (game.platf) {
                    this.text = 'PLATF ON'
                }
                if (!game.platf) {
                    this.text = 'PLATF OFF'
                }
            }, context: game.context
        }))

        levelDrawButtons.add(new Button({
            text: 'DRAW OFF',
            onClick: function () {
                game.boxer = !game.boxer
                if (game.boxer) {
                    this.text = 'DRAW ON'
                }
                if (!game.boxer) {
                    this.text = 'DRAW OFF'
                }
            }, context: game.context
        }))

        levelDrawButtons.add(new Button({
            text: 'HOLLOW OFF',
            onClick: function () {
                game.hollow = !game.hollow
                if (game.hollow) {
                    this.text = 'HOLLOW ON'
                }
                if (!game.hollow) {
                    this.text = 'HOLLOW OFF'
                }
            }, context: game.context
        }))
        // levelDrawButtons.add(new Button({//TODO hmodef
        //     text: 'H mode F',
        //     onClick: function () {
        //         game.hmodef = !game.hmodef
        //         if (game.hmodef) {
        //             this.text = 'H mode B'
        //         }
        //         if (!game.hmodef) {
        //             this.text = 'H mode F'
        //         }
        //     }, context: game.context
        // }))
        levelDrawButtons.add(new Button({
            text: '< BOX',
            onClick: function () {
                game.c--
                if (!game.box_tiles[game.c]) {
                    game.c = game.box_tiles.length - 1
                }
                game.c_img = game.box_tiles[game.c]
            }, context: game.context
        }))
        levelDrawButtons.add(new Button({
            text: 'BOX >',
            onClick: function () {
                game.c++
                if (!game.box_tiles[game.c]) {
                    game.c = 0
                }
                game.c_img = game.box_tiles[game.c]
            }, context: game.context
        }))
        levelDrawButtons.add(new Button({
            text: 'PICK OFF',
            onClick: function () {
                game.pick_box = !game.pick_box
                if (game.pick_box) {
                    this.text = 'PICK ON'
                }
                if (!game.pick_box) {
                    this.text = 'PICK OFF'
                }
            }, context: game.context
        }))
        game.ui.add(levelDrawButtons)
        let botDrawButtons = new ButtonGroup({x: levelDrawButtons.width + 20, y: 60, context: game.context})
        botDrawButtons.add(new Button({
            text: 'BOT OFF',
            onClick: function () {
                game.bot_creator = !game.bot_creator
                if (game.bot_creator) {
                    this.text = 'BOT ON'
                }
                if (!game.bot_creator) {
                    this.text = 'BOT OFF'
                }
            }, context: game.context
        }))
        game.ui.add(botDrawButtons)


        let drawer_mode = 'NONE'//todo ui radio ? ololo
        let newDrawer = new ButtonGroup({x: 10, y: levelDrawButtons.height + 70, context: game.context})
        let myInfocell = new Infocell({ label:'DRAWER MODE', text: drawer_mode, context: game.context})
        newDrawer.add(myInfocell)
        newDrawer.add(new Button({ text: 'NONE', onClick:  () => { drawer_mode = 'NONE';myInfocell.setValue(drawer_mode) }, context: game.context}))
        newDrawer.add(new Button({ text: 'TILE', onClick:  () => { drawer_mode = 'TILE';myInfocell.setValue(drawer_mode) }, context: game.context}))
        newDrawer.add(new Button({ text: 'LAVA', onClick:  () => { drawer_mode = 'LAVA';myInfocell.setValue(drawer_mode) }, context: game.context}))
        newDrawer.add(new Button({ text: 'ARROW', onClick:  () => { drawer_mode = 'ARROW';myInfocell.setValue(drawer_mode) }, context: game.context}))
        newDrawer.add(new Button({ text: 'BOT', onClick:  () => { drawer_mode = 'BOT';myInfocell.setValue(drawer_mode) }, context: game.context}))
        newDrawer.add(new Button({ text: 'FINISH', onClick:  () => { drawer_mode = 'FINISH';myInfocell.setValue(drawer_mode) }, context: game.context}))
        newDrawer.add(new Button({ text: 'red', onClick:  () => { this.red() }, context: game.context}))
        newDrawer.add(new Button({ text: 'blue', onClick:  () => { this.blue() }, context: game.context}))
        game.ui.add(newDrawer)

        let topMenuButtons = new ButtonGroup({x: 0, y: 0, context: game.context})
        topMenuButtons.add(new Button({
            label: '[BACKSPACE]',
            text: 'SPAWN',
            onClick: function () {
                game.socket.emit('spawn')
            }, context: game.context
        }))
        topMenuButtons.add(new Infocell({
            label: '[WASD]',
            text: 'MOVE',
            onClick: function () {
            }, context: game.context
        }))
        topMenuButtons.add(new Infocell({
            label: '[ENTER]',
            text: 'CHAT',
            onClick: function () {
                game.socket.emit('msg', prompt('CHAT'))
            }, context: game.context
        }))
        topMenuButtons.add(new Infocell({
            label: '[F12]',
            text: 'RENAME',
            onClick: function () {
                game.socket.emit('name', prompt('NAME'))
                game.socket.emit('msg', 'vot kak tiper menja zovut')
            }, context: game.context
        }))
        topMenuButtons.add(new Infocell({
            text: new Date().toISOString().split('T')[1].split('.')[0],
            label: 'Time',
            onUpdate: function () {
                this.text = new Date().toISOString().split('T')[1].split('.')[0]
                this.draw()
            }, context: game.context
        }))
        game.online_text = new Infocell({text: '0', label: 'online', context: game.context})
        game.ui.add(game.online_text)
        topMenuButtons.add(game.online_text)

        game.ui_keyhelper = new Infocell({text: '-', label: 'Key Code', context: game.context})
        topMenuButtons.add(game.ui_keyhelper)
        let ui_c = new Infocell({
            text: '-',
            label: 'Tile Index',
            onUpdate: function () {
                this.text = game.c
                this.draw()
            }, context: game.context
        })
        topMenuButtons.add(ui_c)
        game.ui.add(topMenuButtons)
    }
    update() {
        if (this.making_red) {
            this.opacity -= 1.5
            if (this.opacity <1) {
                this.making_red = false
                this.opacity = 50
            }
        }
        if (this.making_blue) {
            this.opacity -= 1.5
            if (this.opacity <1) {
                this.making_blue = false
                this.opacity = 50
            }
        }
    }
    red(opacity) {
        this.making_red = true
        this.opacity = opacity || 50
    }
    blue(opacity) {
        this.making_blue = true
        this.opacity = opacity || 50
    }
    draw() {
        if (this.making_red) {
            this.game.context.globalAlpha = this.opacity/100;
            this.game.context.fillStyle = 'red'
            this.game.context.fillRect(0,0,this.game.canvas.width,this.game.canvas.height);
            this.game.context.globalAlpha = 1;
        }
        if (this.making_blue) {
            this.game.context.globalAlpha = this.opacity/100;
            this.game.context.fillStyle = 'blue'
            this.game.context.fillRect(0,0,this.game.canvas.width,this.game.canvas.height);
            this.game.context.globalAlpha = 1;
        }
    }
}

export default Ekran;
