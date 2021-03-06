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

// --------------- define object player----------------------------
/**
* Player Player(string, string)
*
* constructor for the Player type
*
* @param {string} id the id of the player, is the id of the socket
* @param {string} name the name of the player, as defined by the user
* @return {Player} Player object
* @side-effect: void
*/
function Player(id, name){
    this.id = id;
    this.name = name;
    this.ready = false;
}

/**
* void removePlayer (array, string)
*
* remove the Player object in iterable with identifier id 
*
* @param {array} iterable an iterable where the deletion is done
* @param {string} id the identifier of the Player object to delete
* @return void
* @side-effect: DESTRUCTIVE to iterable, delete element in it
*/
function removePlayer(iterable, id){
  for(var i = 0;i<iterable.length;i++){
    if (iterable[i] != undefined && iterable[i].id == id){
	//splice(index, n) => remove n item starting from index
	iterable.splice(i,1);
    }
  }
}

/**
* void setPlayerName (array, string, string)
*
* set the name of the Player object in iterable with identifier id 
*
* @param {array} iterable an iterable where the setting is done
* @param {string} id the identifier of the Player object to name
* @param {string} name the name to give to the Player
* @return void
* @side-effect: change the name of object of identifier id in iterable
*/
function setPlayerName(iterable, id, name){
    for(var i = 0;i<iterable.length;i++){
	if(iterable[i] != undefined && iterable[i].id == id){
	    console.log("setPlayerName " + name);
	    iterable[i].name = name;
	}
    }
}
/**
* void setPlayerName (array, string, string)
*
* set the ready of the Player object in iterable with identifier id 
*
* @param {array} iterable an iterable where the setting is done
* @param {string} id the identifier of the Player object to set to ready
* @param {string} ready the state of ready
* @return void
* @side-effect: change the ready of object of identifier id in iterable
*/
function setPlayerReady(iterable, id, ready){
    for(var i = 0;i<iterable.length;i++){
	if(iterable[i] != undefined && iterable[i].id == id){
	    console.log("setPlayerReady " + ready);
	    iterable[i].ready = ready;
	}
    }
}
/**
* void togglePlayerName (array, string, string)
*
* toggle the ready state of the Player object in iterable with identifier id 
*
* @param {array} iterable an iterable where the setting is done
* @param {string} id the identifier of the Player object to toggle to ready
* @return void
* @side-effect: change the ready of object of identifier id in iterable
*/
function togglePlayerReady(iterable, id){
    for(var i = 0;i<iterable.length;i++){
	if(iterable[i] != undefined && iterable[i].id == id){
	    console.log("togglePlayerReady ");
	    iterable[i].ready = !iterable[i].ready;
	}
    }
}

//holds the list of Player objects
var _gbl_listSpectator = [];

// ----- interactions with sockets --------------------------------------------------------------------
io.on('connection', function(socket){
    const CHANNEL_GAROU = 'chat message garou';
    const CHANNEL_PUBLIC = 'chat message public';
    const CHANNEL_NEW_USER = 'new user';
    const CHANNEL_CHANGE_NAME = 'change name';
    const CHANNEL_READY = 'ready';
    
    //new user connection
    socket.on(CHANNEL_NEW_USER, function(name){
	_gbl_listSpectator.push(new Player(socket.id, name));
	io.emit(CHANNEL_GAROU, _gbl_listSpectator);
	console.log(socket.id + ", name is "+ name +" and listpeople:" + _gbl_listSpectator);
    });
    //user change name
    socket.on(CHANNEL_CHANGE_NAME, function(name){
	console.log("NAME_CHANGE " + _gbl_listSpectator);
	setPlayerName(_gbl_listSpectator, socket.id, name);
	console.log(_gbl_listSpectator);
	io.emit(CHANNEL_GAROU, _gbl_listSpectator);
	console.log(socket.id + ", changed name to "+ name +" and listpeople:" + _gbl_listSpectator);
    });
    //ready
    socket.on(CHANNEL_READY, function(){
	togglePlayerReady(_gbl_listSpectator, socket.id);
	io.emit(CHANNEL_GAROU, _gbl_listSpectator);
    });
    // ---------------------------------------------------------------------
    // public
    socket.on(CHANNEL_PUBLIC, function(messageObject){
	console.log("INFO: " +
		    messageObject.nick +
		    " is writing in the public channel with color:" +
		    messageObject.color +
		    " and the message was:" +
		    messageObject.msg);
	io.emit(CHANNEL_PUBLIC, messageObject);
   });
    // garou
    socket.on(CHANNEL_GAROU, function(msg){
	io.emit(CHANNEL_GAROU, msg);
    });
    
    
    //disconnect
    socket.on('disconnect', function() {
	console.log("A user is diconnected");
	console.log(socket.id + ", listpeople:" + _gbl_listSpectator);
	removePlayer(_gbl_listSpectator, socket.id);
	console.log("a player was remover, here the new list" + _gbl_listSpectator);
	io.emit('chat message garou', _gbl_listSpectator);
    });
    
});

// -----------------listen-----------------------------------------------------------------------
http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});
