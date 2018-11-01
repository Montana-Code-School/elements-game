import React, { Component } from "react";
import CardDisplay from "./CardDisplay";
import GameCard from "./GameCard";
import CustomModal from "./Modal";
import ChatBox from "./ChatBox"
import { Grid, Card, withStyles } from "@material-ui/core";
import { Card as styles } from "./AllStyles";
import socket from './socket';

function getCount( cards ) {
	let count = 0;
	for ( let cardType in cards ) {
		count += cards[ cardType ];
	}
	return count;
}
class Game extends Component {
	constructor() {
		super();
		this.state = {
			client: socket(),
			message: "Waiting for opponent",
			turn: "",
			modal: {
				open: false,
				message: "",
				buttonFlag: ""
			},
			room: null,
			afterFlip: "",
			playerName: null,
			opponentsDeck: 25,
			opponentsDiscard: 0,
			opponentsStagedCard: "",
			opponentsHand: 0,
			playerDeck: 25,
			opponentsField: {
				fire: 0,
				water: 0,
				light: 0,
				shadow: 0,
				earth: 0,
			},
			playerHand: {
				fire: 0,
				water: 0,
				light: 0,
				shadow: 0,
				earth: 0,
			},
			playerField: {
				fire: 0,
				water: 0,
				light: 0,
				shadow: 0,
				earth: 0,
			},
			playerDiscard: {
				fire: 0,
				water: 0,
				light: 0,
				shadow: 0,
				earth: 0,
			},
			playerStagedCard: "",
		};
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
	}
	onDisconnect = ( data ) => {
		this.setState( {
			"modal": {
				"open": true,
				"message": data,
				"buttonFlag": "homeButton",
			}
		}, function () {
			this.state.client.disconnect();
		} );
	}
	onRoomJoin = ( data ) => {
		this.setState( {
			room: data.roomName,
			playerName: data.playerName,
			turn: data.turn
		}, function () {
			if ( this.state.playerName !== this.state.turn ) {
				this.state.client.initialDraw( this.state.room );
			}
		} );
	}
	onInitialDrawRes = ( data ) => {
		if ( this.state.playerName === this.state.turn ) {
			this.setState( {
				playerDeck: getCount( data.player1.deck ),
				playerHand: data.player1.hand,
				opponentsDeck: getCount( data.player2.deck ),
				opponentsHand: getCount( data.player2.hand ),
				message: data.player1.message
			} )
		} else {
			this.setState( {
				playerDeck: getCount( data.player1.deck ),
				playerHand: data.player2.hand,
				opponentsDeck: getCount( data.player1.deck ),
				opponentsHand: getCount( data.player1.hand ),
				message: data.player2.message,
			} )
		}
	}
	clickHandler = ( e ) => {
		if ( this.state.turn !== this.state.playerName && this.state.afterFlip === "" ) {
			this.setState( {
				"modal": {
					"open": true,
					"message": "It is not your turn."
				}
			} )
		} else {
			this.closeModal()
			this.state.client.clickCard( e.currentTarget.className.split( " " )[2], this.state.room, this.state.afterFlip )
		}
	}
	onClickedCard = ( data ) => {
		if ( data.playerName === this.state.playerName ) {
			this.setState( {
				"playerHand": data.hand,
				"playerStagedCard": data.stagedCard
			}, function () {
				this.state.client.counterOffer( this.state.room );
			} );
		} else {
			this.setState( {
				"opponentsHand": getCount( data.hand ),
				"opponentsStagedCard": data.stagedCard
			} )
		}
	}
	onCounterOffer = ( data ) => {
		if ( data.currentPlayer === this.state.playerName ) {
			this.setState( { "message": data.message } )
		} else {
			if ( this.state.playerHand.water >= 1 && ( this.state.playerHand.earth >= 1 || this.state.playerHand.shadow >= 1 || this.state.playerHand.light >= 1 || this.state.playerHand.fire >= 1 ) ) {
				this.setState( {
					"modal": {
						"open": true,
						"message": "Would you like to counter? ",
						"buttonFlag": "choiceButton",
					}
				} )
			} else if ( this.state.playerHand.water === 0 ) {
				this.setState( {
					"modal": {
						"open": true,
						"message": "You are unable to counter at this time.",
						"buttonFlag": "noWaterButton",
					}
				} )
			}
		}
	}
	refuseCounter = () => {
		this.closeOfferModal( "noCounter" );
	}
	acceptCounter = () => {
		this.closeOfferModal( "counter" );

	}
	onCounterOfferRes = ( result ) => {
		if ( result.result === "noCounter" ) {
			if ( result.player === this.state.playerName ) {
				this.state.client.flipCard( this.state.room );
			}
		} else if ( result.result === "counter" ) {
			if ( result.player === this.state.playerName ) {
				this.setState( {
					"afterFlip": result.afterFlip,
					"modal": {
						"open": true,
						"message": "This is the counter modal",
						"buttonFlag": "closeButton",
					},
				} )
			}
		} else {
			this.setState( { "afterFlip": result.afterFlip } )
		}
	}
	onCounterActionRes = ( result ) => {
		if ( result.player === this.state.playerName ) {
			this.setState( {
				"playerHand": result.counteringPlayerHand,
				"playerDiscard": result.counteringPlayerDiscard,
				"opponentsStagedCard": result.playerStagedCard,
				"opponentsDiscard": getCount( result.playerDiscard ),
				"afterFlip": result.afterFlip,
			}, function () {
				this.state.client.switchTurn( this.state.room );
			} )
		} else {
			this.setState( {
				"opponentsHand": getCount( result.counteringPlayerHand ),
				"opponentsDiscard": getCount( result.counteringPlayerDiscard ),
				"playerStagedCard": result.playerStagedCard,
				"playerDiscard": result.playerDiscard,
				"afterFlip": result.afterFlip
			} )
		}
	}
	onFlippedCardRes = ( data ) => {
		if ( this.state.playerName === data.playerName ) {
			this.setState( {
				"opponentsField": data.field,
				"opponentsStagedCard": data.stagedCard,
				"opponentsHand": getCount( data.hand ),
				"opponentsDeck": getCount( data.deck ),
				"afterFlip": data.afterFlip,
				"message": data.message
			}, function () {
				this.state.client.victoryCheck( this.state.room );
				if ( this.state.afterFlip === "shadowAction" ) {
					this.setState( {
						"modal": {
							"open": true,
							"buttonFlag": "noButton",
						}
					} )
				} else if ( this.state.afterFlip !== "shadowAction" && this.state.afterFlip !== "lightAction" && this.state.afterFlip !== "fireAction" ) {
					this.state.client.switchTurn( this.state.room );
				}
			} );
		} else {
			this.setState( {
				"playerDeck": getCount( data.deck ),
				"playerHand": data.hand,
				"playerField": data.field,
				"playerStagedCard": data.stagedCard,
				"afterFlip": data.afterFlip,
				"message": data.message
			}, function () {
				if ( this.state.afterFlip === "lightAction" ) {
					this.setState( {
						"modal": {
							"open": true,
							"buttonFlag": "noButton",
						}
					} )
				} else if ( this.state.afterFlip === "fireAction" ) {
					this.setState( {
						"modal": {
							"open": true,
							"buttonFlag": "noButton",
						}
					} )
				}
			} );
		}
	}
	onDrawCardRes = ( data ) => {
		if ( data.playerName === this.state.playerName ) {
			this.setState( {
				"playerHand": data.hand,
				"playerDeck": getCount( data.deck ),
				"message": data.playerMessage
			} )
		} else {
			this.setState( {
				"opponentsHand": getCount( data.hand ),
				"opponentsDeck": getCount( data.deck ),
				"message": data.opponentsMessage
			} )
		}
	}
	onVictoryCheck = ( data ) => {
		if ( data.playerMessage !== "keep playing" ) {
			if ( this.state.playerName === data.playerName ) {
				this.setState( {
					"modal": {
						"open": true,
						"message": data.playerMessage,
						"buttonFlag": "homeButton",
					}
				}, function () {
					this.state.client.disconnect();
				} );
			} else {
				this.setState( {
					"modal": {
						"open": true,
						"message": data.opponentsMessage,
						"buttonFlag": "homeButton",
					}
				}, function () {
					this.state.client.disconnect();
				} );
			}
		}
	}
	onCardActionRes = ( data ) => {
		switch ( data.emitAction ) {
			case "fireActionEmit":
				if ( data.currentPlayer === this.state.playerName ) {
					this.setState( {
						"afterFlip": data.afterFlip,
						"opponentsField": data.field,
						"opponentsDiscard": getCount( data.discard )
					} )
				} else {
					this.setState( {
						"afterFlip": data.afterFlip,
						"playerField": data.field,
						"playerDiscard": data.discard,
					}, function () {
						this.state.client.switchTurn( this.state.room );
					} )
				}
				break;
			case "lightActionEmit":
				if ( data.currentPlayer === this.state.playerName ) {
					this.setState( { "afterFlip": data.afterFlip, "playerDiscard": data.discard, "playerHand": data.hand, } )
				} else {
					this.setState( {
						"afterFlip": data.afterFlip,
						"opponentsDiscard": getCount( data.discard ),
						"opponentsHand": getCount( data.hand ),
					}, function () {
						this.state.client.switchTurn( this.state.room );
					} )
				}
				break;
			default:
				if ( data.currentPlayer === this.state.playerName ) {
					this.setState( {
						afterFlip: data.afterFlip,
						"playerHand": data.hand,
						"playerDiscard": data.discard,
					}, function () {
						this.state.client.switchTurn( this.state.room )
					} )
				} else {
					this.setState( {
						afterFlip: data.afterFlip,
						"opponentsHand": getCount( data.hand ),
						"opponentsDiscard": getCount( data.discard ),
					} )
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
	}
	getModalContent = () => {
		if ( this.state.afterFlip === "shadowAction" ) {
			const cards = this.state.playerHand
			return [
				<p>Please select an element in your hand to discard.</p>,
				<CardDisplay onClick={this.clickHandler}/>,
				<Grid
					container={true}
					direction="row"
					justify="space-around"
					alignItems="center">
					<p>{this.state.playerHand[ "water" ]}</p>
					<p>{this.state.playerHand[ "earth" ]}</p>
					<p>{this.state.playerHand[ "light" ]}</p>
					<p>{this.state.playerHand[ "shadow" ]}</p>
					<p>{this.state.playerHand[ "fire" ]}</p>
				</Grid>,
			]
		} else if ( this.state.afterFlip === "lightAction" ) {
			const cards = this.state.playerDiscard
			return [
				<p>Please select an element in your discard to put in your
					hand.</p>,
				<CardDisplay onClick={this.clickHandler}/>,
				<Grid
					container={true}
					direction="row"
					justify="space-around"
					alignItems="center">
					<p>{cards[ "water" ]}</p>
					<p>{cards[ "earth" ]}</p>
					<p>{cards[ "light" ]}</p>
					<p>{cards[ "shadow" ]}</p>
					<p>{cards[ "fire" ]}</p>
				</Grid>,
			]
		} else if ( this.state.afterFlip === "fireAction" ) {
			const cards = this.state.opponentsField
			return [
				<p>Please select one of your opponent's elements on the
					field to discard.</p>,
				<CardDisplay onClick={this.clickHandler}/>,
				<Grid
					container={true}
					direction="row"
					justify="space-around"
					alignItems="center">
					<p>{cards[ "water" ]}</p>
					<p>{cards[ "earth" ]}</p>
					<p>{cards[ "light" ]}</p>
					<p>{cards[ "shadow" ]}</p>
					<p>{cards[ "fire" ]}</p>
				</Grid>,
			]
		} else if ( this.state.afterFlip === "counterAction" ) {
			const cards = this.state.playerHand
			return [
				<p>Please select another element to discard along with water.</p>,
				<CardDisplay onClick={this.clickHandler}/>,
				<Grid
					container={true}
					direction="row"
					justify="space-around"
					alignItems="center">
					<p>{cards[ "water" ]}</p>
					<p>{cards[ "earth" ]}</p>
					<p>{cards[ "light" ]}</p>
					<p>{cards[ "shadow" ]}</p>
					<p>{cards[ "fire" ]}</p>
				</Grid>,
			]
		} else {
			return <p>{this.state.modal.message}</p>
		}
	}
	closeModal = () => {
		this.setState( {
			"modal": {
				"open": false
			}
		} )
	}
	closeOfferModal = ( result ) => {
		this.setState( {
			"modal": {
				"open": false
			}
		}, function () {
			this.state.client.sendCounterOfferRes( this.state.room, result );
		} )
	}
	render() {
		const { classes } = this.props;
		return ( <Card className={classes.page}>
			<CustomModal
				hasChoice={this.state.modal.hasChoice}
				decline={this.refuseCounter}
				accept={this.acceptCounter}
				isOpen={this.state.modal.open}
				buttonFlag={this.state.modal.buttonFlag}
				closeModal={this.closeModal}>
				{this.getModalContent()}
			</CustomModal>
			<Grid
				container={true}
				direction="column"
				justify="space-evenly"
				alignItems="center">
				<Grid
					container={true}
					direction="row"
					justify="space-around"
					alignItems="center">
					<p>{
							this.state.opponentsStagedCard === ""
								? "0"
								: "1"
						}</p>
					<GameCard className="opponentsStack"/>
					<p>{this.state.opponentsHand}</p>
					<Card className={classes.multicardDisplay}>
						<CardDisplay className="opponentsHand"/>
					</Card>
					<p>{this.state.opponentsDiscard}</p>
					<GameCard className="opponentsDiscard"/>
					<p>{this.state.opponentsDeck}</p>
					<GameCard className="opponentsDeck"/>
				</Grid>

				<Grid
					container={true}
					direction="row"
					justify="space-around"
					alignItems="center">
					<ChatBox/>
					<Card className={classes.field}>
						<Grid
							container={true}
							direction="row"
							justify="space-around"
							alignItems="center">
							<p>{this.state.opponentsField[ "water" ]}</p>
							<p>{this.state.opponentsField[ "earth" ]}</p>
							<p>{this.state.opponentsField[ "light" ]}</p>
							<p>{this.state.opponentsField[ "shadow" ]}</p>
							<p>{this.state.opponentsField[ "fire" ]}</p>
						</Grid>
						<CardDisplay
							className="opponentsField"
							onClick={this.clickHandler}/>
						<p>{this.state.message}</p>
						<CardDisplay
							className="playerField"
							onClick={this.clickHandler}/>
						<Grid
							container={true}
							direction="row"
							justify="space-around"
							alignItems="center">
							<p>{this.state.playerField[ "water" ]}</p>
							<p>{this.state.playerField[ "earth" ]}</p>
							<p>{this.state.playerField[ "light" ]}</p>
							<p>{this.state.playerField[ "shadow" ]}</p>
							<p>{this.state.playerField[ "fire" ]}</p>
						</Grid>
					</Card>
				</Grid>

				<Grid
					container={true}
					direction="row"
					justify="space-around"
					alignItems="center">
					<p>{this.state.playerDeck}</p>
					<GameCard className="playerDeck"/>
					<p>{getCount( this.state.playerDiscard )}</p>
					<GameCard
						className="playerDiscard"
						onClick={this.clickHandler}
						cards={this.state.playerDiscard}/>
					<Card className={classes.multicardDisplay}>
						<CardDisplay
							className="playerHand"
							onClick={this.clickHandler}/>
						<Grid
							container={true}
							direction="row"
							justify="space-around"
							alignItems="center">
							<p>{this.state.playerHand[ "water" ]}</p>
							<p>{this.state.playerHand[ "earth" ]}</p>
							<p>{this.state.playerHand[ "light" ]}</p>
							<p>{this.state.playerHand[ "shadow" ]}</p>
							<p>{this.state.playerHand[ "fire" ]}</p>
						</Grid>
					</Card>
					<p>{
							this.state.playerStagedCard === ""
								? "0"
								: "1"
						}</p>
					<GameCard className="playerStack"/>
				</Grid>
			</Grid>
		</Card> )
	}
}
export default withStyles( styles )( Game );
