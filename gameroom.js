var lvlArr=[5,2,2,3];
var playerArr=Array();
var myRoom;
var myLevel;
var myType;
var imgArr1=['http://cdn.wikimg.net/strategywiki/images/5/5e/Battle_City_Stage01.png','http://cdn.wikimg.net/strategywiki/images/6/65/Battle_City_Stage02.png','http://cdn.wikimg.net/strategywiki/images/2/2f/Battle_City_Stage03.png','http://cdn.wikimg.net/strategywiki/images/f/f8/Battle_City_Stage14.png','http://cdn.wikimg.net/strategywiki/images/3/36/Battle_City_Stage17.png'];
var imgArr2=['./images/two1.png','./images/two2.png'];
var imgArr3=['./images/four1.png','./images/fourin1.png'];
var imgArr4=['./images/four1.png','./images/four2.png','./images/fourin1.png'];
var playid;
var myNum;
var log = 0;
var myItem;
var myVar=null;;
var carArray = ["normal", "speed", "bullet2", "blood2", "amptank"];
var statusArray = ["Activate", "Use It?", "Used"];
var basicP = new Array();
basicP[0] = [90, 220, 500];
basicP[1] = [150, 220, 500];
basicP[2] = [80, 220, 500];
basicP[3] = [90, 220, 500];
basicP[4] = [100, 220, 500];
var maxP = new Array();
maxP[0] = [210, 750, 100];
maxP[1] = [270, 750, 100];
maxP[2] = [200, 750, 100];
maxP[3] = [210, 750, 100];
maxP[4] = [220, 750, 100];
var sliderInfo = [0, 100, 1, 3]; //min, max, step, numofslider
var upP = new Array();
var carNeed = [0, 70, 150, 400, 1000];
var spendArray = [100, 100, 100];

var currentNum = 0;
var myPlayer = {
	id: 'haha',
	coins: 0,
	currentcar: 'hoho'
};
var myCar = {};
var allCars = new Array(); //(0,1,3,2)
var pid;
var proom;
var no_of_player;
var pmode;

