var physicsConfig = {
    default: 'arcade',
    arcade: {
        debug: true
    }
}

var phaserConfig={
	type: Phaser.AUTO,
	width: 800,
	hieght: 600,
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
var bullets,bullet;
var game = new Phaser.Game(phaserConfig);
var bulletTime=0;
function preload(){
	//console.log("calling Preload");
	this.load.image('player','assets/player.png');
	this.load.image('spaceBG','assets/spaceBG.jpg');
	this.load.image('bullet','assets/bullet.png');
}
	
function create(){
	 var Bull = new Phaser.Class({

			Extends: Phaser.GameObjects.Image,
			initialize:function Bullet (scene)
			{
				Phaser.GameObjects.Image.call(this, scene, player.x, player.y-80, 'bullet');
				this.debugShowBody=false;
				this.scale=0.07;
				this.debugShowVelocity=false;
				
			},
			fire: function (x,y)
			{
			 this.setPosition(x, y - 50);
				this.setActive(true);
				this.setVisible(true);
			},
			update: function (time, delta)
			{
				this.y -= 15;// * delta;
				//console.log(this.y);
				if (this.y < 00)
				{
					this.setActive(false);
					this.setVisible(false);
				}
			}

		});
	scoreText=this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
	//console.log("calling Create");
	spacebg=this.add.tileSprite(0,0,this.sys.canvas.width*2,this.sys.canvas.height*2,'spaceBG');
	player=this.makePlayer(this.sys.canvas.width/2,this.sys.canvas.height-10);
	player.setScale(.05);
	//this.physics.enable(player,Phaser.Physics.ARCADE);
	//console.log(spacebg._tilePosition);
	bv=-0.7;
	fireButton=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
	leftKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
	rightKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
	//bullets=this.physics.add.group({maxSize:5});
	//bullets.enableBody=true;
	//console.log(bullets);
	 bullets = this.add.group({
        classType: Bull,
        maxSize: 10,
        runChildUpdate: true
    });
	bullets.setOrigin(0.5,1);

	
}
	
function update(){   
	spacebg._tilePosition.y +=bv;
	if(rightKey.isDown && player.x < this.sys.canvas.width - player.displayWidth* player.originX){
		player.x+=player.props.speed;
	}else if(leftKey.isDown && player.x >0+player.displayWidth*player.originX){
		player.x-=player.props.speed;
	}
	if(this.input.activePointer.isDown){
		player.x=this.input.activePointer.x;
		if(this.time.now>bulletTime){
			bullet=bullets.get();
			if(bullet){
				player.props.score++;
				scoreText.setText('Score: ' + score);
				bullet.fire(player.x,player.y);
			}//bullet=bullets.getFirst(false,true, player.x, player.y-80,'bullet',0, false);
			//bullet.scale=0.071;
			
			//bullet.visible=true;
			
		
			//console.log(bullet);

			bulletTime=this.time.now+150;
		}
	}
}

function makePlayer(x,y){
	//console.log("making player"+ x+" "+y);
	var player = this.add.image(x,y,"player").setOrigin(0.5,1);
	player.props={};
	player.props.speed=10;
	player.props.score=0;
	return player;
}