const gameloop = require('node-gameloop');
const express = require('express');

let path = require('path');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let fs = require('fs');

import Player from './Player'
import Box from './Box'
import Bot from './Bot'
import Utils from './Utils'
import LevelList from './LevelList'
import Level from './Level'

const PORT = 9009;
const FPS = 60;

console.log('PORT', PORT, 'FPS', FPS);

/* TODO
let levels = new LevelList();
let level = new Level({name:'huj'});
levels.addItem(level);
let box_id = level.boxes.addItem(new Box({name:'1'}));
level.boxes.getItem(box_id).name = '2';
console.log(level.boxes);
console.log(level.save());

 */

let players = new Map();
let boxes = new Map();
let bots = new Map();

let boxes_count = 0;
let bots_count = 0;

let saved_boxes = require('./data/boxes.json');
saved_boxes.boxes.forEach(function (box: Box) {
    let id = boxes_count++;
    box.id = id;
    boxes.set(id, new Box(box));
});

let saved_bots = require('./data/bots.json');
saved_bots.bots.forEach(function (bot: Bot) {
    let id = bots_count++;
    bot.id = id;
    bots.set(id, new Bot(bot));
});

function load_scores(cb?) {
    return {scores:[]};
    let fs = require('fs');
    fs.readFile('./dist/data/scores.json', 'utf8', function (err, data) {
        if (err) throw err;
        let scoreboard = JSON.parse(data);
        players.forEach(function (player) {
            player.score = 0;
        });
        scoreboard.scores.forEach(function (score) {
            players.forEach(function (player) {
                if (player.name === score.name) {
                    player.score = score.score;
                }
            });
        });
        if (cb) {
            cb(scoreboard);
        }
    });

}

load_scores();

function save_boxes(callback:Function) {
    let b = [];
    boxes.forEach(function (box) {
        b.push(box);
    });
    fs.writeFile(path.join(__dirname, 'data/boxes.json'), JSON.stringify({boxes: b}), callback);
}

function save_bots(callback:Function) {
    let b = [];
    bots.forEach(function (bot) {
        bot.sx = bot.x;
        bot.sy = bot.y;
        b.push(bot);
    });
    fs.writeFile(path.join(__dirname, 'data/bots.json'), JSON.stringify({bots: b}), callback);
}

function save_scores(callback?:Function) {
    callback({scores: []});
    fs.readFile('./dist/data/scores.json', 'utf8', function (err, data) {
        if (err) throw err;

        let scoreboard = JSON.parse(data);
        let scores = [];
        console.log(scoreboard.scores);
        scoreboard.scores.forEach(function (score) {
            players.forEach(function (player) {
                let item = {name: score.name, score: score.score};
                if (score.name === player.name) {
                    if (player.score < score.score) {
                        item.score = player.score;
                    }
                }
                scores.push(item);
            });
        });
        players.forEach(function (player) {
            let found = false;
            scores.forEach(function (score) {
                if (score.name === player.name) {
                    found = true;
                }
            });
            if (!found) {
                scores.push({name: player.name, score: player.score});
            }
        });
        fs.writeFile(path.join(__dirname, 'data/scores.json'), JSON.stringify({scores: scores}), function () {
            if (callback) {
                callback({scores: scores});
            }
        });
    });


}

