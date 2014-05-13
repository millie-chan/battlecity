var lvlArr=[5,3,2,3];
var playerArr=Array();
var imgArr1=['http://cdn.wikimg.net/strategywiki/images/5/5e/Battle_City_Stage01.png','http://cdn.wikimg.net/strategywiki/images/6/65/Battle_City_Stage02.png','http://cdn.wikimg.net/strategywiki/images/2/2f/Battle_City_Stage03.png','http://cdn.wikimg.net/strategywiki/images/f/f8/Battle_City_Stage14.png','http://cdn.wikimg.net/strategywiki/images/3/36/Battle_City_Stage17.png'];
var imgArr2=['http://cdn.wikimg.net/strategywiki/images/2/2f/Battle_City_Stage03.png','http://cdn.wikimg.net/strategywiki/images/f/f8/Battle_City_Stage14.png','http://cdn.wikimg.net/strategywiki/images/3/36/Battle_City_Stage17.png'];
var imgArr3=['./images/four1.png','http://cdn.wikimg.net/strategywiki/images/6/65/Battle_City_Stage02.png'];
var imgArr4=['./images/four1.1.png','http://cdn.wikimg.net/strategywiki/images/2/2f/Battle_City_Stage03.png','http://cdn.wikimg.net/strategywiki/images/3/36/Battle_City_Stage17.png'];

$(document).ready(function() {
	$.post("http://54.254.178.30:1234/getroom", function(json) {
		printRoooms(json);
	});
	$("#new").click(function(){
		$("#newgrModal").css("display","block");
		$(".overlay").css("display","block");
	});	
	$(".overlay").click(function(){
		$("#newgrModal").css("display","none");
		$(".overlay").css("display","none");
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
//		console.log($("#newgrForm").serialize());
		$.post("http://54.254.178.30:1234/newroom", $("#newgrForm").serialize(), function(json) {
			$(".overlay").click();
			printRoooms(json);
		});
	});
	$("#startGameBtn").click(function(e){
		e.preventDefault();
		var n="level"+$("input[name='level']").val();
//		console.log($("#newgrForm").serialize());
        console.log("play");
		$(".overlay").click();
		$("#main").css("display","none");
		$("#outer").css("display","block");
		window.clearInterval(myVar);
		Q.stageScene(n);
		
	});
	var myVar;// = setInterval(function(){myTimer()},1500);
	function myTimer() {
		$.post("http://54.254.178.30:1234/getroom", function(json) {
			printRoooms(json);
		});
	}
	$("input[name='up']").change(function(){
		if($("input[name='up']:checked").val()=="go"){
			myVar = setInterval(function(){myTimer()},1500);
		}
		else{
			window.clearInterval(myVar);
		}
	});
});

function printRoooms(json){
	var len=json.length;
	var enter=0;
	var myRoom="12345";
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
/*				if(myID==json[i-1].player1){
					myRoom=json[i-1].roomid;
				}*/
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
/*				if(myID==json[i-1].player2){
					myRoom=json[i-1].roomid;
				}*/
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
/*				if(myID==json[i-1].player4){
					myRoom=json[i-1].roomid;
				}*/
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
/*				if(myID==json[i-1].player3){
					myRoom=json[i-1].roomid;
				}*/
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
	$(".join button").click(function(e){
		e.preventDefault();
		var classes=$(this).attr("class").split(" ");
		console.log(classes[1]+" wanna join! "+classes[0]);
		var postStr="player="+classes[0]+"&pId=23456&roomId="+classes[1];
		$.post("http://54.254.178.30:1234/joinroom", postStr, function(json) {
			printRoooms(json);
		});
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
		console.log(index+"full"+full);
	});
	if(full){
		console.log("full!!!"+playerArr);
	}
}

