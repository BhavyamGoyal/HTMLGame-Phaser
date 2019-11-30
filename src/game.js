
var GameScene = {
    key: 'gameScene',
    init: function (data) {
        if (data != null) {
            bgY = data.bgY;
            background = data.background;
            ship = data.ship;
            shipScale = data.shipScale;
        } else {
            bgY = 0;
        }
    },

    preload: function () {  
    },

    create: function () {
        bulletTime = 0;
        spacebg = this.add.tileSprite(0, 0, this.sys.canvas.width, this.sys.canvas.height, background);
        spacebg.setOrigin(0, 0);
        spacebg.tilePositionY = bgY;
        player = this.makePlayer(this.sys.canvas.width / 2, this.sys.canvas.height - 10);
        scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '28px', fill: '#FFFFFF' });
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
        player.setScale(shipScale);
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
    },

    update: function () {
        spacebg.tilePositionY += bv;
        if (rightKey.isDown && player.x < this.sys.canvas.width - player.displayWidth * player.originX) {
            this.player.x += this.player.props.speed;
        } else if (leftKey.isDown && player.x > 0 + player.displayWidth * player.originX) {
            player.x -= player.props.speed;
        }
        if (this.input.activePointer.isDown) {
            player.x = this.input.activePointer.x;
            if (this.time.now > bulletTime) {
                bullet = bullets.get();
                if (bullet) {
                    player.props.score++;
                    scoreText.setText('Score: ' + player.props.score);
                    bullet.fire(player.x, player.y);
                }
                bulletTime = this.time.now + 130;
            }
        }
    },

    extend: {
        makePlayer: function (x, y) {
            var player = this.physics.add.image(x, y, ship).setOrigin(0.5, 1);
            player.body.allowGravity = false;
            player.props = {};
            player.props.speed = 10;
            player.props.score = 0;
            return player;
        }
    }
}
