const connect = require( "connect" );
const serveStatic = require( "serve-static" );
const express = require( "express" );
const app = express();
const path = require( "path" );
const port = process.env.PORT || 5001;
const server = require( "http" ).createServer( app );
const io = require( "socket.io" )( server );
const makeHandlers = require( "./eventHandler" );

const game = {
	room: null,
	afterFlip: "",
	turn: "",
	"player1": {
		clientInfo: null,
		clientId: null,
		field: {
			fire: 0,
			water: 0,
			light: 0,
			shadow: 0,
			earth: 0
		},
		hand: {
			fire: 0,
			water: 0,
			light: 0,
			shadow: 0,
			earth: 0
		},
		deck: {
			fire: 5,
			water: 5,
			light: 5,
			shadow: 5,
			earth: 5
		},
		discard: {
			fire: 0,
			water: 0,
			light: 0,
			shadow: 0,
			earth: 0
		},
		stagedCard: {
			count: 0,
			cardName: ""
		},
	},
	"player2": {
		clientInfo: null,
		clientId: null,
		field: {
			fire: 0,
			water: 0,
			light: 0,
			shadow: 0,
			earth: 0
		},
		hand: {
			fire: 0,
			water: 0,
			light: 0,
			shadow: 0,
			earth: 0
		},
		deck: {
			fire: 5,
			water: 5,
			light: 5,
			shadow: 5,
			earth: 5
		},
		discard: {
			fire: 0,
			water: 0,
			light: 0,
			shadow: 0,
			earth: 0
		},
		stagedCard: {
			count: 0,
			cardName: ""
		},
	},
};

io.on( "connection", function ( client ) {

	const { rooms } = io.sockets.adapter;
	const { handleJoin, getVictory, drawCard,flipCard, onClick } = makeHandlers( client, rooms, game );

	client.on( "join", function (){
		game.room = handleJoin();
		if (game.player1.clientInfo === null) {
			game.player1.clientInfo = client;
			game.player1.clientId = client.id;
			game.turn = client.id
			client.emit("roomJoin", {"roomName": game.room, "playerName": client.id, "turn": game.turn});
		} else if (game.player2.clientInfo === null){
			game.player2.clientInfo = client;
			game.player2.clientId = client.id;
		 	client.emit("roomJoin", {"roomName": game.room, "playerName": client.id});
		}
		} );
	client.on( "initialDraw", function (roomName) {
		// Find specific room for initialDraw
		if(game.player1.clientInfo && game.player2.clientInfo){
		 	 drawCard( 4, game.player1 );
			 drawCard(4,game.player2);
			 io.sockets.in(roomName).emit("initialDrawRes", {
				 "player1": {
					 "deck": game.player1.deck,
					 "hand": game.player1.hand,
				 },
				 "player2": {
					 "deck": game.player2.deck,
					 "hand": game.player2.hand,
				 }
			 });
		}
	} );
	client.on("click",cardType=>{
		onClick(cardType);
	})
	client.on("flipCard", flipCard);
	client.on( "disconnect", function () {
		console.log( "client disconnect...", client.id );
		// remove user client.removeClient( client );
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
	if ( err )
		throw err
	console.log( "listening on port" + port );
} )
