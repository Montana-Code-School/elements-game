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

room = new Room();
io.on( "connection", function ( client ) {
	clientManager.addClient( client );
	console.log( "client connected...", client.id );
	const { rooms } = io.sockets.adapter;
	const { handleJoin, getVictory, drawCard, flipCard, onClick } = makeHandlers( client, rooms, game );

	client.on( "join", function () {
		game.room = handleJoin();
		if ( game.player1.clientInfo === null ) {
			game.player1.clientInfo = client;
			game.player1.clientId = client.id;
			game.turn = client.id
			client.emit( "roomJoin", {
				"roomName": game.room,
				"playerName": client.id,
				"turn": game.turn
			} );
		} else if ( game.player2.clientInfo === null ) {
			game.player2.clientInfo = client;
			game.player2.clientId = client.id;
			client.emit( "roomJoin", {
				"roomName": game.room,
				"playerName": client.id,
				"turn": game.turn
			} );
		}
	} );
	client.on( "initialDraw", function ( roomName ) {
		// Find specific room for initialDraw
		if ( game.player1.clientInfo && game.player2.clientInfo ) {
			drawCard( 4, game.player1 );
			drawCard( 4, game.player2 );
			io.sockets. in ( roomName ).emit( "initialDrawRes", {
				"player1": {
					"deck": game.player1.deck,
					"hand": game.player1.hand,
				},
				"player2": {
					"deck": game.player2.deck,
					"hand": game.player2.hand,
				}
			} );
		}
	} );
	client.on( "click", cardType => {
		onClick( cardType );
	} )
	client.on( "flipCard", flipCard );
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
server.listen(port, function ( err ) {
	<<<<<<< HEAD if ( err ) { console.log( "error", err ) ======= if ( err ) >>>>>>>
		master throw err } console.log( "listening on port" + port ); } )