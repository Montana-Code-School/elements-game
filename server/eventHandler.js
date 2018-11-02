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
	drawCard = ( n, player ) => {
		const deck = player.deck;
		const hand = player.hand;
		const keys = Object.keys( deck );
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
		for ( let i = 0; i < n; i++ ) {
			drawSingleCard();
		}
		return { deck, hand };
	}
	flipCard = ( gameOnCardFlip, opponent ) => {
		let card = gameOnCardFlip[ opponent ].stagedCard;
		gameOnCardFlip[ opponent ].stagedCard = "";
		gameOnCardFlip[ opponent ].field[ card ]++;
		switch ( card ) {
			case "earth":
				let deckAndHand = drawCard( 1, gameOnCardFlip[ opponent ] );
				gameOnCardFlip[ opponent ].deck = deckAndHand.deck;
				gameOnCardFlip[ opponent ].hand = deckAndHand.hand;
				break;
			case
				"fire":
				gameOnCardFlip.afterFlip = "fireAction";
				break;
			case
				"shadow":
				gameOnCardFlip.afterFlip = "shadowAction";
				break;
			case "light":
				gameOnCardFlip.afterFlip = "lightAction";
				break;
			default:
				break;
		}
		return gameOnCardFlip;
	}
	onClick = ( cardType, gameOnClick, emitAction ) => {
		let currentPlayer = "player1";
		let opponent = "player2";
		if ( gameOnClick.player1.clientInfo === null || gameOnClick.player2.clientInfo === null ) {
			console.log( "Player Disconnected" );
			return
		}
		if ( gameOnClick.turn === gameOnClick.player1.clientId ) {
			currentPlayer = "player1";
			opponent = "player2";
		} else {
			currentPlayer = "player2";
			opponent = "player1";
		}
		switch ( gameOnClick.afterFlip ) {
			case "fireAction":
				gameOnClick[ opponent ].field[ cardType ]--;
				gameOnClick[ opponent ].discard[ cardType ]++;
				emitAction = "fireActionEmit";
				gameOnClick.afterFlip = "";
				break;
			case "counterAction":
				gameOnClick[ opponent ].hand[ cardType ]--;
				gameOnClick[ opponent ].hand[ "water" ]--;
				gameOnClick[ opponent ].discard[ cardType ]++;
				gameOnClick[ opponent ].discard[ "water" ]++;
				gameOnClick[ currentPlayer ].discard[ gameOnClick[ currentPlayer ].stagedCard ]++;
				gameOnClick[ currentPlayer ].stagedCard = "";
				gameOnClick.afterFlip = "";
				emitAction = "counterActionEmit";
				break;
			case "lightAction":
				gameOnClick[ currentPlayer ].discard[ cardType ]--;
				gameOnClick[ currentPlayer ].hand[ cardType ]++;
				emitAction = "lightActionEmit";
				gameOnClick.afterFlip = "";
				break;
			case "shadowAction":
				gameOnClick[ opponent ].hand[ cardType ]--;
				gameOnClick[ opponent ].discard[ cardType ]++;
				gameOnClick.afterFlip = "";
				emitAction = "shadowActionEmit";
				break;
			default:
				if ( gameOnClick[ currentPlayer ].hand[ cardType ] === 0 || gameOnClick[ currentPlayer ].stagedCard !== "" ) {
					return;
				} else {
					gameOnClick[ currentPlayer ].hand[ cardType ]--;
					gameOnClick[ currentPlayer ].stagedCard = cardType;
					gameOnClick.afterFlip = "counterAction";
					emitAction = "cardClicked";
				}
				break;
		}
		return { "game": gameOnClick, "emitAction": emitAction };
	}
	onSwitchTurn = ( gameOnSwitchTurn ) => {
		gameOnSwitchTurn.turn === gameOnSwitchTurn.player1.clientId
			? gameOnSwitchTurn.turn = gameOnSwitchTurn.player2.clientId
			: gameOnSwitchTurn.turn = gameOnSwitchTurn.player1.clientId;
		return gameOnSwitchTurn;
	}
	getVictory = ( field ) => {
		if ( !Object.values( field ).includes( 0 ) ) 
			return "victory";
		else {
			return null;
		}
	}
	return {
		handleJoin,
		getVictory,
		drawCard,
		flipCard,
		onClick,
		onSwitchTurn
	};
}
