const connect = require( "connect" );
const serveStatic = require( "serve-static" );
const express = require( "express" );
const app = express();
const path = require( "path" );
const port = process.env.PORT || 5000;
const server = require( 'http' ).createServer( app );
const io = require( "socket.io" )( server );

const classes = require( "./roomAndPlayerClasses" )
const ClientManager = require( "./clientManager" );
const RoomHandler = require( "./playingRoomManager" )
const makeHandlers = require( "./eventHandler" );
const clientManager = ClientManager();
const playingRoomManager = RoomHandler();

// room = new Room();
io.on( "connection", function ( client ) {
	let game = null;
	const { rooms } = io.sockets.adapter;
	const { Player } = classes;
	const {
		handleJoin,
		getVictory,
		drawCard,
		flipCard,
		onClick,
	} = makeHandlers( client, rooms );
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
			// pass information to client with room name,turn and client
			// id
			client.emit( "roomJoin", {
				"roomName": game.name,
				"playerName": client.id,
				"turn": game.turn,
			} );
			//if room exist,but there is only one player
		} else if ( game.player2 === null ) {
			//add second player to the room
			game.player2 = new Player( client, client.id )
			game = playingRoomManager.updateRoom( game );
			// pass information to client with room name,turn and client
			// id
			client.emit( "roomJoin", {
				"roomName": game.name,
				"playerName": client.id,
				"turn": game.turn,
			} );
		}
	} );
	client.on( "initialDraw", function ( roomName ) {
		game = playingRoomManager.getRoomById( roomName )
		// Find specific room for  initialDraw
		if ( game.player1.clientInfo && game.player2.clientInfo ) {
			drawCard( 4, game.player1 );
			drawCard( 4, game.player2 );
			game = playingRoomManager.updateRoom( game );
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
	client.on( "click", ( cardType, roomName, afterFlip ) => {
		let emitAction = "";
		game = playingRoomManager.getRoomById( roomName );
		game.afterFlip = afterFlip;
		game = onClick( cardType, game );
		// console.log( "back from onclick", game.emitAction )
		emitAction = game.emitAction;
		game = playingRoomManager.updateRoom( game.game );
		// console.log( "this is after update: ", game )
		let currentPlayer = "";
		client.id === game.player1.clientId
			? currentPlayer = "player1"
			: currentPlayer = "player2";
		switch ( emitAction ) {
				// case "fireActionEmit": 	io.sockets. in ( roomName ).emit(
				// emitAction, { "field":,"discard": } ); 	break; case
				// "shadowActionEmit": 	io.sockets. in ( roomName ).emit(
				// emitAction, { "blabla" } ); 	break; case
				// "lightActionEmit": io.sockets. in ( roomName ).emit(
				// emitAction, { "blabla" } ); 	break;
			default:
				io.sockets. in ( roomName ).emit( "cardClicked", {
					"hand": game[ currentPlayer ].hand,
					"stagedCard": game[ currentPlayer ].stagedCard,
					"playerName": client.id
				} );
				break;
		}
	} );

	client.on( "counterOffer", function ( roomName ) {
		client.broadcast.to( roomName ).emit( "getCounterOffer" );
	} )
	client.on( "flipCard", function ( roomName ) {
		game = playingRoomManager.getRoomById( roomName );
		console.log( game )
		let opponent = "";
		client.id === game.player1.clientId
			? opponent = "player2"
			: opponent = "player1";
		game = flipCard( game, opponent );
		game = playingRoomManager.updateRoom( game );
		io.sockets. in ( roomName ).emit( "getFlippedCardRes", {
			"stagedCard": game[ opponent ].stagedCard,
			"field": game[ opponent ].field,
			"playerName": client.id,
		} )
	} )

	client.on( "disconnect", function () {
		console.log( "client disconnect...", client.id );
		const roomName = playingRoomManager.findRoomByClient(client.id);
		client.broadcast.to(roomName).emit("getDisconnect", "Your opponent left the game. You will now be redirected to the Home Page.")
		//remove user
		clientManager.deleteClient( client );
		playingRoomManager.deleteRoom(roomName);
		// send message to the client about opponent disconnecting
		// after that send emit to server to join again
		console.log( "all rooms", io.sockets.adapter.rooms );
	} );
	client.on( "error", function ( err ) {
		console.log( "received error from client:", client.id );
		console.log( err );
	} )
} );
if ( process.env.NODE_ENV === "production" ) {
	app.use( express.static( path.join( __dirname, "../client/build" ) ) );
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
