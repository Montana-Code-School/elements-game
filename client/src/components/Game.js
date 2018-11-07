import React, { Component } from "react";
import CardDisplay from "./CardDisplay";
import CustomModal from "./Modal";
import { Grid, Card, withStyles } from "@material-ui/core";
import { Card as styles } from "./AllStyles";
import socket from "./socket";
import CardCounts from "./CardCounts";
import PlayArea from "./PlayArea";

//main component
class Game extends Component {
	constructor() {
		super();
		this.state = {
			client: socket(),
			message: "Waiting for opponent to join the game.",
			previousPlay: "None",
			turn: "",
			modal: {
				open: false,
				message: "",
				buttonFlag: ""
			},
			room: null,
			afterFlip: "",
			playerName: null,
			//object that contains information about opponent
			opponent: {
				deck: 25,
				discard: 0,
				stagedCard: "",
				hand: 0,
				field: {
					fire: 0,
					water: 0,
					light: 0,
					shadow: 0,
					earth: 0
				}
			},
			//object that contains information about player
			player: {
				deck: 25,
				hand: {
					fire: 0,
					water: 0,
					light: 0,
					shadow: 0,
					earth: 0
				},
				field: {
					fire: 0,
					water: 0,
					light: 0,
					shadow: 0,
					earth: 0
				},
				discard: {
					fire: 0,
					water: 0,
					light: 0,
					shadow: 0,
					earth: 0
				},
				stagedCard: ""
			}
		};
		//set listeners to the all messages from the server
		this.state.client.join();
		this.state.client.getRoomJoin( this.onRoomJoin );
		this.state.client.getInitialDrawRes( this.onInitialDrawRes );
		this.state.client.getClickedCard( this.onClickedCard );
		this.state.client.getCounterOffer( this.onCounterOffer );
		this.state.client.getCounterOfferRes( this.onCounterOfferRes );
		this.state.client.getCounterActionRes( this.onCounterActionRes );
		this.state.client.getFlippedCardRes( this.onFlippedCardRes );
		this.state.client.getDrawCardRes( this.onDrawCardRes );
		this.state.client.getVictoryCheck( this.onVictoryCheck );
		this.state.client.getCardActionRes( this.onCardActionRes );
		this.state.client.getNewTurn( this.onNewTurn );
		this.state.client.getDisconnect( this.onDisconnect );
	};

	// function that returns sum of all field values in the
	// object
	getCount = ( cards ) => {
		let count = 0;
		for ( let cardType in cards ) {
			count += cards[ cardType ];
		}
		return count;
	};

	//in case if your opponent disconnected
	onDisconnect = ( data ) => {
		// open modal  with message about opponent being
		// disconnected and button that will take player back to the
		// home screen
		this.modalContent( "homeButton", data, this.state.client.disconnect.bind( this ) );
	};

	//after player joined playing room
	onRoomJoin = ( data ) => {
		//set room name, player name, and turn inside of state
		this.setState( {
			room: data.roomName,
			playerName: data.playerName,
			turn: data.turn
		}, function () {
			//if this is the second player who joined the room
			if ( this.state.playerName !== this.state.turn ) {
				//make request to the server for initial draw
				this.state.client.initialDraw( this.state.room );
			}
		} );
	};

	// function that being triggered when server sent back
	// initial draw result
	onInitialDrawRes = ( data ) => {
		//create copy of player and opponent objects from this.state
		const player = {
			...this.state.player
		};
		const opponent = {
			...this.state.opponent
		};
		//if it is current player turn
		if ( this.state.playerName === this.state.turn ) {
			// update player and opponent objects with recieved
			// information from the server
			player.hand = data.player1.hand;
			player.deck = this.getCount( data.player1.deck );
			opponent.hand = this.getCount( data.player2.hand );
			opponent.deck = this.getCount( data.player2.deck );
			//set state with updated copies
			this.setState( { player, opponent, message: data.player1.message } );
			//if turn belongs to the opponent
		} else {
			// update player and opponent objects with recieved
			// information from the server
			player.hand = data.player2.hand;
			player.deck = this.getCount( data.player2.deck );
			opponent.hand = this.getCount( data.player1.hand );
			opponent.deck = this.getCount( data.player1.deck );
			//set state with updated copies
			this.setState( { player, opponent, message: data.player2.message, } );
		}
	};

