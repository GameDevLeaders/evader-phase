'use strict';

var game = new Phaser.Game(350, 650, Phaser.AUTO, 'game');

game.state.add('play', play);
game.state.add('gameOver', gameOver);
game.state.start('play');
