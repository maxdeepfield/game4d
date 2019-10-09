import UI from './src/ui/UI.js';
import UiElement from './src/ui/UiElement.js';
import Button from './src/ui/Button.js';
import ButtonGroup from './src/ui/ButtonGroup.js';
import Input from './src/ui/Input.js';
import Table from './src/ui/Table.js';
import Infocell from './src/ui/Infocell.js';
import Player from './src/Player.js';
import Bot from './src/Bot.js';

class Game {
    addr;
    constructor(options) {
        this.addr = options.addr;
        let game = this;

        class Message {
            constructor(props) {
                this.id = props.id;
                this.text = props.text;
                this.created = new Date();
            }

            update() {
                if (new Date().getTime() - this.created.getTime() > 5000) {
                    //msgs.delete(this.id);
                }
            }
        }

        game.msgs = new Map();//TODO
        game.data = {
            players: [],
            boxes: [],
            bots: []
        };

        game.players = new Map();//TODO
        game.bots = new Map();//TODO

        game.canvas = document.getElementById('canvas');
        game.context = game.canvas.getContext('2d');
        game.canvas.width = document.body.clientWidth;
        game.canvas.height = document.body.clientHeight;
        game.canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };
        game.ui = new UI({context: game.context});//todo  use Game somehow?

        game.ui_scoreboard = new Table({
            x: 340, y: 200, width: 400, height: 300, background: 'rgba(0,0,0,0.2)', data: [], context: game.context
        });
        game.ui.add(game.ui_scoreboard);

        game.ui_playerlist = new Table({
            x: 340, y: 200, width: 400, height: 300, background: 'rgba(110,0,0,0.2)', data: [], context: game.context
        });
        game.ui.add(game.ui_playerlist);

        game.ui.add(new UiElement({
            x: 0, y: 0, width: 2000, height: 50, background: 'rgba(0,0,0,0.2)', context: game.context
        }));
        game.ui.add(new Input({x: 10, y: 250, width: 200, height: 30, text: 'vasja', context: game.context}));
        let g = new ButtonGroup({
            x: 10, y: 60, context: game.context
        });
        g.add(new Button({
            text: 'D is OFF',
            onClick: function () {
                game.boxer = !game.boxer;
                if (game.boxer) {
                    this.text = 'D is ON';
                }
                if (!game.boxer) {
                    this.text = 'D is OFF';
                }
            }, context: game.context
        }));
        g.add(new Button({
            text: 'H is OFF',
            onClick: function () {
                game.hollow = !game.hollow;
                if (game.hollow) {
                    this.text = 'H is ON';
                }
                if (!game.hollow) {
                    this.text = 'H is OFF';
                }
            }, context: game.context
        }));
        g.add(new Button({//TODO hmodef
            text: 'H mode F',
            onClick: function () {
                game.hmodef = !game.hmodef;
                if (game.hmodef) {
                    this.text = 'H mode B';
                }
                if (!game.hmodef) {
                    this.text = 'H mode F';
                }
            }, context: game.context
        }));
        g.add(new Button({
            text: '< P BOX',
            onClick: function () {
                game.c--;
                if (!game.box_tiles[game.c]) {
                    game.c = game.box_tiles.length - 1;
                }
                game.c_img = game.box_tiles[game.c];
            }, context: game.context
        }));
        g.add(new Button({
            text: 'N BOX >',
            onClick: function () {
                game.c++;
                if (!game.box_tiles[game.c]) {
                    game.c = 0;
                }
                game.c_img = game.box_tiles[game.c];
            }, context: game.context
        }));

        g.add(new Button({
            text: 'P BOX OFF',
            onClick: function () {
                game.pick_box = !game.pick_box;
                if (game.pick_box) {
                    this.text = 'P BOX ON';
                }
                if (!game.pick_box) {
                    this.text = 'P BOX OFF';
                }
            }, context: game.context
        }));
        game.ui.add(g);

        let bot_menu = new ButtonGroup({
            x: 10, y: 120, context: game.context
        });
        bot_menu.add(new Button({
            text: 'B is OFF',
            onClick: function () {
                game.bot_creator = !game.bot_creator;
                if (game.bot_creator) {
                    this.text = 'B is ON';
                }
                if (!game.bot_creator) {
                    this.text = 'B is OFF';
                }
            }, context: game.context
        }));
        game.ui.add(bot_menu);

