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


$(function () {
    var socket = io();
    // HEADER -------------------------------------------------------------------------
    $('#colorPicker').change(function(){
	$('#nickname').css("border-color", $('#colorPicker').val());
    });
    // CHAT   -------------------------------------------------------------------------
    //public
    $('#form-public').submit( function(){
	socket.emit('chat message public' , $('#nickname').val(), $('#colorPicker').val(), $('#m-public').val());
	$('#m-public').val('');
	return false;
    });
    socket.on('chat message public', function(nick, color, msg){
	var newLi = $("<li>").css('color',color);
	newLi.text(nick + ": " + msg);
	$('#messages-public').append(newLi);
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

