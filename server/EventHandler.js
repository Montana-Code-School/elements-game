module.exports = function ( client, ClientManager, rooms ) {
	let counter = 0;

	function handleJoin() {
		for ( let i = 0; i <= counter; i++ ) {
			if ( !!rooms[ `room${ i }` ] ) {
				if ( rooms[ `room${ i }` ].length === 1 ) {
					client.join( `room${ i }` );
					console.log( 'client joined: ', `room${ i }` );
					break;
				} else if ( rooms[ `room${ i }` ].length === 2 && i === counter ) {
					counter++;
				}
			} else {
				client.join( `room${ i }` );
				console.log( 'new room created client joined: ', `room${ counter }` );
				break;
			}
		}
		console.log( "all rooms", rooms )
	}
	function drawCard( n = 1 ) {
		console.log( n )
		let random;
		// for ( let i = 0; i < n; i++ ) {
		// 	random = Math.floor( Math.random() * Object.keys( this.state.playerDeck ).length );
		// 	Object
		// 		.keys( this.state.playerDeck )
		// 		.forEach( ( key, index ) => {
		// 			if ( index === random ) {
		// 				if ( this.state.playerDeck[ key ] === 0 ) {
		// 					this.draw_card();
		// 				} else {
		// 					this.setState( {
		// 						[ `playerDeck['${ key }']` ]: this
		// 							.state
		// 							.playerDeck[ key ]--,
		// 						[ `playerDeck['${ key }']` ]: this
		// 							.state
		// 							.playerHand[ key ]++,
		// 					} );
		// 				}
		// 			}
		// 		} )
		// }
	}
	getVictory = ( field ) => {
		if ( !Object.values( field ).includes( 0 ) ) 
			return "victory"
		else 
			return null
	}
	return { handleJoin, drawCard, getVictory }
}
