
window.bg_timer = null;

var hit_counter = 0;
var no_of_player = 4;


var socket = io.connect('http://ec2-54-254-178-30.ap-southeast-1.compute.amazonaws.com:8078');

socket.on('sync', function(obj){
if(obj.room == proom){
for(var player_no = 0; player_no < no_of_player; player_no++){
	if(obj.player[player_no] && player_no != pid){
		//console.log(player_no);
		//console.log(Q2.sync_info.player[player_no]);
		//console.log(obj.player[player_no]);
		
		Q2.sync_info.player[player_no].p.x = obj.player[player_no].x;
		Q2.sync_info.player[player_no].p.y = obj.player[player_no].y;
		Q2.sync_info.player[player_no].p.vx = obj.player[player_no].vx;
		Q2.sync_info.player[player_no].p.vy = obj.player[player_no].vy;
		Q2.sync_info.player[player_no].p.angle = obj.player[player_no].angle;
  //Q2.sync_info.player[player_no].fire();
  
  for(var b_count = 0;obj.player[player_no].bullet[b_count]; b_count++){
	//console.log("sd2");
	//console.log(obj.player[player_no].bullet[b_count].id);
	//console.log(Q2.sync_info.player[player_no].bullet[obj.player[player_no].bullet[b_count].id]);
	var bullet_id = obj.player[player_no].bullet[b_count].id;
	//console.log(bullet_id);
	//console.log(Q2.sync_info.bullet[player_no][bullet_id]);
    if(!Q2.sync_info.bullet_list[player_no][bullet_id]){
		Q2.sync_info.bullet_list[player_no][bullet_id] = new Q2.Bullet_zom({shooter: Q2.sync_info.player[player_no],no_bullet: bullet_id});
		Q2.stage().insert(Q2.sync_info.bullet_list[player_no][bullet_id]);
		//console.log("sd");
	}
	
	Q2.sync_info.bullet_list[player_no][bullet_id].p.x = obj.player[player_no].bullet[b_count].x;
	Q2.sync_info.bullet_list[player_no][bullet_id].p.y = obj.player[player_no].bullet[b_count].y;
	Q2.sync_info.bullet_list[player_no][bullet_id].p.vx = obj.player[player_no].bullet[b_count].vx;
	Q2.sync_info.bullet_list[player_no][bullet_id].p.vy = obj.player[player_no].bullet[b_count].vy;
	Q2.sync_info.bullet_list[player_no][bullet_id].p.angle = obj.player[player_no].bullet[b_count].angle;
	
 }
 
   for(var d_counter = 0; obj.destroy_list[d_counter]; d_counter++){
	
	if(Q2.stage().locate(obj.destroy_list[d_counter].x,obj.destroy_list[d_counter].y)){
		//console.log(d_counter);
		if(Q2.stage().locate(obj.destroy_list[d_counter].x,obj.destroy_list[d_counter].y).isA("Brick")){
			Q2.stage().locate(obj.destroy_list[d_counter].x,obj.destroy_list[d_counter].y).destroy();
		}
	}
  }
  

  
  for(var h_count = 0;obj.player[player_no].hit_list[h_count]; h_count++){
	//console.log("sd2");
	//console.log(obj.player[player_no].bullet[b_count].id);
	//console.log(Q2.sync_info.player[player_no].bullet[obj.player[player_no].bullet[b_count].id]);
	//var hit_var = Q2.sync_info.player[player_no].hit_list[obj.player[player_no].hit_list[h_count].counter];
	//var hit_obj = obj.player[player_no].hit_list[h_count];
	
    if(!Q2.sync_info.hit_list[player_no][h_count]){
		
		Q2.sync_info.hit_list[player_no][h_count] = {};
		
		Q2.sync_info.hit_list[player_no][h_count].id = obj.player[player_no].hit_list[h_count].hit_p;
		Q2.sync_info.hit_list[player_no][h_count].not_used = true;
		//Q2.stage().insert(Q2.sync_info.player[player_no].bullet[obj.player[player_no].bullet[b_count].id]);
		//console.log("sd");
	}
	if(Q2.sync_info.hit_list[player_no][h_count].not_used){
		Q2.sync_info.hit_list[player_no][h_count].not_used = false;
		var player_kill = obj.player[player_no].hit_list[h_count].hit_p;
		Q2.sync_info.player[player_kill].die();
	}
	
	/*
	Q2.sync_info.player[player_no].bullet[obj.player[player_no].bullet[b_count].id].p.x = obj.player[player_no].bullet[b_count].x;
	Q2.sync_info.player[player_no].bullet[obj.player[player_no].bullet[b_count].id].p.y = obj.player[player_no].bullet[b_count].y;
	Q2.sync_info.player[player_no].bullet[obj.player[player_no].bullet[b_count].id].p.vx = obj.player[player_no].bullet[b_count].vx;
	Q2.sync_info.player[player_no].bullet[obj.player[player_no].bullet[b_count].id].p.vy = obj.player[player_no].bullet[b_count].vy;
	Q2.sync_info.player[player_no].bullet[obj.player[player_no].bullet[b_count].id].p.angle = obj.player[player_no].bullet[b_count].angle;
	*/
	
 }
 
 
 }
 
 }
}
});

