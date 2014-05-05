
    // 1. Wait for the onload even
    window.addEventListener("load",function() {

      // Set up a basic Quintus object
      // with the necessary modules and controls
      var Q = window.Q = Quintus({ development: true })
              .include("Sprites, Scenes, Input, 2D")
              .setup({ width: 640, height: 480 })
              .controls(true)

      // Add in the default keyboard controls
      // along with joypad controls for touch
      Q.input.keyboardControls();
      Q.input.joypadControls();

      Q.gravityX = 0;
      Q.gravityY = 0;

      var SPRITE_PLAYER = 1;
      var SPRITE_TILES = 2;
      var SPRITE_ENEMY = 4;
      var SPRITE_DOT = 8;

	  /*******************************************
	  *   			Ira's Code Here             *
	  *			Creating Bullet Wahahaha 		*
	  *******************************************/
	  
      Q.component("towerManControls", {
        // default properties to add onto our entity
        defaults: { speed: 0, direction: 'up' },

        // called when the component is added to
        // an entity
        added: function() {
          var p = this.entity.p;
		  console.log(p);

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
            p.angle = 270;
          } else if(p.vy > 0) {
            p.angle = 180;
          } else if(p.vy < 0) {
            p.angle = 0;
          }

          // grab a direction from the input
          p.direction = Q.inputs['fire']  ? 'fire' :
						Q.inputs['left']  ? 'left' :
                        Q.inputs['right'] ? 'right' :
                        Q.inputs['up']    ? 'up' :
                        Q.inputs['down']  ? 'down' : 	
						'none';

          // based on our direction, try to add velocity
          // in that direction
          switch(p.direction) {
			case "fire": Q.stage(0).PlayerTank.fire(); break;
            case "left": p.vx = -100; break;
            case "right":p.vx = 100; break;
            case "up":   p.vy = -100; break;
            case "down": p.vy = 100; break;
			case "none": p.vx = 0;p.vy = 0;break;
          }
        }
      });

	//bullet_available: true when the bullet is available to shoot
	var bullet_available = true;
	
	/************************************************
	*Class: Bullet									
	*Variable: None									
	*Function:										
	*	init: run when the object is created
	*	countdown: count the time. after 3secs, the bullet will disappear
	**************************************************/
	Q.Sprite.extend('Bullet',{
		init: function(props) {
			this._super({
				sheet:"player",
				x: props.dx,
				y: props.dy,
				angle: props.angle,
				seconds: 3
			});
			this.on('step',this,'countdown');
			this.on("hit.sprite",'collision');
			this.add("2d,bulletControls");
		},

		countdown: function(dt) {
			this.p.seconds -= dt;
			if(this.p.seconds < 0) { 
				this.destroy();
				bullet_available = true;
			} else if(this.p.seconds < 1) {
				this.set({ "fill-opacity": this.p.seconds });
			}
		},
		
		collision: function(collision) {
			if(collision.obj.isA("Enemy")) {
				collision.obj.destroy();
				this.destroy();
				bullet_available = true;
			}
		}
	});
	  
	Q.component("bulletControls", {
		defaults: { speed: 1000},

		added: function() {
			var p = this.entity.p;

			Q._defaults(p,this.defaults);

			console.log(p);
			//this.step();
			this.entity.on("step",this,"step");
			//this.entity.on('hit',this,"changeDirection");
		},
		
		step: function(dt) {
			var p = this.entity.p;
			
			if(p.angle ==0){
				p.direction = "up";
			}
			if(p.angle ==90){
				p.direction = "right";
			}
			if(p.angle ==180){
				p.direction = "down";
			}
			if(p.angle ==270){
				p.direction = "left";
			}
			console.log(p.direction);
			
			switch(p.direction) {
			case "left": p.vx = -p.speed; break;
			case "right":p.vx = p.speed; break;
			case "up":   p.vy = -p.speed; break;
			case "down": p.vy = p.speed; break;
			}
		}
		
	});
	  
	Q.Sprite.extend("Player", {
        init: function(p) {

          this._super(p,{
            sheet:"player",
            type: SPRITE_PLAYER,
            collisionMask: SPRITE_TILES | SPRITE_ENEMY | SPRITE_DOT
          });
		  
		  bullet_available = true;
          this.add("2d, towerManControls");
        },
		
		
		fire: function() {
			var bullet_x;
			var bullet_y;
			
			//if the tank face up
			if(this.p.angle == 0){
				bullet_x = this.p.x;
				bullet_y = this.p.y-32;
			}
			//if the tank face down
			if(this.p.angle == 180){
				bullet_x = this.p.x;
				bullet_y = this.p.y+32;
			}
			//if the tank face left
			if(this.p.angle == 270){
				bullet_x = this.p.x-32;
				bullet_y = this.p.y;
			}
			//if the tank face right
			if(this.p.angle == 90){
				bullet_x = this.p.x+32;
				bullet_y = this.p.y;
			}
			
			var bullet = new Q.Bullet({dx: bullet_x, dy: bullet_y, angle: this.p.angle});
			if(bullet_available){
				Q.stage().insert(bullet);
				bullet_available = false;
			}
			//console.log(this.p.angle);
			console.log("fired");
		}
		
	});
  
	  /******************************************
	  *   			Ira's Code End				*
	  *			Creating Bullet Wahahaha 		*
	  *******************************************/
	  
      // Create the Dot sprite
      Q.Sprite.extend("Dot", {
        init: function(p) {
          this._super(p,{
            sheet: 'dot',
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
          this.stage.dotCount = this.stage.dotCount || 0
          this.stage.dotCount++;
        }
      });


      // Tower is just a dot with a different sheet - use the same
      // sensor and counting functionality
      Q.Dot.extend("Tower", {
        init: function(p) {
          this._super(Q._defaults(p,{
            sheet: 'tower'
          }));
        }
      });

      // Return a x and y location from a row and column
      // in our tile map
      Q.tilePos = function(col,row) {
        return { x: col*32 + 16, y: row*32 + 16 };
      }

      Q.TileLayer.extend("TowerManMap",{
        init: function() {
          this._super({
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

              if(tile == 0 || tile == 2) {
                var className = tile == 0 ? 'Dot' : 'Tower'
                this.stage.insert(new Q[className](Q.tilePos(x,y)));
                row[x] = 0;
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
            Q.stageScene("level1");
          }
        }
      });

      Q.scene("level1",function(stage) {
        var map = stage.collisionLayer(new Q.TowerManMap());
        map.setup();

		//changed by Ira here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        stage.PlayerTank = stage.insert(new Q.Player(Q.tilePos(10,7)));

        stage.insert(new Q.Enemy(Q.tilePos(10,4)));
        stage.insert(new Q.Enemy(Q.tilePos(15,10)));
        stage.insert(new Q.Enemy(Q.tilePos(5,10)));
      });

      Q.load("sprites.png, sprites.json, level.json, tiles.png", function() {
        Q.sheet("tiles","tiles.png", { tileW: 32, tileH: 32 });

        Q.compileSheets("sprites.png","sprites.json");

        Q.stageScene("level1");
      });

    });
