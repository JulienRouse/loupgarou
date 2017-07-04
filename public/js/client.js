/*
* client.js
*/
//globals
var _gbl_listSpectator = [];
var _gbl_gameStarted = false;
var _gbl_user = {}

/**
* void editNickname(Object)
*
* edit the nickname of the client
*
* @param {Object} element the element the method will apply on
* @return void
* @side-effect: - set the disable property of #nickname to false
*               - set the onclick attribute of element to saveNickname(this)
*               - change the innerHTML of element to 'save'
*/
function editNickname(element){
    $('#nickname').prop('disabled', false);
    element.setAttribute('onclick','saveNickAndsendNick(this)');
    element.innerHTML = "save";
}

/**
* void saveNickname(Object)
*
* save the nickname of the client
* 
* @param {Object} element the element the method will apply on
* @return void
* @side-effect: - set the disable property of #nickname to true
*               - set the onclick attribute of element to editNickname(this)
*               - change the innerHTML of element to 'edit'
*/
function saveNickname(element){
    $('#nickname').prop('disabled', true);
    element.setAttribute('onclick','editNickname(this)');
    element.innerHTML = "edit";
}

/**
* combine saveNickname and a socket.emit to update the name in user list
*/
function saveNickAndsendNick(element){
    saveNickname(element);
    socket.emit('change name',$('#nickname').val());
}

/**
* Object createMessageObject(string, string, string)
*
* Create an object that represent a message for the chat. It is composed of 3 parts,
* nick for the sender, colorCode for the color of the message, and msgtext for the content.
*
* @param {string} nick the name of the message sender 
* @param {string} colorCode must be a valid string representation of a color. (valid as understable by css)
* @param {string} msgText the content of the message
* @return {Object} an object with fields nickname, color and msg
* @side-effect: none 
*/
function createMessageObject(nickname, colorCode, msgText){
    return {nick : nickname, color : colorCode, msg : msgText};
}

/** construct dynamically list of ready
*/
function createLiRightOrder(socketId){
    console.log("socket id: socketID");
    console.log("list" + _gbl_listSpectator);
    var ul = $('#game-list');

    var start_li = '<li class="game-player';
    var optionnal_red  = ' red';
    var close_angle = '" >';
    var close_li = '</li>';

    var res = '';
    ul.empty();
    for(var i=0;i<_gbl_listSpectator.length;i++){
	res = start_li;
	if(_gbl_listSpectator[i].ready){
	    res += optionnal_red;
	} 
	res += close_angle + _gbl_listSpectator[i].name + close_li;
	console.log("res: " + res);
	
	if(_gbl_listSpectator[i].id == socketId){
	    ul.prepend($(res));
	    console.log("bon id");
	}else{
	    ul.append($(res));
	    console.log("mauvais id");
	}
    }
    console.log("fin createLiRightOrder");
}

$(function () {
    socket = io();
    // on connection, send name to the server
    socket.emit('new user', $('#nickname').val());
    
    // HEADER -------------------------------------------------------------------------
    $('#colorPicker').change(function(){
	$('#nickname').css("border-color", $('#colorPicker').val());
    });
    // GAME ---------------------------------------------------------------------------
    if(!_gbl_gameStarted){
	var element = $('#game-list');
	element.on("click", 'li:first', (function(){
	    $(this).css('background-color','red');
	    socket.emit('ready');
	}));
    }else
    {
	console.log();
    }
    // CHAT   -------------------------------------------------------------------------
    //public
    $('#form-public').submit( function(){
	socket.emit('chat message public' , createMessageObject($('#nickname').val(), $('#colorPicker').val(), $('#m-public').val()));
	$('#m-public').val('');
	return false;
    });
    socket.on('chat message public', function(messageObject){
	var newLi = $("<li class='li-message-public'>");
	newLi.css('color', messageObject.color);
	newLi.text(messageObject.nick + ": " + messageObject.msg);
	//?FIX or USE?
	newLi.prepend($('<span></span>'));
	$('#messages-public').append(newLi);
	
	//scroll to bottom
	$('.mini-chatroom-container').scrollTop($('#messages-public')[0].scrollHeight);
    });
    
    // garou
    $('#form-garou').submit(function(){
	socket.emit('chat message garou' , $('#m-garou').val());
	$('#m-garou').val('');
	return false;
    });
    socket.on('chat message garou', function(msg){
	var chatUl = $('#messages-garou');
	$('#messages-garou').empty();
	for(var i=0;i<msg.length;i++){
	    console.log(msg);
	    $('#messages-garou').append($('<li>').text(msg[i].name));
	}
	_gbl_listSpectator = msg;
	console.log("chat message garou: " + _gbl_listSpectator);
	createLiRightOrder(socket.id);
    });


});