        game.ui.add(new Infocell({
            x: 20,
            y: 300,
            color: 'white',
            background: 'rgba(0,0,0,0.7)',
            label: '[ENTER]',
            text: 'CHAT',
            onClick: function () {
                game.socket.emit('msg', prompt('CHAT'))
            }, context: game.context
        }));
        game.ui.add(new Infocell({
            x: 20,
            y: 340,
            color: 'white',
            background: 'rgba(0,0,0,0.7)',
            label: '[F12]',
            text: 'RENAME',
            onClick: function () {
                game.socket.emit('name', prompt('NAME'));
                game.socket.emit('msg', 'vot kak tiper menja zovut');
            }, context: game.context
        }));
        game.online_text = new Infocell({
            x: 10,
            y: 10,
            text: '0',
            label: 'online', context: game.context
        });
        game.ui.add(game.online_text);
        game.ui.add(new Infocell({
            x: 120,
            y: 10,
            text: new Date().toISOString().split('T')[1].split('.')[0],
            label: 'Time',
            onUpdate: function () {
                this.text = new Date().toISOString().split('T')[1].split('.')[0];
                this.draw();
            }, context: game.context
        }));
        game.ui_keyhelper = new Infocell({
            x: 340,
            y: 10,
            text: '-',
            label: 'Key Code', context: game.context
        });
        game.ui.add(game.ui_keyhelper);
        let ui_c = new Infocell({
            x: 450,
            y: 10,
            text: '-',
            label: 'Tile Index',
            onUpdate: function () {
                this.text = game.c;
                this.draw();
            }, context: game.context
        });
        game.ui.add(ui_c);
        game.ui.add(new Button({
            x: 230,
            y: 10,
            text: 'respawn',
            onClick: function () {
                game.socket.emit('spawn');
            }, context: game.context
        }));

        game.keys = {
            w: 0,
            a: 0,
            s: 0,
            d: 0,
            _: 0,
            mx: 0,
            my: 0,
            xx: 0,
            xy: 0,
            m1: 0,
            m2: 0,
            m3: 0,
            m4: 0
        };
        game.c_img = {loaded: false};

        game.pick_box = false;
        game.bot_creator = false;

        let w = 1;
        for (w = 1; w < 12; w++) {
            game['p3_walk0' + w] = new Image();
            game['p3_walk0' + w].src = './assets/Player/p3_walk/PNG/p3_walk0' + w + '.png';
        }
        for (w = 1; w < 12; w++) {
            game['lp3_walk0' + w] = new Image();
            game['lp3_walk0' + w].src = './assets/Player/p3_walk/PNG/l/p3_walk0' + w + '.png';
        }

        for (w = 1; w < 3; w++) {
            game['bot_image' + w] = new Image();
            game['bot_image' + w].src = './assets/Enemies/flyFly'+w+'r.png';
            game['bot_image' + w].onload = function () {
                this.loaded = true;
            };
        }
        for (w = 1; w < 3; w++) {
            game['lbot_image' + w] = new Image();
            game['lbot_image' + w].src = './assets/Enemies/flyFly'+w+'.png';
            game['lbot_image' + w].onload = function () {
                this.loaded = true;
            };
        }

        game.context.font = "13px Arial";

        game.bg_image = new Image();
        game.bg_image.src = './assets/bg2.png';
        game.bg_image.onload = function () {
            game.bg_image.loaded = true;
        };
        game.bg_image3 = new Image();
        game.bg_image3.src = './assets/bg3.png';
        game.bg_image3.onload = function () {
            game.bg_image3.loaded = true;
        };

        game.box_tiles = [];
        game.c = 0;
        for (let i = 1; i <= 162; i++) {
            let img = new Image;
            img.src = './assets/boxes/box (' + i + ').png';
            img.onload = function () {
                img.loaded = true;
                game.c_img = game.box_tiles[game.c]
            };
            game.box_tiles.push(img);
        }

        game.hollow = false;
        game.hmodef = false;
        game.boxer = false;
        game.me = null;

        game.socket = io(game.addr);

        game.socket.on('connect', function () {
            game.socket.emit('msg', 'privet ja tut!!!!!');
        });

