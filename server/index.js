const connect = require( "connect" );
const serveStatic = require( "serve-static" );
const express = require( "express" );
const app = express();
const path = require( "path" );
const port = process.env.PORT || 5000;
const server = require( 'http' ).createServer( app );
const io = require( "socket.io" ).listen( server );

const classes = require( "./roomAndPlayerClasses" )
const ClientManager = require( "./clientManager" );
const RoomHandler = require( "./playingRoomManager" )
const makeHandlers = require( "./eventHandler" );
const clientManager = ClientManager();
const playingRoomManager = RoomHandler();

io.on( "connection", function ( client ) {
	// create  variable rooms that have information about all
	// existing rooms
	const { rooms } = io.sockets.adapter;
	//import class player from  roomAndPlayerClasses.js
	const { Player } = classes;
	// import all functions from eventHandler.js and pass them
	// infromation about current client and availbale rooms
	const {
		handleJoin,
		getVictory,
		drawCard,
		flipCard,
		onClick,
		onSwitchTurn,
	} = makeHandlers( client, rooms );
	// after user connected add client to the map of clients in
	// clientManager.js
	clientManager.addClient( client );

	//message from client to join the room
	client.on( "join", function () {
		//generate room name that client needs to join
		roomName = handleJoin();
		//find room object by room name that needs to be updated
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
				"turn": gameOnJoin.turn
			} );
			//if room exist,but there is only one player
		} else if ( gameOnJoin.player2 === null ) {
			//add second player to the room
			gameOnJoin.player2 = new Player( client, client.id );
			// pass updated room inforamtion to the rooms map inside
			// playingRoomManager.js
			playingRoomManager.updateRoom( gameOnJoin );
			// pass information to client with room name,turn and client
			// id
			client.emit( "roomJoin", {
				"roomName": gameOnJoin.name,
				"playerName": client.id,
				"turn": gameOnJoin.turn
			} );
		}
	} );

	//message from client to make initialDraw
	client.on( "initialDraw", function ( roomName ) {
		//find room object by room name that needs to be updated
		let gameOnInitialDraw = playingRoomManager.getRoomById( roomName )
		//check if both users in the room
		if ( gameOnInitialDraw.player1.clientInfo && gameOnInitialDraw.player2.clientInfo ) {
			//draw 4 cards for player1
			drawCard( 4, gameOnInitialDraw.player1.deck, gameOnInitialDraw.player1.hand );
			//draw 4 card for player2
			drawCard( 4, gameOnInitialDraw.player2.deck, gameOnInitialDraw.player2.hand );
			// pass updated room inforamtion to the rooms map inside
			// playingRoomManager.js
			playingRoomManager.updateRoom( gameOnInitialDraw );
			// pass updated room information back to both users in the
			// room
			io.sockets. in ( roomName ).emit( "initialDrawRes", {
				"player1": {
					"deck": gameOnInitialDraw.player1.deck,
					"hand": gameOnInitialDraw.player1.hand,
					"message": "Your turn"
				},
				"player2": {
					"deck": gameOnInitialDraw.player2.deck,
					"hand": gameOnInitialDraw.player2.hand,
					"message": "Waiting for opponent..."
				},
			} );
		}
	} );

	//message from client that click event happened
	client.on( "click", ( cardType, roomName, afterFlip ) => {
		// create variable that will keep track of which information
		// needs to be passed back to the clients
		let emitAction = "";
		//find room object by room name that needs to be updated
		let gameOnClick = playingRoomManager.getRoomById( roomName );
		//update afterFlip flag
		console.log( gameOnClick.afterFlip, afterFlip )
		gameOnClick.afterFlip = afterFlip;
		let res = onClick( cardType, gameOnClick, emitAction );
		gameOnClick = res.game;
		emitAction = res.emitAction
		gameOnClick.afterFlip = "";
		// pass updated room inforamtion to the rooms map inside
		// playingRoomManager.js
		playingRoomManager.updateRoom( gameOnClick );
		let currentPlayer = "";
		if ( client.id === gameOnClick.player1.clientId ) {
			currentPlayer = "player1";
			opponent = "player2";
		} else {
			currentPlayer = "player2";
			opponent = "player1";
		}
		switch ( emitAction ) {
			case "counterActionEmit":
				// currentPlayer=player2 opponent=player1
				io.sockets. in ( roomName ).emit( "onCounterActionRes", {
					"result": "counter",
					"counteringPlayerDiscard": gameOnClick[ currentPlayer ].discard,
					"counteringPlayerHand": gameOnClick[ currentPlayer ].hand,
					"playerStagedCard": gameOnClick[ opponent ].stagedCard,
					"playerDiscard": gameOnClick[ opponent ].discard,
					"afterFlip": gameOnClick.afterFlip,
					"player": client.id,
				} )
				break;
			case "fireActionEmit":
				io.sockets. in ( roomName ).emit( "cardActionRes", {
					"field": gameOnClick[ opponent ].field,
					"discard": gameOnClick[ opponent ].discard,
					"emitAction": emitAction,
					"afterFlip": gameOnClick.afterFlip,
					"currentPlayer": client.id
				} );
				break;
			case "shadowActionEmit":
				io.sockets. in ( roomName ).emit( "cardActionRes", {
					"hand": gameOnClick[ currentPlayer ].hand,
					"discard": gameOnClick[ currentPlayer ].discard,
					"emitAction": emitAction,
					"afterFlip": gameOnClick.afterFlip,
					"currentPlayer": client.id
				} );
				break;
			case "lightActionEmit":
				io.sockets. in ( roomName ).emit( "cardActionRes", {
					"hand": gameOnClick[ currentPlayer ].hand,
					"discard": gameOnClick[ currentPlayer ].discard,
					"emitAction": emitAction,
					"afterFlip": gameOnClick.afterFlip,
					"currentPlayer": client.id,
				} );
				break;
			default:
				io.sockets. in ( roomName ).emit( "cardClicked", {
					"hand": gameOnClick[ currentPlayer ].hand,
					"stagedCard": gameOnClick[ currentPlayer ].stagedCard,
					"playerName": client.id
				} );
				break;
		}
	} );
	client.on( "counterOffer", function ( roomName ) {
		io.sockets. in ( roomName ).emit( "getCounterOffer", {
			"message": "Waiting for opponent...",
			"currentPlayer": client.id,
		} );
	} );
	client.on( "sendCounterOfferRes", function ( roomName, result ) {
		if ( result === "noCounter" ) {
			io.sockets. in ( roomName ).emit( "getCounterOfferRes", {
				"result": result,
				"player": client.id,
			} )
		} else {
			//find room object by room name that needs to be updated
			let gameOnCounter = playingRoomManager.getRoomById( roomName );
			gameOnCounter.afterFlip = result;
			// pass updated room inforamtion to the rooms map inside
			// playingRoomManager.js
			playingRoomManager.updateRoom( gameOnCounter );
			io.sockets. in ( roomName ).emit( "getCounterOfferRes", {
				"afterFlip": "counterAction",
				"result": result,
				"player": client.id,
			} )
		}
	} );
	client.on( "flipCard", function ( roomName ) {
		//find room object by room name that needs to be updated
		let gameOnFlipCard = playingRoomManager.getRoomById( roomName );
		let opponent = "";
		client.id === gameOnFlipCard.player1.clientId
			? opponent = "player2"
			: opponent = "player1";
		let card = gameOnFlipCard[ opponent ].stagedCard;
		flipCard( gameOnFlipCard, opponent );
		// pass updated room inforamtion to the rooms map inside
		// playingRoomManager.js
		playingRoomManager.updateRoom( gameOnFlipCard );
		io.sockets. in ( roomName ).emit( "onFlippedCardRes", {
			"deck": gameOnFlipCard[ opponent ].deck,
			"hand": gameOnFlipCard[ opponent ].hand,
			"stagedCard": gameOnFlipCard[ opponent ].stagedCard,
			"field": gameOnFlipCard[ opponent ].field,
			"playerName": client.id,
			"afterFlip": gameOnFlipCard.afterFlip,
			"message": `${ card } was flipped`,
		} );
	} );
	client.on( "switchTurn", function ( roomName ) {
		//find room object by room name that needs to be updated
		let gameOnSwitchTurn = playingRoomManager.getRoomById( roomName );
		gameOnSwitchTurn = onSwitchTurn( gameOnSwitchTurn );
		// pass updated room inforamtion to the rooms map inside
		// playingRoomManager.js
		playingRoomManager.updateRoom( gameOnSwitchTurn );
		io.sockets. in ( roomName ).emit( "getNewTurn", {
			"currentPlayer": client.id,
			"turn": gameOnSwitchTurn.turn,
			"playerMessage": "Your turn",
			"opponnentsMessage": "Waiting for opponent...",
		} )
	} )
	client.on( "drawCard", function ( roomName ) {
		let player = "player1";
		//find room object by room name that needs to be updated
		let gameOnCardDraw = playingRoomManager.getRoomById( roomName );
		gameOnCardDraw.player1.clientId === client.id
			? player = "player1"
			: player = "player2";
		if ( Object.values( gameOnCardDraw[ player ].deck ).reduce( ( a, b ) => a + b ) === 0 ) {
			io.sockets. in ( roomName ).emit( "onVictoryCheck", {
				"playerMessage": "YOU LOST! You don't have any elements to draw.",
				"opponentsMessage": "YOU WON! Your opponent ran out of elements.",
				"playerName": client.id,
			} )
		} else {
			drawCard( 1, gameOnCardDraw[ player ].deck, gameOnCardDraw[ player ].hand );
		}
		// pass updated room inforamtion to the rooms map inside
		// playingRoomManager.js
		playingRoomManager.updateRoom( gameOnCardDraw );
		io.sockets. in ( roomName ).emit( "drawCardRes", {
			"deck": gameOnCardDraw[ player ].deck,
			"hand": gameOnCardDraw[ player ].hand,
			"playerName": client.id,
			"playerMessage": "Element was drawn, it is now your turn",
			"opponentsMessage": "Waiting for opponent...",
		} );
	} );

	client.on( "victoryCheck", function ( roomName ) {
		//find room object by room name that needs to be updated
		let gameOnVictoryCheck = playingRoomManager.getRoomById( roomName );
		if ( getVictory( gameOnVictoryCheck.player1.field ) === "victory" ) {
			io.sockets. in ( roomName ).emit( "onVictoryCheck", {
				"playerMessage": "YOU WON!",
				"opponentsMessage": "YOU LOST!",
				"playerName": gameOnVictoryCheck.player1.clientId,
			} );
		} else if ( getVictory( gameOnVictoryCheck.player2.field ) === "victory" ) {
			io.sockets. in ( roomName ).emit( "onVictoryCheck", {
				"playerMessage": "YOU WON!",
				"opponentsMessage": "YOU LOST!",
				"playerName": gameOnVictoryCheck.player2.clientId,
			} );
		} else {
			io.sockets. in ( roomName ).emit( "onVictoryCheck", {
				"playerName": client.id,
				"playerMessage": "keep playing",
			} )
		}
	} );

	client.on( "leave", function () {
		console.log( "client left the room" )
	} )

	client.on( "disconnect", function () {
		console.log( "client disconnect...", client.id );
		const roomName = playingRoomManager.findRoomByClient( client.id );
		client.broadcast.to( roomName ).emit( "getDisconnect", "Your opponent left the game. You will now be redirected to" +
					" the Home Page." )
		clientManager.deleteClient( client );
		playingRoomManager.deleteRoom( roomName );
	} );

	setTimeout( () => {
		const roomName = playingRoomManager.findRoomByClient( client.id );
		client.broadcast.to( roomName ).emit( "getDisconnect", "Your opponent left the game. You will now be redirected to" +
					" the Home Page." )
	}, 45000 );

	client.on( "error", function ( err ) {
		console.log( "received error from client:", client.id );
		console.log( err );
	} )
} );
//if this production mode
if ( process.env.NODE_ENV === "production" ) {
	//path
	app.use( express.static( path.join( __dirname, "../client/build" ) ) );
	app.get( "/", function ( req, res ) {
		res.sendFile( path.join( __dirname, "../client/build", "index.html" ) );
	} );
}
//server listens to the specified port
server.listen( port, function ( err ) {
	if ( err ) {
		console.log( "error", err )
	}
	console.log( "listening on port" + port );
} )
