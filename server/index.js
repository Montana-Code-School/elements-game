const express = require( 'express' );
const app = express();
const port = process.env.PORT || 5000;
const server = require( 'http' ).createServer()
const io = require( 'socket.io' )( server )
const _ = require( "underscore" );
const ClientManager = require( './ClientManager' )

const clientManager = ClientManager()
let counter = 0;
io.on( 'connection', function ( client ) {
	console.log( 'client connected...', client.id )
	clientManager.addClient( client )

	client.on( 'join', async function () {

		const { rooms } = io.sockets.adapter;

		for ( let i = 0; i <= counter; i++ ) {
			if ( !!io.sockets.adapter.rooms[ `room${ i }` ] ) {
				if ( io.sockets.adapter.rooms[ `room${ i }` ].length === 1 ) {
					client.join( `room${ i }` );
					console.log( 'client joined: ', `room${ i }` );
					break;
				} else if ( io.sockets.adapter.rooms[ `room${ i }` ].length === 2 && i === counter ) {
					counter++;
				}
			} else {
				client.join( `room${ i }` );
				console.log( 'new room created client joined: ', `room${ counter }` );
				break;
			}
		}
		console.log( "all rooms", io.sockets.adapter.rooms )
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
server.listen( port, function ( err ) {
	if ( err ) 
		throw err
	console.log( 'listening on port' + port )
} )
