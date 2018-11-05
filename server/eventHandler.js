module.exports = function ( client, rooms ) {
	// counter that keep tracking of the last room number that
	// was created
	let counter = 0;

	// function that generates the name of the room that user
	// should join
	handleJoin = () => {
		// look through all room names to see if there is an empty
		// ones or the ones that have only one player in them
		for ( let i = 0; i <= counter; i++ ) {
			//if room wih specific name exist
			if ( !!rooms[ `room${ i }` ] ) {
				//if there is only one person in that room
				if ( rooms[ `room${ i }` ].length === 1 ) {
					//join current user to that room
					client.join( `room${ i }` );
					console.log( "client joined: ", `room${ i }` );
					//return name of that room
					return `room${ i }`;
					// if there is two people in the last room on the list and
					// all of the other rooms are full
				} else if ( rooms[ `room${ i }` ].length === 2 && i === counter ) {
					//and 1 to the counter of the rooms
					counter++;
				};
			} else { //if room with specific name doesn't exist
				//create new room and join client to that new room
				client.join( `room${ i }` );
				console.log( "new room created client joined: ", `room${ counter }` );
				//return name of the new room
				return `room${ i }`;
			};
		};
	}

	//function that drawing n amount of cards from the deck
	drawCard = ( n, deck, hand ) => {
		// create an array with name of elements in the deck
		const keys = Object.keys( deck );
		//function that drawing single card from the deck
		function drawSingleCard() {
			//if there is no keys in keys array
			if ( keys.length === 0 ) 
				return;
			
			//generate random index number in keys array
			const randomIndex = Math.floor( Math.random() * keys.length );
			//access element in keys array using random generated index
			const randomKey = keys[ randomIndex ];
			//if amount of specifc card elements in the deck equals to 0
			if ( !deck[ randomKey ] ) {
				//delete that element from an array
				keys.splice( randomIndex, 1 );
				//call drawSingleCard function;
				drawSingleCard();
				return;
			}
			//move specific card element from deck object to the hand
			deck[ randomKey ]--;
			hand[ randomKey ]++;
		}
		//call drawSingleCard function for n amount of times
		for ( let i = 0; i < n; i++ ) {
			drawSingleCard();
		}
		//return updated deck and hand objects
		return { deck, hand };
	}

	//function that moving staged card to the field
	flipCard = ( gameOnCardFlip, opponent ) => {
		//assign staged card to the card variable
		let card = gameOnCardFlip[ opponent ].stagedCard;
		//empty out staged card name
		gameOnCardFlip[ opponent ].stagedCard = "";
		//increment field value of previously staged card
		gameOnCardFlip[ opponent ].field[ card ]++;
		//make switch by the variable card
		switch ( card ) {
				//if earth card was staged
			case "earth":
				// call drawCard function and pass number 1(for how many
				// cards need to be drawn) and infromation about the players
				// deck and hand that needs to be updated
				drawCard( 1, gameOnCardFlip[ opponent ].deck, gameOnCardFlip[ opponent ].hand );
				break;
				//if fire card was staged
			case "fire":
				//switch afterFlip flag to "fireAction"
				gameOnCardFlip.afterFlip = "fireAction";
				break;
				//if shadow card was staged
			case "shadow":
				//switch afterFlip flag to "shadowAction"
				gameOnCardFlip.afterFlip = "shadowAction";
				break;
				//if light card was staged
			case "light":
				//switch afterFlip flag to "lightAction"
				gameOnCardFlip.afterFlip = "lightAction";
				break;
			default:
				break;
		};
	}

	// function that depending on which card was clicked and
	// what afterFlip flag is set to, moving one card from one
	// pile to another or just move it to the staged card
	onClick = ( cardType, gameOnClick, emitAction ) => {
		//create variables for current player and opponent
		let currentPlayer = "player1";
		let opponent = "player2";
		// check if turn belongs to player1
		if ( gameOnClick.turn === gameOnClick.player1.clientId ) {
			//assign current player to player1 and opponent to player2
			currentPlayer = "player1";
			opponent = "player2";
		} else {
			// if turn belongs to player2 assign cirrent player to
			// player2 and opponent to player1
			currentPlayer = "player2";
			opponent = "player1";
		}
		//make switch by afterFlip flag
		switch ( gameOnClick.afterFlip ) {
				//if fireAction needs to be triggered
			case "fireAction":
				// decrement clicked card on the field and add it to the
				// discard
				gameOnClick[ opponent ].field[ cardType ]--;
				gameOnClick[ opponent ].discard[ cardType ]++;
				//set the flag for the emit
				emitAction = "fireActionEmit";
				//set afterFlip flag to an empty string
				gameOnClick.afterFlip = "";
				break;
				//if counterAction needs to be triggered
			case "counterAction":
				// if actual card was clicked
				if ( cardType !== "none" ) {
					// move clicked card and water card from hand to the discard
					// pile
					gameOnClick[ opponent ].hand[ cardType ]--;
					gameOnClick[ opponent ].hand.water--;
					gameOnClick[ opponent ].discard[ cardType ]++;
					gameOnClick[ opponent ].discard.water++;
					//move staged card to the discard pile
					gameOnClick[ currentPlayer ].discard[ gameOnClick[ currentPlayer ].stagedCard ]++;
					gameOnClick[ currentPlayer ].stagedCard = "";
				}
				//set emitAction flag
				emitAction = "counterActionEmit";
				//set afterFlip flag to an empty string
				gameOnClick.afterFlip = "";
				break;
				//if lightAction needs to be triggered
			case "lightAction":
				// if actual card was clicked
				if ( cardType !== "none" ) {
					//move clicked card from the discrad pile to the hand
					gameOnClick[ currentPlayer ].discard[ cardType ]--;
					gameOnClick[ currentPlayer ].hand[ cardType ]++;
				}
				//set emitAction flag
				emitAction = "lightActionEmit";
				//set afterFlip flag to an empty string
				gameOnClick.afterFlip = "";
				break;
				//if shadowAction needs to be triggered
			case "shadowAction":
				// if actual card was clicked
				if ( cardType !== "none" ) {
					//move clicked card from hand to the discard
					gameOnClick[ opponent ].hand[ cardType ]--;
					gameOnClick[ opponent ].discard[ cardType ]++;
				}
				//set emitAction flag
				emitAction = "shadowActionEmit";
				//set afterFlip flag to an empty string
				gameOnClick.afterFlip = "";
				break;
			default:
				//move clicked card from hand to the staged card
				gameOnClick[ currentPlayer ].hand[ cardType ]--;
				gameOnClick[ currentPlayer ].stagedCard = cardType;
				//set afterFlip flag to counterAction
				gameOnClick.afterFlip = "counterAction";
				//set emitAction flag
				emitAction = "cardClicked";
				break;
		}
		return { "game": gameOnClick, "emitAction": emitAction };
	}

	//switch players turn
	onSwitchTurn = ( gameOnSwitchTurn ) => {
		// if it is first players turn,pass turn to the second
		// player,otherwise pass turn to the first player
		gameOnSwitchTurn.turn === gameOnSwitchTurn.player1.clientId
			? gameOnSwitchTurn.turn = gameOnSwitchTurn.player2.clientId
			: gameOnSwitchTurn.turn = gameOnSwitchTurn.player1.clientId;
		//return updated game state
		return gameOnSwitchTurn;
	}
	//function that check specific field for victory
	getVictory = ( field ) => {
		//if field has more than 0 cards of each kind
		if ( !Object.values( field ).includes( 0 ) ) {
			//return victory string
			return "victory";
		} else {
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