$(document).ready(function() {
	loadFBSDK(function(){
		setup(function(){
			loadPage();
		});
	});
	$.post("http://54.254.178.30:1234/getroom", function(json) {
		printRoooms(json);
	});
	$("#new").click(function(){
		if($("#"+playid).length>0){
			openAlert("You need to leave the current gameroom before joining a new one!<br>But, if you have created a room, you cannot leave it.");
		}
		else{
			$("#newgrModal").css("display","block");
			$("#over1").css("display","block");
		}
	});	
	$("#over1").click(function(){
		$("#coinModal").css("display","none");
		$("#warningModal").css("display","none");
		$("#newgrModal").css("display","none");
		$("#over1").css("display","none");
		$("#main").css("display","block");
		$("#outer").css("display","none");
		if(!myVar){
			myVar = setInterval(function(){myTimer()},1500);
		}
		$( "input[name='num']:checked" ).prop('checked', false); 
		$( "input[name='type4P']:checked" ).prop('checked', false); 
		$("#startGame").slideUp();
		$("#submitNewgrForm").slideUp();
		$("#choose4P").slideUp();
		$("#chooseMap").slideUp();
		$("#chooseLevel").slideUp();
	});	
	$("input[name='num']").change(function(){
		if($(this).val()==4){
			$("#choose4P").slideDown();
			$("#chooseMap").slideUp();
			$("#chooseLevel").slideUp();
			$("#startGame").slideUp();
			$("#submitNewgrForm").slideUp();
		}
		else if($(this).val()==1){
			$("#choose4P").slideUp();
			$( "input[name='type4P']:checked" ).prop('checked', false); 
			$("#chooseMap").slideUp();
			$("input[name='level']").prop('max',lvlArr[0]);
			$("input[name='level']").prop('value',1);
			$("#previewLevel").prop('src',imgArr1[0]);
			$("#chooseLevel").slideDown();
			$("#startGame").slideDown();
			$("#submitNewgrForm").slideUp();
		}
		else if($(this).val()==2){
			$("#choose4P").slideUp();
			$( "input[name='type4P']:checked" ).prop('checked', false); 
			$("#chooseLevel").slideUp();
			$("input[name='map']").prop('max',lvlArr[1]);
			$("input[name='map']").prop('value',1);
			$("#previewMap").prop('src',imgArr2[0]);
			$("#chooseMap").slideDown();
			$("#startGame").slideUp();
			$("#submitNewgrForm").slideDown();
		}
	});
	$("input[name='type4P']").change(function(){
		if($(this).val()==3){
			$("input[name='map']").prop('max',lvlArr[2]);
			$("input[name='map']").prop('value',1);
			$("#previewMap").prop('src',imgArr3[0]);
			$("#chooseMap").slideDown();
			$("#startGame").slideUp();
			$("#submitNewgrForm").slideDown();
		}
		else if($(this).val()==4){
			$("input[name='map']").prop('max',lvlArr[3]);
			$("input[name='map']").prop('value',1);
			$("#previewMap").prop('src',imgArr4[0]);
			$("#chooseMap").slideDown();
			$("#startGame").slideUp();
			$("#submitNewgrForm").slideDown();
		}
	});
	$("input[name='level']").change(function(){
		var n=$(this).val();
		$("#previewLevel").prop('src',imgArr1[n-1]);
	});
	$("input[name='map']").change(function(){
		var n=$(this).val();
		if($("input[name='num']:checked").val()==2){
			$("#previewMap").prop('src',imgArr2[n-1]);
		}
		else if($("input[name='type4P']:checked").val()==3){
			$("#previewMap").prop('src',imgArr3[n-1]);
		}
		else{
			$("#previewMap").prop('src',imgArr4[n-1]);
		}
	});
	$("#submitNewgrBtn").click(function(e){
		e.preventDefault();
		var time1=new Date().getTime();
		$("input[name='pid']").val(playid);
		$("input[name='rid']").val(playid+"ttt"+time1);
		console.log($("#newgrForm").serialize());
		$.post("http://54.254.178.30:1234/newroom", $("#newgrForm").serialize(), function(json) {
			$("#over1").click();
			printRoooms(json);
		});
	});
	$("#startGameBtn").click(function(e){
		e.preventDefault();
		var n="level"+$("input[name='level']").val();
//		console.log($("#newgrForm").serialize());
        console.log("play");
		$("#over1").click();
		$("#main").css("display","none");
		$("#outer").css("display","block");
		if(myVar){
			window.clearInterval(myVar);
			myVar=null;
		}
//		console.log("curr car "+myPlayer.currentcar+" cool "+myCar[myPlayer.currentcar][2]+" bullet "+myCar[myPlayer.currentcar][1]+" move "+myCar[myPlayer.currentcar][0]);
		if(log){
			Q.setPlayer(playid,myPlayer.currentcar,"grenade",myCar[myPlayer.currentcar][2],myCar[myPlayer.currentcar][1],myCar[myPlayer.currentcar][0]);
		}
		else{
			Q.setPlayer("abc","normal","grenade",500,220,90);
		}
		Q.clearStages();
		Q.state.reset({ score: 0, lives: 2, stage: n });
		Q.stageScene(n);
		$("#myGame").attr('tabindex','0');
		$("#myGame").focus();
	});
	$("#startMultiGameBtn").click(function(e){
		e.preventDefault();
		if(myVar){
			window.clearInterval(myVar);
			myVar=null;
		}
		if(($("input[name='item']:checked").val())){
			myItem=$("input[name='item']:checked").val();
		}
		else{
			myItem="none";
		}
//		console.log($("#newgrForm").serialize());
        console.log($("input[name='item']:checked").val());
		$("#chooseItemModal").css("display","none");
		$( "input[name='item']:checked" ).prop('checked', false); 
		console.log("me "+ playid+" ppl "+playerArr+" room "+myRoom+" type "+myType+" item "+myItem+" level "+myLevel+" ## "+playerArr.length+" # "+myNum);
		var poststr="";
		for (var i=0; i < playerArr.length; i++){
			poststr += "player"+(i+1)+"="+playerArr[i]+"&";
		}
		console.log("poststr "+poststr);
		$.post("http://54.254.178.30:1234/carsinroom",poststr, function(json) {
			if (json != null) {
				console.log(json);
				console.log(json[0]+" "+json[1]+" "+json[2]+" "+json[3]);
				allCars[0] = json[0];
				allCars[1] = json[1];
				allCars[2] = json[3];
				allCars[3] = json[2];
				$.post("http://54.254.178.30:1234/removeroom","roomId="+myRoom, function(json) {
					printRoooms(json);
				});
				$("#over2").css("display","none");
				$(".overlay").click();
				$("#main").css("display","none");
				$("#outer").css("display","block");
				if(myVar){
					window.clearInterval(myVar);
					myVar=null;
				}			
				pid = myNum;
				proom = myRoom;
				no_of_player = playerArr.length;
				pmode=myType;
/*				Q2.sync_info = [];
				Q2.sync_info.player = [];
				Q2.sync_info.bullet_list = [];

				Q2.sync_info.destroy_list = [];
				Q2.sync_info.hit_list = [];
				Q2.sync_info.barrier_list = [];
				Q2.sync_info.brick_list = [];*/
				if(log){
					Q2.setPlayer(playid,myPlayer.currentcar,myItem,myCar[myPlayer.currentcar][2],myCar[myPlayer.currentcar][1],myCar[myPlayer.currentcar][0]);
				}
				else{
					Q2.setPlayer("abc","normal",myItem,500,220,90);
				}
				Q2.state.reset({ score: 0, lives: 2, stage: 1 });
				var sta="level1";
				switch(myType){
					case "2": if(myLevel=="1"){sta="2p_1";}else if(myLevel=="2"){sta="2p_snow";}break;
					case "3": if(myLevel=="1"){sta="4p_1";}else if(myLevel=="2"){sta="4p_snow";}break;
					case "4": if(myLevel=="1"){sta="4p_1";}else if(myLevel=="2"){sta="4p_team";}else if(myLevel=="3"){sta="4p_snow";}break;
				}
				console.log(sta);
				Q2.clearStages();
				Q2.stageScene(sta);
				zom_car();
				setTimeout(start_round,7000);
				$("#countdownModal").css("display","block");
				$("#over2").css("display","block");
				for(var i=5;i>=0;i--){
					var j=i;
					var sth=function(j){
						setTimeout(function(){
							$("#countdownModal").html(j);
							if(j==0){
								$("#countdownModal").css("display","none");
								$("#over2").css("display","none");
								$("#myGame").attr('tabindex','0');
								$("#myGame").focus();
							}
						},1000*(5-j));
					}
					sth(j);
				}
			}
		});
		
	});
	myVar = setInterval(function(){myTimer()},1500);
	function myTimer() {
		$.post("http://54.254.178.30:1234/getroom", function(json) {
			printRoooms(json);
		});
	}
	


/*	$("input[name='up']").change(function(){
		if($("input[name='up']:checked").val()=="go"){
			myVar = setInterval(function(){myTimer()},1500);
		}
		else{
			window.clearInterval(myVar);
			myVar=null;
			console.log(myVar);
		}
	});*/
/*	$("input[name='up']").change(function(){
		if($("input[name='up']:checked").val()=="go"){
			myVar = setInterval(function(){myTimer()},1500);
		}
		else{
			window.clearInterval(myVar);
		}
	});*/
	$("#mypageBtn").click(function(){
		loadPage();
		$("#myInfo").css("display","block");
		$("#main").css("display","none");
		$("#outer").css("display","none");
		if(!myVar){
			myVar = setInterval(function(){myTimer()},1500);
		}
		
	});	
	$("#mypagebackBtn").click(function(){
		$("#myInfo").css("display","none");
		$("#main").css("display","block");
		$("#outer").css("display","none");
		if(!myVar){
			myVar = setInterval(function(){myTimer()},1500);
		}
	});	

	$("#left").click(function(){
		var nextNum = currentNum - 1;
		if (nextNum >= 0) {
			$("#carContainer").css('background-image', 'url("images/car/'+carArray[nextNum]+'.png")');
			currentNum = nextNum;
			nameStatus(currentNum);
			disableButton(currentNum);
		}
	});
	$("#right").click(function(){
		var nextNum = currentNum + 1;
		if (nextNum < carArray.length) {
			$("#carContainer").css('background-image', 'url("images/car/'+carArray[nextNum]+'.png")');
			currentNum = nextNum;
			nameStatus(currentNum);
			disableButton(currentNum);
		}
	});
	$("#carStatus").click(function(){
		var cs = $("#carStatus").html();
		if (cs == statusArray[0]) {
			buyCar(currentNum);
		} else if (cs == statusArray[1]) {
			useCar(currentNum);
		} else {
			console.log("what's wrong with car status?");
		}
		console.log("player is "+playid);
	});
	$("button[id^=buy]").click(function(event){
		var idnum = event.target.id.replace(/buy/, '');
		var cartype = carArray[currentNum];
		//var v = sliderToReal($("#property"+idnum).slider("option","value"));
		console.log(sliderToReal($("#property"+idnum).slider("value"), idnum, currentNum));
		console.log(myPlayer.coins+" "+spendArray[idnum]);
		if (myPlayer.coins < spendArray[idnum]){
			console.log("from client: no money no talk");
		} else {
			if (log == 1){
				var postStr="pId="+playid+"&cartype="+cartype+"&needm="+spendArray[idnum]+"&qn="+idnum+"&up="+upP[currentNum][idnum];
				console.log(postStr);
				$.post("http://54.254.178.30:1234/buyp", postStr, function(json) {
					console.log("afterpost"+json);
					if (json == "nomoney"){
						console.log("in fact you have no money");
					}
					loadPage();
				});
			}		
		}
	});
});

