var physicsConfig = {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
    }
}

var phaserConfig = {
    type: Phaser.AUTO,
    width: document.getElementById('gameDiv').clientWidth,
    height: document.getElementById('gameDiv').clientHeight,
    parent: "gameDiv",
    physics: physicsConfig,
    scene: [
        MenuScene,
        GameScene
    ]
};

const game = new Phaser.Game(phaserConfig);
game.scene.start('menuScene');﻿﻿