	//function that handles all click events on the game page
	clickHandler = ( e ) => {
		//assign clicked card type to the onClickedCardName
		let onClickedCardName = e.currentTarget.className.split( " " )[ 2 ];
		//assign name of the clicked parent div to parent variable
		let parent = e.target.parentElement.className.split( " " )[ 3 ];
		// if turn doesn't belong to the player and afterFlip flag
		// is empty
		if ( this.state.turn !== this.state.playerName && this.state.afterFlip === "" ) {
			//display modal to the player saying that it's not his turn
			this.modalContent( "closeButton", "It is not your turn." )
			//if this is players turn
		} else if ( this.state.turn === this.state.playerName ) {
			//if card was already played and afterflip is still empty
			if ( this.state.player.stagedCard !== "" && this.state.afterFlip === "" ) {
				// display modal to the player saying that he already played
				// one card and now should wait for the opponent
				this.setState( { "message": "Element is already played, wait for opponent" } );
				// if afterFlip flag is empty player can click only when
				// certain certain conditions are met
			} else if ( this.state.afterFlip === "" ) {
				// if player clicked inside playerHand container and amount
				// of that card in the hand more than 0
				if ( parent === "playerHand" && this.state.player.hand[ onClickedCardName ] > 0 ) {
					//close modal
					this.closeModal();
					// send message to the server about which card was clicked,
					// name of the room and afterFlip flag
					this.state.client.clickCard( onClickedCardName, this.state.room, this.state.afterFlip );
					//if amount of clicked card in the hand is 0
				} else if ( parent === "playerHand" ) {
					// open modal to the user with message that he is uable to
					// play this card
					this.modalContent( "closeButton", "You are unable to play this element." )
				}
				// if afterFlip flag set to fireAction,clciked card is
				// inside of fireActionModal and amount of that card is more
				// than 0 on the opponents field
			} else if ( this.state.afterFlip === "fireAction" && parent === "fireActionModal" && this.state.opponent.field[ onClickedCardName ] > 0 ) {
				//close modal
				this.closeModal();
				// send message to the server about which card was clicked,
				// name of the room and afterFlip flag
				this.state.client.clickCard( onClickedCardName, this.state.room, this.state.afterFlip );
				// if afterFlip flag set to lighAction,clciked card is
				// inside of lightActionModal and amount of that card is
				// more than 0 inside of players discard
			} else if ( this.state.afterFlip === "lightAction" && parent === "lightActionModal" && this.state.player.discard[ onClickedCardName ] > 0 ) {
				//close modal
				this.closeModal();
				// send message to the server about which card was clicked,
				// name of the room and afterFlip flag
				this.state.client.clickCard( onClickedCardName, this.state.room, this.state.afterFlip );
			}
			// if this is not players turn and afterflip flag set to the
			// counterAction or shadowAction
		} else if ( this.state.turn !== this.state.playerName && ( this.state.afterFlip === "counterAction" || this.state.afterFlip === "shadowAction" ) ) {
			//if click was made inside of counter Action Modal
			if ( parent === "counterActionModal" ) {
				// if player clicked water and he has two or more cards of
				// water
				if ( onClickedCardName === "water" && this.state.player.hand[ onClickedCardName ] >= 2 ) {
					//close modal
					this.closeModal();
					// send message to the server about which card was clicked,
					// name of the room and afterFlip flag
					this.state.client.clickCard( onClickedCardName, this.state.room, this.state.afterFlip );
					// if player clicked some other element different from water
					// and he has at lest one clicked card in the hand
				} else if ( onClickedCardName !== "water" && this.state.player.hand[ onClickedCardName ] > 0 ) {
					//close modal
					this.closeModal();
					// send message to the server about which card was clicked,
					// name of the room and afterFlip flag
					this.state.client.clickCard( onClickedCardName, this.state.room, this.state.afterFlip );
				}
				// if click happened inside of shadowActionModal and player
				// has at lest one of the clicked card in his hand
			} else if ( parent === "shadowActionModal" && this.state.player.hand[ onClickedCardName ] > 0 ) {
				//close modal
				this.closeModal();
				// send message to the server about which card was clicked,
				// name of the room and afterFlip flag
				this.state.client.clickCard( onClickedCardName, this.state.room, this.state.afterFlip );
			}
		}
	};

