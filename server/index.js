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

	//message from the client to make initialDraw
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

	//message from the client that click event happened
	client.on( "click", ( cardType, roomName, afterFlip ) => {
		//find room object by room name that needs to be updated
		let gameOnClick = playingRoomManager.getRoomById( roomName );
		// trigger onClick function inside eventHandler.js and
		// assign result to the res
		let res = onClick( cardType, gameOnClick );
		//assign updated game state to the gameOnClick
		gameOnClick = res.game;
		// assign emitAction flag depending on onClick function
		// result
		let emitAction = res.emitAction;
		//zero out afterFlip flag
		gameOnClick.afterFlip = "";
		// pass updated room inforamtion to the rooms map inside
		// playingRoomManager.js
		playingRoomManager.updateRoom( gameOnClick );
		// variable that assigns player1 or player2 depending on who
		// made an emit
		let currentPlayer = "";
		let opponent = "";
		if ( client.id === gameOnClick.player1.clientId ) {
			currentPlayer = "player1";
			opponent = "player2";
		} else {
			currentPlayer = "player2";
			opponent = "player1";
		}
		//switch by emitAction flag
		switch ( emitAction ) {
				//if counter action was triggered
			case "counterActionEmit":
				//send updated game state after counter action
				io.sockets. in ( roomName ).emit( "onCounterActionRes", {
					"result": "counter",
					"counteringPlayerDiscard": gameOnClick[ currentPlayer ].discard,
					"counteringPlayerHand": gameOnClick[ currentPlayer ].hand,
					"playerStagedCard": gameOnClick[ opponent ].stagedCard,
					"playerDiscard": gameOnClick[ opponent ].discard,
					"afterFlip": gameOnClick.afterFlip,
					"player": client.id,
				} );
				break;
				//if fire action was triggered
			case "fireActionEmit":
				//send updated game state after fire action
				io.sockets. in ( roomName ).emit( "cardActionRes", {
					"field": gameOnClick[ opponent ].field,
					"discard": gameOnClick[ opponent ].discard,
					"emitAction": emitAction,
					"afterFlip": gameOnClick.afterFlip,
					"currentPlayer": client.id
				} );
				break;
				//if shadow action was triggered
			case "shadowActionEmit":
				//send updated game state after shadow action
				io.sockets. in ( roomName ).emit( "cardActionRes", {
					"hand": gameOnClick[ currentPlayer ].hand,
					"discard": gameOnClick[ currentPlayer ].discard,
					"emitAction": emitAction,
					"afterFlip": gameOnClick.afterFlip,
					"currentPlayer": client.id
				} );
				break;
				//if light action was triggered
			case "lightActionEmit":
				//send updated game state after light action
				io.sockets. in ( roomName ).emit( "cardActionRes", {
					"hand": gameOnClick[ currentPlayer ].hand,
					"discard": gameOnClick[ currentPlayer ].discard,
					"emitAction": emitAction,
					"afterFlip": gameOnClick.afterFlip,
					"currentPlayer": client.id,
				} );
				break;
				//in case of regular click
			default:
				// send updated game state after card was clicked and
				// afterFlip was assigned to an empty string
				io.sockets. in ( roomName ).emit( "cardClicked", {
					"hand": gameOnClick[ currentPlayer ].hand,
					"stagedCard": gameOnClick[ currentPlayer ].stagedCard,
					"playerName": client.id
				} );
				break;
		}
	} );

	// message from the client that counterOffer needs to be
	// triggered
	client.on( "counterOffer", function ( roomName ) {
		//send counter offer to the both clients
		io.sockets. in ( roomName ).emit( "getCounterOffer", {
			"message": "Waiting for opponent...",
			"currentPlayer": client.id,
		} );
	} );

	//message from the client with the result of an offer
	client.on( "sendCounterOfferRes", function ( roomName, result ) {
		//if result equals to noCounter
		if ( result === "noCounter" ) {
			io.sockets. in ( roomName ).emit( "getCounterOfferRes", {
				"result": result,
				"player": client.id,
			} )
			//if user decided to counter
		} else {
			//find room object by room name that needs to be updated
			let gameOnCounter = playingRoomManager.getRoomById( roomName );
			gameOnCounter.afterFlip = result;
			// pass updated room inforamtion to the rooms map inside
			// playingRoomManager.js
			playingRoomManager.updateRoom( gameOnCounter );
			//send updated game state to the both clients
			io.sockets. in ( roomName ).emit( "getCounterOfferRes", {
				"afterFlip": "counterAction",
				"result": result,
				"player": client.id,
			} );
		}
	} );

	//message from the client to move staged card to the field
	client.on( "flipCard", function ( roomName ) {
		//find room object by room name that needs to be updated
		let gameOnFlipCard = playingRoomManager.getRoomById( roomName );
		let opponent = "";
		// depending on who send request to flip the card assign
		// opponent variable
		client.id === gameOnFlipCard.player1.clientId
			? opponent = "player2"
			: opponent = "player1";
		//remember which card was staged
		let card = gameOnFlipCard[ opponent ].stagedCard;
		//get updated game state after card was moved to the field
		flipCard( gameOnFlipCard, opponent );
		// pass updated room inforamtion to the rooms map inside
		// playingRoomManager.js
		playingRoomManager.updateRoom( gameOnFlipCard );
		//send updated game state to both clients
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
		onSwitchTurn( gameOnSwitchTurn );
		// pass updated room inforamtion to the rooms map inside
		// playingRoomManager.js
		playingRoomManager.updateRoom( gameOnSwitchTurn );
		io.sockets. in ( roomName ).emit( "getNewTurn", {
			"currentPlayer": client.id,
			"turn": gameOnSwitchTurn.turn,
			"playerMessage": "Your turn",
			"opponnentsMessage": "Waiting for opponent...",
		} )
	} );

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

	//inactivity timeout
	setTimeout( () => {
		const roomName = playingRoomManager.findRoomByClient( client.id );
		client.broadcast.to( roomName ).emit( "getDisconnect", "Your opponent left the game. You will now be redirected to" +
					" the Home Page." )
	}, 120000 );

	//
	client.on( "error", function ( err ) {
		console.log( "received error from client:", client.id );
		console.log( err );
	} )
} );
//if this production mode
if ( process.env.NODE_ENV === "production" ) {
	//path to the
	app.use( express.static( path.join( __dirname, "../client/build" ) ) );
	app.get( "/", function ( req, res ) {
		res.sendFile( path.join( __dirname, "../client/build", "index.html" ) );
	} );
};
//server listens to the specified port
server.listen( port, function ( err ) {
	if ( err ) {
		console.log( "error", err )
	}
	console.log( "listening on port" + port );
} );
