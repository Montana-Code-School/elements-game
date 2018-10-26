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
		playerStagedCard = "";
		playerField[ playerStagedCard ]++;
		switch ( playerStagedCard ) {
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
		let gameUpdate = {};
		let emitAction = "";
		let currentPlayer = "player1";
		let opponent = "player1";
		if ( game.player1.clientInfo === null || game.player2.clientInfo === null ) {
			console.log( "Player Disconnected" );
			return
		}
		if ( game.turn === game.player1.clientId ) {
			currentplayer = "player1";
			opponent = "player2";
		} else {
			currentplayer = "player2";
			opponent = "player1";
		}
		switch ( game.afterFlip ) {
			case "fireAction":
				game[ opponent ].field[ cardType ]--;
				game[ opponent ].discard[ cardType ]++;
				game.afterFlip = "";
				emitAction = "fireActionEmit";
				break;
			case "counterAction":
				game[ currentPlayer ].hand[ cardType ]--;
				game[ currentPlayer ].hand.water--;
				game[ currentPlayer ].discard[ cardType ]++;
				game[ currentPlayer ].discard.water++;
				game[ opponent ].stagedCard = "";
				game[ opponent ].discard++;
				game.afterFlip = "";
				emitAction = "counterActionEmit";
				break;
			case "lightAction":
				// call for discard pile component
				pick = prompt( `Available cards - Earth: ${ game[ currentPlayer ].discard.earth}, Fire: ${ game[ currentPlayer ].discard.fire}, Water: ${ game[ currentPlayer ].discard.water}, Shadow: ${ game[ currentPlayer ].discard.shadow}, Light: ${ game[ currentPlayer ].discard.light }` );
				game[ currentPlayer ].discard[ pick ]--;
				game[ currentPlayer ].hand[ pick ]++;
				game.afterFlip = "";
				emitAction = "lightActionEmit";
				break;
			case "shadowAction":
				// pass turn to opponnent
				game[ opponent ].hand[ pick ]--;
				game[ opponent ].discard[ pick ]++;
				game.afterFlip = "";
				emitAction = "shadowActionEmit";
				break;
			default:
				if ( game[ currentPlayer ].hand[ cardType ] === 0 || game[ currentPlayer ].stagedCard !== "empty" ) {
					return;
				} else {
					game[ currentPlayer ].hand[ cardType ]--;
					game[ currentPlayer ].stagedCard = cardType;
					game.afterFlip = "counterAction";
					emitAction = "cardPlayed";
				}
				break;
		}
		return { "game": game, "emitAction": emitAction };
	}
	getVictory = ( field ) => {
		if ( !Object.values( field ).includes( 0 ) ) 
			return "victory";
		else 
			return null;
		}
	return { handleJoin, getVictory, drawCard, flipCard, onClick };
}
