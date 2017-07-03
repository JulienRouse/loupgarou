/**
*
* server.js
*/
const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

//static file: css, image ...
const staticPath = '/static';
const publicDir = 'public';

app.use(staticPath, express.static(path.join(__dirname, publicDir)));

app.get('/', function(req, res){
    var mypath = path.resolve(__dirname + '/public/index.html');
    res.sendFile(mypath);
});

// ----- interactions with sockets --------------------------------------------------------------------
io.on('connection', function(socket){
    // public
    var channelPublic = 'chat message public';
    socket.on(channelPublic, function(messageObject){
	console.log(messageObject.nick);
	console.log(messageObject.color);
	console.log(messageObject.msg);
	io.emit(channelPublic, messageObject);
   });
    // garou
    var channelGarou = 'chat message garou';
    socket.on(channelGarou, function(msg){
	io.emit(channelGarou, msg);
  });
});

// -----------------listen-----------------------------------------------------------------------
http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});