function printRoooms(json){
	var len=json.length;
	var enter=0;
	var content="";
	playerArr=Array();
	var full=false;
	for(var i=len; i>0; i--){
		var n=len-i;
//		console.log("back "+i+" _id "+json[i-1]._id+" roomid "+json[i-1].roomid+" playerN "+json[i-1].playerN+" mapN "+json[i-1].mapN+" player1 "+json[i-1].player1+" p2 "+json[i-1].player2);
		if(!enter){
			content+='<div class="tbl_row">';
		}
		content+='<div class="tbl_cell">';
		content+='<div class="tbl room" id="room'+n+'">';
		content+='<div class="tbl_row"><div class="tbl_cell"></div>';
		if(json[i-1].playerN>0){
			if(!json[i-1].player1){
				content=content+'<div class="tbl_cell join center"><button class="join1 '+json[i-1].roomid+'">join</button></div>';
			}
			else{
				content=content+'<div class="tbl_cell join center"><button class="join1 '+json[i-1].roomid+'" id="'+json[i-1].player1+'" disabled></button></div>';
				if(playid==json[i-1].player1){
					myRoom=json[i-1].roomid;
					myLevel=json[i-1].mapN;
					myType=json[i-1].playerN;
					myNum=0;
				}
			}
		}
		else{
			content+='<div class="tbl_cell join center"></div>';
		}
		content+='<div class="tbl_cell"></div></div><div class="tbl_row">';
		if(json[i-1].playerN>1){
			if(!json[i-1].player2){
				content=content+'<div class="tbl_cell join middle"><button class="join2 '+json[i-1].roomid+'">join</button></div>';
			}
			else{
				content=content+'<div class="tbl_cell join middle"><button class="join2 '+json[i-1].roomid+'" id="'+json[i-1].player2+'" disabled></button></div>';
				if(playid==json[i-1].player2){
					myRoom=json[i-1].roomid;
					myLevel=json[i-1].mapN;
					myType=json[i-1].playerN;
					myNum=1;
				}
			}
		}
		else{
			content+='<div class="tbl_cell join middle"></div>';
		}
		content+='<div class="tbl_cell table"><img class="pre" src="';
		switch(json[i-1].playerN){
			case "1":content+=imgArr1[json[i-1].mapN-1];break;
			case "2":content+=imgArr2[json[i-1].mapN-1];break;
			case "3":content+=imgArr3[json[i-1].mapN-1];break;
			case "4":content+=imgArr4[json[i-1].mapN-1];break;
		}
		content+='"></img></div>';
		if(json[i-1].playerN>2){
			if(!json[i-1].player4){
				content=content+'<div class="tbl_cell join middle"><button class="join4 '+json[i-1].roomid+'">join</button></div>';
			}
			else{
				content=content+'<div class="tbl_cell join middle"><button class="join4 '+json[i-1].roomid+'" id="'+json[i-1].player4+'" disabled></button></div>';
				if(playid==json[i-1].player4){
					myRoom=json[i-1].roomid;
					myLevel=json[i-1].mapN;
					myType=json[i-1].playerN;
					myNum=3;
				}
			}
		}
		else{
			content+='<div class="tbl_cell join middle"></div>';
		}
		content+='</div><div class="tbl_row"><div class="tbl_cell"></div>';
		if(json[i-1].playerN>2){
			if(!json[i-1].player3){
				content=content+'<div class="tbl_cell join center"><button class="join3 '+json[i-1].roomid+'">join</button></div>';
			}
			else{
				content=content+'<div class="tbl_cell join center"><button class="join3 '+json[i-1].roomid+'" id="'+json[i-1].player3+'" disabled></button></div>';
				if(playid==json[i-1].player3){
					myRoom=json[i-1].roomid;
					myLevel=json[i-1].mapN;
					myType=json[i-1].playerN;
					myNum=2;
				}
			}
		}
		else{
			content+='<div class="tbl_cell join center"></div>';
		}
		content+='<div class="tbl_cell"></div></div></div></div><div class="tbl_cell">';
		content+='<div class="tbl roomInfo" id="info'+n+'">';
		if(json[i-1].playerN<3){
			content+='<div class="tbl_row"><div class="tbl_cell">Information: <br>- '+json[i-1].playerN+' Players<br>- Level '+json[i-1].mapN+'</div></div></div></div>';
		}
		else{
			content+='<div class="tbl_row"><div class="tbl_cell">Information: <br>- 4 Players<br>- ';
			if(json[i-1].playerN==3){
				content+='Individual Play<br>- Map '+json[i-1].mapN+'</div></div></div></div>';
			}
			else{
				content+='Team Play<br>- Map '+json[i-1].mapN+'</div></div></div></div>';
			}
		}
		if(enter){
			content+='</div>';
		}
		if(enter){
			enter=0;
		}
		else{
			enter=1;
		}
	}
	$("#rooms").html(content);
	//console.log($("#"+playid).html());
	if($("#"+playid).length>0){
		$("#"+playid).addClass("seated");
		$("#"+playid).parent().removeClass("join");
		if(myRoom.indexOf(playid+"ttt")==-1){
			$("#"+playid).html("leave");
			$("#"+playid).prop("disabled",false);
			$("#"+playid).click(function(e){
				e.preventDefault();
				var classes=$(this).attr("class").split(" ");
				console.log("check!!!"+$("#"+playid).attr("id"));
				myRoom=null;
				$("#"+playid).removeAttr("id");
				console.log(classes[1]+" wanna leave! "+classes[0]);
				var postStr="player="+classes[0]+"&pId="+playid+"&roomId="+classes[1];
				$.post("http://54.254.178.30:1234/leaveroom", postStr, function(json) {
					printRoooms(json);
				});
			});
		}
	}
	$(".join button").click(function(e){
		e.preventDefault();
		if($("#"+playid).length>0){
			openAlert("You need to leave the current gameroom before joining a new one!<br>But, if you have created a room, you cannot leave it.");
		}
		else{
			var classes=$(this).attr("class").split(" ");
			console.log(classes[1]+" wanna join! "+classes[0]);
			var postStr="player="+classes[0]+"&pId="+playid+"&roomId="+classes[1];
			$.post("http://54.254.178.30:1234/joinroom", postStr, function(json) {
				printRoooms(json);
			});
		}
	});
	$("."+myRoom).each(function( index ) {
		if(index==0){
			full=true;
		}
//		console.log($(this).attr("id"));
		if(!($(this).attr("id"))){
			full=false;
		}
		else{
			playerArr[index]=$(this).attr("id");
		}
//		console.log(index+"full"+full);
	});
	if(full){
		console.log("full!!! "+playerArr+" room "+myRoom);
		window.clearInterval(myVar);
		$("#chooseItemModal").css("display","block");
		$("#over2").css("display","block");
	}
}

