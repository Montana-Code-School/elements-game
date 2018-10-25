module.exports = function ( client, rooms ) {
	let counter = 0;

	function handleJoin() {
		for ( let i = 0; i <= counter; i++ ) {
			if ( !!rooms[ `room${ i }` ] ) {
				if ( rooms[ `room${ i }` ].length === 1 ) {
					client.join( `room${ i }` );
					console.log( "client joined: ", `room${ i }` );
					return `room${ i }`;
				} else if ( rooms[ `room${ i }` ].length === 2 && i === counter ) {
					counter++;
				}
			} else {
				client.join( `room${ i }` );
				console.log( "new room created client joined: ", `room${ counter }` );
				return `room${ i }`;
			}
		}
		console.log( "all rooms", rooms );
	}
	drawCard = ( n = 1, player ) => {
		const deck = player.deck;
		const hand = player.hand;
		const keys = Object.keys( deck );

		for ( let i = 0; i < n; i++ ) {
			drawSingleCard();
		}
		function drawSingleCard() {
			if ( keys.length === 0 )
				return;
			const randomIndex = Math.floor( Math.random() * keys.length );
			const randomKey = keys[ randomIndex ];
			if ( !deck[ randomKey ] ) {
				keys.splice( randomIndex, 1 );
				drawSingleCard();
				return;
			}
			deck[ randomKey ]--;
			hand[ randomKey ]++;
		}
		return {deck,hand};
	}
	flipCard = () => {
		let {
			playerHand,
			playerStagedCard,
			playerField,
			opponentsField,
			opponentsDiscard,
			opponentsStagedCard
		} = {
			...this.state
		};
		playerStagedCard.counter = 0;
		playerField[ playerStagedCard.card ]++;
		switch ( playerStagedCard.card ) {
			case "earth":
				drawCard( 1 );
				break;
			case "fire":
				afterFlip = "fireAction";
				break;
			case "shadow":
				afterFlip = "shadowAction";
				break;
			case "light":
				afterFlip = "lightAction";
				break;
			default:
				break;
		}
		this.setState( {
			playerHand,
			playerStagedCard,
			playerField,
			opponentsField,
			opponentsDiscard,
			opponentsStagedCard
		} )
	}


	getVictory = ( field ) => {
		if ( !Object.values( field ).includes( 0 ) )
			return "victory";
		else
			return null;
		}
	return { handleJoin, getVictory, drawCard };
}
