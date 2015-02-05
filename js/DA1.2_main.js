// This example uses the Phaser 2.2.2 framework

// Copyright � 2014 John Watson
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
	//randy = new game.RandomDataGenerator();//default RNG
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
    this.MAX_SPEED = 650; // pixels/second
	this.MIN_SPEED = 150;
	this.SPEED = 300;
    this.MIN_DISTANCE = 32; // pixels
};

// Followers are a type of Phaser.Sprite
Follower.prototype = Object.create(Phaser.Sprite.prototype);
Follower.prototype.constructor = Follower;

var passedobjects, ypos, xpos, rotation, self, count, itemtype, distance, obstagen, sinval;
Follower.prototype.update = function() {
    // Calculate distance to target
	console.log("Updating");
	self = this;
    //var distance = this.game.math.distance(this.x, this.y, this.target.x, this.target.y);
	/*passedobjects = obstacles.filter(function(child, index, children){return child.x < (self.x-500) ? true : false;});
	passedobjects.callAll('destroy', false);*/
	obstacles.forEachAlive(function(obstacle){
		if(obstacle.x < self.x-500)
			obstacle.destroy();
		});
	//if
	count = obstacles.countLiving();
	if(count < 30)
	{
		console.log("Creating more obstacles...");//debug
		for(i = count; i < 25; i++)
		{
			/*ypos = randy.integerInRange(64, 544);
			xpos = randy.integerInRange(self.body.x+1050, self.body.x+2050);
			itemtype = randy.integerInRange(1, 2);*/
			ypos = game.rnd.integerInRange(0, 480);
			xpos = game.rnd.integerInRange(self.body.x+1050, self.body.x+2050);
			itemtype = game.rnd.integerInRange(1, 2);
			obstagen = game.add.sprite('log');
			if(game.physics.arcade.overlap(obstagen, obstacles) === false)
			{
				console.log("Creating object");//debug
				obstagen.destroy();
				if(itemtype === 1)
				{
					obstagen = obstacles.create(xpos, ypos, 'log');
					obstagen.body.velocity.x = -self.SPEED;//edit for variable speed?
					
				}
				else
				{
					obstagen = obstacles.create(xpos, ypos, 'bear');
					obstagen.body.velocity.x = -self.SPEED;//edit for variable speed?
				}
			}
			else
			{
				i--;
				console.log("overlap detected");//debug
			}
			console.log("Obstacle of type %d at (%d, %d)", itemtype, xpos, ypos);//debug
		}
	}
	background.tilePosition.x = scrollPosition;
	//console.log("scrollPosition: %d", scrollPosition);//debug
    // If the distance > MIN_DISTANCE then move
    //if (distance > this.MIN_DISTANCE) {
    // Calculate the angle to the target
	rotation = self.game.math.angleBetween(self.x, self.y, self.target.x, self.target.y);
	
	distance = self.target.x - self.body.x;
	// Calculate velocity vector based on rotation and this.MAX_SPEED
	//this.body.velocity.x = Math.cos(rotation) * this.MAX_SPEED;
	sinval = Math.sin(rotation);
	self.body.velocity.y = sinval*distance*5;
	self.SPEED = self.SPEED *(distance/400);
	if(self.SPEED > self.MAX_SPEED)
		self.SPEED = self.MAX_SPEED;
	else if(self.SPEED < self.MIN_SPEED)
		self.SPEED = self.MIN_SPEED;
	/*if(sinval < 0)
		self.body.velocity.y = sinval * self.MAX_SPEED;
	else
		self.body.velocity.y = sinval * self.MAX_SPEED;*/
	//this.body.velocity.x = 300;//constant running speed? debug value for now
	scrollPosition += self.SPEED;//adjust playerspeed (or this value for speed running)
	//obstacles.setAll('this.body.velocity.x', -self.SPEED, true, false, 0, true);//updating speed?
	
	//game.camera.deadzone.setTo(game.camera.deadzone.left+playerSpeed, 0, 950, 544);//maybe keep the camera locked?
    //} else {
    //    this.body.velocity.setTo(0, 0);
    //}
	//console.log("End of update");//debug
};

var game = new Phaser.Game(1000, 544, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);