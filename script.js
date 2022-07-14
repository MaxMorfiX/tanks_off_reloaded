const SEP = '_';
var playerSpeed = 3;
var bulletSpeed = playerSpeed * 3;
var field = $('#field');
var playerSize = $('.player').innerWidth();
var bulletSize = $('.bullet').innerWidth();
var playPlayers = 3;

$('#divForBulletSize').remove();

var timeBetweenBullets = 500;
var gamespeed = 15;
var buttons = {};
var bullets = {0: {isAlive: false}};
var players = {
    1: {x: 0, y: 0, ang: 0, lastFire: timeBetweenBullets, lives: 10, score: 0},
    2: {x: 0, y: 0, ang: 180, lastFire: timeBetweenBullets, lives: 10, score: 0},
    3: {x: 0, y: 0, ang: 0, lastFire: timeBetweenBullets, lives: 10, score: 0},
    4: {x: 0, y: 0, ang: 180, lastFire: timeBetweenBullets, lives: 10, score: 0}
};

document.addEventListener('keydown', KeyDown);
document.addEventListener('keyup', KeyUp);

function KeyDown(e) {
    buttons[e.which] = true;
}
function KeyUp(e) {
    if (buttons[e.which]) {
        buttons[e.which] = false;
    }
}

start();

function start() {
    fitToSize();
    cycle();
}

function cycle() {

    hitboxCheck();

    moveBullets();

    checkButtons();

    setTimeout(cycle, gamespeed);
}

function moveBullets() {
    for (i = 0; i < Object.keys(bullets).length; i++) {
        if (!bullets[i].isAlive) {
            continue;
        }
        var ret = $('#bull' + i).moveByVec(bullets[i].ang, bulletSpeed);
        bullets[i]['x'] = ret.finX;
        bullets[i]['y'] = ret.finY;
    }
}

function hitboxCheck() {
    for (j = 1; j <= playPlayers; j++) {

        var player = players[j];

        for (i = 0; i < Object.keys(bullets).length; i++) {

            var bullet = bullets[i];

            if (!bullet.isAlive) {
                continue;
            }

            if (bullet.player === j) {
                continue;
            }

            if (checkOnePlayerCol(player, bullet)) {
                player.lives -= 1;
                players[bullet.player].score += 1;

                console.log(bullet.player + '`s player bullet hit in ' + j + ' player');

                bullet.isAlive = false;

                $('#bull' + i).remove();
            }
        }
    }
}

function checkOnePlayerCol(player, bullet) {
    var pL = player.x;
    var pB = player.y;
    var pR = pL + playerSize;
    var pT = pB + playerSize;

    var bL = bullet.x;
    var bB = bullet.y;
    var bR = bL + bulletSize;
    var bT = bB + bulletSize;

    if (bL < pR) {
        if (bR > pL) {
            if (bB < pT) {
                if (bT > pB) {
                    return true;
                }
            }
        }
    }
}

