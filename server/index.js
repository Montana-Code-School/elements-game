const connect = require( "connect" );
const serveStatic = require( "serve-static" );
const express = require( "express" );
const path = require( "path" );
const port = process.env.PORT || 5000;
const server = require( "http" ).createServer();
const io = require( "socket.io" )( server );

const classes = require( "./roomAndPlayerClasses" )
const ClientManager = require( "./clientManager" );
const RoomHandler = require( "./PlayingRoomManager" )
const makeHandlers = require( "./eventHandler" );

const clientManager = ClientManager();
const playingRoomManager = RoomHandler();

let afterFlip = "";
io.on( "connection", function ( client ) {

	const { rooms } = io.sockets.adapter;
	const { handleJoin, drawCard } = makeHandlers( client, rooms )
	const { Room, Player, } = classes;
	room = new Room();
	if ( game.player1.clientInfo == null ) {
		game.player1.clientInfo = client;
	} else if ( game.player2.clientInfo == null ) {
		game.player2.clientInfo = client;
	} else {
		client.disconnect();
	}
	clientManager.addClient( client );
	console.log( "client connected...", client.id );
	client.on( "join", function () {
		room.name = handleJoin();
		playingRoomManager.addRoom( room );
		client.emit( "roomJoin", room.name );
	} );

	client.on( "initialDraw", function () {
		if ( ( game.player1.clientInfo === null ) || ( game.player2.clientInfo === null ) ) {
			console.log( "waiting for opponent" );
			return;
		} else if ( ( game.player1.clientInfo !== null ) && ( game.player2.clientInfo !== null ) ) {
			console.log( game );
			console.log( "two players in the room", game.room );
		}
		// console.log( game.room ); drawCard( 4, game );,
	} );
	client.on( "disconnect", function () {
		console.log( "client disconnect...", client.id );
		//remove user
		clientManager.deleteClient( client );
		console.log( "all rooms", io.sockets.adapter.rooms );
	} );
	client.on( "error", function ( err ) {
		console.log( "received error from client:", client.id );
		console.log( err );
	} )
} );
if ( process.env.NODE_ENV === "production" ) {
	app.use( express.static( path.join( __dirname, "../client / build " ) ) );
	app.get( "/", function ( req, res ) {
		res.sendFile( path.join( __dirname, "../client/build", "index.html" ) );
	} );
}
server.listen( port, function ( err ) {
	if ( err ) {
		console.log( "error", err )
		throw err
	}
	console.log( "listening on port" + port );
} )
