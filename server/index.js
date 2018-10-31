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
	const { rooms } = io.sockets.adapter;
	const { Player } = classes;
	const {
		handleJoin,
		getVictory,
		drawCard,
		flipCard,
		onClick,
		onSwitchTurn
	} = makeHandlers( client, rooms );
	clientManager.addClient( client );
	client.on( "join", function () {
		//generate room name that client needs to join
		roomName = handleJoin();
		//check if room exists
		let gameOnJoin = playingRoomManager.getRoomById( roomName );
		//if room doesn't exist
		if ( gameOnJoin === undefined ) {
			//create new room with generated name
			gameOnJoin = playingRoomManager.addRoom( roomName, client );
			// pass information to client with room name,turn and client
			// id
			client.emit( "roomJoin", {
				"roomName": gameOnJoin.name,
				"playerName": client.id,
				"turn": gameOnJoin.turn,
			} );
			//if room exist,but there is only one player
		} else if ( gameOnJoin.player2 === null ) {
			//add second player to the room
			gameOnJoin.player2 = new Player( client, client.id )
			gameOnJoin = playingRoomManager.updateRoom( gameOnJoin );
			// pass information to client with room name,turn and client
			// id
			client.emit( "roomJoin", {
				"roomName": gameOnJoin.name,
				"playerName": client.id,
				"turn": gameOnJoin.turn,
			} );
		}
	} );
	client.on( "initialDraw", function ( roomName ) {
		let gameOnInitialDraw = playingRoomManager.getRoomById( roomName )
		// Find specific room for  initialDraw
		if ( gameOnInitialDraw.player1.clientInfo && gameOnInitialDraw.player2.clientInfo ) {
			drawCard( 4, gameOnInitialDraw.player1 );
			drawCard( 4, gameOnInitialDraw.player2 );
			gameOnInitialDraw = playingRoomManager.updateRoom( gameOnInitialDraw );
			io.sockets. in ( roomName ).emit( "initialDrawRes", {
				"player1": {
					"deck": gameOnInitialDraw.player1.deck,
					"hand": gameOnInitialDraw.player1.hand,
					"message": "Your turn",
				},
				"player2": {
					"deck": gameOnInitialDraw.player2.deck,
					"hand": gameOnInitialDraw.player2.hand,
					"message": "waiting for opponent",
				}
			} );
		}
	} );
	client.on( "click", ( cardType, roomName, afterFlip ) => {
		console.log( "recieved on click    ", cardType, "roomName   ", roomName, "flip   ", afterFlip )
		let emitAction = "";
		let gameOnClick = playingRoomManager.getRoomById( roomName );
		gameOnClick.afterFlip = afterFlip;
		console.log( "calling onClick", gameOnClick );
		onClick( cardType, gameOnClick, emitAction );
		console.log( "return result", gameOnClick )
		gameOnClick = playingRoomManager.updateRoom( gameOnClick );
		console.log( "this is after update: ", gameOnClick )
		let currentPlayer = "";
		client.id === gameOnClick.player1.clientId
			? currentPlayer = "player1"
			: currentPlayer = "player2";
		switch ( emitAction ) {
				// case "fireActionEmit": 	io.sockets. in ( roomName ).emit(
				// emitAction, { 		"field":, 		"discard":, 		"emitAction": }
				// ); 	break; case 	"shadowActionEmit": 	io.sockets. in (
				// roomName ).emit( emitAction, { "blabla" } ); 	break; case
				// "lightActionEmit": 	io.sockets. in ( roomName ).emit(
				// emitAction, { "blabla" } ); 	break;
			default:
				io.sockets. in ( roomName ).emit( "cardClicked", {
					"hand": gameOnClick[ currentPlayer ].hand,
					"stagedCard": gameOnClick[ currentPlayer ].stagedCard,
					"playerName": client.id,
				} );
				break;
		}
	} );
	client.on( "counterOffer", function ( roomName ) {
		io.sockets. in ( roomName ).emit( "getCounterOffer", {
			"message": "Waiting for opponent...",
			"currentPlayer": client.id
		} );
	} );
	client.on( "sendCounterOfferRes", function ( roomName, result ) {
		console.log( "server recieved counter Offer result" )
		io.sockets. in ( roomName ).emit( "getCounterOfferRes", {
			"result": result,
			"player": client.id
		} )
	} );
	client.on( "flipCard", function ( roomName ) {
		let gameOnFlipCard = playingRoomManager.getRoomById( roomName );
		let opponent = "";
		client.id === gameOnFlipCard.player1.clientId
			? opponent = "player2"
			: opponent = "player1";
		gameOnFlipCard = flipCard( gameOnFlipCard, opponent );
		gameOnFlipCard = onSwitchTurn( gameOnFlipCard );
		gameOnFlipCard.flipCard = "";
		gameOnFlipCard = playingRoomManager.updateRoom( gameOnFlipCard );
		io.sockets. in ( roomName ).emit( "onFlippedCardRes", {
			"stagedCard": gameOnFlipCard[ opponent ].stagedCard,
			"field": gameOnFlipCard[ opponent ].field,
			"playerName": client.id,
			"turn": gameOnFlipCard.turn,
		} );
	} );
	client.on( "drawCard", function ( roomName, currentPlayer ) {
		let player = "player1";
		let gameOnCardDraw = playingRoomManager.getRoomById( roomName );
		gameOnCardDraw.player1.clientId === currentPlayer
			? player = "player1"
			: player = "player2";
		drawCard( 1, gameOnCardDraw[ player ] );
		gameOnCardDraw = playingRoomManager.updateRoom( gameOnCardDraw );
		console.log( "sending drawCardRes" )
		io.sockets. in ( roomName ).emit( "drawCardRes", {
			"deck": gameOnCardDraw[ player ].deck,
			"hand": gameOnCardDraw[ player ].hand,
			"playerName": client.id,
			"playerMessage": "Your turn",
			"opponentsMessage": "waiting for opponent"
		} );
	} )
	client.on( "disconnect", function () {
		console.log( "client disconnect...", client.id );
		const roomName = playingRoomManager.findRoomByClient( client.id );
		client.broadcast.to( roomName ).emit( "getDisconnect", "Your opponent left the game. You will now be redirected to" +
					" the Home Page." )
		//remove user
		clientManager.deleteClient( client );
		playingRoomManager.deleteRoom( roomName );
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
