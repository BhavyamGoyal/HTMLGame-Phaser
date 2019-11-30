var MenuScene = {
    key: 'menuScene',
    init: function (data) {
        if (data != null) {
            bgY = data.bgY;
        } else {
            bgY = 0;
        }
    },
    preload: function () {
        this.load.image('player', 'assets/player.png');
        this.load.image('spaceBG', 'assets/spaceBG.jpg');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('player2', 'assets/player2.png');
    },
    create: function () {
        spacebg = this.add.tileSprite(0, 0, this.sys.canvas.width, this.sys.canvas.height, 'spaceBG');
        spacebg.setOrigin(0, 0);
        spacebg.tilePositionY = bgY;
        spaceship = this.add.image(this.sys.canvas.width / 3, this.sys.canvas.height / 2, 'player');
        spaceship.scale = 0.1;
        spaceship2 = this.add.image(this.sys.canvas.width / 1.5, this.sys.canvas.height / 2, 'player2');
        spaceship2.scale = 0.1;
        menuText = this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height * .2, 'Select Your Ship', { fontSize: '40px', fill: '#FFFFFF' }).setOrigin(0.5, 0.5);
        spaceship.setInteractive()
            .on('pointerup', () => this.buttonClick('player', 'spaceBG', spacebg.tilePositionY,.1));
        spaceship2.setInteractive()
            .on('pointerup', () => this.buttonClick('player2', 'spaceBG', spacebg.tilePositionY,.1));
    },
    update: function () {
        //spacebg.tilePositionY += -0.7;
    },
    extend: {
        buttonClick: function (ship,background,bgy,scale) {
            console.log("clicked");
            this.scene.start("gameScene", {
                bgY: bgy,
                background: background,
                ship: ship,
                shipScale: scale / 2
            });
        }
    }
}

