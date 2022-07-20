const SEP = '_';
var playerSpeed = 3;
var playerRotateSpeed = 2.5;
var bulletSpeed = playerSpeed * 3;
var field = $('#field');
var panel = $('#panel');
var fieldHeight = field.height();
var fieldWidth = field.width();
var playerSize = $('.player').innerWidth();
var bulletSize = $('.bullet').innerWidth();
$('#divForBulletSize').remove();
var playPlayers = 4;
var lastBulletId = 0;
var spaceBetwSc = 1;
var gamePlaying = false;
var gamemode = 1;
var timeBetweenBullets = 500;
var gamespeed = 15;
var buttons = {};
var bullets = [];
var players = {
    1: {x: 0, y: 0, ang: 0, lastFire: timeBetweenBullets, lives: 10, score: 0, isAlive: true},
    2: {x: 0, y: 0, ang: 180, lastFire: timeBetweenBullets, lives: 10, score: 0, isAlive: true},
    3: {x: 0, y: 0, ang: 0, lastFire: timeBetweenBullets, lives: 10, score: 0, isAlive: true},
    4: {x: 0, y: 0, ang: 180, lastFire: timeBetweenBullets, lives: 10, score: 0, isAlive: true}
};
var target = 10;
var timer = 10.00;
var addTime = false;
var gameEnded = false;

document.addEventListener('keydown', KeyDown);
document.addEventListener('keyup', KeyUp);

function KeyDown(e) {
    buttons[e.which] = true;
}
function KeyUp(e) {
    if (buttons[e.which]) {
        buttons[e.which] = false;
    }
    if(e.which === 27) {
        togglePause();
    }
}

start();

function start() {
    fitToSize();
    loadSettings();
//    startGame();
}

function startGame() {
    
    $('#menuField').hide();
    
    field.show();
    $('#pause, #pauseMenu').show();
    $('#panel').show();
    
    if(gamemode === 3) {
        for(i = 1; i <= 4; i++) {
            players[i].lives = target;
            $('#p' + i + 'sc').text(players[i].lives);
        }
    }
    
    for(i = 4; i > 0; i--) {
        if(playPlayers < i) {
            $('#p' + i).hide();
            $('#p' + i + 'sc').hide();
        } else {
            break;
        }
    }
    
    timer = target;
    if(gamemode === 2) {
        $('#timer').text('TIME LEFT: ' + timer);
    } else {
        $('#timer').hide();
    }
    
    fitToSizeScore();
    
    gamePlaying = true;
    cycle();
}

function togglePause() {
    
    if(gameEnded) {
        return;
    }
    
    if(gamePlaying) {
        gamePlaying = false;
        $('#blur, #restart, #menu, #resume, #settings').show();
        $('#pause').css('background', 'url("textures/resume.png"').css('background-size', '100% 100%');    
    } else {
        $('#blur, #restart, #menu, #resume, #settings').hide();
        $('#pause').css('background', 'url("textures/pause.png"').css('background-size', '100% 100%');
        gamePlaying = true;
        cycle();
    }
}
function resume() {
    gamePlaying = true;
    $('#blur').hide();
    $('#pause').css('background', 'url("textures/pause.png"').css('background-size', '100% 100%');
    $('#pause').on('click', 'pause();');
}

function cycle() {

    checkGameWin();

    hitboxCheck();

    moveBullets();

    checkButtons();
    
    if(gamePlaying) {
        setTimeout(cycle, gamespeed);
        
        timer = Math.floor((timer - gamespeed/1000)*100)/100;
        
        if(gamemode === 2) {
            if(!addTime) {
                
                $('#timer').text('TIME LEFT: ' + timer);
                
                if(timer <= 0) {
                    addTime = true;
                    field.css('filter', 'grayscale(30%)');
                }
            }
        }
    }
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
    
    if(bullets.length === 0 && addTime) {
        checkGameWin(true);
    }
}

function bulletsPlayersColCheck() {
    for (var j = 1; j <= playPlayers; j++) {
        
        var player = players[j];
        
        if(!player.isAlive || j > playPlayers) {
            continue;
        }

        for (var i = 0; i < bullets.length; i++) {

            var bullet = bullets[i];

            if (bullet.player === j) {
                continue;
            }

            if (checkOnePlayerCol(player, bullet)) {
                player.lives -= 1;
                
                if(gamemode === 3) {
                    $('#p' + j + 'sc').text(player.lives);
                    if(player.lives < 1) {
                        player.isAlive = false;
                        $('#p' + j).opacity(0.3);
                        checkGameWin();
                    }
                } else {
                    changeScore(bullet.player);
                }
                
                $('#bull' + bullet.id).remove();
                bullets.splice(i, 1);
                i--;
                
//              console.log(bullet.player + '`s player bullet hit in ' + j + ' player');
                
                
                // yep, this works as (i < bullets.length) condition is recalculated each loop.
                // or we may just iterate backwards:
                // for (i = bullets.length-1; i >= 0; i--) {
            }
        }
    }
}

