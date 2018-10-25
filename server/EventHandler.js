module.exports = function ( client, rooms, game ) {
	let counter = 0;

	handleJoin=()=> {
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

	onClick = (cardType) => {
		if (game.player1.clientInfo === null || game.player2.clientInfo === null){
			console.log("Player Disconnected")
			return
		}
 		if (game.afterFlip === "" && game.turn === game.player1.clientId){
} 
		//
		// let pick;
		// switch ( game.afterFlip ) {
		// 	case "fireAction":
		// 		opponentsField[ cardType ]--;
		// 		playerDiscard[ cardType ]++;
		// 		game.afterFlip = "";
		// 		break;
		// 	case "earthAction":
		// 		this.drawCard( 1 );
		// 		game.afterFlip = "";
		// 		break;
		// 	case "counterAction":
		// 		playerHand[ cardType ]--;
		// 		playerHand.water--;
		// 		playerDiscard[ cardType ]++;
		// 		playerDiscard.water++;
		// 		opponentsStagedCard--;
		// 		opponentsDiscard++;
		// 		game.afterFlip = "";
		// 		break;
		// 	case "lightAction":
		// 		// call for  discard pile component
		// 		pick = prompt( `Available cards - Earth: ${ playerDiscard.earth}, Fire: ${ playerDiscard.fire}, Water: ${ playerDiscard.water}, Shadow: ${ playerDiscard.shadow}, Light: ${ playerDiscard.light }` );
		// 		playerDiscard[ pick ]--;
		// 		playerHand[ pick ]++;
		// 		game.afterFlip = "";
		// 		break;
		// 	case "shadowAction":
		// 		// pass turn to opponnent
		// 		playerHand[ pick ]--;
		// 		playerDiscard[ pick ]++;
		// 		game.afterFlip = "";
		// 		break;
		// 	default:
		// 		if ( playerHand[ cardType ] === 0 || this.state.playerStagedCard.counter === 1 )
		// 			return
		// 		else {
		// 			playerHand[ cardType ]--;
		// 			playerStagedCard.counter++;
		// 			playerStagedCard.card = cardType;
		// 			if ( window.confirm( "Would you like to counter?" ) ) {
		// 				// check for  water card and additional card in playerhand
		// 				game.afterFlip = "counterAction";
		// 				window.alert( "Pick a second card to discard in addition to your water" );
		// 			} else {
		// 				this.flipCard();
		// 			}
		// 		}
		// 		break;
		// }
	}
	getVictory = ( field ) => {
		if ( !Object.values( field ).includes( 0 ) )
			return "victory";
		else
			return null;
		}
	return { handleJoin, getVictory, drawCard,flipCard,onClick };
}
