var physicsConfig = {
	default: 'arcade',
	arcade: {
		gravity: { y: 300 },
		debug: false
	}
}


var phaserConfig = {
	type: Phaser.AUTO,
	//width: ,
	//height: ,
	parent:"gameDiv",
	physics: physicsConfig,
	scene: {
		preload: preload,
		create: create,
		update: update,
		extend: {
			makePlayer: makePlayer
		}
	}
};

var player;
var fireButton;
var leftKey;
var rightKey;
var spacebg;
var scoreText;
var bullets, bullet;
var game = new Phaser.Game(phaserConfig);
var bulletTime = 0;
function preload() {
	this.load.image('player', 'assets/player.png');
	this.load.image('spaceBG', 'assets/spaceBG.jpg');
	this.load.image('bullet', 'assets/bullet.png');
}
function create() {
	this.sys.canvas.width=document.getElementById('gameDiv').clientWidth;
	this.sys.canvas.height=document.getElementById('gameDiv').clientHeight;
	spacebg = this.add.tileSprite(this,0, 0, this.sys.canvas.width, this.sys.canvas.height, "spaceBG");
	player = this.makePlayer(this.sys.canvas.width / 2, this.sys.canvas.height - 10);
	scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '28px', fill: '#ffff' });
	var Bull = new Phaser.Class({
		Extends: Phaser.GameObjects.Image,
		initialize: function Bullet(scene) {
			Phaser.GameObjects.Image.call(this, scene, player.x, player.y - 80, 'bullet');
			this.debugShowBody = false;
			this.scale = 0.07;
			this.debugShowVelocity = false;
		},
		fire: function (x, y) {
			this.setPosition(x, y - 50);
			this.setActive(true);
			this.setVisible(true);
		},
		update: function (time, delta) {
			this.y -= 15;
			if (this.y < 00) {
				this.setActive(false);
				this.setVisible(false);
			}
		}

	});

	player.setScale(.05);
	bv = -0.7;
	leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
	rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
	bullets = this.physics.add.group({
		classType: Bull,
		maxSize: 10,
		runChildUpdate: true,
		allowGravity: false
	});
	bullets.setOrigin(0.5, 1);
}

function update() {
	spacebg._tilePosition.y += bv;
	if (rightKey.isDown && player.x < this.sys.canvas.width - player.displayWidth * player.originX) {
		player.x += player.props.speed;
	} else if (leftKey.isDown && player.x > 0 + player.displayWidth * player.originX) {
		player.x -= player.props.speed;
	}
	if (this.input.activePointer.isDown) {
		player.x = this.input.activePointer.x;
		if (this.time.now > bulletTime) {
			bullet = bullets.get();
			bullet.body.debugShowBody = true;
			if (bullet) {
				player.props.score++;
				scoreText.setText('Score: ' + player.props.score);
				bullet.fire(player.x, player.y);
			}
			bulletTime = this.time.now + 150;
		}
	}
}

function makePlayer(x, y) {
	var player = this.physics.add.image(x, y, "player").setOrigin(0.5, 1);
	player.body.allowGravity = false;
	player.props = {};
	player.props.speed = 10;
	player.props.score = 0;
	return player;
}