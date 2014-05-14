$(document).ready(function() {
	var carArray = ["normal", "speed", "bullet2", "blood2", "amptank"];
	var statusArray = ["Activate", "Use It?", "Used"];
	//var allP = Array();
	//var allP = {};
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
	var carNeed = [0, 7, 15, 4, 10];
	var spendArray = [10, 10, 10];
	
	var currentNum = 0;
	var login = 0;
	var playerid;
	var myPlayer = {
		id: 'haha',
		coins: 0,
		currentcar: 'hoho'
	};
	var myCar = {};
	
	//setup
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
	
	loadFBSDK(function(){
		setup(function(){
			loadPage();
		});
	});
	
	function checkLogin(callback){
		FB.getLoginStatus(function(response) {
			console.log(response);
			if (response.status === 'connected') {
				// the user is logged in and has authenticated your
				// app, and response.authResponse supplies
				// the user's ID, a valid access token, a signed
				// request, and the time the access token 
				// and signed request each expire
				if (login == 0) {
					var uid = response.authResponse.userID;
					console.log("connected uid: "+uid);
					//var accessToken = response.authResponse.accessToken;
					playerid = uid;
					login = 1;
					//getPlayer();
				}
			} else if (response.status === 'not_authorized') {
				console.log("not_authorized");
				playerid = "tmp00000";
				myPlayer = {
					id: playerid,
					coins: 0,
					currentcar: 'currentcar'
				};
				login = 0;
			} else {
				console.log("not_logged_in_FB");
				playerid = "tmp00000";
				myPlayer = {
					id: playerid,
					coins: 0,
					currentcar: 'currentcar'
				};
				login = 0;
			}
			callback && callback();
		});
		FB.Event.subscribe('auth.authResponseChange', function(response) {
			console.log("auth.authResponseChange");
			if (response.status == 'connected') {
				if (login == 0){
					var uid = response.authResponse.userID;
					console.log("I become connected uid: "+uid);
					playerid = uid;
					login = 1;
					//getPlayer();
				}
			} else {
				console.log("still not_authorized or not_logged_in_FB");
				if (login == 1) {
					playerid = "tmp00000";
					myPlayer = {
						id: playerid,
						coins: 0,
						currentcar: 'currentcar'
					};
					login = 0;
				}
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
	
	function getPlayer(callback){
		//console.log(playerMe);
		if (login == 1){
			var postStr = 'pId='+playerid;
			$.post("http://54.254.178.30:1234/getplayer", postStr, function(json) {
				//console.log(json);
				myPlayer.id = playerid;
				myPlayer.coins = json.coins;
				myPlayer.currentcar = json.currentcar;
				console.log(myPlayer);
				callback && callback();
			});
		}
	}
	
	function getAllCars(callback){
		console.log(playerid);
		if (login == 1){
			var postStr="pId="+playerid;
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
			if (login == 1){
				var postStr="pId="+playerid+"&cartype="+cartype+"&needm="+carNeed[carNum];
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
		if (login == 1){
			var postStr="pId="+playerid+"&cartype="+cartype;
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
		/*
		switch (type) {
			case 0:
				r = (val - basicP[0])/upP[0] + 1;
				break;
			case 1:
				r = (val - basicP[1])/upP[1] + 1;
				break;
			case 2:
				r = -val;
				break;
		}*/
		console.log(val+" "+type+" "+tar);
		console.log("HIHI"+val);
		console.log("HIHI"+basicP[tar][type]);
		console.log("HIHI"+upP[tar][type]);
		console.log(r);
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
		if (login == 1) {
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
		console.log("player is "+playerid);
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
			if (login == 1){
				var postStr="pId="+playerid+"&cartype="+cartype+"&needm="+spendArray[idnum]+"&qn="+idnum+"&up="+upP[currentNum][idnum];
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