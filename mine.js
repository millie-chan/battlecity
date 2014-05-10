window.addEventListener("load",function() {
	$("#outer").css("left", (window.innerWidth-544)/2+"px");
	for (var i=1; i <= 20; i++) {
		if (i % 2 ==0) {
			$('<div class="numSprite bomb eneven" id="en'+i+'" style="display:none"></div>').appendTo($("#outer"));
			$("#en"+i).css("top", (32 + i*8)+'px');
		} else if (i % 2 ==1) {
			$('<div class="numSprite bomb enodd" id="en'+i+'" style="display:none"></div>').appendTo($("#outer"));
			$("#en"+i).css("top", (40 + i*8)+'px');
		}
	}
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
	var SPRITE_BARRIER = 64;
	var SPRITE_TREE = 128;

	Q.component("towerManControls", {
		// default properties to add onto our entity
		defaults: { speed: 0, direction: 'up' , cannonCooldown: false},
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

			if(Q.stage().endgame){
				p.direction='none';
			}
			if(Q.stage().currentEnemy == 0 && Q.stage().enemyNum==0){
				if (Q.stage().endgame == false) {
					Q.stage().endgame = true;
					setTimeout(function(){
						Q.clearStages();
						Q.stageScene('showScore');
					}, 1500);
				}
				//console.log("score: "+this.entity.stage.score);
			}
			//fire if space is being pressed
			if(Q.inputs['fire'] == true){
				if(p.cannonCooldown == false){
					Q.stage(0).PlayerTank.fire();
					p.cannonCooldown = true;
					setTimeout( function(){p.cannonCooldown = false;},  300);
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
			if(p.barrier){
				p.barrier.p.x=p.x;
				p.barrier.p.y=p.y;
			}
		}
		
	});
	
	
	Q.Sprite.extend('Bullet',{
		init: function(props) {
			this._super({
				sheet:"bullet",
				x: props.dx,
				y: props.dy,
				z: 0,
				angle: props.angle,
				shooter: props.shooter, 
				type:SPRITE_BULLET,
				first_colli: true,
				collisionMask: SPRITE_TILES | SPRITE_ENEMY | SPRITE_BULLETE | SPRITE_BARRIER
			});
//			this.on('step',this,'countdown');
			this.on("hit.sprite",'collision');
			this.add("2d,bulletControls");
		},

		
		collision: function(collision) {
//		//console.log(collision.obj);
			var xX=this.p.x;
			var yY=this.p.y;
			var stage = this.stage;
			if(collision.obj.isA("EnemyA")||collision.obj.isA("EnemyB")||collision.obj.isA("EnemyC")||collision.obj.isA("EnemyD")) {
			////console.log("coll");//console.log(collision.obj);//	collision.obj.hit();
				collision.obj.hit();
				this.p.shooter.bullet++;
				this.destroy();
				stage.insert(new Q.Disappear1({ x: xX, y: yY },false));
				////console.log(f);
			}
			else if(collision.obj.isA("Brick")){
				if(this.p.first_colli){
					this.p.shooter.bullet++;
					this.p.first_colli = false;
				}
				collision.obj.destroy();
				this.destroy();
				stage.insert(new Q.Disappear1({ x: xX, y: yY},false));
				////console.log(f);
			}
			else if(collision.obj.isA("Swall")||collision.obj.isA("BulletE")){
				if(this.p.first_colli){
					this.p.shooter.bullet++;
					this.p.first_colli = false;
				}
				this.destroy();
				stage.insert(new Q.Disappear1({ x: xX, y: yY},false));
				////console.log(f);
			}
			else if(collision.obj.isA("Bird")){
				if(collision.obj.p.sheet!="flag"){
					var pX=collision.obj.p.x;
					var pY=collision.obj.p.y;
					this.p.shooter.bullet++;
					this.destroy();
					stage.insert(new Q.Disappear1({ x: xX, y: yY},false));
					stage.insert(new Q.Disappear1({ x: pX, y: pY},true));
					collision.obj.p.sheet='flag';
				}
				else{
					this.p.shooter.bullet++;
					this.destroy();
				}
			}
		}
	});
	
	Q.Sprite.extend('BulletE',{
		init: function(props) {
			this._super({
				sheet:"bullet",
				x: props.dx,
				y: props.dy,
				z: 0,
				angle: props.angle,
				belong: props.ene,
				firstCollide:true,
				type:SPRITE_BULLETE,
				collisionMask: SPRITE_TILES | SPRITE_PLAYER | SPRITE_BULLET | SPRITE_BARRIER
			});
//			this.on('step',this,'countdown');
			this.on("hit.sprite",'collision');
			this.add("2d,bulletControls");	
		},
		
		collision: function(collision) {
			var xX=this.p.x;
			var yY=this.p.y;
			var stage = this.stage;
			if(collision.obj.isA("Player")){
//				console.log(collision.obj);
				collision.obj.die();
				if(this.p.firstCollide){
					this.p.firstCollide=false;
					this.p.belong.bullet++;
				}
				this.destroy();
				stage.insert(new Q.Disappear1({ x: xX, y: yY},false));
			}
			else if(collision.obj.isA("Brick")){
				collision.obj.destroy();
				if(this.p.firstCollide){
					this.p.firstCollide=false;
					this.p.belong.bullet++;
				}
				this.destroy();
				stage.insert(new Q.Disappear1({ x: xX, y: yY},false));
			}
			else if(collision.obj.isA("Swall")||collision.obj.isA("Bullet")){
//			//console.log(this);
				if(this.p.firstCollide){
					this.p.firstCollide=false;
					this.p.belong.bullet++;
				}
				this.destroy();
				stage.insert(new Q.Disappear1({ x: xX, y: yY},false));
				////console.log(f);
			}
			else if(collision.obj.isA("Bird")){
				if(collision.obj.p.sheet!="flag"){
					var pX=collision.obj.p.x;
					var pY=collision.obj.p.y;
					if(this.p.firstCollide){
						this.p.firstCollide=false;
						this.p.belong.bullet++;
					}
					this.destroy();
					stage.insert(new Q.Disappear1({ x: xX, y: yY},false));
					stage.insert(new Q.Disappear1({ x: pX, y: pY},true));
					collision.obj.p.sheet='flag';
				}
				else{
					if(this.p.firstCollide){
					this.p.firstCollide=false;
					this.p.belong.bullet++;
					}
					this.destroy();
				}
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
	

	// 4. Add in a basic sprite to get started
	Q.Sprite.extend("Player", {
		init: function(p) {

			this._super(p,{
				sheet:"player",
				type: SPRITE_PLAYER,
				barrier: null,
//				points: [  [ -8, -8 ], [  8, -8 ], [  8,  8 ], [ -8,  8 ] ],
				collisionMask: SPRITE_TILES | SPRITE_ENEMY | SPRITE_BULLETE,// | SPRITE_BRICK | SPRITE_BIRD,
				bullet: 2,
				barrier_time: 3,
				z: 0,
				muteki: true
			});

			
			this.add("2d, towerManControls");
			this.on("inserted");
			this.on('step',this,'countdown');
		},
		
		countdown: function(dt) {
			this.p.barrier_time -= dt;
			//console.log(this.p.barrier_time);
			if(this.p.barrier_time <= 0) { 
				this.p.muteki = false;
				this.p.barrier.destroy();
				//this.p.barrier=null;
			}
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
			
			if(this.p.bullet != 0){
				var bullet = new Q.Bullet({dx: bullet_x, dy: bullet_y, angle: this.p.angle, shooter: this.p});

				Q.stage().insert(bullet);

				this.p.bullet--;
			}
		},

		inserted: function() {
//			//console.log(this);
			var f;
			var p=this.p;
			this.stage.insert(f=new Q.Barrier({ x: this.p.x, y: this.p.y }));
			p.barrier=f;
			console.log(p);
			console.log(f);
			//f.play('barrier');
			//setTimeout(function(){f.destroy();p.barrier=null;},5000);
		},
		die: function(){
			if(this.p.muteki != true){
				if(Q.stage().playerLife>0){
					console.log("die");
					Q.stage().playerLife--;
					Q.state.dec("lives",1);
					var pX=this.p.x;
					var pY=this.p.y;
					Q.stage().insert(new Q.Disappear1({ x: pX, y: pY},true));
					Q.stage().insert(new Q.Appear(Q.stage().playerStart,4,3.5));
					//Gloria add animation~~~~~~yeah~~~~~~~
					//add flash and then revive~
					this.destroy();
				}else{
					console.log("No life, endgame, score: "+this.stage.score);
					var pX=this.p.x;
					var pY=this.p.y;
					Q.stage().insert(new Q.Disappear1({ x: pX, y: pY},true));
					this.destroy();
					if (Q.stage().endgame == false) {
						Q.stage().endgame = true;
						$("#over").show().animate({
							top: 224
						}, 3000, function (){
							Q.clearStages();
							Q.stageScene('showScore');
						});
					}
				}
			}else{
				console.log("muteki, wahaha");


			}
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
			//if(this.entity.stage.diff==0){
				if(Math.random() < p.switchPercent / 100) {
					this.tryDirection();
				}
			// }
			/*else {
				if(Math.random() < p.switchPercent / 100) {
					var nY= false;
					var nX= false;
					if(p.vy != 0 && p.vx == 0) {
						nY= true;
					}
					else if(p.vx != 0 && p.vy == 0) {
						nX= true;
					}
					console.log("change "+p.vx+" "+p.vy);
					this.changeDirection({normalX:nX,normalY:nY});
				}
			 }*/
			switch(p.direction) {
				case "left": p.vx = -p.speed; p.vy = 0;break;
				case "right":p.vx = p.speed; p.vy = 0;break;
				case "up":   p.vx = 0; p.vy = -p.speed; break;
				case "down": p.vx = 0; p.vy = p.speed; break;
				case "stop": p.vx = 0; p.vy = 0;break;
			}
			switch(p.angle){
				case -90: bullet_x = p.x-22;bullet_y = p.y;break;
				case 90: bullet_x = p.x+22;bullet_y = p.y;break;
				case 0:   bullet_x = p.x; bullet_y = p.y-22;break;
				case 180:  bullet_x = p.x; bullet_y = p.y+22;break;
			}
			if((p.bullet>0)&&(!p.bulletCooldown)){
//			console.log(p.bullet);
				var bullet = new Q.BulletE({dx: bullet_x, dy: bullet_y, angle: p.angle, ene: p});
//				//console.log(bullet);
				this.entity.stage.insert(bullet);
				p.bullet--;
				p.bulletCooldown=true;
				setTimeout( function(){p.bulletCooldown = false;},  500);
			}
        },

        tryDirection: function() {
			var diff = this.entity.stage.diff;
			var p = this.entity.p; 
			var from = p.direction;
			if(diff==0){
				if(p.vy != 0 && p.vx == 0) {
					p.direction = Math.random() < 0.5 ? 'left' : 'right';
				} else if(p.vx != 0 && p.vy == 0) {
					p.direction = Math.random() < 0.5 ? 'up' : 'down';
				}
			}
			else{
				if(diff==1){
					var px=this.entity.stage.lists.Player[0].p.x;
					var py=this.entity.stage.lists.Player[0].p.y;
				}
				else{
					var px=this.entity.stage.lists.Bird[0].p.x;
					var py=this.entity.stage.lists.Bird[0].p.y;
				}
				if(p.vy != 0 && p.vx == 0) {
					if(p.x > px){
						p.direction = Math.random() < 0.95 ? 'left' : 'right';
					}
					else if(p.x == px){
						if(Math.random() < 0.95){
							if(p.y > py){
								p.direction = Math.random() < 0.95 ? 'up' : 'down';
							}
							else{
								p.direction = Math.random() < 0.05 ? 'up' : 'down';
							}
						}
						else{
							p.direction = Math.random() < 0.5 ? 'left' : 'right';
						}
					}
					else{
						p.direction = Math.random() < 0.05 ? 'left' : 'right';
					}
				}
				else if(p.vx != 0 && p.vy == 0) {
					if(p.y > py){
						p.direction = Math.random() < 0.95 ? 'up' : 'down';
					}
					else if(p.y == py){
						if(Math.random() < 0.95){
							if(p.x > px){
								p.direction = Math.random() < 0.95 ? 'left' : 'right';
							}
							else{
								p.direction = Math.random() < 0.05 ? 'left' : 'right';
							}
						}
						else{
							p.direction = Math.random() < 0.5 ? 'up' : 'down';
						}
					}
					else{
						p.direction = Math.random() < 0.05 ? 'up' : 'down';
					}
				}
			}
			// console.log("from "+from+" to "+p.direction+" "+p.vx+" "+p.vy);
        },

        changeDirection: function(collision) {
			var diff = this.entity.stage.diff;
			var p = this.entity.p;
			var from = p.direction;
////console.log(this.entity.stage.lists.Player[0].p.y);
			if(diff==0){
//				if(p.vx == 0 && p.vy == 0) {
					if(collision.normalY) {
						p.direction = Math.random() < 0.5 ? 'left' : 'right';
					} else if(collision.normalX) {
						p.direction = Math.random() < 0.5 ? 'up' : 'down';
					}
//				}
			}
			else{
				if(diff==1){
					var px=this.entity.stage.lists.Player[0].p.x;
					var py=this.entity.stage.lists.Player[0].p.y;
				}
				else{
					var px=this.entity.stage.lists.Bird[0].p.x;
					var py=this.entity.stage.lists.Bird[0].p.y;
				}
				if(collision.normalY) {
					if(p.x > px){
						p.direction = Math.random() < 0.95 ? 'left' : 'right';
					}
					else if(p.x == px){
						if(Math.random() < 0.95){
							if(p.y > py){
								p.direction = Math.random() < 0.95 ? 'up' : 'down';
							}
							else{
								p.direction = Math.random() < 0.05 ? 'up' : 'down';
							}
						}
						else{
							p.direction = Math.random() < 0.5 ? 'left' : 'right';
						}
					}
					else{
						p.direction = Math.random() < 0.05 ? 'left' : 'right';
					}
				}
				else if(collision.normalX) {
					if(p.y > py){
						p.direction = Math.random() < 0.95 ? 'up' : 'down';
					}
					else if(p.y == py){
						if(Math.random() < 0.95){
							if(p.x > px){
								p.direction = Math.random() < 0.95 ? 'left' : 'right';
							}
							else{
								p.direction = Math.random() < 0.05 ? 'left' : 'right';
							}
						}
						else{
							p.direction = Math.random() < 0.5 ? 'up' : 'down';
						}
					}
					else{
						p.direction = Math.random() < 0.05 ? 'up' : 'down';
					}
				}
			}
			// console.log("from "+from+" to "+p.direction+" "+p.vx+" "+p.vy);
        }
      });

	Q.animations('ani', {
	  appear: { frames: [0,1,2,3,2,1,0,1,2,3,2,1,0,1,2,3], rate: 1/5, loop: false , trigger: 'end'}, 
	  disappear1: { frames: [0,1,2], rate:1/8, trigger: 'end', loop: false  },
	  disappear2: { frames: [0,1], rate:1/8, loop: false , trigger: 'end' },
	  barrier: { frames: [0,1], rate:1/8, loop: true }
	});

    Q.Sprite.extend("Enemy", {
		init: function(p) {

			this._super(p,{
				sheet:"enemy",
				type: SPRITE_ENEMY,
				collisionMask: SPRITE_PLAYER | SPRITE_TILES | SPRITE_ENEMY | SPRITE_BULLET | SPRITE_BARRIER, //| SPRITE_BRICK | SPRITE_BIRD
//				fire:true,
				z: 0,
				bulletCooldown: false
			});

			this.add("2d,enemyControls");
//      	    this.on("hit.sprite",this,"hit");
			this.on("inserted");
        },

        hit: function() {
        //  if(col.obj.isA("Bullet")) {
			var stage=this.stage;
			var p= this.p;
			var wid=stage._collisionLayers[0].p.cols;
            p.health--;
			if(p.health==0){
				stage.score+=p.score;
				switch(p.name){
					case "A": stage.currentA++; break;
					case "B": stage.currentB++; break;
					case "C": stage.currentC++; break;
					case "D": stage.currentD++; break;
				}
				Q.state.dec(p.name+"Left",1);
				Q.state.inc(p.name+"Killed", 1);
				var xX=p.x;
				var yY=p.y;
				////console.log("x "+xX+" y "+yY);
				this.destroy();
				stage.currentEnemy--;
				stage.insert(new Q.Disappear1({ x: xX, y: yY}, p.score));
				Q.state.inc("score", p.score);
				////console.log(f);
				////console.log(stage.enemyNum);
				if(stage.enemyNum>0){
					var pos=[3.5,wid/2+0.5,wid-2.5];
					setTimeout(function(){
						var r=Math.floor((Math.random() * 3));
//						var gen=0;
//						while(!gen){
						var e=stage.enemyArr.shift();//Math.floor((Math.random() * 4));
						switch(e) {
							case 0: if(stage.enemyANum>0){stage.insert(new Q.Appear(Q.tilePos(pos[r],1.5),0,pos[r]));} break;
							case 1: if(stage.enemyBNum>0){stage.insert(new Q.Appear(Q.tilePos(pos[r],1.5),1,pos[r]));} break;
							case 2: if(stage.enemyCNum>0){stage.insert(new Q.Appear(Q.tilePos(pos[r],1.5),2,pos[r]));} break;
							case 3: if(stage.enemyDNum>0){stage.insert(new Q.Appear(Q.tilePos(pos[r],1.5),3,pos[r]));} break;
						}
						//this.stage.insert(new Q.EnemyA(Q.tilePos(pos[r],0.5)));
						// this.stage.insert(new Q.Enemy(Q.tilePos(4.5,6.5)));
					},2500);
				}
//				console.log("a "+stage.currentA+" b "+stage.currentB+" c "+stage.currentC+" d "+stage.currentD);
			}
        },
		inserted: function() {
//			//console.log(this);
			this.stage.enemyNum--;
			this.stage.currentEnemy++;
			Q.state.dec("eNum",1);
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
				switchPercent: 1,
				bullet: 1,
				health: 1,
				score: 100
			}));
			this.add("animation");
        },
		inserted: function() {
//			//console.log(this);
			this.stage.enemyNum--;
			this.stage.enemyANum--;
			this.stage.currentEnemy++;
			Q.state.dec("eNum",1);
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
				switchPercent: 2,
				bullet: 1,
				health: 2,
				score: 200
			}));
        },
		inserted: function() {
//			//console.log(this);
			this.stage.enemyNum--;
			this.stage.enemyBNum--;
			this.stage.currentEnemy++;
			Q.state.dec("eNum",1);
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
				bullet: 2,
				health: 1,
				score: 300
			}));
        },
		inserted: function() {
//			//console.log(this);
			this.stage.enemyNum--;
			this.stage.enemyCNum--;
			this.stage.currentEnemy++;
			Q.state.dec("eNum",1);
			//console.log(this.stage.enemyCNum);
		}
    });
	
    Q.Enemy.extend("EnemyD", {
        init: function(p) {
			this._super(Q._defaults(p,{
				sheet: "enemyD",
				name: "D",
				speed: 80,
				direction: 'down',
				switchPercent: 1,
				bullet: 1,
				health: 3,
				score: 400
			}));
        },
		inserted: function() {
//			//console.log(this);
			this.stage.enemyNum--;
			this.stage.enemyDNum--;
			this.stage.currentEnemy++;
			Q.state.dec("eNum",1);
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
				z: 0,
				posx:pos
			});
			this.add("animation");
			this.on("end",this,"des");
			this.on("inserted");
		},
		inserted: function() {
//			//console.log(this);
			this.play('appear');
			//console.log(this.stage.enemyCNum);
		},
		des:function() {
			//console.log("end");
			//console.log(this);
			var s=this.stage;
			this.destroy();
			switch(this.p.kind) {
				case 0: s.insert(new Q.EnemyA(Q.tilePos(this.p.posx,1.5)));break;
				case 1: s.insert(new Q.EnemyB(Q.tilePos(this.p.posx,1.5)));break;
				case 2: s.insert(new Q.EnemyC(Q.tilePos(this.p.posx,1.5)));break;
				case 3: s.insert(new Q.EnemyD(Q.tilePos(this.p.posx,1.5)));break;
				case 4: s.PlayerTank = s.insert(new Q.Player(s.playerStart));break;
			}
		}
	});
	
	Q.Sprite.extend("Disappear1", {
		init: function(p,cr) {
			this._super(p,{
				sheet: 'disappear1',
				sprite: "ani",
				type: SPRITE_APP,
				caller:cr
//				posx:x,
//				posy:y
			});
			this.add("animation");
			this.on("end",this,"des");
			this.on("inserted");
		},
		inserted: function() {
//			//console.log(this);
			this.play('disappear1');
			//console.log(this.stage.enemyCNum);
		},
		des:function() {
			//console.log("end");
			//console.log(this);
			var xX=this.p.x;
			var yY=this.p.y;
			var c=this.p.caller;
			var s= this.stage;
			this.destroy();
			if(c){
				s.insert(new Q.Disappear2({ x: xX, y: yY },c));
			}
		}
	});
	
	Q.Sprite.extend("Disappear2", {
		init: function(p,c) {
			this._super(p,{
				sheet: 'disappear2',
				sprite: "ani",
				type: SPRITE_APP,
				score:c
			});
			this.add("animation");
			this.on("end",this,"des");
			this.on("inserted");
		},
		inserted: function() {
//			//console.log(this);
			this.play('disappear2');
			//console.log(this.stage.enemyCNum);
		},
		des:function() {
			//console.log("end");
			//console.log(this);
			var xX=this.p.x;
			var yY=this.p.y;
			var c=this.p.score;
			var s= this.stage;
			this.destroy();
			if(c){
				s.insert(new Q.Score({ x: xX, y: yY },""+c));
			}
		}
	});

	Q.Sprite.extend("Score", {
		init: function(p,c) {
			this._super(p,{
				sheet: c,
				sprite: "ani",
				z: 2,
				type: SPRITE_APP
			});
			this.on("inserted");
//			this.on("end",this,"des");
		},
		inserted: function() {
			var p=this;
//			console.log(this);
			setTimeout(function(){p.destroy();},1000);
			//console.log(this.stage.enemyCNum);
		}
	});


	Q.Sprite.extend("Barrier", {
		init: function(p) {
			this._super(p,{
				sheet: 'barrier',
				sprite: "ani",
				z: 0,
				type: SPRITE_BARRIER
			});
			this.add("animation");
			this.on("inserted");
//			this.on("end",this,"des");
		},
		inserted: function() {
//			//console.log(this);
			this.play('barrier');
			//console.log(this.stage.enemyCNum);
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
					var e=stage.enemyArr.shift();//Math.floor((Math.random() * 4));
					switch(e) {
						case 0: if(stage.enemyANum>0){
									stage.insert(new Q.Appear(Q.tilePos(pos[r],1.5),0,pos[r]));
									//stage.insert(new Q.EnemyA(Q.tilePos(pos[r],1.5)));
//									gen=1;
								} break;
						case 1: if(stage.enemyBNum>0){
									stage.insert(new Q.Appear(Q.tilePos(pos[r],1.5),1,pos[r]));
									//stage.insert(new Q.EnemyB(Q.tilePos(pos[r],1.5)));
//									gen=1;
								} break;
						case 2: if(stage.enemyCNum>0){
									stage.insert(new Q.Appear(Q.tilePos(pos[r],1.5),2,pos[r]));
									//stage.insert(new Q.EnemyC(Q.tilePos(pos[r],1.5)));
//									gen=1;
								} break;
						case 3: if(stage.enemyDNum>0){
									stage.insert(new Q.Appear(Q.tilePos(pos[r],1.5),3,pos[r]));
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

	Q.genArray=function(stage){
		var arr=[];
		for(var i=0;i<stage.enemyANum;i++){
			arr.push(0);
		}
		for(var i=0;i<stage.enemyBNum;i++){
			arr.push(1);
		}
		for(var i=0;i<stage.enemyCNum;i++){
			arr.push(2);
		}
		for(var i=0;i<stage.enemyDNum;i++){
			arr.push(3);
		}
		return Q.shuffle(arr);
	}
	
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
				type: SPRITE_TREE,
				z: 1,
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


		}
	});
	
	// Tower is just a dot with a different sheet - use the same
	// sensor and counting functionality
	
	Q.Brick.extend("Bird", {
		init: function(p) {
			this._super(Q._defaults(p,{
				sheet: 'bird'
			}));
			this.on("hit.sprite",this,"hit");
		},
		hit: function(col){
			if(col.obj.isA("Bullet")||col.obj.isA("BulletE")){
				this.p.sheet='flag';
				console.log("endgame, score: "+this.stage.score);
				if (Q.stage().endgame == false) {
					Q.stage().endgame = true;
					$("#over").show().animate({
						top: 224
					}, 3000, function (){
						Q.clearStages();
						Q.stageScene('showScore');
					});
				}
			}
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
				dataAsset: '',
				sheet: ''
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
	
	Q.scene('showScore', function(stage) {
		//change outer into black and hide all numbers
		$("#outer").removeClass("outerImage");
		$("#outer").addClass("outerBlack");
		$(".numSprite").hide();
		$("#over").hide();
		$("#over").css("top","464px");
		$("#scoreBG").show();
		$("#levelNum").removeClass();
		$("#levelNum").addClass("numSprite num"+Q.state.get("stage"));
		$("#levelNum").show();
		
		//show total score(no animation)
		//Q.state.get("score");
		function numToImage(id, s, post){
			var oldid = id;
			//console.log("id: "+oldid+" s:"+s);
			s = s + "";
			var arr = s.split("");
			arr.reverse();
			$.each(arr, function(index, value){
				//console.log("INDEX: " + index + " VALUE: " + value);
				var $temp = $('<div class="numSprite grid num'+value+' '+post+'" id="temp'+index+post+'"></div>').insertBefore(oldid);
				var pos = $(oldid).position();
				$temp.css({
					position: 'absolute',
					top: Math.round(pos.top),
					left: Math.round(pos.left)-16
				});
				oldid = "#"+$temp.attr("id");
			});
		}
		
		var myArray = ["tScore", "A", "B", "C", "D", "tNum"];
		numToImage("#score0", Q.state.get("score"), "S0");
		function showAll(index, value){
			if (index > 4) {
				numToImage("#carnum0", Q.state.get("AKilled")+Q.state.get("BKilled")+Q.state.get("CKilled")+Q.state.get("DKilled"), "C0");
				setTimeout(function(){
					$(".grid").remove();
					$("#outer").removeClass("outerBlack");
					$("#outer").addClass("outerImage");
					//$(".numSprite").show();
					$("#scoreBG").hide();
					$("#levelNum").hide();
					Q.clearStages();
					var ll = Q.state.get("total")-Q.state.get("AKilled")-Q.state.get("BKilled")-Q.state.get("CKilled")-Q.state.get("DKilled");
					if (ll > 0){
						//game over
					} else if (ll == 0 && Q.state.get("stage") <= 2){
						Q.stageScene("level"+(Q.state.get("stage")+1));
					}
				}, 3000);
				return;
			}
			//var killed = Q.state.get(value+"Num") - Q.state.get(value+"Left");
			var killed = Q.state.get(value+"Killed");
			var i = 0;
			
			var iid = setInterval(function showS(){
				if (i <= killed) {
					$(".S"+index).remove();
					$(".C"+index).remove();
					numToImage("#score"+index, i*Q.state.get(value+"Score"), "S"+index);
					numToImage("#carnum"+index, i, "C"+index);
					i++;
				} else {
					clearInterval(iid);
					showAll(index+1, myArray[index+1]);
				}
			}, 400);
		}
		showAll(1, myArray[1]);
		
	});

	Q.scene('ui', function(stage){
		$("#level1").removeClass();
		$("#level1").addClass("numSprite num"+Q.state.get("stage"));
		$("#level0").show();
		$("#level1").show();
		$("#lives1").addClass("num" + Q.state.get("lives"));
		$("#lives1").show();
		//$(".bomb").hide();
		var divs = $(".bomb").map(function(){
			if (this.id.replace('en', '') <= Q.state.get("eNum")) {
				return this;
			}
		}).get();
		$(divs).show();
		
		Q.state.on("change.eNum",this, function() {
            var divs = $(".bomb").map(function(){
				if (this.id.replace('en', '') > Q.state.get("eNum")) {
					return this;
				}
			}).get();
			$(divs).hide();
        });
		
		Q.state.on("change.lives",this, function() {
			$("#lives1").removeClass();
			$("#lives1").addClass("numSprite num"+Q.state.get("lives"));
		});
	});
	
	Q.scene("level1",function(stage) {
		var map = stage.collisionLayer(new Q.TowerManMap({dataAsset: 'level1.json', sheet: 'tiles'}));
		map.setup();
		stage.playerStart=Q.tilePos2(5.5,12.5);
		stage.insert(new Q.Bird(Q.tilePos2(7.5,12.5)));
		stage.PlayerTank = stage.insert(new Q.Player(stage.playerStart));
//		 stage.add("viewport").follow(stage.PlayerTank);
		stage.playerLife = 2;
		stage.endgame = false;
		stage.enemyNum=3;
		stage.enemyANum=3;
		stage.enemyBNum=0;
		stage.enemyCNum=0;
		stage.enemyDNum=0;
		stage.enemyMax=3;
		stage.currentEnemy=0;
		stage.currentA=0;
		stage.currentB=0;
		stage.currentC=0;
		stage.currentD=0;
		stage.score=0;
		stage.diff=0;
		stage.enemyArr=Q.genArray(stage);
		console.log(stage.enemyArr);
		stage.add("viewport");
		stage.moveTo(32,0);
		Q.genEnemy(stage,map.p.tiles[0].length,stage.enemyMax);
		Q.state.set({
			eNum: stage.enemyNum,
			lives: stage.playerLife,
			stage: 1,
			score: 0,
			total: stage.enemyNum,
			ANum: stage.enemyANum,
			BNum: stage.enemyBNum,
			CNum: stage.enemyCNum,
			DNum: stage.enemyDNum,
			ALeft: stage.enemyANum,
			BLeft: stage.enemyBNum,
			CLeft: stage.enemyCNum,
			DLeft: stage.enemyDNum,
			AKilled: stage.currentA,
			BKilled: stage.currentB,
			CKilled: stage.currentC,
			DKilled: stage.currentD,
			AScore: 100,
			BScore: 200,
			CScore: 300,
			DScore: 400
		});
		Q.stageScene("ui",1);
	}, {sort:true});
	
	Q.scene("level2",function(stage) {
		var map = stage.collisionLayer(new Q.TowerManMap({dataAsset: 'level2.json', sheet: 'tiles'}));
		map.setup();

		stage.add("viewport");
		stage.moveTo(32,0);
		stage.playerStart=Q.tilePos2(5.5,12.5);
		stage.PlayerTank = stage.insert(new Q.Player(stage.playerStart));
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
		
		stage.playerLife = Q.state.get("lives");
		stage.endgame = false;
		stage.enemyNum=10;
		stage.enemyANum=8;
		stage.enemyBNum=2;
		stage.enemyCNum=0;
		stage.enemyDNum=0;
		stage.enemyMax=3;
		stage.currentEnemy=0;
		stage.currentA=0;
		stage.currentB=0;
		stage.currentC=0;
		stage.currentD=0;
		stage.score=0;
		stage.diff=0;
		stage.enemyArr=Q.genArray(stage);
		console.log(stage.enemyArr);
		stage.add("viewport");
		stage.moveTo(32,0);
		Q.genEnemy(stage,map.p.tiles[0].length,stage.enemyMax);
		Q.state.set({
			eNum: stage.enemyNum,
			//lives: stage.playerLife,
			stage: 2,
			//score: 0,
			total: stage.enemyNum,
			ANum: stage.enemyANum,
			BNum: stage.enemyBNum,
			CNum: stage.enemyCNum,
			DNum: stage.enemyDNum,
			ALeft: stage.enemyANum,
			BLeft: stage.enemyBNum,
			CLeft: stage.enemyCNum,
			DLeft: stage.enemyDNum,
			AKilled: stage.currentA,
			BKilled: stage.currentB,
			CKilled: stage.currentC,
			DKilled: stage.currentD,
			//AScore: 100,
			//BScore: 200,
			//CScore: 300,
			//DScore: 400
		});
		Q.stageScene("ui",1);
	}, {sort: true});

	Q.load("sprites2.png, newSprites.json, level1.json, level2.json", function() {
		//Q.sheet("tiles","tiles.png", { tileW: 16, tileH: 16 });

		Q.compileSheets("sprites2.png","newSprites.json");

		Q.state.reset({ score: 0, lives: 2, stage: 1 });
		Q.stageScene("level1");
	});

	
});