var zom_car = function() {
for(var player_no = 0; player_no < no_of_player; player_no++){
console.log(player_no);
	if(player_no != pid){
		Q2.sync_info.player[player_no] = Q2.stage().insert(new Q2.Player(Q2.p_start[player_no],player_no));
		
		//Q2.sync_info.player[player_no]
		Q2.input.off("fire",Q2.sync_info.player[player_no],"fire");
		Q2.input.off("action",Q2.sync_info.player[player_no],"item");
		Q2.sync_info.player[player_no].towerManControls.destroy();
	}else{
		Q2.sync_info.player[player_no] = Q2.stage().PlayerTank;
	}
	Q2.sync_info.bullet_list[player_no] = new Array();
	Q2.sync_info.hit_list[player_no] = new Array();
	Q2.sync_info.life = [];
	Q2.sync_info.life[0] = Q2.sync_info.life[1] = Q2.sync_info.life[2] = Q2.sync_info.life[3] = 3;

}
}

var start_round = function() {

bg_timer = setInterval(function() {
	
    var info = {};
	info.room = proom;
	//console.log(info.room);
	//console.log(Q2.sync_info.p.x);
	info.player = {};
	//for(var player_no = 0; player_no < no_of_player; player_no++){
	//if(player_no == pid){
	//info.player[0] = Q2.sync_info.player[0].p;
	info.player[pid] = {};
	info.player[pid].x = Q2.sync_info.player[pid].p.x;
	info.player[pid].y = Q2.sync_info.player[pid].p.y;
	info.player[pid].vx = Q2.sync_info.player[pid].p.vx;
	info.player[pid].vy = Q2.sync_info.player[pid].p.vy;
	info.player[pid].angle = Q2.sync_info.player[pid].p.angle;
	var tmp_no_bullet = 0;
	info.player[pid].bullet = {};
	for(var b_count = 0; b_count < Q2.sync_info.bullet_list[pid].length; b_count++){
		
		
			
		if(Q2.sync_info.bullet_list[pid][b_count].p.first_colli){
			info.player[pid].bullet[tmp_no_bullet] = {};
			info.player[pid].bullet[tmp_no_bullet].id = b_count;
			info.player[pid].bullet[tmp_no_bullet].x = Q2.sync_info.bullet_list[pid][b_count].p.x;
			info.player[pid].bullet[tmp_no_bullet].y = Q2.sync_info.bullet_list[pid][b_count].p.y;
			info.player[pid].bullet[tmp_no_bullet].vx = Q2.sync_info.bullet_list[pid][b_count].p.vx;
			info.player[pid].bullet[tmp_no_bullet].vy = Q2.sync_info.bullet_list[pid][b_count].p.vy;
			info.player[pid].bullet[tmp_no_bullet++].angle = Q2.sync_info.bullet_list[pid][b_count].p.angle;
			//console.log(Q2.sync_info.player[pid].p.bullet_list[b_count].p.no_bullet);
		}
	}
	
	var tmp_no_destroy = 0;
	info.destroy_list = {};
	for(var d_count = 0; Q2.sync_info.destroy_list[d_count]; d_count++){
		
		
		if(Q2.sync_info.destroy_list[d_count]){
		//console.log(Q2.sync_info.destroy_list[d_count].x);
			info.destroy_list[tmp_no_destroy] = {};
			info.destroy_list[tmp_no_destroy].x = Q2.sync_info.destroy_list[d_count].x;
			info.destroy_list[tmp_no_destroy++].y = Q2.sync_info.destroy_list[d_count].y;
		}
	}
	var tmp_no_hit = 0;
	info.player[pid].hit_list = {};
	for(var h_count = 0; h_count < Q2.sync_info.hit_list[pid].length; h_count++){
		info.player[pid].hit_list[tmp_no_hit] = {};
		info.player[pid].hit_list[tmp_no_hit].id = hit_counter++;
		info.player[pid].hit_list[tmp_no_hit].hit_p = Q2.sync_info.hit_list[pid][tmp_no_hit++].p.Id;
	}
	
    socket.json.emit('sync', info);
  }, TICK_INTERVAL);
  
  
}

/*

*/
//setTimeout(start_round,7000);

/*
var window_width = jQuery(window).width();
var player1_arrow_width = jQuery('#player1_arrow').width();
jQuery('#player1_arrow').css({left: ((window_width / 2) - player1_arrow_width - 350) + 'px'});
jQuery('#player2_arrow').css({left: ((window_width / 2) + 350) + 'px'});
*/