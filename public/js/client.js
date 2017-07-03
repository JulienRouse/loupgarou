/*
* client.js
*/


/**
* void editNckname(Object)
*
* @param {Object} element the element the method will apply on
* @return void
* @side-effect: - set the disable property of #nickname to false
*               - set the onclick attribute of element to saveNickname(this)
*               - change the innerHTML of element to 'save'
*/
function editNickname(element){
    $('#nickname').prop('disabled', false);
    element.setAttribute('onclick','saveNickname(this)');
    element.innerHTML = "save";
}

/**
* void saveNckname(Object)
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



$(function () {
    var socket = io();
   
    // HEADER -------------------------------------------------------------------------
    $('#colorPicker').change(function(){
	$('#nickname').css("border-color", $('#colorPicker').val());
    });
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
	$('#messages-garou').append($('<li>').text(msg));
    });

});