function openAlert(msg){
	var str="";
	str+='<div class="modalContent">'+msg+'</div>';
	$("#warningModal").html(str);
	$("#warningModal").css("display","block");
	$("#over1").css("display","block");
	//setTimeout(function(){$("#warningModal").css("display","none");},4000);
}

function setup(callback){
	$("#carContainer").css('background-image', 'url("images/car/'+carArray[currentNum]+'.png")');
	disableButton(currentNum);
	for (var j = 0; j < carArray.length; j++){
		upP[j] = new Array();
		for (var i = 0; i < basicP[0].length; i++){
			upP[j][i] = (maxP[j][i] - basicP[j][i])/10;
		}
	}
	console.log(upP);
	prepareSlider(sliderInfo[3], sliderInfo);
	callback && callback();
	
}

function loadPage(){
	getPlayer(function(){
		getAllCars(function(){
			nameStatus(currentNum);
		});
	});
}

function getPlayer(callback){
	//console.log(playerMe);
	if (log == 1){
		var postStr = 'pId='+playid;
		$.post("http://54.254.178.30:1234/getplayer", postStr, function(json) {
			//console.log(json);
			myPlayer.id = playid;
			myPlayer.coins = json.coins;
			myPlayer.currentcar = json.currentcar;
			console.log(myPlayer);
			$("#mypage").css("display","inline-block");
			$("#coinNum").html("coins: "+json.coins);
			callback && callback();
		});
	}
}

