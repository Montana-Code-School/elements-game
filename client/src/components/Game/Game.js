import React, { Component } from "react";
import CardDisplay from "../CardDisplay/CardDisplay"
import GameCard from "../GameCard/GameCard"
import { Grid, Card, withStyles } from "@material-ui/core";
import { Card as styles } from "./AllStyles"
import openSocket from 'socket.io-client'
const socket = openSocket( 'http://localhost:5000' )
function getCount( cards ) {
	let count = 0
	for ( let cardType in cards ) {
		count += cards[ cardType ]
	}
	return count
}

class Game extends Component {
	state = {
		afterFlip: "",
		opponentsDeck: 25,
		opponentsHand: 0,
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
	}

	drawCard = ( n = 1 ) => {
		let random;
		for ( let i = 0; i < n; i++ ) {
			random = Math.floor( Math.random() * Object.keys( this.state.playerDeck ).length );
			Object
				.keys( this.state.playerDeck )
				.forEach( ( key, index ) => {
					if ( index === random ) {
						if ( this.state.playerDeck[ key ] === 0 ) {
							this.draw_card();
						} else {
							this.setState( {
								[ `playerDeck['${ key }']` ]: this
									.state
									.playerDeck[ key ]--,
								[ `playerDeck['${ key }']` ]: this
									.state
									.playerHand[ key ]++,
							} );
						}
					}
				} )
		}

	}

	componentDidMount() {
		socket.emit( "join" );
		this.drawCard(4)
	}
	// onFlip = ( e ) => {
	// 	this.setState( {
	// 		'playerStack': null,
	// 		[ `playerField['${ e.currentTarget.alt }']` ]: this
	// 			.state
	// 			.playerField[`'${ e.currentTarget.alt }'`],
	// 	} )
	// 	switch ( e.currentTarget.alt ) {
	// 		case "fire":
	// 			this.state.afterFlip = "destroy opponent's card"
	// 			break;
	// 		case "earth":
	// 			this.draw_card()
	// 			break;
	// 		case "light":
	// 			this.state.afterFlip = "select card from discard"
	// 			//open discard pile
	// 			break;
	// 		case "shadow":
	// 			this.state.afterFlip = "opponent discards card"
	// 			//propmpt opponent to click the card to discard
	// 			break;
	// 	}
	// }
	playCard = (e) => {
	const cardType = e.currentTarget.className.split(" ")[2]
	const currentState = this.state
	if (currentState.playerHand[cardType] === 0)
		return
	currentState.playerHand[cardType]--
	if (this.state.playerStagedCard.counter === 1)
		return
	currentState.playerStagedCard.counter++
	currentState.playerStagedCard.card = cardType
	this.setState(currentState)
	// this.setState({
	// 	[`playerHand['${cardType}']`]: this.state.playerHand[cardType]--
	// })
	if (window.confirm("Would you like to counter?")) {
    window.alert("This doesn't work yet, fuck off!")
} else {
    this.flipCard()
}
}

flipCard = () => {
	const currentState = this.state
	const stagedCardType = this.state.playerStagedCard.card
	currentState.playerStagedCard.counter = 0
	currentState.playerField[stagedCardType]++
	this.setState(currentState)
	switch (stagedCardType) {
		case "earth":
			this.drawCard(1)
			break;
		case "fire":
		break;
		case "shadow":
				this.shadowFlip()
		break;
		case "light":
				this.lightFlip()
		break;
		case "water":
		break;
	}
}
	shadowFlip = () => {
		const currentState = this.state
		const hand = this.state.playerHand
		const handString = `Available cards - Water: ${hand.water}, Earth: ${hand.earth}, Light ${hand.light}, Shadow: ${hand.shadow}, Fire: ${hand.fire}`;
		const pick = prompt(`Please type the name of the card you'd like to discard from your hand. ${handString.toLowerCase()}`)
		currentState.playerHand[pick]--
		currentState.playerDiscard[pick]++
		this.setState(currentState)
	}


