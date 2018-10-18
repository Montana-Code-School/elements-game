const express = require( 'express' );
const app = express();
const port = process.env.PORT || 5000;
const server = require( 'http' ).createServer()
const io = require( 'socket.io' )( server )

const ClientManager = require( './ClientManager' )

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

	client.on( 'join', async function () {

		for ( let i = 0; i <= counter; i++ ) {
			if ( !!io.sockets.adapter.rooms[ `room${ i }` ] ) {
				if ( io.sockets.adapter.rooms[ `room${ i }` ].length === 1 ) {
					await new Promise( ( resolve ) => {
						client.join( `room${ i }`, function () {
							resolve();
						} );
					} )
				} else {
					counter++;
				}
			} else {
				await new Promise( ( resolve ) => {
					client.join( `room${ i }`, function () {
						resolve();
					} );
				} )
				console.log( 'new room created client joined: ', `room${ counter }` );
			}
		}
		console.log( "all rooms", io.sockets.adapter.rooms )
	} )
	// console.log( "rooms", playing_room ), });
	client.on( 'disconnect', function () {
		console.log( 'client disconnect...', client.id );
		// remove user
		clientManager.removeClient( client )
		console.log( io.sockets.adapter.rooms )
	} );
	client.on( 'error', function ( err ) {
		console.log( 'received error from client:', client.id )
		console.log( err )
	} )
} );
server.listen( port, function ( err ) {
	if ( err ) 
		throw err
	console.log( 'listening on port' + port )
} )
