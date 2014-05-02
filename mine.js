//HAHA I AM GLORIA!!!!
window.addEventListener("load",function() {
	var Q = window.Q = Quintus({ development: true })
			.include("Sprites, Scenes, Input, 2D")
			.setup("myGame", { width: 640, height: 480 });

	// 3. Add in the default keyboard controls
	//    along with joypad controls for touch
	Q.input.keyboardControls();
	Q.input.joypadControls();

	Q.gravityY = 0;
	Q.gravityX = 0;

	var SPRITE_PLAYER = 1;
	var SPRITE_TILES = 2;
	var SPRITE_ENEMY = 4;
	var SPRITE_DOT = 8;
	
	// 4. Add in a basic sprite to get started
	Q.Sprite.extend("Player", {
		init: function(p) {

			this._super(p,{
				sheet:"player"
			});

			this.add("2d");
		}
	});

	Q.Sprite.extend("Wall", {
		init: function(p) {
			this._super(p,{
				sheet: 'wall1',
				type: SPRITE_DOT,
				// Set sensor to true so that it gets notified when it's
				// hit, but doesn't trigger collisions itself that cause
				// the player to stop or change direction
				sensor: true
			});

			this.on("sensor");
			this.on("inserted");
		},

		// When a dot is hit..
		sensor: function() {
			// Destroy it and keep track of how many dots are left
			this.destroy();
			this.stage.dotCount--;
			// If there are no more dots left, just restart the game
			if(this.stage.dotCount == 0) {
				Q.stageScene("level1");
			}
		},

		// When a dot is inserted, use it's parent (the stage)
		// to keep track of the total number of dots on the stage
		inserted: function() {
			this.stage.dotCount = this.stage.dotCount || 0;
			this.stage.dotCount++;
		}
	});
	
	// Tower is just a dot with a different sheet - use the same
	// sensor and counting functionality
	Q.Wall.extend("Tower", {
		init: function(p) {
			this._super(Q._defaults(p,{
				sheet: 'tower'
			}));
		}
	});
	
	Q.tilePos = function(col,row) {
		return { x: col*32 + 16, y: row*32 + 16 };
		//return { x: col*32, y: row*32 };
	}
	
	Q.TileLayer.extend("TowerManMap",{
		init: function(p) {
			this._super({//p,{
				type: SPRITE_TILES,
				dataAsset: 'level.json',
				sheet:     'tiles',
			});
		},

		setup: function() {
			// Clone the top level arriw
			var tiles = this.p.tiles = this.p.tiles.concat();
			var size = this.p.tileW;
			for(var y=0;y<tiles.length;y++) {
				var row = tiles[y] = tiles[y].concat();
				for(var x =0;x<row.length;x++) {
					var tile = row[x];

					// Replace 0's with dots and 2's with Towers
					if(tile == 0 || tile == 2) {
						//var className = 'Wall';
						var className = tile == 0 ? 'Wall' : 'Tower'
						this.stage.insert(new Q[className](Q.tilePos(x,y)));
						row[x] = 0;
					}
				}
			}
		}
	});
	
	Q.scene("level1",function(stage) {
		var map = stage.collisionLayer(new Q.TowerManMap());
		map.setup();

		var player = stage.insert(new Q.Player(Q.tilePos(5,5)));
	});

	Q.load("sprites.png, sprites.json, level.json, tiles.png", function() {
		Q.sheet("tiles","tiles.png", { tileW: 32, tileH: 32 });

		Q.compileSheets("sprites.png","sprites.json");

		Q.stageScene("level1");
	});

});
