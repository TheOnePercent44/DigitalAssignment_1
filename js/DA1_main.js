window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 1000, 700, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        //game.load.atlasJSONHash( 'dog', 'assets/dog.png', 'assets/dog.json');
		game.load.spritesheet('dog', 'assets/dog.png', 47, 31, 4);
		game.load.tilemap('map', 'assets/grasstile1.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('tiles', 'assets/grassblock.png');
    }
    
    var playersprite, group, scrollPosition, background, playerSpeed, map, layer;
    
    function create() {
		map = game.add.tilemap('map');//, 32, 32);
		map.addTilesetImage('More Grass?', 'tiles', 32, 32);
		layer = map.createLayer('Tile Layer 1');
		playerSpeed = 250;
		//layer.resizeWorld();
        // Create a sprite at the center of the screen using the 'dog' image.
        /*playersprite = game.add.sprite(47, game.world.centerY, 'dog');
		playersprite.anchor.setTo(0.5, 1);
		playersprite.scale.x = -2;
		playersprite.scale.y = 2;*/
		this.game.add.existing(new Follower(this.game, 47, this.game.height/2, this.game.input));
		//playersprite.animations.add('walk', ['dog/run/0001'], 10, true, false);
		//player.animations.add('run', [1, 3, 0], 10, true);
		//player.animations.add('right', [5, 6, 7, 8], 10, true);
		
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        //playersprite.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        //game.physics.enable(playersprite, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        //playersprite.body.collideWorldBounds = true;
    }
	
	var Follower = function(game, x, y, target) {
		Phaser.Sprite.call(this, game, x, y, 'dog');

		// Save the target that this Follower will follow
		// The target is any object with x and y properties
		this.target = target;

		// Set the pivot point for this sprite to the center
		this.anchor.setTo(0.5, 0.5);
		this.scale.x = -2;
		this.scale.y = 2;
		// Enable physics on this object
		this.game.physics.enable(this, Phaser.Physics.ARCADE);

		// Define constants that affect motion
		this.MAX_SPEED = 250; // pixels/second
		this.MIN_DISTANCE = 32; // pixels
		
		this.body.collideWorldBounds = true;
	};

	// Followers are a type of Phaser.Sprite
	Follower.prototype = Object.create(Phaser.Sprite.prototype);
	Follower.prototype.constructor = Follower;

	Follower.prototype.update = function() {
		// Calculate distance to target
		var distance = this.game.math.distance(this.x, this.y, this.target.x, this.target.y);

		// If the distance > MIN_DISTANCE then move
		if (distance > this.MIN_DISTANCE) {
			// Calculate the angle to the target
			var rotation = this.game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);

			// Calculate velocity vector based on rotation and this.MAX_SPEED
			//this.body.velocity.x = Math.cos(rotation) * this.MAX_SPEED;
			this.body.velocity.y = Math.sin(rotation) * this.MAX_SPEED;
		} else {
			this.body.velocity.setTo(0, 0);
		}
	};
    
    /*function update() {
        //playersprite.rotation = game.physics.arcade.accelerateToPointer( playersprite, this.game.input.activePointer, 500, 500, 500 );
		var self = this;
        
        map.tilePosition.x = scrollPosition;
        scrollPosition += playerSpeed;
        
		
                
        
    }*/
	
};