function getAllCars(callback){
	console.log(playid);
	if (log == 1){
		var postStr="pId="+playid;
		$.post("http://54.254.178.30:1234/getcar", postStr, function(json) {
			console.log(json);
			myCar = json;
			callback && callback(json);
		});
	}
}

function buyCar(carNum){
	var cartype = carArray[carNum];
	if (myPlayer.coins < carNeed[carNum]){
		console.log("from client: no money no talk");
	} else {
		if (log == 1){
			var postStr="pId="+playid+"&cartype="+cartype+"&needm="+carNeed[carNum];
			$.post("http://54.254.178.30:1234/buycar", postStr, function(json) {
				console.log(json);
				if (json == "nomoney"){
					console.log("in fact you have no money");
				}
				loadPage();
			});
		}		
	}
}

function useCar(carNum){
	var cartype = carArray[carNum];
	console.log(carArray[carNum]+" "+carArray[currentNum]);
	if (log == 1){
		var postStr="pId="+playid+"&cartype="+cartype;
		$.post("http://54.254.178.30:1234/usecar", postStr, function(json) {
			console.log(json);
			loadPage(carNum);
		});
	}
}

function sliderToReal(val,type, tar){
	var r = (val-1)*upP[tar][type]+basicP[tar][type];
	return r;
}

