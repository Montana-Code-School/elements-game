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

// room = new Room();
io.on( "connection", function ( client ) {
	let game = null;
	const { rooms } = io.sockets.adapter;
	const { Player } = classes;
	const { handleJoin, getVictory, drawCard, flipCard, onClick } = makeHandlers( client, rooms );
	clientManager.addClient( client );
	client.on( "join", function () {
		//generate room name that client needs to join
		roomName = handleJoin();
		//check if room exists
		game = playingRoomManager.getRoomById( roomName );
		//if room doesn't exist
		if ( game === undefined ) {
			//create new room with generated name
			game = playingRoomManager.addRoom( roomName, client );
			//pass information to client with room name,turn and client id
			client.emit( "roomJoin", {
				"roomName": game.name,
				"playerName": client.id,
				"turn": game.turn
			} );
			//if room exist,but there is only one player
		} else if ( game.player2 === null ) {
			//add second player to the room
			game.player2 = new Player( client, client.id )
			game = playingRoomManager.updateRoom( game );
			// pass information to client with room name,turn and client id
			client.emit( "roomJoin", {
				"roomName": game.name,
				"playerName": client.id,
				"turn": game.turn
			} );
		}
	} );
	client.on( "initialDraw", function ( roomName ) {
		game = playingRoomManager.getRoomById( roomName )
		// Find specific room for  initialDraw
		if ( game.player1.clientInfo && game.player2.clientInfo ) {
			drawCard( 4, game.player1 );
			drawCard( 4, game.player2 );
			io.sockets. in ( roomName ).emit( "initialDrawRes", {
				"player1": {
					"deck": game.player1.deck,
					"hand": game.player1.hand
				},
				"player2": {
					"deck": game.player2.deck,
					"hand": game.player2.hand
				},
			} );
		}
	} );
	client.on( "click", cardType => {
		let result = onClick( cardType, game );
		if ( result === "counter" ) {
			client.broadcast.to( game.room ).emit( "counterOffer" );
		}

	} );
	client.on( "flipCard", flipCard );
	client.on( "disconnect", function () {
		console.log( "client disconnect...", client.id );
		//remove user
		clientManager.deleteClient( client );
		// send message to the client about opponent disconnecting after that send emit
		// to server to join again
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
	}
	console.log( "listening on port" + port );
} )