	lightFlip = () => {
		const currentState = this.state
		const discard = this.state.playerDiscard
		const discardString = `Available cards - Water: ${discard.water}, Earth: ${discard.earth}, Light ${discard.light}, Shadow: ${discard.shadow}, Fire: ${discard.fire}`;
		const choice = prompt(`Please type the name of the card you'd like to return to your hand. ${discardString.toLowerCase()}`)
		currentState.playerDiscard[choice]--
		currentState.playerHand[choice]++
		this.setState(currentState)
	}

	clickHandler = ( e ) => {
		this.playCard(e)
	}
	render() {
		const { classes } = this.props;
		return ( <Card className={classes.page} alignItems="center">
			<Grid container={true} direction="column" justify="space-evenly" alignItems="center">
				<Grid container={true} direction="row" justify="space-around" alignItems="center">
					<p>{
							this.state.opponentsStagedCard === 0
								? "0"
								: "1"
						}</p>
					<GameCard className="opponents_stack"/>
					<Card className={classes.multicard_display}>
						<CardDisplay className="opponents_hand"/>
						<p>{getCount( this.state.opponentsHand )}</p>
					</Card>
					<p>{this.state.opponentsDiscard}</p>
					<GameCard className="opponents_discard"/>
					<p>{this.state.opponentsDeck}</p>
					<GameCard className="opponents_deck"/>
				</Grid>
				<Grid container={true} direction="row" justify="space-around" alignItems="center">
					<p>
						{
							this
								.state
								.opponentsField[ 'water' ]
						}
					</p>
					<p>
						{
							this
								.state
								.opponentsField[ 'earth' ]
						}
					</p>
					<p>
						{
							this
								.state
								.opponentsField[ 'light' ]
						}
					</p>
					<p>
						{
							this
								.state
								.opponentsField[ 'shadow' ]
						}
					</p>
					<p>
						{
							this
								.state
								.opponentsField[ 'fire' ]
						}
					</p>
				</Grid>
				<CardDisplay className="opponents_field" onClick={this.clickHandler}/>
				<CardDisplay className="player_field" onClick={this.clickHandler}/>
				<Grid container={true} direction="row" justify="space-around" alignItems="center">
					<p>
						{
							this
								.state
								.playerField[ 'water' ]
						}
					</p>
					<p>
						{
							this
								.state
								.playerField[ 'earth' ]
						}
					</p>
					<p>
						{
							this
								.state
								.playerField[ 'light' ]
						}
					</p>
					<p>
						{
							this
								.state
								.playerField[ 'shadow' ]
						}
					</p>
					<p>
						{
							this
								.state
								.playerField[ 'fire' ]
						}
					</p>
				</Grid>
				<Grid container={true} direction="row" justify="space-around" alignItems="center">
					<p>{getCount( this.state.playerDeck )}</p>
					<GameCard className="player_deck"/>
					<p>{getCount( this.state.playerDiscard )}</p>
					<GameCard className="player_discard" onClick={this.clickHandler}/>
					<Card className={classes.multicard_display}>
						<CardDisplay className="player_hand" onClick={this.clickHandler}/>
						<Grid container={true} direction="row" justify="space-around" alignItems="center">
							<p>
								{
									this
										.state
										.playerHand[ 'water' ]
								}
							</p>
							<p>
								{
									this
										.state
										.playerHand[ 'earth' ]
								}
							</p>
							<p>
								{
									this
										.state
										.playerHand[ 'light' ]
								}
							</p>
							<p>
								{
									this
										.state
										.playerHand[ 'shadow' ]
								}
							</p>
							<p>
								{
									this
										.state
										.playerHand[ 'fire' ]
								}
							</p>
						</Grid>
					</Card>
					<p>{
							this.state.playerStagedCard.counter === 0
								? "0"
								: "1"
						}</p>
					<GameCard className="player_stack"/>

				</Grid>
			</Grid>
		</Card> )
	}
}
export default withStyles( styles )( Game );