function realToSlider(val, type, tar){
	var r = ((val - basicP[tar][type]) / upP[tar][type]) + 1;
/*	console.log(val+" "+type+" "+tar);
	console.log("HIHI"+val);
	console.log("HIHI"+basicP[tar][type]);
	console.log("HIHI"+upP[tar][type]);
	console.log(r);*/
	return r;
}

function prepareSlider(num, info){
	console.log("prepare slider");
	for (var i = 0; i < num; i++){
		$("#property"+i).slider({
			min: 0,
			max: 11,
			range: "min",
			value: 0,
			slide: function(event, ui) {
				return false;
			}
		});
	}
	/*
	for (var i = 0; i < num; i++){
		console.log(basicP[i]-upP[i]);
		console.log(maxP[i]-upP[i]);
		console.log(basicP[i]+" "+maxP[i]+" "+upP[i]);
		$("#property"+i).slider({
			min: basicP[i]-upP[i],
			max: maxP[i],
			step: upP[i],
			range: "min",
			value: 0,
			slide: function(event, ui) {
				return false;
				
				// var pa = myCar[carArray[currentNum]];
				// var targetS = event.target.id.replace(/property/, '');
				// if (ui.value < realToSlider(pa[targetS])){
					// return false;
				// }
				
			}
		});
	}*/
}

function showProperties(pArray, target){
	console.log("propeties: "+pArray);
	for (var i = 0; i < pArray.length; i++){
		$( "#property"+i ).slider("value", realToSlider(pArray[i], i, target));
		$( "#property"+i ).slider("option", "disabled", false);
		$("#buy"+i).prop("disabled", false);
		$("#scale"+i).html("current:"+sliderToReal($("#property"+i).slider("value"), i, target)+" max:"+maxP[target][i]);
	}
}