        game.socket.on('data', function (res) {
            game.data = res;

            let notfound;

            notfound = [];//todo
            game.players.forEach(function (existing) {
                let found = false;
                game.data.players.map(function (player) {
                    if (existing.id === player.id) {
                        found = true;
                    }
                });
                if (!found) {
                    notfound.push(existing.id);
                }
            });
            notfound.map(function (id) {
                game.players.delete(id);
            });
            game.data.players.map(function (player) {
                let existing = game.players.get(player.id);
                if (existing) {
                    existing.x = player.x;
                    existing.y = player.y;
                    existing.grounded = player.grounded;
                    existing.jumping = player.jumping;
                    existing.score = player.score;
                    existing.online = player.online;
                    existing.velX = player.velX;
                    existing.velY = player.velY;
                } else {
                    player.game = game;
                    game.players.set(player.id, new Player(player));
                }
            });

            notfound = [];
            game.bots.forEach(function (existing) {
                let found = false;
                game.data.bots.map(function (bot) {
                    if (existing.id === bot.id) {
                        found = true;
                    }
                });
                if (!found) {
                    notfound.push(existing.id);
                }
            });
            notfound.map(function (id) {
                game.bots.delete(id);
            });
            game.data.bots.map(function (bot) {
                let existing = game.bots.get(bot.id);
                if (existing) {
                    existing.x = bot.x;
                    existing.y = bot.y;
                    existing.dirleft = bot.dirleft;
                    existing.grounded = bot.grounded;
                    existing.alive = bot.alive;
                    existing.jumping = bot.jumping;
                    existing.velX = bot.velX;
                    existing.velY = bot.velY;
                } else {
                    bot.game = game;
                    game.bots.set(bot.id, new Bot(bot));
                }
            });
        });

        game.socket.on('msg', function (res) {
            let id = new Date().getTime();
            game.msgs.set(id, new Message({id: id, text: res}))
        });

        document.addEventListener('mousemove', function (event) {
            game.keys.xx = event.clientX;
            game.keys.xy = event.clientY;
            game.ui.items.map(function (item) {
                item.hover = game.ui.isMouseOver(item, game.keys.xx, game.keys.xy);
                if (item.items) {//todo for buttongroup and its weird
                    item.items.map(function (item) {
                        item.hover = game.ui.isMouseOver(item, game.keys.xx, game.keys.xy);
                    });
                }
            });
        });

        document.addEventListener('mousedown', function (event) {
            let prevent = false;
            game.ui.items.map(function (item) {
                if (game.ui.isMouseOver(item, game.keys.xx, game.keys.xy)) {
                    if (item.onClick) item.onClick();
                    prevent = true;
                }
                if (item.items) {//todo for buttongroup and its weird
                    item.items.map(function (item) {
                        if (game.ui.isMouseOver(item, game.keys.xx, game.keys.xy)) {
                            if (item.onClick) item.onClick();
                            prevent = true;
                        }
                    });
                }
            });

            if (prevent) return;

            game.keys['m' + (event.button + 1)] = 1;

            if (game.pick_box) {
                if (event.button === 0) {
                    game.socket.emit('pick_box', {}, function (res) {
                        game.c = res;
                        game.c_img = game.box_tiles[game.c];
                    });
                }
                return;
            }
            if (game.boxer) {
                if (event.button === 0) {
                    game.socket.emit('box', {
                        name: game.c,
                        hollow: game.hollow//todo depth (front of player)
                    });
                }
                return;
            }

            if (game.bot_creator) {
                if (event.button === 0) {
                    game.socket.emit('bot', {
                        name: new Date().getTime()
                    });
                }
            }

        });

        document.addEventListener('mouseup', function (event) {
            game.keys['m' + (event.button + 1)] = 0;
        });

        document.addEventListener('keydown', function (event) {
            game.ui_keyhelper.setValue(event.keyCode);
            if (event.repeat) {
                return;
            }
            if (event.keyCode === 38 || event.keyCode === 87) {
                game.keys.w = 1;
            }
            if (event.keyCode === 37 || event.keyCode === 65) {
                game.keys.a = 1;
            }
            if (event.keyCode === 39 || event.keyCode === 68) {
                game.keys.d = 1;
            }
            if (event.keyCode === 40) {
                game.keys.s = 1;
            }
        }, true);

