// This example uses the Phaser 2.2.2 framework

// Copyright © 2014 John Watson
// Licensed under the terms of the MIT License

var GameState = function(game) {
};

// Load images and sounds
GameState.prototype.preload = function() {
    game.load.spritesheet('dog', 'assets/dog.png', 47, 31, 4);
	/*game.load.tilemap('map', 'assets/grasstile4.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('grasstiles', 'assets/grassblock2_128x96_poor.png');
	game.load.image('logtiles', 'assets/log_w_grass_64x64.png');
	game.load.image('beartiles', 'assets/beartrap_grass_64x64.png');*/
	game.load.image('background', 'assets/grasstile5.png');
	game.load.image('log', 'assets/log_w_grass_64x64.png');
	game.load.image('bear', 'assets/beartrap_grass_64x64.png');
};
var obstacles, scrollPosition, background, playerSpeed, randy;//, map, layer0, layer1;
// Setup the example
GameState.prototype.create = function() {
	randy = new RandomDataGenerator();//default RNG
    // Set stage background color
    //this.game.stage.backgroundColor = 0x4488cc;
	/*map = game.add.tilemap('map');//, 32, 32);
	map.addTilesetImage('GrassBlocks', 'grasstiles', 32, 32);
	map.addTilesetImage('LogBlock', 'logtiles', 64, 64);
	map.addTilesetImage('BearBlock', 'beartiles', 64, 64);
	layer0 = map.createLayer('Layer0');
	layer1 = map.createLayer('Layer1');
	layer1.resizeWorld();*/
	scrollPosition = 0;
	background = game.add.tileSprite(0, 0, 3200, 544, 'background');
	obstacles = game.add.group();
	game.physics.enable(obstacles, Phaser.Physics.ARCADE);
	obstacles.enableBody = true;
    // Create a follower
    this.game.add.existing(
        new Follower(this.game, 47, this.game.height/2, this.game.input)
    );
	
	//console.log("Player made");
    // Simulate a pointer click/tap input at the center of the stage
    // when the example begins running.
    this.game.input.x = this.game.width/2;
    this.game.input.y = this.game.height/2;
};

// The update() method is called every frame
GameState.prototype.update = function() {
};

// Follower constructor
var Follower = function(game, x, y, target) {
    Phaser.Sprite.call(this, game, x, y, 'dog');
	this.anchor.setTo(0.5, 0.5);
	this.scale.x = -2;
	this.scale.y = 2;
    // Save the target that this Follower will follow
    // The target is any object with x and y properties
    this.target = target;

    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);

    // Enable physics on this object
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
	
    this.body.collideWorldBounds = true;
	//game.camera.follow(this);
	//game.camera.deadzone = new Phaser.Rectangle(50, 0, 950, 544);//might lock player position on screen?
    // Define constants that affect motion
    this.MAX_SPEED = 250; // pixels/second
    this.MIN_DISTANCE = 32; // pixels
};

// Followers are a type of Phaser.Sprite
Follower.prototype = Object.create(Phaser.Sprite.prototype);
Follower.prototype.constructor = Follower;

var passedobjects, ypos, xpos, rotation, self, count, itemtype;
Follower.prototype.update = function() {
    // Calculate distance to target
	//console.log("Updating");
	self = this;
    //var distance = this.game.math.distance(this.x, this.y, this.target.x, this.target.y);
	passedobjects = obstacles.filter(function(child, index, children){return child.x < self.x ? true : false;});
	passedobjects.callAll('destroy', false);
	count = obstacles.countLiving();
	if(count < 30)
	{
		for(int i = count; i < 30; i++)
		{
			ypos = randy.integerInRange(64, 544);
			xpos = randy.integerInRange(self.body.x+1050, self.body.x+2050);
			itemtype = randy.integerInRange(1, 2);
			if(itemtype === 1)
				obstacles.create(xpos, ypos, 'log');
			else
				obstacles.create(xpos, ypos, 'bear');
		}
	}
	background.tilePosition.x = scrollPosition;
    // If the distance > MIN_DISTANCE then move
    //if (distance > this.MIN_DISTANCE) {
    // Calculate the angle to the target
	rotation = self.game.math.angleBetween(self.x, self.y, self.target.x, self.target.y);
	
	// Calculate velocity vector based on rotation and this.MAX_SPEED
	//this.body.velocity.x = Math.cos(rotation) * this.MAX_SPEED;
	self.body.velocity.y = Math.sin(rotation) * self.MAX_SPEED;
	//this.body.velocity.x = 300;//constant running speed? debug value for now
	scrollPosition += self.MAX_SPEED;//adjust playerspeed (or this value for speed running)
	
	//game.camera.deadzone.setTo(game.camera.deadzone.left+playerSpeed, 0, 950, 544);//maybe keep the camera locked?
    //} else {
    //    this.body.velocity.setTo(0, 0);
    //}
};

var game = new Phaser.Game(1000, 544, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);