function disableP(){
	for (var i = 0; i < sliderInfo[3]; i++){
		$( "#property"+i ).slider("value", 0);
		$( "#property"+i ).slider("option", "disabled", true);
		$("#buy"+i).prop("disabled", true);
	}
}

function nameStatus(target){
	if (log == 1) {
		$("#carStatus").prop("disabled", false);
		$("#carName").html(carArray[target]);
		$("#moneyneed").html("");
		if (target == 2){
			$("#carName").html($("#carName").html()+" (with two bullet)");
		} else if (target == 3){
			$("#carName").html($("#carName").html()+" (die after two hit)");
		} else if (target == 4){
			$("#carName").html($("#carName").html()+" (able to cross water)");
		}
		console.log(myCar);
		if (myCar.hasOwnProperty(carArray[target])){
			console.log(myPlayer.currentcar+" "+carArray[target]);
			if (myPlayer.currentcar != carArray[target]) {
				$("#carStatus").prop("disabled", false);
				$("#carStatus").html(statusArray[1]);
			} else {
				$("#carStatus").prop("disabled", true);
				$("#carStatus").html(statusArray[2]);
			}
			showProperties(myCar[carArray[target]], target);
		} else {
		console.log("tar"+carNeed[target]+" "+target);
			$("#carStatus").prop("disabled", false);
			$("#moneyneed").html("need coins:"+carNeed[target]);
			$("#carStatus").html(statusArray[0]);
			for (var i = 0; i < basicP[0].length; i++){
				$("#scale"+i).html("start from:"+basicP[target][i]);
			}
			disableP();
		}
	} else {
		$("#carStatus").prop("disabled", true);
		disableP();
	}
}

function disableButton(current){
	if (current == 0){
		$("#left").prop("disabled", true);
	}
	if (current == 1){
		$("#left").prop("disabled", false);
	}
	if (current == carArray.length - 2){
		$("#right").prop("disabled", false);
	}	
	if (current == carArray.length - 1){
		$("#right").prop("disabled", true);
	}
}

function checkLogin(callback){
	var time=new Date().getTime();
	FB.getLoginStatus(function(response) {
		console.log(response);
		if (response.status === 'connected') {
			// the user is logged in and has authenticated your
			// app, and response.authResponse supplies
			// the user's ID, a valid access token, a signed
			// request, and the time the access token 
			// and signed request each expire
			var uid = response.authResponse.userID;
			console.log("connected uid: "+uid);
			//var accessToken = response.authResponse.accessToken;
			playid = uid;
			log = 1;
			//getPlayer();
		} else if (response.status === 'not_authorized') {
			console.log("not_authorized");
			playid = "tmp"+time;
			myPlayer = {
				id: playid,
				coins: 0,
				currentcar: 'currentcar'
			};
			log = 0;
		} else {
			console.log("not_logged_in_FB");
			playid = "tmp"+time;
			myPlayer = {
				id: playid,
				coins: 0,
				currentcar: 'currentcar'
			};
			log = 0;
		}
		callback && callback();
	});
	FB.Event.subscribe('auth.authResponseChange', function(response) {
		console.log("auth.authResponseChange");
		if (response.status == 'connected') {
			var uid = response.authResponse.userID;
			console.log("I become connected uid: "+uid);
			playid = uid;
			log = 1;
			//getPlayer();
		} else {
			console.log("still not_authorized or not_logged_in_FB");
			playid = "tmp"+time;
			myPlayer = {
				id: playid,
				coins: 0,
				currentcar: 'currentcar'
			};
			log = 0;
		}
		callback && callback();
	});
}

function loadFBSDK(callback){
	$.ajaxSetup({ cache: true });
	$.getScript('//connect.facebook.net/en_UK/all.js', function(){
		FB.init({
			appId: '528688120569031',
			xfbml      : true,
			version    : 'v2.0'
		});
		checkLogin(callback);
		//$('#loginbutton,#feedbutton').removeAttr('disabled');
		
		//FB.getLoginStatus(updateStatusCallback);
	});
}