        document.addEventListener('keyup', function (event) {
            if (event.repeat) {
                return;
            }
            if (event.keyCode === 13) {
                game.socket.emit('msg', prompt('CHAT'));
            }
            if (event.keyCode === 113) {
                game.socket.emit('msg', 'vot kak tiper menja zovut');
                game.socket.emit('name', prompt('NAME'));
            }
            if (event.keyCode === 38 || event.keyCode === 87) {
                game.keys.w = 0;
            }
            if (event.keyCode === 37 || event.keyCode === 65) {
                game.keys.a = 0;
            }
            if (event.keyCode === 39 || event.keyCode === 68) {
                game.keys.d = 0;
            }
            if (event.keyCode === 40) {
                game.keys.s = 0;
            }
        }, true);

    }

    update() {
        let game = this;

        game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);

        if (game.bg_image3.loaded) {
            //game.context.drawImage(game.bg_image3, 0, 0, 4000, 2000);
        }
        if (game.bg_image.loaded && game.me) {
           game.context.drawImage(game.bg_image, Math.round(0 - (game.me.velY > 10 ? game.me.velX * 10 : 0) - 1020),  Math.round(0 - (game.me.velY < 10 ? game.me.velY : 4) * 4 - 100), 4800, 1900);
        }

        game.context.save();

        game.data.players.forEach(function (player) {
            if (game.socket.id === player.id) {
                game.me = player;
            }
        });

        if (game.me) {
            game.context.translate(-(game.me.x - game.canvas.width / 2), -(game.me.y - game.canvas.height / 2));
        }

        let score_rows = [];

        let playerlist = [];

        game.players.forEach(function (player) {
            player.update();
            player.draw();
            playerlist.push({name:player.name,time:player.online,score:player.score})
        });

        game.ui_playerlist.setData(playerlist);
        game.ui_scoreboard.setData(score_rows);//todo?

        game.data.boxes.forEach(function (box) {
            if (game.box_tiles[box.name] && game.box_tiles[box.name].loaded) {
                game.context.drawImage(game.box_tiles[box.name], Math.round(box.x), Math.round(box.y));
            }
        });

        game.bots.forEach(function (bot) {
            bot.update();
            bot.draw();
        });

        if (game.keys.m1) {
            game.context.fillStyle = 'blue';
        }
        if (game.keys.m2) {
            game.context.fillStyle = 'red';
        }
        if (game.keys.m3) {
            game.context.fillStyle = 'pink';
        }

        if (game.c_img.loaded && game.me && game.boxer) {
            game.context.save();
            game.context.globalAlpha = 0.5;
            game.context.drawImage(game.c_img, game.me.px, game.me.py);
            game.context.restore();
        }


        if (game.me) {
            game.keys.mx = game.keys.xx - game.canvas.width / 2 + game.me.x;
            game.keys.my = game.keys.xy - game.canvas.height / 2 + game.me.y;
        }

        game.context.restore();
        game.ui.update();
        game.ui.draw();

        if (game.online_text) {
            game.online_text.setValue(game.data.players.length);
        }

        game.context.font = "10px Consolas";
        game.context.fillStyle = 'red';
        game.context.textAlign = 'left';
        let msg_y = 400;
        let aaa = [];
        game.msgs.forEach(function (msg) {
            aaa.push(msg);
        });
        aaa.reverse();
        aaa.forEach(function (msg, i) {
            msg.update();
            if (i > 9) {
                return false;
            }
            game.context.fillText(msg.created.toISOString().split('T')[1].split('.')[0] + '] ' + msg.text, 30, msg_y);
            msg_y += 15;
        });

        if (game.me) {
            let a = 13;
            game.context.fillStyle = 'steelblue';
            game.context.fillRect(game.keys.xx, game.keys.xy, a, 1);
            game.context.fillRect(game.keys.xx, game.keys.xy, 1, a);
            game.context.fillRect(game.keys.xx - a, game.keys.xy, a, 1);
            game.context.fillRect(game.keys.xx, game.keys.xy - a, 1, a);
        }

        game.socket.emit('keys', game.keys);

        game.draw();

        requestAnimationFrame(function () {
            game.update();
        });
    }

    draw() {
        //todo
    }

}

export default Game;
