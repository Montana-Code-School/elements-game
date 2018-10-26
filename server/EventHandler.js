module.exports = function ( client, rooms ) {
	let counter = 0;
	handleJoin = () => {
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
		return { deck, hand };
	}
	flipCard = ( game ) => {
		playerStagedCard.counter = 0;
		playerField[ playerStagedCard.card ]++;
		switch ( playerStagedCard.card ) {
			case "earth":
				drawCard( 1 );
				break;
			case "fire":
				game.afterFlip = "fireAction";
				break;
			case "shadow":
				game.afterFlip = "shadowAction";
				break;
			case "light":
				game.afterFlip = "lightAction";
				break;
			default:
				break;
		}
	}

	onClick = ( cardType, game ) => {
		if ( game.player1.clientInfo === null || game.player2.clientInfo === null ) {
			console.log( "Player Disconnected" );
			return
		}
		let currentPlayer = "player1";
		let opponent = "player2";
		if ( game.turn === game.player1.clientId ) {
			currentplayer = "player1";
			opponent = "player2";
		} else {
			currentplayer = "player2";
			opponent = "player1";
		}
		let pick;
		switch ( game.afterFlip ) {
			case "fireAction":
				game[ opponent ].field[ cardType ]--;
				game[ opponent ].discard[ cardType ]++;
				game.afterFlip = "";
				break;
				// I don't think we need this case because it doesn't have effect on click case
				// "earthAction": 	let result = drawCard( 1, currentPlayer ); 	game.afterFlip =
				// ""; 	break;
			case "counterAction":
				game[ currentPlayer ].hand[ cardType ]--;
				game[ currentPlayer ].hand.water--;
				game[ currentPlayer ].discard[ cardType ]++;
				game[ currentPlayer ].discard.water++;
				game[ opponent ].stagedCard = {
					"count": 0,
					"cardName": "",
				};
				game[ opponent ].discard++;
				game.afterFlip = "";
				break;
			case "lightAction":
				// call for discard pile component
				pick = prompt( `Available cards - Earth: ${ game[ currentPlayer ].discard.earth}, Fire: ${ game[ currentPlayer ].discard.fire}, Water: ${ game[ currentPlayer ].discard.water}, Shadow: ${ game[ currentPlayer ].discard.shadow}, Light: ${ game[ currentPlayer ].discard.light }` );
				game[ currentPlayer ].discard[ pick ]--;
				game[ currentPlayer ].hand[ pick ]++;
				game.afterFlip = "";
				break;
			case "shadowAction":
				// pass turn to opponnent
				game[ opponent ].hand[ pick ]--;
				game[ opponent ].discard[ pick ]++;
				game.afterFlip = "";
				break;
			default:
				if ( game[ currentPlayer ].hand[ cardType ] === 0 || game[ currentPlayer ].stagedCard.count === 1 ) {
					return;
				} else {
					console.log( "clicked" );
					game[ currentPlayer ].hand[ cardType ]--;
					game[ currentPlayer ].stagedCard = {
						"count": 1,
						"cardName": cardType,
					};
					return "counter";
					// {  check for  water card and additional card in currentPlayerhand
					// game.afterFlip = "counterAction"; 	window.alert( "Pick a second card to
					// discard in addition to your water " ); } else { 	this.flipCard(); }
				}
				break;
		}
	}
	getVictory = ( field ) => {
		if ( !Object.values( field ).includes( 0 ) ) 
			return "victory";
		else 
			return null;
		}
	return { handleJoin, getVictory, drawCard, flipCard, onClick };
}