function changeScore(playerId) {
    var player = players[playerId];
    player.score += 1;
    if(gamemode === 3) {
        return;
    } else {
        $('#p' + playerId + 'sc').text(player.score);
        if(!addTime && gamemode === 1 && player.score >= target) {
            addTime = true;
            field.css('filter', 'grayscale(30%)');
        }
    }
}
function checkGameWin(finalOperation) {
    if(gamemode === 3) {
        var aliveCount = 0;
        var thatOne = 1;
        for(var i = 1; i <= playPlayers; i++) {
            if(!players[i].isAlive) {
                continue;
            }
            thatOne = i;
            aliveCount++;
        }
        if(aliveCount === 1) {
            gameWinMenu('player ' + thatOne + ' won the game!');
        }
    } else if(finalOperation) {
        if(timer <= 0) {
            var maxSc = Math.max(players[1].score, players[2].score, players[3].score, players[4].score);
            var winPlayers = [];
            for(var i = 1; i <= playPlayers; i++) {
                if(players[i].score === maxSc) {
                    winPlayers.push(i);
                }
            }
            if(winPlayers.length === playPlayers) {
                gameWinMenu('dead heat - all players won the game!');
            } else if(winPlayers.length === 1) {
                gameWinMenu('player ' + winPlayers[0] + ' won the game!');
            } else if(winPlayers.length === 2) {
                gameWinMenu('player ' + winPlayers[0] + ' and player ' + winPlayers[1] + ' won the game!');
            } else if(winPlayers.length === 3) {
                gameWinMenu('players ' + winPlayers[0] + ', ' + winPlayers[1] + ' and ' + winPlayers[2] + ' won the game!');
            }
        }
    }
}

