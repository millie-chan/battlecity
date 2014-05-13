$(document).ready(function() {
	var carArray = ["normal", "speed", "bullet2", "blood2", "amptank"];
	var statusArray = ["Activate", "Use It?", "Used"];
	var currentNum = 0;
	var curCar = 0;
	var login = 0;
	var playerid;
	var myPlayer = {
		id: 'haha',
		coins: 0,
		currentcar: 'hoho'
	};
	var myCar;
	
	loadFBSDK(function(){
		getPlayer();
		getAllCars(function(){
			nameStatus(currentNum);
		});
	});
	
	$("#carContainer").css('background-image', 'url("images/car/'+carArray[currentNum]+'.png")');
	
	disableButton(currentNum);
	
	function checkLogin(callback){
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
				playerid = uid;
				login = 1;
				//getPlayer();
			} else if (response.status === 'not_authorized') {
				console.log("not_authorized");
				playerid = "tmp00000";
				login = 0;
			} else {
				console.log("not_logged_in_FB");
				playerid = "tmp00000";
				login = 0;
			}
			callback && callback();
		});
		FB.Event.subscribe('auth.authResponseChange', function(response) {
			console.log("auth.authResponseChange");
			if (response.status == 'connected') {
				var uid = response.authResponse.userID;
				console.log("I become connected uid: "+uid);
				playerid = uid;
				login = 1;
				//getPlayer();
			} else {
				console.log("still not_authorized or not_logged_in_FB");
				playerid = "tmp00000";
				login = 0;
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
	
	function getPlayer(){
		//console.log(playerMe);
		if (login == 1){
			var postStr = 'pId='+playerid;
			$.post("http://54.254.178.30:1234/getplayer", postStr, function(json) {
				//console.log(json);
				myPlayer.id = playerid;
				myPlayer.coins = json.coins;
				myPlayer.currentcar = json.currentcar;
				//console.log(playerMe);
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
				callback && callback();
				//if (json.hasOwnProperty(''))
			});
		}
	}
	
	function nameStatus(target){
		$("#carName").html(carArray[target]);
		if (myCar.hasOwnProperty(carArray[target])){
			if (myPlayer.currentcar != carArray[target]) {
				$("#carStatus").prop("disabled", false);
				$("#carStatus").html(statusArray[1]);
			} else {
				$("#carStatus").prop("disabled", true);
				$("#carStatus").html(statusArray[2]);
			}
		} else {
			$("#carStatus").prop("disabled", false);
			$("#carStatus").html(statusArray[0]);
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
	
	$("div#property1").progressbar({
		value: 10
	});
	$("div#property2").progressbar({
		value: 10
	});
	$("div#property3").progressbar({
		value: 10
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
		console.log("player is "+playerid);
	});
});