	// message from the server wih updated state of the game
	// after click action happened
	onClickedCard = ( data ) => {
		//create copy of player and opponent objects from this.state
		const player = {
			...this.state.player
		};
		const opponent = {
			...this.state.opponent
		};
		//if this is the player who played the card
		if ( data.playerName === this.state.playerName ) {
			// update player object with recieved information from the
			// server
			player.hand = data.hand;
			player.stagedCard = data.stagedCard
			// update player object in this.state and send message to
			// the server to trigger counter offer to the opponent
			this.setState( {
				player
			}, this.state.client.counterOffer( this.state.room ) );
		} else {
			// update opponent object with recieved information from the
			// server
			opponent.hand = this.getCount( data.hand );
			opponent.stagedCard = data.stagedCard;
			//update opponent object in this.state
			this.setState( { opponent } )
		}
	};

	onCounterOffer = ( data ) => {
		if ( data.currentPlayer === this.state.playerName ) {
			this.setState( { message: data.message } )
		} else {
			if ( this.state.player.hand.water > 0 && Object.values( this.state.player.hand ).reduce( ( a, b ) => a + b ) > 1 ) {

				this.modalContent( "choiceButton", "Would you like to counter?" )
			} else if ( this.state.player.hand.water === 0 ) {
				console.log( "no ability to counter" )
				this.modalContent( "noWaterButton", "You are unable to counter at this time." )
			}
		}
	};

	//if user clicked "no" on the counter modal
	refuseCounter = () => {
		//trigger closeModal function and pass "noCounter flag
		this.closeModal( "noCounter" );
	};

	//if user clicked "yes" on the counter modal
	acceptCounter = () => {
		//trigger closeModal function and pass "counter" flag
		this.closeModal( "counter" );
	};

	// message from the server with the result of counter offer
	onCounterOfferRes = ( data ) => {
		//is user decided not to counter
		if ( data.result === "noCounter" ) {
			//if this is countering player
			if ( data.player === this.state.playerName ) {
				//send message to the server to make card flip
				this.state.client.flipCard( this.state.room );
			}
			//if user decided to counter
		} else if ( data.result === "counter" ) {
			//if this is countering player
			if ( data.player === this.state.playerName ) {
				// update afterFlip flag and open modal with players hand
				// and prompt player to discard a card along with water
				this.setState( {
					afterFlip: data.afterFlip
				}, this.modalContent( "noButton" ) )
			}
			//if this is the other player
		} else {
			//update afterFlip flag
			this.setState( { "afterFlip": data.afterFlip } )
		}
	};

	// message from the server with the result of counter offer
	// action
	onCounterActionRes = ( data ) => {
		//create copy of player and opponent objects from this.state
		const player = {
			...this.state.player
		};
		const opponent = {
			...this.state.opponent
		};
		//if this is countering player
		if ( data.player === this.state.playerName ) {
			// update player and opponent objects with recieved
			// information from the server
			player.hand = data.counteringPlayerHand;
			player.discard = data.counteringPlayerDiscard;
			opponent.stagedCard = data.playerStagedCard;
			opponent.discard = this.getCount( data.playerDiscard );
			// update afterFlip flag, player and opponent objects in
			// this.state and send message to the server to switch turn
			this.setState( {
				player,
				opponent,
				afterFlip: data.afterFlip,
			}, this.state.client.switchTurn( this.state.room ) );
		} else {
			// update player and opponent objects with recieved
			// information from the server
			player.stagedCard = data.playerStagedCard;
			player.discard = data.playerDiscard;
			opponent.hand = this.getCount( data.counteringPlayerHand );
			opponent.discard = this.getCount( data.counteringPlayerDiscard );
			// update afterFlip flag,player and opponent objects in
			// this.state
			this.setState( { opponent, player, afterFlip: data.afterFlip, } )
		}
	};

