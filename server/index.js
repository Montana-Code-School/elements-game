const connect = require( 'connect' );
const serveStatic = require('serve-static');
const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 5000;
const server = require('http').createServer(app);
const io = require( 'socket.io' )( server );
const _ = require( "underscore" );
const ClientManager = require( './ClientManager' );
const makeHandlers = require( './EventHandler' )
const clientManager = ClientManager();

let afterFlip = "";
let player1Field = {
	fire: 0,
	water: 0,
	light: 0,
	shadow: 0,
	earth: 0,
};
let player2Field = {
	fire: 0,
	water: 0,
	light: 0,
	shadow: 0,
	earth: 0,
};
let player1Deck = {
	fire: 5,
	water: 5,
	light: 5,
	shadow: 5,
	earth: 5,
};
let player2Deck = {
	fire: 5,
	water: 5,
	light: 5,
	shadow: 5,
	earth: 5,
};
let player1Hand = {
	fire: 0,
	water: 0,
	light: 0,
	shadow: 0,
	earth: 0,
};
let player2Hand = {
	fire: 0,
	water: 0,
	light: 0,
	shadow: 0,
	earth: 0,
};
let player1Discard = {
	fire: 0,
	water: 0,
	light: 0,
	shadow: 0,
	earth: 0,
};
let player2Discard = {
	fire: 0,
	water: 0,
	light: 0,
	shadow: 0,
	earth: 0,
}
let player1StagedCard = "";
let player2StagedCard = "";
io.on( 'connection', function ( client ) {

	const { rooms } = io.sockets.adapter;
	const { handleJoin, drawCard } = makeHandlers( client, clientManager, rooms )

	console.log( 'client connected...', client.id )
	clientManager.addClient( client )
	const drawCard1 = () => drawCard( 4 )
	client.on( 'join', handleJoin )
	client.on( 'initialDraw', function () {
		console.log( "drawCard" );
	} )
	client.on( 'disconnect', function () {
		console.log( 'client disconnect...', client.id );
		// remove user
		clientManager.removeClient( client )
		console.log( "all rooms", io.sockets.adapter.rooms )
	} );
	client.on( 'error', function ( err ) {
		console.log( 'received error from client:', client.id )
		console.log( err )
	} )
} );
// if (process.env.NODE_ENV === 'production') {
	// app.use(express.static(__dirname + '/client/build'))
	// connect().use(serveStatic( './client/build/index.html'))
// }
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

server.listen( port, function ( err ) {
	if ( err )
		throw err
	console.log( 'listening on port' + port )
} )
