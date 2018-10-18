const express = require( 'express' );
const app = express();
const port = process.env.PORT || 5000;
const server = require( 'http' ).createServer()
const io = require( 'socket.io' )( server )

const ClientManager = require( './ClientManager' )
// const makeHandlers = require( './handlers' )
let counter = 0;
const players = {
	player1: null,
	player2: null,
}
let player = 'player1';

function reset() {
	players[ 'player1' ] = null
	players[ 'player2' ] = null
	player = 'player1'
}
const clientManager = ClientManager()

io.on( 'connection', function ( client ) {
	console.log( 'client connected...', client.id )
	clientManager.addClient( client )

	client.on( 'join', function () {
		// if ( Object.keys( io.sockets.adapter.rooms ) ) {
		// 	io
		// 		.sockets
		// 		.adapter
		// 		.rooms
		// 		.map( ( room, index ) => {
		// 			console.log( room );
		// 		} )
		// } else {
		client.join( `room${ counter }` );
		// console.log( 'new room created client joined: ', `room${ counter }` );
		console.log( io.sockets.adapter )
		// }

		// console.log( "join the room", io.sockets.adapter.rooms )
	} )
	client.on( 'disconnect', function () {
		console.log( 'client disconnect...', client.id );
		// remove user profile
		clientManager.removeClient( client )
	} )

	client.on( 'error', function ( err ) {
		console.log( 'received error from client:', client.id )
		console.log( err )
	} )
} )

server.listen( port, function ( err ) {
	if ( err ) 
		throw err
	console.log( 'listening on port' + port )
} )
