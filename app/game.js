var game = new Phaser.Game(350, 650, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

var map = [
  [0,0,1],
  [0,1,0],
  [0,1,1],
  [1,0,0],
  [1,0,1],
  [1,1,0]
];

var playerGroup,
  cursors,
  enemyGroup,
  enemy;

function preload() {
  game.load.image('enemy', 'assets/enemy.png');
  game.load.image('ship', 'assets/ship.png');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  enemyGroup = game.add.group();
  enemyGroup.enableBody = true;
  cursors = game.input.keyboard.createCursorKeys();
  createPlayer();
  createEnemies();
}
function createPlayer(){
    playerGroup = game.add.group();
    playerGroup.enableBody = true;
    var x = 50, y = game.height - 100,
        playerHBox = playerGroup.create(x, y, 'ship'),
        playerVBox = playerGroup.create(x, y);
    playerHBox.body.setSize(95,30,2,35);
    playerVBox.body.setSize(30,75,35,0);
    playerHBox.name = 'Wings';
    playerVBox.name = 'Body';
    
    playerHBox.body.velocity.y = 0;
    playerVBox.body.velocity.y = 0;
}
function moveLeft(){
    var players = playerGroup.children, newX = 0;
    for (var i = 0; i < players.length; i++) {
        newX = players[i].body.x - step*turbo
        if(newX >= 0){
            players[i].body.x = newX;
        }else{
            break;
        }
    }
}
function moveRight(){
    var players = playerGroup.children, newX = 0;
    for (var i = 0; i < players.length; i++) {
        newX = players[i].body.x + step*turbo
        if(newX + players[i].body.width <= game.width){
            players[i].body.x = newX;
        }else{
            break;
        }
    }
}
function updatePlayer(){
}
function updateEnemies(){
    var enemies = enemyGroup.children;
    for (var i = 0; i < enemies.length; i++) {
      enemies[i].body.velocity.y = 100 * turbo;
      if (enemies[i].body.y > game.height) {
        enemyGroup.remove(enemies[i], true, true);
      }
    }
    var lastEnemy = enemyGroup.children[enemyGroup.children.length-1];
    if (lastEnemy.body.y > lastEnemy.body.height * 2.5) {
      createEnemies();
    }
}
function checkInputs(){
    turbo = 1;
    if (cursors.up.isDown) {
        turbo = 4;
    }
    if (cursors.left.isDown) {
        moveLeft();
    } else if (cursors.right.isDown) {
        moveRight();
    }
}
function checkCollisions(){
    game.physics.arcade.overlap(playerGroup, enemyGroup, function (player, enemy,c) {
      console.log('COLLIDES with ' + player.name);
//      game.paused = true;
      enemy.destroy();
    });
}
var turbo = 1, step = 6;

function update() {
    updatePlayer();
    updateEnemies();
    checkCollisions();
    checkInputs();
}

function createEnemies() {
  var line = map[getRandom(0, map.length-1)];
  for (var i = 0; i < line.length; i++) {
    if (line[i] === 0) {
      continue;
    }

    var x = generateXForEnemy(i);
    var enemy = enemyGroup.create(x, -100, 'enemy');
    enemy.body.velocity.y = 100;
  }
}

function generateXForEnemy(index) {
  if (index === 0) {
    return 10;
  } else if (index === 1) {
    return game.width / 2 - 49;
  } else {
    return game.width - 100;
  }
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function render(){
    enemyGroup.forEachAlive(renderGroup, this);
    playerGroup.forEachAlive(renderGroup, this);
}
function renderGroup(member) {
    game.debug.body(member);
}