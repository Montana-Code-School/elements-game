const connect = require( 'connect' );
const serveStatic = require( 'serve-static' );
const express = require( 'express' );
const path = require( 'path' );
const port = process.env.PORT || 5000;
const server = require( 'http' ).createServer();
const io = require( 'socket.io' )( server );
const makeHandlers = require( './EventHandler' )
const DataStore = require( "./DataStore" )
let afterFlip = "";
const data = new DataStore();
io.on( 'connection', function ( client ) {

	const { rooms } = io.sockets.adapter;
	const { handleJoin, drawCard } = makeHandlers( client, rooms )

	// if ( game.player1.clientInfo == null ) {
	// 	game.player1.clientInfo = client;
	// } else if ( game.player2.clientInfo == null ) {
	// 	game.player2.clientInfo = client;
	// } else {
	// 	client.disconnect();
	// }
	console.log( 'client connected...', client.id );
	data.addClient( client );

	client.on( 'join', function () {
		let room = handleJoin();
		// game.room = room;
		client.emit( "roomJoin", room );
	} );

	client.on( 'initialDraw', function () {
		// if ( ( game.player1.clientInfo === null ) || ( game.player2.clientInfo === null ) ) {
		// 	console.log( 'waiting for opponent' );
		// 	return;
		// } else if ( ( game.player1.clientInfo !== null ) && ( game.player2.clientInfo !== null ) ) {
		// 	console.log( game )
		// console.log( "two players in the room", game.room );
	} )
	// console.log( game.room );
	// drawCard( 4, game );, });
	client.on( 'disconnect', function () {
		console.log( 'client disconnect...', client.id );
		// game = initial;  remove user
		data.deleteClient( client );
		console.log( "all rooms", io.sockets.adapter.rooms );
	} );
	client.on( 'error', function ( err ) {
		console.log( 'received error from client:', client.id );
		console.log( err );
	} )
} );
if ( process.env.NODE_ENV === 'production' ) {
	app.use( express.static( path.join( __dirname, '../client/build' ) ) );

	app.get( '/', function ( req, res ) {
		res.sendFile( path.join( __dirname, '../client/build', 'index.html' ) );
	} );
}
server.listen( port, function ( err ) {
	if ( err ) {
		console.log( 'error', err )
		throw err
	}
	console.log( 'listening on port' + port );
} )
