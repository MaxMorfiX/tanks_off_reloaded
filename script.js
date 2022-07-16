const SEP = '_';
var playerSpeed = 3;
var bulletSpeed = playerSpeed * 3;
var field = $('#field');
var panel = $('#panel');
var fieldHeight = field.height();
var fieldWidth = field.width();
var playerSize = $('.player').innerWidth();
var bulletSize = $('.bullet').innerWidth();
var playPlayers = 4;
var lastBulletId = 0;
var spaceBetwSc = 1;

$('#divForBulletSize').remove();

var timeBetweenBullets = 500;
var gamespeed = 15;
var buttons = {};
var bullets = [];
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
    for (i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        var ret = $('#bull' + bullet.id).moveByVec(bullet.ang, bulletSpeed);
        bullet.x = ret.finX;
        bullet.y = ret.finY;
    }
}

function hitboxCheck() {
    bulletsPlayersColCheck();
    
    bulletsWallColCheck();
}

function bulletsPlayersColCheck() {
    for (j = 1; j <= playPlayers; j++) {

        var player = players[j];

        for (i = 0; i < bullets.length; i++) {

            var bullet = bullets[i];

            if (bullet.player === j) {
                continue;
            }

            if (checkOnePlayerCol(player, bullet)) {
                changeScore(bullet.player);
                player.lives -= 1;
                

//                console.log(bullet.player + '`s player bullet hit in ' + j + ' player');

                $('#bull' + bullet.id).remove();
                bullets.splice(i, 1);
                // yep, this works as (i < bullets.length) condition is recalculated each loop.
                // or we may just iterate backwards:
                // for (i = bullets.length-1; i >= 0; i--) {
                i--;
            }
        }
    }
}
function changeScore(playerId) {
    var player = players[playerId];
    player.score += 1;
    $('#p' + playerId + 'sc').text(player.score);
}
function bulletsWallColCheck() {
    for (i = 0; i < bullets.length; i++) {

        var bullet = bullets[i];
        
        if(bullet.x <= 0 || bullet.x >= fieldWidth - bulletSize) {
            $('#bull' + bullet.id).remove();
            bullets.splice(i, 1);
        } else if(bullet.y <= 0 || bullet.y >= fieldHeight - bulletSize) {
            $('#bull' + bullet.id).remove();
            bullets.splice(i, 1);
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
            moveOnePlayer(1, players[1].ang + 180);
        }
        if (buttons[38]) {
            moveOnePlayer(1, players[1].ang);
        }
        if (buttons[83]) {
            moveOnePlayer(2, players[2].ang + 180);
        }
        if (buttons[87]) {
            moveOnePlayer(2, players[2].ang);
        }
        if (buttons[75]) {
            moveOnePlayer(3, players[3].ang + 180);
        }
        if (buttons[73]) {
            moveOnePlayer(3, players[3].ang);
        }
        if (buttons[98]) {
            moveOnePlayer(4, players[4].ang + 180);
        }
        if (buttons[101]) {
            moveOnePlayer(4, players[4].ang);
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

    var newBullet = {};
    newBullet.ang = players[player].ang;
    newBullet.player = player;
    newBullet.id = ++lastBulletId;
    newBullet.x = players[player].x + playerSize / 2 - bulletSize / 2;
    newBullet.y = players[player].y + playerSize / 2 - bulletSize / 2;

    create('bullet', newBullet);

    bullets.push(newBullet);

    $('#bull' + (newBullet.id)).moveByVec(players[player].ang, playerSize * 0.45);
}
function moveOnePlayer(player, ang) {
    var ret = $('#p' + player).moveByVec(ang, playerSpeed, true);
    var walls = checkWallPlCol(players[player]);
    var moveX = true;
    var moveY = true;
    
    if(walls['right']) {
        if(ret.xAdd > 0) {
            moveX = false;
            if(player.x !== fieldWidth - playerSize) {
                players[player].y = fieldWidth - playerSize;
                $('#p' + player).y(players[player].x);
            }
        }
    }
    if(walls['left']) {
        if(ret.xAdd < 0) {
            moveX = false;
            if(player.x !== 0) {
                players[player].x = 0;
                $('#p' + player).x(0);
            }
        }
    }
    if(walls['bottom']) {
        if(ret.yAdd < 0) {
            moveY = false;
            if(player.y !== 0) {
                players[player].y = 0;
                $('#p' + player).y(0);
            }
        }
    }
    if(walls['top']) {
        if(ret.yAdd > 0) {
            moveY = false;
            if(player.y !== fieldHeight - playerSize) {
                players[player].y = fieldHeight - playerSize;
                $('#p' + player).y(players[player].y);
            }
        }
    }
    
    if(moveY) {
        players[player].y = ret.finY;
        $('#p' + player).y(ret.finY);
        $('#p' + player).data('y', ret.finY);
    }
    if(moveX) {
        players[player].x = ret.finX;
        $('#p' + player).x(ret.finX);
        $('#p' + player).data('x', ret.finX);
    }
}

function checkWallPlCol(player) {
    
    var walls = {left: false, right: false, top: false, bottom: false};
    
    if(player.x <= 0) {
        walls['left'] = true;
    }
    if(player.x + playerSize >= fieldWidth) {
        walls['right'] = true;
    }
    if(player.y <= 0) {
        walls['bottom'] = true;
    }
    if(player.y + playerSize>= fieldHeight) {
        walls['top'] = true;
    }
    
    return walls;
}

function create(type, newBullet) {
    if (type === 'bullet') {
        var html = `<div id='bull${newBullet.id}' class='bullet' style='left: ${newBullet.x}px; bottom: ${newBullet.y}px'></div>`;
    }
    field.append(html);
}

function fitToSize() {

    var x = window.innerWidth - 0;
    var y = window.innerHeight - 0;
    
    fieldHeight = y - panel.height();
    fieldWidth = x;
    
    field.height(fieldHeight);
    field.width(x);
    panel.width(x);
    
    fitToSizeJQbottom();

    $('#p2').x(x - playerSize);
    $('#p4').x(x - playerSize);
    $('#p3').y(0);
    $('#p4').y(0);
    
    $('#p1').data('y', fieldHeight - playerSize);
    $('#p2').data('y', fieldHeight - playerSize).data('x', fieldWidth - playerSize);
    $('#p4').data('x', fieldWidth - playerSize);
    
    $('#p3sc').x(x/2 + spaceBetwSc/2);
    $('#p2sc').x(x/2 - $('#p2sc').width() - spaceBetwSc/2);
    $('#p1sc').x($('#p2sc').x() - spaceBetwSc*2 - $('#p1sc').width());
    $('#p4sc').x($('#p3sc').x() + spaceBetwSc + $('#p3sc').width());
    
    for (i = 1; i <= 4; i++) {
        players[i].x = $('#p' + i).x();
        players[i].y = $('#p' + i).y();
    }
}