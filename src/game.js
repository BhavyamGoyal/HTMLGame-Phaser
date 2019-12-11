var Bull = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize: function Bullet(scene) {
        Phaser.GameObjects.Image.call(this, scene, player.x, player.y - 80, 'bullet');
        //this.setScale(0.07);

    },
    fire: function(x, y) {
        this.setPosition(x, y - 85);
        this.setActive(true);
        this.setVisible(true);
        this.body.setVelocity(0, -500);
        this.body.enable = true;
    },
    update: function(time, delta) {
        if (this.y < 00) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
});
var ShowLoading = function(text) {
    let i = 0;
    setTimeout(() => {
        if (i < 95) {
            text.setText("loading...  " + i + "%");
            i++;
            ShowLoading(text);
        }
    }, 150);
}
var GameScene = {
    key: 'gameScene',
    init: function(data) {
        if (data != null) {
            bgY = data.bgY;
            background = data.background;
            ship = data.ship;
            shipScale = data.shipScale;
        } else {
            bgY = 0;
        }
    },

    preload: function() {
        loadText = this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 2, "loading...  0%", { fontSize: '40px', fill: '#FFFFFF' });
        this.load.on('progress', function(value) {
            console.log(value);
            loadText.setText("loading...  " + parseInt(value * 100) + "%");
        });
        ShowLoading();
        this.load.on('fileprogress', function(file) {
            console.log(file.src);
        });
        this.load.on('complete', function() {
            console.log('complete');
        });
        this.load.image('rock', 'assets/player2.png');
        this.load.spritesheet('boom', 'assets/explosion2.png', { frameWidth: 100, frameHeight: 100, endFrame: 81 });
        this.load.spritesheet('astroid', 'assets/astroid.png', { frameWidth: 128, frameHeight: 128, endFrame: 81 });
    },

    create: function() {
        gameOn = true;
        astroidTime = 1000;
        this.anims.create({
            key: 'astroidRotate',
            frames: this.anims.generateFrameNumbers('astroid', { start: 1, end: 31, first: 0 }),
            frameRate: 13,
            repeat: -1
        });

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('boom', { start: 0, end: 81, first: 0 }),
            frameRate: 60

        });

        this.events.on('Explode', explosionHandler, this);


        spacebg = this.add.tileSprite(0, 0, this.sys.canvas.width, this.sys.canvas.height, background);
        spacebg.setOrigin(0, 0);
        spacebg.tilePositionY = bgY;
        bv = -0.7;

        scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '28px', fill: '#FFFFFF' });
        bulletTime = 0;

        player = this.makePlayer(this.sys.canvas.width / 2, this.sys.canvas.height - 10);
        player.setSize(1000, 1000, true);
        player.setScale(shipScale);

        bullets = this.physics.add.group({
            classType: Bull,
            maxSize: 20,
            runChildUpdate: true,
            allowGravity: false,
        });
        bullets.setOrigin(0.5, 1);

        group = this.physics.add.group({
            allowGravity: false,
            runChildUpdate: true,
            defaultKey: 'astroid',
            maxSize: 100,
            runChildUpdate: true
        });
        console.log(group);

        //collisions use worl events to use benifits of pool;
        var collider = this.physics.add.collider(bullets, group, null, function(bullet, obj) {
            obj.setActive(false);
            astroidTime--;
            obj.setVisible(false);
            bullet.setActive(false);
            bullet.setVisible(false);
            bullet.body.enable = false;
            obj.body.enable = false;
            player.props.score++;
            scoreText.setText('Score: ' + player.props.score);
            this.events.emit('Explode', obj.x, obj.y);
        }, this);

        var playerCollider = this.physics.add.collider(player, group, null, (player, obj) => {

            obj.setActive(false);
            obj.setVisible(false);
            obj.body.enable = false;
            player.setActive(false);
            player.setVisible(false);
            boom = this.physics.add.sprite(player.x, player.y - 50, 'boom');
            boom.scale = 1;
            boom.anims.play('explode');
            this.physics.world.removeCollider(playerCollider);
            gameOn = false;
            setTimeout(() => { console.log(this.scene.start('menuScene')); }, 2000);

        }, this);
        //**collision

        this.time.addEvent({
            delay: astroidTime,
            loop: true,
            callback: addAstroid
        });

    },

    update: function() {
        spacebg.tilePositionY += bv;
        if (this.input.activePointer.isDown && gameOn) {
            player.x = this.input.activePointer.x;
            if (this.time.now > bulletTime) {
                bullet = bullets.get();
                if (bullet) {
                    bullet.setScale(0.07);
                    bullet.fire(player.x, player.y);
                }
                bulletTime = this.time.now + 500;
            }
        }
    },

    extend: {
        makePlayer: function(x, y) {
            var player = this.physics.add.image(x, y, ship).setOrigin(0.5, 1);
            player.body.allowGravity = false;
            player.props = {};
            player.props.speed = 10;
            player.setDebug(true, true, 0xadfefe);
            player.props.score = 0;
            return player;
        }
    }
}

var explosionHandler = function(x, y) {
    boom = this.physics.add.sprite(x, y, 'boom');
    boom.scale = .5;
    boom.anims.play('explode');
}

function addAstroid() {
    let astroid = group.get(Phaser.Math.Between(0, game.canvas.width), -20);
    if (!astroid) return; // None free
    activateAstroid(astroid);
}

function activateAstroid(astroid) {
    astroid.setActive(true)
        .setVisible(true)
        //.setTint(Phaser.Display.Color.RandomRGB().color)
        .play('astroidRotate')
        .setScale(0.5);
    astroid.body.enable = true;
    astroid.body.setVelocity(0, Phaser.Math.Between(100, 175));
    //astroid.setSize(110, 110, true);
}