	onFlippedCardRes = ( data ) => {
		//create copy of player and opponent objects from this.state
		const player = {
			...this.state.player
		};
		const opponent = {
			...this.state.opponent
		};
		if ( this.state.playerName === data.playerName ) {
			// update opponent object with recieved information from the
			// server
			opponent.field = data.field;
			opponent.stagedCard = data.stagedCard;
			opponent.hand = this.getCount( data.hand );
			opponent.deck = this.getCount( data.deck );
			this.setState( {
				opponent,
				"afterFlip": data.afterFlip,
				"previousPlay": data.message,
			}, function () {
				this.state.client.victoryCheck( this.state.room );
				if ( this.state.afterFlip === "shadowAction" ) {
					if ( this.getCount( this.state.player.hand ) === 0 ) {
						this.modalContent( "closeButton", "There are no elements in your hand to discard.", this.state.client.clickCard.bind( this, "none", this.state.room, this.state.afterFlip ) )
					} else {
						this.modalContent( "noButton" )
					}
				} else if ( this.state.afterFlip !== "shadowAction" && this.state.afterFlip !== "lightAction" && this.state.afterFlip !== "fireAction" ) {
					this.state.client.switchTurn( this.state.room );
				}
			} );
		} else {
			player.deck = this.getCount( data.deck );
			player.hand = data.hand;
			player.field = data.field;
			player.stagedCard = data.stagedCard;
			this.setState( {
				player,
				"afterFlip": data.afterFlip,
				"previousPlay": data.message,
			}, function () {
				if ( this.state.afterFlip === "lightAction" ) {
					if ( this.getCount( this.state.player.discard ) === 0 ) {
						this.modalContent( "closeButton", "There are no elements in your discard.", this.state.client.clickCard.bind( this, "none", this.state.room, this.state.afterFlip ) )
					} else {
						this.modalContent( "noButton" )
					}
				} else if ( this.state.afterFlip === "fireAction" ) {
					if ( this.getCount( this.state.opponent.field ) === 0 ) {
						this.modalContent( "closeButton", "There are no elements on the opponents field", this.state.client.clickCard.bind( this, "none", this.state.room, this.state.afterFlip ) )
					} else {
						this.modalContent( "noButton" )
					}
				}
			} );
		}
	}
	onDrawCardRes = ( data ) => {
		//create copy of player and opponent objects from this.state
		const player = {
			...this.state.player
		};
		const opponent = {
			...this.state.opponent
		};
		if ( data.playerName === this.state.playerName ) {
			// update player object copy with recieved information from
			// the server
			player.hand = data.hand;
			player.deck = this.getCount( data.deck );
			this.setState( { player, "message": data.playerMessage, } )
		} else {
			// update opponent object copy with recieved information
			// from the server
			opponent.hand = this.getCount( data.hand );
			opponent.deck = this.getCount( data.deck );
			this.setState( { opponent, "message": data.opponentsMessage, } )
		}
	};

	modalContent = ( buttonFlag, message = "", triggerFunction = null ) => {
		this.setState( {
			modal: {
				open: true,
				message: message,
				buttonFlag: buttonFlag,
			}
		}, function () {
			if ( triggerFunction !== null ) {
				triggerFunction()
			}
		} )
	}
	onVictoryCheck = ( data ) => {
		if ( data.playerMessage !== "keep playing" ) {
			if ( this.state.playerName === data.playerName ) {
				this.setState( {
					afterFlip: ""
				}, this.modalContent( "homeButton", data.playerMessage, this.state.client.disconnect.bind( this ) ) )
			} else {
				this.setState( {
					afterFlip: ""
				}, this.modalContent( "homeButton", data.opponentsMessage, this.state.client.disconnect.bind( this ) ) )
			}
		}
	};

