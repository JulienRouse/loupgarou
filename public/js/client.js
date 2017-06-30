/*
* client.js
*/

$(function () {
    var socket = io();
    //public
    $('#form-public').submit(function(){
	socket.emit('chat message public' , $('#m-public').val());
	$('#m-public').val('');
	return false;
    });
    socket.on('chat message public', function(msg){
	$('#messages-public').append($('<li>').text(msg));
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
