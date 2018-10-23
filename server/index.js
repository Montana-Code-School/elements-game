const connect = require( 'connect' );
const serveStatic = require( 'serve-static' );
const path = require( 'path' )
const port = process.env.PORT || 5000;
const server = require( 'http' ).createServer();
const io = require( 'socket.io' )( server );
const _ = require( "underscore" );
const ClientManager = require( './ClientManager' );
const makeHandlers = require( './EventHandler' )
const clientManager = ClientManager();

const game = {
	room: null,
	'player1': {
		clientInfo: null,
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
	'player2': {
		clientInfo: null,
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
let player = 'player1';
let afterFlip = "";
io.on( 'connection', function ( client ) {
	const { rooms } = io.sockets.adapter;
	const { handleJoin, drawCard } = makeHandlers( client, clientManager, rooms )

	if ( game.player1.clientInfo == null ) {
		players.player1.clientInfo = client
	} else if ( game.player2.clientInfo == null ) {
		players.player2.clientInfo = client
	} else {
		client.disconnect()
	}

	console.log( 'client connected...', game.player1.clientInfo.id )
	clientManager.addClient( client )
	// const drawCard1 = () => drawCard( 4 )
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
// if ( process.env.NODE_ENV === 'production' ) {
// 	connect().use( serveStatic( path.join( __dirname, 'client/build' ) ) )
// }
server.listen( port, function ( err ) {
	if ( err ) 
		throw err
	console.log( 'listening on port' + port )
} )
