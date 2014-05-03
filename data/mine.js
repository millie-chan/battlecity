window.addEventListener("load",function() {
	var Q = window.Q = Quintus({ development: true })
			.include("Sprites, Scenes, Input, 2D")
			.setup("myGame", { width: 416, height: 416 });

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

	Q.Sprite.extend("Swall", {
		init: function(p) {
			this._super(p,{
				sheet: 'swall',
				type: SPRITE_TILES,
			});
		}
	});
	
	Q.Sprite.extend("Brick", {
		init: function(p) {
			this._super(p,{
				sheet: 'brick',
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
			//this.stage.dotCount = this.stage.dotCount || 0;
			//this.stage.dotCount++;
		}
	});
	
	// Tower is just a dot with a different sheet - use the same
	// sensor and counting functionality
	
	Q.Brick.extend("BirdNW", {
		init: function(p) {
			this._super(Q._defaults(p,{
				sheet: 'birdNW'
			}));
		}
	});

	Q.Brick.extend("BirdNE", {
		init: function(p) {
			this._super(Q._defaults(p,{
				sheet: 'birdNE'
			}));
		}
	});
	
	Q.Brick.extend("BirdSW", {
		init: function(p) {
			this._super(Q._defaults(p,{
				sheet: 'birdSW'
			}));
		}
	});
	
	Q.Brick.extend("BirdSE", {
		init: function(p) {
			this._super(Q._defaults(p,{
				sheet: 'birdSE'
			}));
		}
	});
	
	Q.tilePos = function(col,row) {
		//return { x: col*16 + 16, y: row*16 +16 };
		//return { x: col*32 + 16, y: row*32 + 16 };
		return { x: col*16+8, y: row*16+8 };
	}
	
	Q.TileLayer.extend("TowerManMap",{
		init: function(p) {
			this._super({//p,{
				type: SPRITE_TILES,
				//dataAsset: 'level.json',
				dataAsset: 'newLevel.json',
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
					/*
					if(tile == 0 || tile == 2) {
						var className = 'BirdSE';
						//var className = tile == 0 ? 'Wall' : 'Tower'
						this.stage.insert(new Q[className](Q.tilePos(x,y)));
						row[x] = 0;
					}
					*/
					
					
					switch (tile)
					{
					case 1:
						this.stage.insert(new Q['Brick'](Q.tilePos(x,y)));
						row[x] = 0;
						break;
					case 2:
						this.stage.insert(new Q['Swall'](Q.tilePos(x,y)));
						row[x] = 0;
						break;
					case 3:
						this.stage.insert(new Q['Tree'](Q.tilePos(x,y)));
						row[x] = 0;
						break;
					case 4:
						this.stage.insert(new Q['Water'](Q.tilePos(x,y)));
						row[x] = 0;
						break;
					case 5:
						this.stage.insert(new Q['Ice'](Q.tilePos(x,y)));
						row[x] = 0;
						break;
					case 6:
						this.stage.insert(new Q['BirdNW'](Q.tilePos(x,y)));
						row[x] = 0;
						break;
					case 7:
						this.stage.insert(new Q['BirdNE'](Q.tilePos(x,y)));
						row[x] = 0;
						break;
					case 8:
						this.stage.insert(new Q['BirdSW'](Q.tilePos(x,y)));
						row[x] = 0;
						break;
					case 9:
						this.stage.insert(new Q['BirdSE'](Q.tilePos(x,y)));
						row[x] = 0;
						console.log("here is bird");
						break;
					}
				}
			}
		}
	});
	
	Q.scene("level1",function(stage) {
		var map = stage.collisionLayer(new Q.TowerManMap());
		map.setup();

		var player = stage.insert(new Q.Player(Q.tilePos(0.5,0.5)));
	});

	Q.load("sprites.png, newSprites.json, newLevel.json", function() {
		//Q.sheet("tiles","tiles.png", { tileW: 16, tileH: 16 });

		Q.compileSheets("sprites.png","newSprites.json");

		Q.stageScene("level1");
	});
	
	/*
	Q.load("sprites.png, sprites.json, level.json, tiles.png", function() {
		Q.sheet("tiles","tiles.png", { tileW: 32, tileH: 32 });

		Q.compileSheets("sprites.png","sprites.json");

		Q.stageScene("level1");
	});
	*/
});
