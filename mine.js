window.addEventListener("load",function() {
	var Q = window.Q = Quintus({ development: true })
			.include("Sprites, Scenes, Input, 2D")
			.setup("myGame", { width: 416, height: 416 })
			.controls(true);

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

      Q.component("towerManControls", {
        // default properties to add onto our entity
        defaults: { speed: 0, direction: 'up' },

        // called when the component is added to
        // an entity
        added: function() {
          var p = this.entity.p;

          // add in our default properties
          Q._defaults(p,this.defaults);

          // every time our entity steps
          // call our step method
          this.entity.on("step",this,"step");
        },

        step: function(dt) {
          // grab the entity's properties
          // for easy reference
          var p = this.entity.p;

          // rotate the player
          // based on our velocity
		  
          if(p.vx > 0) {
            p.angle = 90;
          } else if(p.vx < 0) {
            p.angle = -90;
          } else if(p.vy > 0) {
            p.angle = 180;
          } else if(p.vy < 0) {
            p.angle = 0;
          }

          // grab a direction from the input
          p.direction = Q.inputs['left']  ? 'left' :
                        Q.inputs['right'] ? 'right' :
                        Q.inputs['up']    ? 'up' :
                        Q.inputs['down']  ? 'down' : 'none';

          // based on our direction, try to add velocity
          // in that direction
          switch(p.direction) {
            case "left": p.vx = -100; break;
            case "right":p.vx = 100; break;
            case "up":   p.vy = -100; break;
            case "down": p.vy = 100; break;
			case "none": p.vx = 0;p.vy = 0;break;
          }
        }
      });
	
	// 4. Add in a basic sprite to get started
	Q.Sprite.extend("Player", {
		init: function(p) {

			this._super(p,{
				sheet:"player",
				type: SPRITE_PLAYER,
				collisionMask: SPRITE_TILES | SPRITE_ENEMY | SPRITE_DOT
			});

			this.add("2d, towerManControls");
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
	
	Q.Sprite.extend("Tree", {
		init: function(p) {
			this._super(p,{
				sheet: 'tree',
				type: SPRITE_TILES,
			});
		}
	});
	
	Q.Sprite.extend("Brick", {
		init: function(p) {
			this._super(p,{
				sheet: 'brick',
				//type: SPRITE_DOT,
				type: SPRITE_TILES,
				// Set sensor to true so that it gets notified when it's
				// hit, but doesn't trigger collisions itself that cause
				// the player to stop or change direction
				//sensor: true
			});

			//this.on("sensor");
			this.on("inserted");
		},

		// When a dot is hit..
		/*
		sensor: function() {
			// Destroy it and keep track of how many dots are left
			
			this.destroy();
			this.stage.dotCount--;
			// If there are no more dots left, just restart the game
			if(this.stage.dotCount == 0) {
				Q.stageScene("level1");
			}
			
		},
		*/

		// When a dot is inserted, use it's parent (the stage)
		// to keep track of the total number of dots on the stage
		inserted: function() {
			this.stage.dotCount = this.stage.dotCount || 0;
			this.stage.dotCount++;
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
			this._super(p,{
				type: SPRITE_TILES,
				//dataAsset: 'level1.json',
				dataAsset: '',
				sheet: ''
				//sheet:     'tiles'
			});
		},

		setup: function() {
			// Clone the top level arriw
			console.log("p: "+this.p);
			console.log("tiles: "+this.p.tiles);
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
						break;
					}
				}
			}
		}
	});
	
	Q.component("enemyControls", {
        defaults: { speed: 50, direction: 'left', switchPercent: 2 },

        added: function() {
          var p = this.entity.p;

          Q._defaults(p,this.defaults);

          this.entity.on("step",this,"step");
          this.entity.on('hit',this,"changeDirection");
        },

        step: function(dt) {
          var p = this.entity.p;

          if(Math.random() < p.switchPercent / 100) {
            this.tryDirection();
          }

          switch(p.direction) {
            case "left": p.vx = -p.speed; break;
            case "right":p.vx = p.speed; break;
            case "up":   p.vy = -p.speed; break;
            case "down": p.vy = p.speed; break;
          }
        },

        tryDirection: function() {
          var p = this.entity.p; 
          var from = p.direction;
          if(p.vy != 0 && p.vx == 0) {
            p.direction = Math.random() < 0.5 ? 'left' : 'right';
          } else if(p.vx != 0 && p.vy == 0) {
            p.direction = Math.random() < 0.5 ? 'up' : 'down';
          }
        },

        changeDirection: function(collision) {
          var p = this.entity.p;
          if(p.vx == 0 && p.vy == 0) {
            if(collision.normalY) {
              p.direction = Math.random() < 0.5 ? 'left' : 'right';
            } else if(collision.normalX) {
              p.direction = Math.random() < 0.5 ? 'up' : 'down';
            }
          }
        }
      });


      Q.Sprite.extend("Enemy", {
        init: function(p) {

          this._super(p,{
            sheet:"enemy",
            type: SPRITE_ENEMY,
            collisionMask: SPRITE_PLAYER | SPRITE_TILES
          });

          this.add("2d,enemyControls");
          this.on("hit.sprite",this,"hit");
        },

        hit: function(col) {
          if(col.obj.isA("Player")) {
			Q.clearStage(1);
            Q.stageScene("level2");
          }
        }
      });
	
	Q.scene("level1",function(stage) {
		var map = stage.collisionLayer(new Q.TowerManMap({dataAsset: 'level1.json', sheet: 'tiles'}));
		map.setup();

		var player = stage.insert(new Q.Player(Q.tilePos(6.5,0.5)));
		
		stage.insert(new Q.Enemy(Q.tilePos(2.5,0.5)));
        stage.insert(new Q.Enemy(Q.tilePos(2.5,12.5)));
        //stage.insert(new Q.Enemy(Q.tilePos(5,10)));
		
	});
	
	Q.scene("level2",function(stage) {
		var map = stage.collisionLayer(new Q.TowerManMap({dataAsset: 'level2.json', sheet: 'tiles'}));
		map.setup();

		var player = stage.insert(new Q.Player(Q.tilePos(8.5,24.5)));
		
		//stage.insert(new Q.Enemy(Q.tilePos(2.5,0.5)));
        //stage.insert(new Q.Enemy(Q.tilePos(12.5,0.5)));
        //stage.insert(new Q.Enemy(Q.tilePos(5,10)));
		
	});

	Q.load("sprites.png, newSprites.json, level1.json, level2.json, tiles.png", function() {
		Q.sheet("tiles","tiles.png", { tileW: 16, tileH: 16 });

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