	onCardActionRes = ( data ) => {
		//create copy of player and opponent objects from this.state
		const player = {
			...this.state.player
		};
		const opponent = {
			...this.state.opponent
		};
		switch ( data.emitAction ) {
			case "fireActionEmit":
				if ( data.currentPlayer === this.state.playerName ) {
					opponent.field = data.field;
					opponent.discard = this.getCount( data.discard );
					this.setState( { "afterFlip": data.afterFlip, opponent, } )
				} else {
					player.field = data.field;
					player.discard = data.discard;
					this.setState( {
						"afterFlip": data.afterFlip,
						player,
					}, function () {
						this.state.client.switchTurn( this.state.room );
					} )
				}
				break;
			case "lightActionEmit":
				if ( data.currentPlayer === this.state.playerName ) {
					// update player object with recieved information from the
					// server
					player.discard = data.discard;
					player.hand = data.hand;
					this.setState( { "afterFlip": data.afterFlip, player, } )
				} else {
					opponent.discard = this.getCount( data.discard );
					opponent.hand = this.getCount( data.hand );
					this.setState( {
						"afterFlip": data.afterFlip,
						opponent,
					}, function () {
						this.state.client.switchTurn( this.state.room );
					} )
				}
				break;
			default:
				if ( data.currentPlayer === this.state.playerName ) {
					// update player object with recieved information from the
					// server
					player.hand = data.hand;
					player.discard = data.discard
					this.setState( {
						afterFlip: data.afterFlip,
						player,
					}, function () {
						this.state.client.switchTurn( this.state.room )
					} )
				} else {
					// update opponent object with recieved information from the
					// server
					opponent.hand = this.getCount( data.hand );
					opponent.discard = this.getCount( data.discard );
					this.setState( { afterFlip: data.afterFlip, opponent, } )
				}
				break;
		}
	}
	onNewTurn = ( data ) => {
		if ( data.currentPlayer === this.state.playerName ) {
			this.setState( {
				"turn": data.turn,
				"message": data.playerMessage,
			}, function () {
				this.state.client.drawCard( this.state.room );
			} );
		} else {
			this.setState( { "turn": data.turn, "message": data.opponnentsMessage, } );
		}
	};

	// Listens to see what card was flipped and trigger
	// corresponding action.
	getModalContent = () => {
		if ( this.state.afterFlip === "shadowAction" && this.getCount( this.state.player.hand ) > 0 ) {
			return {
				...this.state.player.hand
			}
		} else if ( this.state.afterFlip === "lightAction" && this.getCount( this.state.player.discard ) > 0 ) {
			return {
				...this.state.player.discard
			}
		} else if ( this.state.afterFlip === "fireAction" && this.getCount( this.state.opponent.field ) > 0 ) {
			return {
				...this.state.opponent.field
			}
		} else if ( this.state.afterFlip === "counterAction" && this.getCount( this.state.player.hand ) >= 2 ) {
			return {
				...this.state.player.hand
			}
		} else {
			return this.state.modal.message

		}
	};

	// function listens to set modal back to original state of
	// false after modal is closed
	closeModal = ( result ) => {
		if ( result === "counter" || result === "noCounter" ) {
			this.setState( {
				"modal": {
					"open": false
				}
			}, this.state.client.sendCounterOfferRes( this.state.room, result ) )
		} else {
			this.setState( {
				"modal": {
					"open": false
				}
			} )
		}
	};

	// Renders the entire game board.
	render() {
		const { classes } = this.props;
		return (

		// The entire game board is contained in a MaterialUI Card
		// component that way only a single element is returned as
		// per React.js rules.
		<Card className={classes.page}>

			{/*  The modal component is passed all the props it will need
				*  to function properly.
				*/
			}
			<CustomModal
				hasChoice={this.state.modal.hasChoice}
				decline={this.refuseCounter}
				accept={this.acceptCounter}
				isOpen={this.state.modal.open}
				buttonFlag={this.state.modal.buttonFlag}
				closeModal={this.closeModal}
				afterFlip={this.state.afterFlip}
				onClick={this.clickHandler}
				field={this.getModalContent()}/ >

				{/* This MaterialUI grid contains both play areas */}
				<Grid
					container={true}
					direction="column"
					justify="space-evenly"
					alignItems="center">

					{/* Opponent's play area. */
					}
					<PlayArea
							playerName="opponent"
							playerInfo={this.state.opponent}/>
						<CardCounts cards={this.state.opponent.field}/>
						<CardDisplay className="opponentField"/>

						{/* MaterialUI Grid containing the status message areas. */
					}
					<Grid
							container={true}
							direction="row"
							justify="space-between">
							<p className={classes.statusMessage}>{this.state.message}</p>
							<p
								style={{
									textTransform: "capitalize"
								}}
								className={classes.statusMessage}>Last element played: {this.state.previousPlay}</p>
						</Grid>

						{/* Player's play area. */
					}
					<CardDisplay className="playerField"/>
					<CardCounts cards={this.state.player.field}/>
					<PlayArea
						clickHandler={this.clickHandler}
						playerName="player"
						playerInfo={this.state.player}/>
				</Grid>
			</Card>
			)
		};
	};
	export default withStyles( styles )( Game );