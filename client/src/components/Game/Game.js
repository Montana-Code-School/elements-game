import React, { Component } from "react";
import CardDisplay from "../CardDisplay/CardDisplay";
import GameCard from "../GameCard/GameCard";
import { Grid, Card, withStyles } from "@material-ui/core";
import { Card as styles } from "./AllStyles";
import openSocket from 'socket.io-client';
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

	componentDidMount() {
		socket.emit( "join" );
		socket.emit("initialDraw")
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
		// const oppCard = {fire: 1, water: 1, light: 1, shadow: 1, earth: 1}
		// console.log(this.state.opponentsField)
}
}

flipCard = () => {
	const {
		playerHand, playerField, playerDiscard, opponentsField, playerStagedCard,
	}= this.state
	let pick;
	playerStagedCard.counter = 0
	playerField[playerStagedCard.card]++
	switch (playerStagedCard.card) {
		case "earth":
			this.drawCard(1)
			break;
		case "fire":
			const destroyString = `Available cards - Water: ${opponentsField.water}, Earth: ${opponentsField.earth}, Light ${opponentsField.light}, Shadow: ${opponentsField.shadow}, Fire: ${opponentsField.fire}`;
			pick = prompt(`Please type the name of the card you'd like to destroy. ${destroyString.toLowerCase()}`)
			opponentsField[pick]--
			playerDiscard[pick]++
		break;
		case "shadow":
			const handString = `Available cards - Water: ${playerHand.water}, Earth: ${playerHand.earth}, Light ${playerHand.light}, Shadow: ${playerHand.shadow}, Fire: ${playerHand.fire}`;
			pick = prompt(`Please type the name of the card you'd like to discard from your hand. ${handString.toLowerCase()}`)
			playerHand[pick]--
			playerDiscard[pick]++
		break;
		case "light":
			const discardString = `Available cards - Water: ${playerDiscard.water}, Earth: ${playerDiscard.earth}, Light ${playerDiscard.light}, Shadow: ${playerDiscard.shadow}, Fire: ${playerDiscard.fire}`;
			pick = prompt(`Please type the name of the card you'd like to return to your hand. ${discardString.toLowerCase()}`)
			playerDiscard[pick]--
			playerHand[pick]++
		break;
		default :
		break;
	}
	this.setState({playerHand, playerField, playerDiscard, opponentsField, playerStagedCard
	})
}

	clickHandler = ( e ) => {
		this.playCard(e)
	}
	render() {
		const { classes } = this.props;
		return (
			 <Card className={classes.page}>
			<Grid container={true} direction="column" justify="space-evenly" alignItems="center">
				<Grid container={true} direction="row" justify="space-around" alignItems="center">
					<p>
						{
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
					<GameCard className="player_discard" />
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