function checkButtons() {

    checkRotButtons();
    checkMoveButtons();
    checkFire();

    function checkRotButtons() {
        if (buttons[37]) {
            players[1]['ang'] = players[1].ang - 3;
            $('#p1').rotate(players[1].ang);
        }
        if (buttons[39]) {
            players[1]['ang'] = players[1].ang + 3;
            $('#p1').rotate(players[1].ang);
        }
        if (buttons[65]) {
            players[2]['ang'] = players[2].ang - 3;
            $('#p2').rotate(players[2].ang);
        }
        if (buttons[68]) {
            players[2]['ang'] = players[2].ang + 3;
            $('#p2').rotate(players[2].ang);
        }
        if (buttons[97]) {
            players[4]['ang'] = players[4].ang - 3;
            $('#p4').rotate(players[4].ang);
        }
        if (buttons[99]) {
            players[4]['ang'] = players[4].ang + 3;
            $('#p4').rotate(players[4].ang);
        }
        if (buttons[74]) {
            players[3]['ang'] = players[3].ang - 3;
            $('#p3').rotate(players[3].ang);
        }
        if (buttons[76]) {
            players[3]['ang'] = players[3].ang + 3;
            $('#p3').rotate(players[3].ang);
        }
    }

    function checkMoveButtons() {
        if (buttons[40]) {
            var ret = $('#p1').moveByVec(players[1].ang + 180, playerSpeed);
            players[1]['x'] = ret.finX;
            players[1]['y'] = ret.finY;
        }
        if (buttons[38]) {
            var ret = $('#p1').moveByVec(players[1].ang, playerSpeed);
            players[1]['x'] = ret.finX;
            players[1]['y'] = ret.finY;
        }
        if (buttons[83]) {
            var ret = $('#p2').moveByVec(players[2].ang + 180, playerSpeed);
            players[2]['x'] = ret.finX;
            players[2]['y'] = ret.finY;
        }
        if (buttons[87]) {
            var ret = $('#p2').moveByVec(players[2].ang, playerSpeed);
            players[2]['x'] = ret.finX;
            players[2]['y'] = ret.finY;
        }
        if (buttons[98]) {
            var ret = $('#p4').moveByVec(players[4].ang + 180, playerSpeed);
            players[4]['x'] = ret.finX;
            players[4]['y'] = ret.finY;
        }
        if (buttons[101]) {
            var ret = $('#p4').moveByVec(players[4].ang, playerSpeed);
            players[4]['x'] = ret.finX;
            players[4]['y'] = ret.finY;
        }
        if (buttons[75]) {
            var ret = $('#p3').moveByVec(players[3].ang + 180, playerSpeed);
            players[3]['x'] = ret.finX;
            players[3]['y'] = ret.finY;
        }
        if (buttons[73]) {
            var ret = $('#p3').moveByVec(players[3].ang, playerSpeed);
            players[3]['x'] = ret.finX;
            players[3]['y'] = ret.finY;
        }
    }

    function checkFire() {

        for (i = 1; i <= 4; i++) {
            players[i]['lastFire'] += gamespeed;
        }

        if (buttons[191]) {
            if (players[1].lastFire >= timeBetweenBullets) {
                players[1].lastFire = 0;
                fire(1);
            }
        }
        if (buttons[49]) {
            if (players[2].lastFire >= timeBetweenBullets) {
                players[2].lastFire = 0;
                fire(2);
            }
        }
        if (buttons[32]) {
            if (players[3].lastFire >= timeBetweenBullets) {
                players[3].lastFire = 0;
                fire(3);
            }
        }
        if (buttons[13]) {
            if (players[4].lastFire >= timeBetweenBullets) {
                players[4].lastFire = 0;
                fire(4);
            }
        }
    }
}

function fire(player) {

    var bullNum = 0;

    for (i = 0; i >= 0; i++) {
        if (!bullets[i].isAlive) {
            bullNum = i;
            bullets[Object.keys(bullets).length] = {isAlive: false};
            break;
        }
    }

    create('bullet', players[player].x + playerSize / 2 - bulletSize / 2, players[player].y + playerSize / 2 - bulletSize / 2, bullNum);
    bullets[bullNum].ang = players[player].ang;
    bullets[bullNum].player = player;
    bullets[bullNum].isAlive = true;

    $('#bull' + (bullNum)).moveByVec(players[player].ang, playerSize * 0.45);
}

function create(type, x, y, bullNum) {
    if (type === 'bullet') {
        bullets[bullNum] = {x: x, y: y};
        var html = `<div id='bull${bullNum}' class='bullet' style='left: ${x}px; bottom: ${y}px'></div>`;
    }
    field.append(html);
}

function fitToSize() {

    var x = window.innerWidth - 30;
    var y = window.innerHeight - 30;

    field.height(y);
    field.width(x);

    fitToSizeJQbottom();

    $('#p2').x(x - playerSize);
    $('#p4').x(x - playerSize);
    $('#p3').y(0);
    $('#p4').y(0);

    for (i = 1; i <= 4; i++) {
        players[i].x = $('#p' + i).x();
        players[i].y = $('#p' + i).y();
    }
}