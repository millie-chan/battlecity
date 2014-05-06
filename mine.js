window.addEventListener("load",function() {
	var Q = window.Q = Quintus({ development: true })
			.include("Sprites, Scenes, Input, 2D, Anim")
			.setup("myGame", { width: 448, height: 448 })
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
	var SPRITE_BULLET = 8;
	var SPRITE_BULLETE = 16;
	var SPRITE_APP = 32;

	Q.component("towerManControls", {
		// default properties to add onto our entity
		defaults: { speed: 0, direction: 'up' , bulletCooldown: false},
		added: function() {
			var p = this.entity.p;
			Q._defaults(p,this.defaults);
			//console.log(this);
			//console.log(this.entity);
			this.entity.on("step",this,"step");
		},

		step: function(dt) {
			// grab the entity's properties
			// for easy reference
			var p = this.entity.p;

			// grab a direction from the input
			p.direction = Q.inputs['left']  ? 'left' :

			Q.inputs['right'] ? 'right' :
			Q.inputs['up']    ? 'up' :
			Q.inputs['down']  ? 'down' : 
			'none';

			//fire if space is being pressed
			if(Q.inputs['fire'] == true){
				if(p.bulletCooldown == false){
					Q.stage(0).PlayerTank.fire();
					p.bulletCooldown = true;
					setTimeout( function(){p.bulletCooldown = false;},  500);
				}
			}
			
			// based on our direction, try to add velocity in that direction

			switch(p.direction) {
				case "left": p.vx = -100; p.vy = 0; p.angle = -90; break;
				case "right":p.vx = 100; p.vy = 0; p.angle = 90; break;
				case "up":   p.vx = 0; p.vy = -100; p.angle = 0; break;
				case "down": p.vx = 0; p.vy = 100; p.angle = 180; break;
				case "none": p.vx = 0;p.vy = 0;break;
			}
		}
		
	});
	
	//bullet_available: true when the bullet is available to shoot
	var bullet_available = true;
	
	Q.Sprite.extend('Bullet',{
		init: function(props) {
			this._super({
				sheet:"bullet",
				x: props.dx,
				y: props.dy,
				angle: props.angle,
				seconds: 3,
				type:SPRITE_BULLET,
				collisionMask: SPRITE_TILES | SPRITE_ENEMY | SPRITE_BULLETE
			});
//			this.on('step',this,'countdown');
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
//		//console.log(collision.obj);
			if(collision.obj.isA("EnemyA")||collision.obj.isA("EnemyB")||collision.obj.isA("EnemyC")||collision.obj.isA("EnemyD")) {
			////console.log("coll");//console.log(collision.obj);//	collision.obj.hit();
				collision.obj.hit();
				this.destroy();
				bullet_available = true;
			}
			else if(collision.obj.isA("Brick")){
				collision.obj.destroy();
				this.destroy();
				bullet_available = true;
			}
			else if(collision.obj.isA("Swall")||collision.obj.isA("BulletE")){
				this.destroy();
				bullet_available = true;
			}
			else if(collision.obj.isA("Bird")){
				collision.obj.p.sheet='flag';

				this.destroy();
				bullet_available = true;
			}
		}
	});
	
	Q.Sprite.extend('BulletE',{
		init: function(props) {
			this._super({
				sheet:"bullet",
				x: props.dx,
				y: props.dy,
				angle: props.angle,
				belong: props.ene,
				seconds: 3,
				type:SPRITE_BULLETE,
				collisionMask: SPRITE_TILES | SPRITE_PLAYER | SPRITE_BULLET
			});
//			this.on('step',this,'countdown');
			this.on("hit.sprite",'collision');
			this.add("2d,bulletEControls");
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
//		//console.log(collision.obj);
/*			if(collision.obj.isA("EnemyA")||collision.obj.isA("EnemyB")||collision.obj.isA("EnemyC")||collision.obj.isA("EnemyD")) {
			//console.log("coll");//console.log(collision.obj);//	collision.obj.hit();
				this.destroy();
				bullet_available = true;
			}
			else */if(collision.obj.isA("Brick")||collision.obj.isA("Player")){
				collision.obj.destroy();
				this.p.belong.fire = true;
				this.destroy();
				
			}
			else if(collision.obj.isA("Swall")||collision.obj.isA("Bullet")){
//			//console.log(this);
				this.p.belong.fire = true;
				this.destroy();
			}
			else if(collision.obj.isA("Bird")){
				collision.obj.p.sheet='flag';
				this.p.belong.fire = true;
				this.destroy();
			}
		}
	});
	
	Q.component("bulletControls", {
		defaults: { speed: 200},

		added: function() {
			var p = this.entity.p;

			Q._defaults(p,this.defaults);

			////console.log(p);
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
			if(p.angle ==-90){
				p.direction = "left";
			}
//			//console.log(p.direction);
			
			switch(p.direction) {
			case "left": p.vx = -p.speed; break;
			case "right":p.vx = p.speed; break;
			case "up":   p.vy = -p.speed; break;
			case "down": p.vy = p.speed; break;
			}
		}
		
	});
	
	Q.component("bulletEControls", {
		defaults: { speed: 200},

		added: function() {
			var p = this.entity.p;

			Q._defaults(p,this.defaults);

//			//console.log(p);
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
			if(p.angle ==-90){
				p.direction = "left";
			}
//			//console.log(p.direction);
			
			switch(p.direction) {
			case "left": p.vx = -p.speed; break;
			case "right":p.vx = p.speed; break;
			case "up":   p.vy = -p.speed; break;
			case "down": p.vy = p.speed; break;
			}
		}
		
	});
	


	// 4. Add in a basic sprite to get started
	Q.Sprite.extend("Player", {
		init: function(p) {

			this._super(p,{
				sheet:"player",
				type: SPRITE_PLAYER,
				collisionMask: SPRITE_TILES | SPRITE_ENEMY | SPRITE_BULLETE// | SPRITE_BRICK | SPRITE_BIRD,
			});

			bullet_available = true;
			this.add("2d, towerManControls");
		},
		
		
		fire: function() {
			var bullet_x;
			var bullet_y;
			////console.log(this.p.angle);
			//if the tank face up
			if(this.p.angle == 0){
				bullet_x = this.p.x;
				bullet_y = this.p.y-22;
			}
			//if the tank face down
			if(this.p.angle == 180){
				bullet_x = this.p.x;
				bullet_y = this.p.y+22;
			}
			//if the tank face left
			if(this.p.angle == -90){
				bullet_x = this.p.x-22;
				bullet_y = this.p.y;
			}
			//if the tank face right
			if(this.p.angle == 90){
				bullet_x = this.p.x+22;
				bullet_y = this.p.y;
			}
			
			var bullet = new Q.Bullet({dx: bullet_x, dy: bullet_y, angle: this.p.angle});
			if(bullet_available){
				Q.stage().insert(bullet);
				bullet_available = false;
			}
			////console.log(this.p.angle);
			////console.log("fired");
		}
	});
	
	Q.component("enemyControls", {
//        defaults: {speed: 100,  direction: 'down', switchPercent: 0, bullet: 1 ,health: 1},

        added: function() {
			var p = this.entity.p;
		////console.log(p.health);


		//          Q._defaults(p,this.defaults);
			 // //console.log(p.direction);
			  ////console.log(p.fire);
			this.entity.on("step",this,"step");
			this.entity.on('hit',this,"changeDirection");
        },

        step: function(dt) {
			var p = this.entity.p;
			var bullet_x;
			var bullet_y;
			if(p.vx > 0) {
				p.angle = 90;
			} else if(p.vx < 0) {
				p.angle = -90;
			} else if(p.vy > 0) {
				p.angle = 180;
			} else if(p.vy < 0) {
				p.angle = 0;
			}
			if(Math.random() < p.switchPercent / 100) {
				this.tryDirection();
			}
			switch(p.direction) {
				case "left": p.vx = -p.speed; break;
				case "right":p.vx = p.speed; break;
				case "up":   p.vy = -p.speed; break;
				case "down": p.vy = p.speed; break;
				case "stop": p.vx = 0; p.vy = 0;break;
			}
			switch(p.angle){
				case -90: bullet_x = p.x-22;bullet_y = p.y;break;
				case 90: bullet_x = p.x+22;bullet_y = p.y;break;
				case 0:   bullet_x = p.x; bullet_y = p.y-22;break;
				case 180:  bullet_x = p.x; bullet_y = p.y+22;break;
			}
			if(p.fire){
				var bullet = new Q.BulletE({dx: bullet_x, dy: bullet_y, angle: p.angle, ene: p});
//				//console.log(bullet);
				this.entity.stage.insert(bullet);
				p.fire = false;
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
////console.log(this.entity.stage.lists.Player[0].p.y);
			if(p.vx == 0 && p.vy == 0) {
				if(collision.normalY) {
					p.direction = Math.random() < 0.5 ? 'left' : 'right';
				} else if(collision.normalX) {
					p.direction = Math.random() < 0.5 ? 'up' : 'down';
				}
			}
        }
      });

	Q.animations('ani', {
	  appear: { frames: [0,1,2,3,2,1,0,1,2,3,2,1,0,1,2,3], rate: 1/5, loop: false , trigger: 'end'}, 
	  disappear1: { frames: [0,1,2], rate:1/8, trigger: 'end', loop: false  },
	  disappear2: { frames: [0,1], rate:1/8, loop: false , trigger: 'end' }
	});

    Q.Sprite.extend("Enemy", {
		init: function(p) {

			this._super(p,{
				sheet:"enemy",
				type: SPRITE_ENEMY,
				collisionMask: SPRITE_PLAYER | SPRITE_TILES | SPRITE_ENEMY | SPRITE_BULLET, //| SPRITE_BRICK | SPRITE_BIRD
				fire:true
			});

			this.add("2d,enemyControls");
//      	    this.on("hit.sprite",this,"hit");
			this.on("inserted");
        },

        hit: function() {
        //  if(col.obj.isA("Bullet")) {
			var stage=this.stage;
			var wid=stage._collisionLayers[0].p.cols;
            this.p.health--;
			if(this.p.health==0){
				var xX=this.p.x;
				var yY=this.p.y;
				////console.log("x "+xX+" y "+yY);
				this.destroy();
				var f;
				stage.insert(f=new Q.Disappear1({ x: xX, y: yY }));
				////console.log(f);
				f.play("disappear1");
				////console.log(stage.enemyNum);
				if(stage.enemyNum>0){
					var pos=[3.5,wid/2+0.5,wid-2.5];
					setTimeout(function(){
						var r=Math.floor((Math.random() * 3));
//						var gen=0;
//						while(!gen){
						var e=stage.enemyArr.shift();//Math.floor((Math.random() * 4));
						switch(e) {
							case 0: if(stage.enemyANum>0){stage.insert(ene=new Q.Appear(Q.tilePos(pos[r],1.5),0,pos[r]));ene.play("appear");} break;
							case 1: if(stage.enemyBNum>0){stage.insert(ene=new Q.Appear(Q.tilePos(pos[r],1.5),1,pos[r]));ene.play("appear");} break;
							case 2: if(stage.enemyCNum>0){stage.insert(ene=new Q.Appear(Q.tilePos(pos[r],1.5),2,pos[r]));ene.play("appear");} break;
							case 3: if(stage.enemyDNum>0){stage.insert(ene=new Q.Appear(Q.tilePos(pos[r],1.5),3,pos[r]));ene.play("appear");} break;
						}
						//this.stage.insert(new Q.EnemyA(Q.tilePos(pos[r],0.5)));
						// this.stage.insert(new Q.Enemy(Q.tilePos(4.5,6.5)));
					},2500);
				}
			}
        },
		inserted: function() {
//			//console.log(this);
			this.stage.enemyNum--;
			////console.log(this.stage.enemyNum);
		}
    });
	  
    Q.Enemy.extend("EnemyA", {
        init: function(p) {
			this._super(Q._defaults(p,{
				sheet: "enemyA",
				name: "A",
				speed: 100,
				direction: 'down',
				switchPercent: 0,
				bullet: 1,
				health: 1
			}));
			this.add("animation");
        },
		inserted: function() {
//			//console.log(this);
			this.stage.enemyNum--;
			this.stage.enemyANum--;
			//console.log(this.stage.enemyANum);
		}
    });
	
    Q.Enemy.extend("EnemyB", {
        init: function(p) {
			this._super(Q._defaults(p,{
				sheet: "enemyB",
				name: "B",
				speed: 150,
				direction: 'down',
				switchPercent: 0,
				bullet: 1,
				health: 2
			}));
        },
		inserted: function() {
//			//console.log(this);
			this.stage.enemyNum--;
			this.stage.enemyBNum--;
			//console.log(this.stage.enemyBNum);
		}
    });
	  
    Q.Enemy.extend("EnemyC", {
        init: function(p) {
			this._super(Q._defaults(p,{
				sheet: "enemyC",
				name: "C",
				speed: 100,
				direction: 'down',
				switchPercent: 0,
				bullet: 1,
				health: 1
			}));
        },
		inserted: function() {
//			//console.log(this);
			this.stage.enemyNum--;
			this.stage.enemyCNum--;
			//console.log(this.stage.enemyCNum);
		}
    });
	
    Q.Enemy.extend("EnemyD", {
        init: function(p) {
			this._super(Q._defaults(p,{
				sheet: "enemyD",
				name: "D",
				speed: 100,
				direction: 'down',
				switchPercent: 0,
				bullet: 1,
				health: 3
			}));
        },
		inserted: function() {
//			//console.log(this);
			this.stage.enemyNum--;
			this.stage.enemyDNum--;
			//console.log(this.stage.enemyDNum);
		}
    });	  
	
	Q.Sprite.extend("Appear", {
		init: function(p,k,pos) {
			this._super(p,{
				sheet: 'appear',
				sprite: "ani",
				type: SPRITE_APP,
				kind:k,
				posx:pos
			});
			this.add("animation");
			this.on("end",this,"des");
		},
		des:function() {
			//console.log("end");
			//console.log(this);
			this.destroy();
			switch(this.p.kind) {
				case 0: this.stage.insert(new Q.EnemyA(Q.tilePos(this.p.posx,1.5)));break;
				case 1: this.stage.insert(new Q.EnemyB(Q.tilePos(this.p.posx,1.5)));break;
				case 2: this.stage.insert(new Q.EnemyC(Q.tilePos(this.p.posx,1.5)));break;
				case 3: this.stage.insert(new Q.EnemyD(Q.tilePos(this.p.posx,1.5)));break;
			}
		}
	});
	
	Q.Sprite.extend("Disappear1", {
		init: function(p) {
			this._super(p,{
				sheet: 'disappear1',
				sprite: "ani",
				type: SPRITE_APP,
//				posx:x,
//				posy:y
			});
			this.add("animation");
			this.on("end",this,"des");
		},
		des:function() {
			//console.log("end");
			//console.log(this);
			var xX=this.p.x;
			var yY=this.p.y;
			this.destroy();
			var f;
			this.stage.insert(f=new Q.Disappear2({ x: xX, y: yY }));
			f.play('disappear2');
		}
	});
	
	Q.Sprite.extend("Disappear2", {
		init: function(p) {
			this._super(p,{
				sheet: 'disappear2',
				sprite: "ani",
				type: SPRITE_APP
			});
			this.add("animation");
			this.on("end",this,"des");
		},
		des:function() {
			//console.log("end");
			//console.log(this);
			this.destroy();
		}
	});
	
	Q.shuffle=function(o){ 
		for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};
	Q.genEnemy=function(stage,wid,num){
		var pos=[3.5,wid/2+0.5,wid-2.5];
		//console.log(num);
		for(var i=0;i<num;i++){
			setTimeout(function(){
				var r=Math.floor((Math.random() * 3));
//				var gen=0;
//				while(!gen){
					var ene;
					var e=stage.enemyArr.shift();//Math.floor((Math.random() * 4));
					switch(e) {
						case 0: if(stage.enemyANum>0){
									stage.insert(ene=new Q.Appear(Q.tilePos(pos[r],1.5),0,pos[r]));
									ene.play("appear");
									//stage.insert(new Q.EnemyA(Q.tilePos(pos[r],1.5)));
//									gen=1;
								} break;
						case 1: if(stage.enemyBNum>0){
									stage.insert(ene=new Q.Appear(Q.tilePos(pos[r],1.5),1,pos[r]));
									ene.play("appear");
									//stage.insert(new Q.EnemyB(Q.tilePos(pos[r],1.5)));
//									gen=1;
								} break;
						case 2: if(stage.enemyCNum>0){
									stage.insert(ene=new Q.Appear(Q.tilePos(pos[r],1.5),2,pos[r]));
									ene.play("appear");
									//stage.insert(new Q.EnemyC(Q.tilePos(pos[r],1.5)));
//									gen=1;
								} break;
						case 3: if(stage.enemyDNum>0){
									stage.insert(ene=new Q.Appear(Q.tilePos(pos[r],1.5),3,pos[r]));
									ene.play("appear");
									//stage.insert(new Q.EnemyD(Q.tilePos(pos[r],1.5)));
//									gen=1;
								} break;
					}
//				}
			},i*3000);			
		}//stage.insert(new Q.EnemyA(Q.tilePos(pos[r],0.5)));
/*		stage.insert(new Q.EnemyA(Q.tilePos(pos[0],1.5)));
		stage.insert(new Q.EnemyA(Q.tilePos(pos[1],1.5)));
		stage.insert(new Q.EnemyA(Q.tilePos(pos[2],1.5)));*/
	};
	
	Q.Sprite.extend("Swall", {
		init: function(p) {
			this._super(p,{
				sheet: 'swall',
				type: SPRITE_TILES
			});
		}
	});
	
	Q.Sprite.extend("Tree", {
		init: function(p) {
			this._super(p,{
				sheet: 'tree',
				type: SPRITE_TILES,
				sensor: true
			});
		}
	});
	
	Q.Sprite.extend("Brick", {
		init: function(p) {
			this._super(p,{
				sheet: 'brick',
				type: SPRITE_TILES
				// Set sensor to true so that it gets notified when it's
				// hit, but doesn't trigger collisions itself that cause
				// the player to stop or change direction
				//sensor: true
			});

		//	this.on("sensor");
			this.on("hit.sprite",this,"hit");
		//	this.on("inserted");
		},

		// When a dot is hit..
		hit: function(col) {
			// Destroy it and keep track of how many dots are left
		//	this.destroy();
		//	this.stage.dotCount--;
			// If there are no more dots left, just restart the game
		//	if(this.stage.dotCount == 0) {
		//		Q.stageScene("level1");
		//	}
/*			if(col.obj.isA("Bullet")) {
				this.destroy();////console.log(this.stage.donut);this.stage.donut=10;//console.log(this.stage.donut);
			}*/
		},

		// When a dot is inserted, use it's parent (the stage)
		// to keep track of the total number of dots on the stage
		/*inserted: function() {
			//console.log(this);
			this.stage.donut = this.stage.donut || 0;
			this.stage.donut++;
		}*/
	});
	
	// Tower is just a dot with a different sheet - use the same
	// sensor and counting functionality
	
	Q.Brick.extend("Bird", {
		init: function(p) {
			this._super(Q._defaults(p,{
				sheet: 'bird'
			}));
		}
	});


	
	Q.tilePos = function(col,row) {
		//return { x: col*16 + 16, y: row*16 +16 };
		//return { x: col*32 + 16, y: row*32 + 16 };
		return { x: col*16+8, y: row*16+8 };
	}
	
	Q.tilePos2 = function(col,row) {
		//return { x: col*16 + 16, y: row*16 +16 };
		return { x: col*32 + 16, y: row*32 + 16 };
		//return { x: col*16+8, y: row*16+8 };
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
			var tiles = this.p.tiles = this.p.tiles.concat();
			var size = this.p.tileW;
			for(var y=0;y<tiles.length;y++) {
				var row = tiles[y] = tiles[y].concat();
				for(var x =0;x<row.length;x++) {
					var tile = row[x];

					
					
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
//						this.stage.insert(new Q['Tree'](Q.tilePos(x,y)));
//						row[x] = 0;
						break;
					case 4:
						this.stage.insert(new Q['Water'](Q.tilePos(x,y)));
						row[x] = 0;
						break;
					case 5:
						this.stage.insert(new Q['Ice'](Q.tilePos(x,y)));
						row[x] = 0;
						break;
/*
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
						//console.log("here is bird");
						break;
*/
					}
				}
			}
			//callback(this.stage,tiles.length,1);
		}
	});
	
	Q.scene("level1",function(stage) {
		var map = stage.collisionLayer(new Q.TowerManMap({dataAsset: 'level1.json', sheet: 'tiles'}));
		map.setup();
		stage.insert(new Q.Bird(Q.tilePos2(7.5,12.5)));
		stage.PlayerTank = stage.insert(new Q.Player(Q.tilePos(2.5,10.5)));
//		 stage.add("viewport").follow(stage.PlayerTank);
		stage.enemyNum=10;
		stage.enemyANum=8;
		stage.enemyBNum=2;
		stage.enemyCNum=0;
		stage.enemyDNum=0;
		stage.enemyMax=3;
		var arr=[];
		for(var i=0;i<8;i++){
			arr.push(0);
		}
		for(var i=0;i<2;i++){
			arr.push(1);
		}
		stage.enemyArr=Q.shuffle(arr);
		console.log(stage.enemyArr);
		stage.add("viewport");
		stage.moveTo(32,0);
		Q.genEnemy(stage,map.p.tiles[0].length,stage.enemyMax);
	});
	
	Q.scene("level2",function(stage) {
		var map = stage.collisionLayer(new Q.TowerManMap({dataAsset: 'level2.json', sheet: 'tiles'}));
		map.setup();

		stage.add("viewport");
		stage.moveTo(32,0);

		var player = stage.insert(new Q.Player(Q.tilePos2(5,4)));
		stage.insert(new Q.Bird(Q.tilePos2(7.5,12.5)));
		
		stage.insert(new Q.Tree(Q.tilePos2(1.5,4.5)));
		stage.insert(new Q.Tree(Q.tilePos2(1.5,5.5)));
		stage.insert(new Q.Tree(Q.tilePos2(2.5,5.5)));
		stage.insert(new Q.Tree(Q.tilePos2(5.5,6.5)));
		stage.insert(new Q.Tree(Q.tilePos2(5.5,7.5)));
		stage.insert(new Q.Tree(Q.tilePos2(6.5,6.5)));
		stage.insert(new Q.Tree(Q.tilePos2(7.5,6.5)));
		stage.insert(new Q.Tree(Q.tilePos2(11.5,4.5)));
		stage.insert(new Q.Tree(Q.tilePos2(11.5,5.5)));
		stage.insert(new Q.Tree(Q.tilePos2(11.5,6.5)));

	});

	Q.load("sprites2.png, newSprites.json, level1.json, level2.json", function() {
		//Q.sheet("tiles","tiles.png", { tileW: 16, tileH: 16 });

		Q.compileSheets("sprites2.png","newSprites.json");

		Q.stageScene("level1");
	});

	
});