io.on('connection', function (socket) {
    console.log('a user connected', socket.id);

    let player = new Player({name: socket.id.substr(0, 7), socket: socket});

    player.on('dead', function (overhit) {
        console.log('overhit', overhit);
        player.spawn();
    });

    load_scores();

    players.set(socket.id, player);

    socket.on('msg', function (res) {
        console.log('[MSG] ' + socket.id + ': ', res);
        socket.broadcast.emit('msg', player.name + ': ' + res);
        socket.emit('msg', player.name + ': ' + res);
    });

    socket.on('name', function (res) {
        console.log('[name]', res);
        player.name = res;
        load_scores();
    });

    socket.on('box', function (box) {
        console.log('[box]', box);

        function boxPoint(x1, y1, w1, h1, x2, y2) {
            return x2 >= x1 && x2 <= x1 + w1 && y2 >= y1 && y2 <= y1 + h1
        }

        let deleted = false;
        boxes.forEach(function (box) {
            //  console.log(box);
            let col = boxPoint(box.x, box.y, box.width, box.height, player.keys.mx, player.keys.my);
            if (col) {
                boxes.delete(box.id);
                console.log('deleted box', box);
                deleted = true;
            }
        });
        if (deleted) {
            return;
        }
        let id = boxes_count++;
        boxes.set(id, new Box({
            id: id,
            name: box.name,
            x: player.px,
            y: player.py,
            height: 70,
            width: 70,
            hollow: box.hollow
        }));

        save_boxes(function (err) {
            console.log('boxes saved' + err);
        });
    });

    socket.on('pick_box', function (req, cb) {
        console.log('[pick_box]', req);

        function boxPoint(x1, y1, w1, h1, x2, y2) {
            return x2 >= x1 && x2 <= x1 + w1 && y2 >= y1 && y2 <= y1 + h1
        }

        let found;
        boxes.forEach(function (box) {
            let col = boxPoint(box.x, box.y, box.width, box.height, player.keys.mx, player.keys.my);
            if (col) {
                found = box;
            }
        });
        if (found) {
            cb(found.name);
        }

    });
    socket.on('bot', function (bot) {
        console.log('[bot]', bot);

        function botPoint(x1, y1, w1, h1, x2, y2) {
            return x2 >= x1 && x2 <= x1 + w1 && y2 >= y1 && y2 <= y1 + h1
        }

        let deleted = false;
        bots.forEach(function (bot) {
            let col = botPoint(bot.x, bot.y, bot.width, bot.height, player.keys.mx, player.keys.my);
            if (col) {
                bots.delete(bot.id);
                console.log('deleted bot', bot);
                deleted = true;
            }
        });
        if (deleted) {
            return;
        }
        let id = bots_count++;
        bots.set(id, new Bot({
            id: id,
            name: bot.name,
            x: player.keys.mx,
            y: player.keys.my,
            sx: player.keys.mx,
            sy: player.keys.my,
            height: 36,
            width: 72
        }));

        save_bots(function (err) {
            console.log('bots saved' + err);
        });

    });

    socket.on('disconnect', function () {
        players.delete(socket.id);
    });
});
http.listen(PORT, '0.0.0.0', function () {
    console.log('http://127.0.0.1:' + PORT);

    gameloop.setGameLoop(function () {
        update();
    }, 1000 / FPS);
});

