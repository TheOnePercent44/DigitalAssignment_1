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
		//layer.resizeWorld();
        // Create a sprite at the center of the screen using the 'dog' image.
        playersprite = game.add.sprite(47, game.world.centerY, 'dog');
		playersprite.anchor.setTo(0.5, 1);
		playersprite.scale.x = -2;
		playersprite.scale.y = 2;
		//playersprite.animations.add('walk', ['dog/run/0001'], 10, true, false);
		//player.animations.add('run', [1, 3, 0], 10, true);
		//player.animations.add('right', [5, 6, 7, 8], 10, true);
		
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        //playersprite.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable(playersprite, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        playersprite.body.collideWorldBounds = true;
    }
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //playersprite.rotation = game.physics.arcade.accelerateToPointer( playersprite, this.game.input.activePointer, 500, 500, 500 );
		/*var self = this;
        
        ground.tilePosition.x = scrollPosition;
        
        background.tilePosition.x = -(scrollPosition * 0.005);
        
        game.physics.arcade.collide(group, ground);*/
                
        
    }
};
