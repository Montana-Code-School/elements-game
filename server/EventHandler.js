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
	drawCard = ( n = 1, game ) => {
		console.log( "drawCard is working!" )
		const playerDeck = game.player1.deck
		const playerHand = game.player1.hand
		const keys = Object.keys( playerDeck )

		for ( let i = 0; i < n; i++ ) {
			drawSingleCard()
		}
		function drawSingleCard() {
			if ( keys.length === 0 )
				return
			const randomIndex = Math.floor( Math.random() * keys.length )
			const randomKey = keys[ randomIndex ]
			if ( !playerDeck[ randomKey ] ) {
				keys.splice( randomIndex, 1 )
				drawSingleCard()
				return
			}
			playerDeck[ randomKey ]--
			playerHand[ randomKey ]++
		}
		console.log( game )
	}
	getVictory = ( field ) => {
		if ( !Object.values( field ).includes( 0 ) )
			return "victory"
		else
			return null
	}
	return { handleJoin, getVictory, drawCard }
}
