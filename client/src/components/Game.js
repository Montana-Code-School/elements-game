import React, { Component } from "react";
import CardDisplay from "./CardDisplay";
import GameCard from "./GameCard";
import { Grid, Card, withStyles } from "@material-ui/core";
import { Card as styles } from "./AllStyles";
import openSocket from "socket.io-client";
const socket = openSocket( "http://localhost:5000" );
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
		opponentsDeck: 25,
		opponentsDiscard: 0,
		opponentsStagedCard: 0,
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
		playerStagedCard: {
			counter: 0,
			card: undefined
		}
	};
	componentDidMount() {
		socket.emit( "join" );
		socket.emit( "initialDraw" );
	}
	playCard = ( e ) => {
		const cardType = e.currentTarget.className.split( " " )[ 2 ];
		const currentState = this.state;
		if ( currentState.playerHand[ cardType ] === 0 ) 
			return;
		currentState.playerHand[ cardType ]--;
		if ( this.state.playerStagedCard.counter === 1 ) 
			return;
		currentState.playerStagedCard.counter++;
		currentState.playerStagedCard.card = cardType;
		this.setState( currentState );
		if ( window.confirm( "Would you like to counter?" ) ) {
			window.alert( "This doesn't work yet, fuck off!" );
		} else {
			this.flipCard();
		}
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
				this.drawCard( 1 );
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
	clickHandler = ( e ) => {
		let {
			playerHand,
			playerStagedCard,
			playerField,
			opponentsField,
			opponentsDiscard,
			opponentsStagedCard,
			playerDiscard
		} = {
			...this.state
		};
		const cardType = e.currentTarget.className.split( " " )[ 2 ];
		let pick;
		switch ( afterFlip ) {
			case "fireAction":
				opponentsField[ cardType ]--;
				playerDiscard[ cardType ]++;
				afterFlip = "";
				break;
			case "earthAction":
				this.drawCard( 1 );
				afterFlip = "";
				break;
			case "counterAction":
				playerHand[ cardType ]--;
				playerHand.water--;
				playerDiscard[ cardType ]++;
				playerDiscard.water++;
				opponentsStagedCard--;
				opponentsDiscard++;
				afterFlip = "";
				break;
			case "lightAction":
				// call for  discard pile component
				pick = prompt( `Available cards - Earth: ${ playerDiscard.earth}, Fire: ${ playerDiscard.fire}, Water: ${ playerDiscard.water}, Shadow: ${ playerDiscard.shadow}, Light: ${ playerDiscard.light }` );
				playerDiscard[ pick ]--;
				playerHand[ pick ]++;
				afterFlip = "";
				break;
			case "shadowAction":
				// pass turn to opponnent
				playerHand[ pick ]--;
				playerDiscard[ pick ]++;
				afterFlip = "";
				break;
			default:
				if ( playerHand[ cardType ] === 0 || this.state.playerStagedCard.counter === 1 ) 
					return
				else {
					playerHand[ cardType ]--;
					playerStagedCard.counter++;
					playerStagedCard.card = cardType;
					if ( window.confirm( "Would you like to counter?" ) ) {
						// check for  water card and additional card in playerhand
						afterFlip = "counterAction";
						window.alert( "Pick a second card to discard in addition to your water" );
					} else {
						this.flipCard();
					}
				}
				break;
		}
		this.setState( {
			playerHand,
			playerStagedCard,
			playerField,
			opponentsField,
			opponentsDiscard,
			opponentsStagedCard,
			playerDiscard
		} )
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
							this.state.opponentsStagedCard === 0
								? "0"
								: "1"
						}</p>
					<GameCard className="opponentsStack"/>
					<Card className={classes.multicardDisplay}>
						<CardDisplay className="opponentsHand"/>
						<p>{getCount( this.state.opponentsHand )}</p>
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
					<p>{this.state.opponentsField[ "water" ]}</p>
					<p>{this.state.opponentsField[ "earth" ]}</p>
					<p>{this.state.opponentsField[ "light" ]}</p>
					<p>{this.state.opponentsField[ "shadow" ]}</p>
					<p>{this.state.opponentsField[ "fire" ]}</p>
				</Grid>
				<CardDisplay className="opponentsField" onClick={this.clickHandler}/>
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
				<Grid
					container={true}
					direction="row"
					justify="space-around"
					alignItems="center">
					<p>{getCount( this.state.playerDeck )}</p>
					<GameCard className="playerDeck"/>
					<p>{getCount( this.state.playerDiscard )}</p>
					<GameCard className="playerDiscard"/>
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
							this.state.playerStagedCard.counter === 0
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
