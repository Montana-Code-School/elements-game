import React, { Component } from "react";
import CardDisplay from "./CardDisplay";
import GameCard from "./GameCard";
import { Grid, Card, withStyles } from "@material-ui/core";
import { Card as styles } from "./AllStyles";
import socket from './socket';
let afterFlip = "";
function getCount( cards ) {
	let count = 0;
	for ( let cardType in cards ) {
		count += cards[ cardType ];
	}
	return count;
}
class Game extends Component {
	state = {
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
		opponentsField: {
			fire: 0,
			water: 0,
			light: 0,
			shadow: 0,
			earth: 0
		},
		playerDeck: {
			fire: 5,
			water: 5,
			light: 5,
			shadow: 5,
			earth: 5
		},
		playerHand: {
			fire: 0,
			water: 0,
			light: 0,
			shadow: 0,
			earth: 0
		},
		playerField: {
			fire: 0,
			water: 0,
			light: 0,
			shadow: 0,
			earth: 0
		},
		playerDiscard: {
			fire: 0,
			water: 0,
			light: 0,
			shadow: 0,
			earth: 0
		},
		playerStagedCard: ""
	};
	componentDidMount() {
		this.join();
		this.state.client.getRoomJoin( this.onRoomJoin );
		this.state.client.getInitialDrawRes( this.onInitialDrawRes )
	}
	onRoomJoin = ( data ) => {
		this.setState( {
			room: data.roomName,
			playerName: data.playerName,
			turn: data.turn,
		}, function () {
			if ( this.state.playerName !== this.state.turn ) {
				this.state.client.initialDraw( this.state.room );
			}
		} );
	}
	join = () => {
		this.state.client.join();
	}
	onInitialDrawRes = ( data ) => {
		if ( this.state.playerName === this.state.turn ) {
			this.setState( {
				playerDeck: data.player1.deck,
				playerHand: data.player1.hand,
				opponentsDeck: getCount( data.player2.deck ),
				opponentsHand: getCount( data.player2.hand )
			} )
		} else {
			this.setState( {
				playerDeck: data.player2.deck,
				playerHand: data.player2.hand,
				opponentsDeck: getCount( data.player1.deck ),
				opponentsHand: getCount( data.player1.hand )
			} )
		}
	}
	clickHandler = ( e ) => {
		if ( this.state.turn !== this.state.playerName && this.state.afterFlip === "" ) {
			window.alert( "hey its not your turn" )
		} else {
			this.state.client.playCard( e.currentTarget.className.split( " " )[2], this.state.room );
		}
		this.state.client.getPlayedCard( this.onPlayedCard );
	}
	onPlayedCard = ( data ) => {
		if ( data.currentPlayer === this.state.playerName ) {
			this.setState( {
				"playerHand": data.hand,
				"playerStagedCard": data.stagedCard,
			}, function () {
				this.state.client.counterOffer( this.state.room );
			} );
		} else {
			this.setState( {
				"opponentsHand": getCount( data.hand ),
				"opponentsStagedCard": data.stagedCard,
			}, function () {
				this.state.client.getCounterOffer( this.onCounterOffer );
			} )
		}
	}
	onCounterOffer = () => {
		this.setState( {
			"flipCard": "counterAction"
		}, function () {
			if ( window.alert( "Would you like to counter?" ) ) {
				console.log( "player countered !" );
			} else {
				// this.state.client.flipCard( this.state.room );
			}
		} );
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
						<CardDisplay className="opponentsField" onClick={this.clickHandler}/>
						<p>{this.state.message}</p>
						<CardDisplay className="playerField" onClick={this.clickHandler}/>
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
					<p>{getCount( this.state.playerDeck )}</p>
					<GameCard className="playerDeck"/>
					<p>{getCount( this.state.playerDiscard )}</p>
					<GameCard className="playerDiscard" cards={this.state.playerDiscard}/>
					<Card className={classes.multicardDisplay}>
						<CardDisplay className="playerHand" onClick={this.clickHandler}/>
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
