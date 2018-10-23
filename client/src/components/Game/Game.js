import React, { Component } from "react";
import CardDisplay from "../CardDisplay/CardDisplay"
import GameCard from "../GameCard/GameCard"
import { Grid, Card, withStyles, } from "@material-ui/core";
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
let afterFlip = ""
const room = "";
class Game extends Component {
	state = {
		opponentsDeck: 25,
		opponentsDiscard: 0,
		//check to see if we need to use and object instead
		opponentsStagedCard: 0,
		opponentsField: {
			fire: 0,
			water: 0,
			light: 0,
			shadow: 0,
			earth: 0,
		},

		playerDeck: {
			fire: 5,
			water: 5,
			light: 5,
			shadow: 5,
			earth: 5,
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
		playerStagedCard: {
			counter: 0,
			card: undefined,
		},
	}
	// drawCard = ( n = 1 ) => {
	// 	let random;
	// 	for ( let i = 0; i < n; i++ ) {
	// 		random = Math.floor( Math.random() * Object.keys( this.state.playerDeck ).length );
	// 		Object
	// 			.keys( this.state.playerDeck )
	// 			.forEach( ( key, index ) => {
	// 				if ( index === random ) {
	// 					if ( this.state.playerDeck[ key ] === 0 ) {
	// 						this.draw_card();
	// 					} else {
	// 						let playerDeck = this.state.playerDeck
	// 						let playerHand = this.state.playerHand
	// 						this.setState({
	// 							[ `playerDeck['${ key }']` ]: playerDeck[key]--,
	// 							[ `playerHand['${ key }']` ]: playerHand[key]++,
	// 						});
	//
	// 					}
	// 				}
	// 			} )
	// 	}
	//
	// }

	componentDidMount() {
		//check how to pass info about which room you are in
		socket.emit( "join" );
		socket.emit( "initialDraw", room )
	}

	flipCard = () => {
		const {
			playerHand,
			playerStagedCard,
			playerField,
			opponentsField,
			opponentsDiscard,
			opponentStagedCard,
		} = {
			...this.state
		}
		playerStagedCard.counter = 0
		playerField[ playerStagedCard.card ]++
		switch ( playerStagedCard.card ) {
			case "earth":
				this.drawCard( 1 )
				break;
			case "fire":
				afterFlip = "fireAction"
				break;
			case "shadow":
				afterFlip = "shadowAction"
				break;
			case "light":
				afterFlip = "lightAction"
				break;
		}
		this.setState( {
			playerHand,
			playerStagedCard,
			playerField,
			opponentsField,
			opponentsDiscard,
			opponentStagedCard,
		} )
	}

	clickHandler = ( e ) => {
		const {
			playerHand,
			playerStagedCard,
			playerField,
			opponentsField,
			opponentsDiscard,
			opponentStagedCard,
			playerDiscard,
		} = {
			...this.state
		}
		const cardType = e
			.currentTarget
			.className
			.split( " " )[ 2 ]
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
				playerHand[ cardType ]--
				playerHand.water--
				playerDiscard[ cardType ]++
				playerDiscard.water++
				opponentStagedCard--;
				opponentsDiscard++;
				afterFlip = ""
				break;
			case "lightAction":
				//call for discard pile component
				pick = prompt( `Available cards - Earth: ${ playerDiscard.earth}, Fire: ${ playerDiscard.fire}, Water: ${ playerDiscard.water}, Shadow: ${ playerDiscard.shadow}, Light: ${ playerDiscard.light }` )
				playerDiscard[ pick ]--
				playerHand[ pick ]++
				afterFlip = ""
				break;
			case "shadowAction":
				//pass turn to opponnent
				playerHand[ pick ]--
				playerDiscard[ pick ]++
				afterFlip = ""
				break;
			default:
				if ( playerHand[ cardType ] === 0 || this.state.playerStagedCard.counter === 1 ) 
					return
				else {
					playerHand[ cardType ]--
					playerStagedCard.counter++
					playerStagedCard.card = cardType
					if ( window.confirm( "Would you like to counter?" ) ) {
						//check for water card and additional card in playerhand
						afterFlip = "counterAction"
						window.alert( "Pick a second card to discard in addition to your water" )
					} else {
						this.flipCard()
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
			opponentStagedCard,
			playerDiscard,
		} )
	}
	render() {
		const { classes } = this.props;
		return ( <Card className={classes.page}>
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
