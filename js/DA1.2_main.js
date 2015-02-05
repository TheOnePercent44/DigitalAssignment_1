// This example uses the Phaser 2.2.2 framework

// Copyright © 2014 John Watson
// Licensed under the terms of the MIT License

var GameState = function(game) {
};

// Load images and sounds
GameState.prototype.preload = function() {
    game.load.spritesheet('dog', 'assets/dog.png', 47, 31, 4);
	game.load.image('background', 'assets/grasstile5.png');
	game.load.image('log', 'assets/log_w_grass_64x64.png');
	game.load.image('bear', 'assets/beartrap_grass_64x64.png');
};
var obstacles, scrollPosition, background, playerSpeed, randy;//, map, layer0, layer1;
// Setup the example
GameState.prototype.create = function() {
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
	
    this.MAX_SPEED = 650; // pixels/second
	this.MIN_SPEED = 150;
	this.SPEED = 500;
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
	
	passedobjects = obstacles.filter(function(child, index, children){return child.x < (self.x-500) ? true : false;});
	passedobjects.callAll('destroy', false);
	
	count = obstacles.countLiving();
	if(count < 30)
	{
		//console.log("Creating more obstacles...");//debug
		for(i = count; i < 25; i++)
		{
			ypos = game.rnd.integerInRange(0, 480);
			xpos = game.rnd.integerInRange(self.body.x+1050, self.body.x+2050);
			itemtype = game.rnd.integerInRange(1, 2);
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
	}
	background.tilePosition.x = scrollPosition;
	
	rotation = self.game.math.angleBetween(self.x, self.y, self.target.x, self.target.y);
	
	distance = self.target.x - self.body.x;
	
	sinval = Math.sin(rotation);
	self.body.velocity.y = sinval*5;
	/*self.SPEED = self.SPEED *(Math.cos(rotation)*distance);
	if(self.SPEED > self.MAX_SPEED)
		self.SPEED = self.MAX_SPEED;
	else if(self.SPEED < self.MIN_SPEED)
		self.SPEED = self.MIN_SPEED;*/
		
	scrollPosition += self.SPEED;//adjust playerspeed (or this value for speed running)
	obstacles.setAll('body.velocity.x', -self.SPEED, false, false, 0, true);//updating speed?
};

var game = new Phaser.Game(1000, 544, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);