function gameWinMenu(text) {
    gameEnded = true;
    gamePlaying = false;
    
    field.css('filter', 'none');
    $('#field, #pause, #panel').hide();
    $('#gameWinMenu').text(text).css('text-aligin', 'center').show();
    
    log(text);
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
    
    if(gameEnded) {
        return;
    }
    
    checkRotButtons();
    checkMoveButtons();
    checkFire();

    function checkRotButtons() {
        if (buttons[37]) {
            players[1]['ang'] = players[1].ang - playerRotateSpeed;
            $('#p1').rotate(players[1].ang);
        }
        if (buttons[39]) {
            players[1]['ang'] = players[1].ang + playerRotateSpeed;
            $('#p1').rotate(players[1].ang);
        }
        
        if(playPlayers <= 1) {
            return;
        }
        
        if (buttons[65]) {
            players[2]['ang'] = players[2].ang - playerRotateSpeed;
            $('#p2').rotate(players[2].ang);
        }
        if (buttons[68]) {
            players[2]['ang'] = players[2].ang + playerRotateSpeed;
            $('#p2').rotate(players[2].ang);
        }
        
        if(playPlayers <= 2) {
            return;
        }
        
        if (buttons[74]) {
            players[3]['ang'] = players[3].ang - playerRotateSpeed;
            $('#p3').rotate(players[3].ang);
        }
        if (buttons[76]) {
            players[3]['ang'] = players[3].ang + playerRotateSpeed;
            $('#p3').rotate(players[3].ang);
        }
        
        if(playPlayers <= 3) {
            return;
        }
        
        if (buttons[97]) {
            players[4]['ang'] = players[4].ang - playerRotateSpeed;
            $('#p4').rotate(players[4].ang);
        }
        if (buttons[99]) {
            players[4]['ang'] = players[4].ang + playerRotateSpeed;
            $('#p4').rotate(players[4].ang);
        }
    }

    function checkMoveButtons() {
        if (buttons[40]) {
            moveOnePlayer(1, players[1].ang + 180);
        }
        if (buttons[38]) {
            moveOnePlayer(1, players[1].ang);
        }
        
        if(playPlayers <= 1) {
            return;
        }
        
        if (buttons[83]) {
            moveOnePlayer(2, players[2].ang + 180);
        }
        if (buttons[87]) {
            moveOnePlayer(2, players[2].ang);
        }
        
        if(playPlayers <= 2) {
            return;
        }
        
        if (buttons[75]) {
            moveOnePlayer(3, players[3].ang + 180);
        }
        if (buttons[73]) {
            moveOnePlayer(3, players[3].ang);
        }
        
        if(playPlayers <= 3) {
            return;
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
        
        if(addTime) {
            return;
        }
        
        if (buttons[191] && players[1].isAlive) {
            if (players[1].lastFire >= timeBetweenBullets) {
                players[1].lastFire = 0;
                fire(1);
            }
        }
        
        if(playPlayers <= 1) {
            return;
        }
        
        if (buttons[49] && players[2].isAlive) {
            if (players[2].lastFire >= timeBetweenBullets) {
                players[2].lastFire = 0;
                fire(2);
            }
        }
        
        if(playPlayers <= 2) {
            return;
        }
        
        if (buttons[32] && players[3].isAlive) {
            if (players[3].lastFire >= timeBetweenBullets) {
                players[3].lastFire = 0;
                fire(3);
            }
        }
        
        if(playPlayers <= 3) {
            return;
        }
        
        if (buttons[13] && players[4].isAlive) {
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

function changePlayPlayers(count) {
    playPlayers = count;
    for(var i = 1; i <= 4; i++) {
        if(i <= playPlayers) {
            $('#p' + i + 'chooser').opacity(1);
        } else {
            $('#p' + i + 'chooser').opacity(0.3);
            players[i].isAlive = false;
        }
    }
    
    saveSettings();
}

function changeGamemode(mode) {
    $('#gamemode' + gamemode).opacity(0.3);
    
    gamemode = mode;
    
    $('#gamemode' + gamemode).opacity(1);
    
    if(gamemode === 1) {
        $('#inputTarget').placeholder("at what maximum score a player'll win");
    } else if(gamemode === 2) {
        $('#inputTarget').placeholder("how much time game'll play (seconds)");
    } else if(gamemode === 3) {
        $('#inputTarget').placeholder("how many lives every player'll have");
    }
    
    saveSettings();
}
function setNewTargetNum(value) {
    if(typeof value !== 'undefined') {
        target = value;
        $('#inputTarget').val(value);
        return;
    }
    target = $('#inputTarget').val();
    
    saveSettings();
}

function saveSettings() {
   var settings = {  
       gamemode, playPlayers, target
   };
    localStorage.setItem('settings', JSON.stringify(settings));
}
function loadSettings() {
    var settings = JSON.parse(localStorage.getItem('settings'));
    changeGamemode(settings.gamemode); 
    setNewTargetNum(settings.target);
    changePlayPlayers(settings.playPlayers);
}
function fitToSize() {

    var x = window.innerWidth - 10;
    var y = window.innerHeight - 10;
    
    field.show();
    panel.show();
    $('#gameWinMenu').show();
    
    fieldHeight = y - panel.height();
    fieldWidth = x;
    
    field.height(fieldHeight);
    field.width(x);
    panel.width(x);
    
    fitToSizeJQbottom();
    
    $('#menuField').width(x).height(y);
    
    $('#gameWinMenu').width(x);
    
    $('#restart').x(x/2 - $('#restart').width()).y(y/2 - $('#restart').height());
    $('#menu').x($('#restart').x() - spaceBetwSc*5 - $('#menu').width()).y(y/2 - $('#menu').height());
    $('#resume').x($('#restart').x() + spaceBetwSc*5 + $('#restart').width()).y(y/2 - $('#menu').height());
    
    $('#blur, #pauseMenu').width(x).height(y);
    
    $('#pause').x(x - $('#pause').width() - spaceBetwSc);

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
    
    $('#gameWinMenu, #menu, #restart').hide();
    field.hide();
    panel.hide();
}
function fitToSizeScore() {
    if(playPlayers === 1) {
        $('#p1sc').x(fieldWidth/2 - $('#p1sc').width()/2);
    } else if(playPlayers === 2) {
        $('#p2sc').x(fieldWidth/2 + spaceBetwSc/2);
        $('#p1sc').x(fieldWidth/2 - $('#p1sc').width() - spaceBetwSc/2);
    } else if(playPlayers === 3) {
        $('#p2sc').x(fieldWidth/2 - $('#p2sc').width()/2);
        $('#p1sc').x($('#p2sc').x() - spaceBetwSc - $('#p1sc').width());
        $('#p3sc').x($('#p2sc').x() + spaceBetwSc + $('#p2sc').width());
    }
}