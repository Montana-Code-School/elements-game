import React, { Component } from "react";
import CardDisplay from "./CardDisplay";
import GameCard from "./GameCard";
import { Grid, Card, withStyles, } from "@material-ui/core";
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
		this.state.client.getDisconnect( this.onDisconnect );
	}
	onDisconnect = ( data ) => {
		window.alert( data );
		this.state.client.disconnect();
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
		this.state.client.getClickedCard( this.onClickedCard );
	}
	clickHandler = ( e ) => {
		if ( this.state.turn !== this.state.playerName && this.state.afterFlip === "" ) {
			window.alert( "hey its not your turn" )
		} else {
			this.state.client.clickCard( e.currentTarget.className.split( " " )[2], this.state.room, this.state.afterFlip );
		}
	}
	onClickedCard = ( data ) => {
		if ( data.playerName === this.state.playerName ) {
			this.setState( {
				"playerHand": data.hand,
				"playerStagedCard": data.stagedCard
			}, function () {
				this.state.client.counterOffer( this.state.room, this.onCounterOffer );
			} );
		} else {
			this.setState( {
				"opponentsHand": getCount( data.hand ),
				"opponentsStagedCard": data.stagedCard
			} )
		}
		this.state.client.getCounterOffer( this.onCounterOffer );
	}

	onCounterOffer = ( data ) => {
		let result = "noCounter";
		if ( data.currentPlayer === this.state.playerName ) {
			this.setState( { "message": data.message } )
		} else {
			if ( this.state.playerHand.water >= 1 && ( this.state.playerHand.earth >= 1 || this.state.playerHand.shadow >= 1 || this.state.playerHand.light >= 1 || this.state.playerHand.fire >= 1 ) ) {
				if ( window.confirm( "Would you like to counter?" ) ) {
					result = "blabla"
					this.state.client.sendCounterOfferRes( this.state.room, result );
				} else {
					result = "noCounter";
					this.state.client.sendCounterOfferRes( this.state.room, result );
				}
			} else if ( this.state.playerHand.water === 0 ) {
				window.alert( "Unfortunately you are not able to counter" );
				result = "noCounter";
				this.state.client.sendCounterOfferRes( this.state.room, result );
			}
		}
		console.log( "onCounterOffer", result );
		if ( result === "noCounter" ) {
			this.state.client.getFlippedCardRes( this.onFlippedCardRes );
		} else {
			this.state.client.getCounterOfferRes( this.onCounterOfferRes );
		}
	}
	listenerOff( emit ) {
		this.state.client.listenerOff( emit );
	}
	onCounterOfferRes = () => {
		console.log( "onCounterOfferRes" );
		// this.state.client.getFlippedCardRes(
		// this.onFlippedCardRes );
	}
	onFlippedCardRes = ( data ) => {
		if ( this.state.playerName === data.playerName ) {
			this.setState( {
				"opponentsField": data.field,
				"opponentsStagedCard": data.stagedCard,
				"turn": data.turn
			}, function () {
				this.state.client.drawCard( this.state.room, this.state.playerName )
			} );
		} else {
			this.setState( { "playerField": data.field, "playerStagedCard": data.stagedCard, "turn": data.turn } );
		}
		this.state.client.drawCardRes( this.onDrawCardRes );
	}
	onDrawCardRes = ( data ) => {
		if ( data.playerName === this.state.playerName ) {
			this.setState( {
				"playerHand": data.hand,
				"playerDeck": getCount( data.deck ),
				"message": data.playerMessage,
			} )
		} else {
			this.setState( {
				"opponentsHand": getCount( data.hand ),
				"opponentsDeck": getCount( data.deck ),
				"message": data.opponentsMessage,
			} )
		}
	}
	render() {
		const { classes } = this.props;
		return ( <Card className={classes.page}>
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
					{/* <Card className={classes.chat}>
						<p>njkbkjbjkb</p>
						</Card> */
					}

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