function update() {

    let p = [];
    let b = [];
    let s = [];
    let me;
    players.forEach(function (player) {
        p.push({
            id: player.id,
            name: player.name,
            x: player.x,
            y: player.y,
            score: player.score,
            mx: player.keys.mx,
            online: new Date().getTime() - player.spawnedAt.getTime(),
            my: player.keys.my,
            px: player.px,
            py: player.py,
            grounded: player.grounded,
            jumping: player.jumping,
            velX: player.velX,
            velY: player.velY,
            width: player.width,
            height: player.height
        });

        player.px = Utils.snapToGrid(player.keys.mx, 70) - 35;
        player.py = Utils.snapToGrid(player.keys.my, 70) - 35;

        me = p;
    });
    players.forEach(function (player) {
        player.b = [];
    });
    boxes.forEach(function (box) {

        //TODO show nearby tiles:
        function dist(x1, y1, x2, y2) {
            function diff(num1, num2) {
                if (num1 > num2) {
                    return (num1 - num2);
                } else {
                    return (num2 - num1);
                }
            }
            let deltaX = diff(x1, x2);
            let deltaY = diff(y1, y2);
            let dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
            return (dist);
        }
         players.forEach(function (player) {
              if (dist(box.x, box.y, player.x, player.y) < 600) {
                  player.b.push({id: box.id, name: box.name, x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height)});
            }
        });
    });
    bots.forEach(function (bot) {
        s.push({
            id: bot.id, name: bot.name, x: bot.x, y: bot.y,
            dirleft: bot.dirleft,
            alive: bot.alive,
            grounded: bot.grounded,
            velY: bot.velY, width: bot.width, height: bot.height
        });
    });
    let data = {
        players: p,
        boxes: b,
        bots: s
    };

    bots.forEach(function (bot) {
        bot.update();
        bot.grounded = false;
        boxes.forEach(function (box) {
            if (!box.hollow && bot.alive) {
                let dir = Utils.colCheck(bot, box);
                if (dir === "l" || dir === "r") {
                    bot.velX = 0;
                    bot.jumping = false;
                } else if (dir === "b") {
                    bot.grounded = true;
                    bot.jumping = false;
                    bot.velX = bot.maxSpeed;
                } else if (dir === "t") {
                    bot.velY *= -1;
                    bot.velX = bot.maxSpeed;
                } else {
                    bot.velX = bot.maxSpeed;
                }
            }
        });
    });

    players.forEach(function (player) {
        player.grounded = false;
        //player.ladder = false;
        boxes.forEach(function (box) {
            if (box.name == 116) {//if finished
                let dir = Utils.colCheck(player, box, true);
                if (dir) {
                    let score = new Date().getTime() - player.spawnedAt.getTime() + player.score;
                    if (player.score <= 0 || player.score > score) {
                        player.score = score;
                        // save_scores(function () {
                        //     console.log('scores saved');
                        //     load_scores(function (res) {
                        //         console.log('scores load_scores', res);
                        //
                        //     });
                        // })
                    } else {
                        // load_scores();
                    }
                }
            }
            if (box.name == 84 && player.alive) {//if lava
                let dir = Utils.colCheck(player, box, true);
                if (dir) {
                    player.spawn();
                    //return;//todo
                    // player.alive = false;
                    // setTimeout(function () {
                    //     if (player.alive) {
                    //         player.spawn();
                    //     }
                    // }, 2000);
                }
            }
            // if (box.name == 91) {//todo ladder
            // var dir = Utils.colCheck(player, box);
            //   if (dir) {
            // player.ladder = true;
            // player.velX = 2;
            //  player.velY = 2;
            // }
            //return false;
            //   }
            if (!box.hollow) {
                let dir = Utils.colCheck(player, box);
                if (dir === "l" || dir === "r") {
                    player.velX = 0;
                    player.jumping = false;
                } else if (dir === "b") {
                    player.grounded = true;
                    player.jumping = false;
                } else if (dir === "t") {
                    player.velY = 0;
                    if (box.name == 0) {
                        boxes.delete(box.id);//todo also respawn cooldown?
                    }
                }
            }
        });
        bots.forEach(function (bot) {
            if (!bot.alive) return false;
            let dir = Utils.colCheck(player, bot);
            if (dir === "l" || dir === "r") {
                player.velX = 0;
                player.jumping = false;
                // console.log('kick!')
            } else if (dir === "b") {
                player.grounded = true;
                player.jumping = false;
                bot.y += 26;
                // console.log('fKILL HIM');
                bot.killedAt = new Date().getTime();
                bot.alive = false;
                player.score -= 1000;
            } else if (dir === "t") {
                //player.velY *= -1;
                //   console.log('from bottom?')

                player.spawn();
            }
        });

        player.update();
        data.boxes = player.b;
        player.socket.emit('data', data);
    });
}


/*
player.hit(50);
player.keys.w = true;
console.log(player.update().getPosition());
player.hit(30);
player.keys.w = false;
player.keys.d = true;
console.log(player.update().getPosition());
player.hit(50);
player.hit(50);
player.keys.d = false;
player.keys.a = true;
player.rename('petja');
console.log(player.update().getPosition());
player.keys.a = false;
console.log(player.update().getPosition());
player.hit(530);
player.keys.a = true;
console.log(player.update().getPosition());
player.keys.a = false;
console.log(player.update().getPosition());

*/
