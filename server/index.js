const express = require( 'express' );
const app = express();
const port = process.env.PORT || 5000;
const io = require( 'socket.io' )();

const discard_pile = {
	fire: 0,
	light: 0,
	shadow: 0,
	earth: 0,
	water: 0
}
const hand = {
	fire: 0,
	light: 0,
	shadow: 0,
	earth: 0,
	water: 0,
}
const players = {
	player1: null,
	player2: null,
}
let player = 'player1';
const deck = {
	fire: 5,
	light: 5,
	shadow: 5,
	earth: 5,
	water: 5,
}
function reset() {
	players[ 'player1' ] = null
	players[ 'player2' ] = null
	player = 'player1'
}
function draw_card() {
	let random = Math.floor( Math.random() * Object.keys( deck ).length );
	Object
		.keys( deck )
		.map( function ( key, index ) {
			if ( index === random ) {
				if ( deck[ key ] === 0 ) 
					draw_card();
				else {
					deck[ key ]--;
					hand[ key ]++;
				}
			}
		} )
}
io.on( 'connection', function ( socket ) {
	if ( players[ 'player1' ] == null ) {
		players[ 'player1' ] = socket
		console.log( 'player1' );
		// socket.emit('color', 'red')
	} else if ( players[ 'player2' ] == null ) {
		players[ 'player2' ] = socket
		console.log( 'player2' );
		// socket.emit('color', 'yellow')
		// io.emit('turn', 'red')
	} else {
		socket.disconnect()
	}
	socket.on( 'disconnect', function () {
		if ( players[ 'player1' ] === socket ) {
			players[ 'player1' ] = null
		} else if ( players[ 'player2' ] === socket ) {
			players[ 'player2' ] = null
		}
	} )
	socket.on( 'click', function ( id ) {
		// Ignore players clicking when it's not their turn
		// if ( players[ player ] !== socket ) {
		// 	console.log( 'click from wrong player: ' );
		// 	return
		// }
		//  Ignore clicks before both players are connected
		// if ( ( players[ 'player1' ] == null ) || ( players[ 'player2' ] == null ) ) {
		// 	console.log( 'click before all players are connected' )
		// 	return
		// }
		console.log( 'someone', player );
		console.log( id );
		// Toggle the player
		player = player === 'player1'
			? 'player2'
			: 'player1'

	} )
} )
// console.log that your server is up and running
// app.listen( port, () => console.log( `Listening on port ${ port }` ) );
reset();
io.listen( port );
// create a GET route
app.get( '/express_backend', ( req, res ) => {
	res.send( { express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' } );
} )
