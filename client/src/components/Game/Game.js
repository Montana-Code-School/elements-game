import React, { Component } from "react";
import CardDisplay from "../CardDisplay/CardDisplay"
import GameCard from "../GameCard/GameCard"
import { Grid, Card, withStyles, } from "@material-ui/core";
import { Card as styles } from "./AllStyles"
class Game extends Component {
	state = {
		opponentsDeck: 25,
		opponentsHand: 0,
		opponentsDiscard: 0,
		opponentsStagedCard: null,
		opponentsBoard: {
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
		playerBoard: {
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
		playerStagedCard: null,
	}

	componentDidMount() {
		this.draw_card()
		this.draw_card()
		this.draw_card()
		this.draw_card()
	}
	draw_card = () => {
		let random = Math.floor( Math.random() * Object.keys( this.state.playerDeck ).length );
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
								.playerDeck[ key ] - 1,
							[ `playerDeck['${ key }']` ]: this
								.state
								.playerHand[ key ] + 1
						} );
					}
				}
			} )
	}
	render() {
		const { classes } = this.props;
		console.log( this.state.playerDeck, this.state.playerHand );
		return ( <div>
			<Grid container={true} direction="column" justify="space-evenly" alignItems="center">
				<Grid container={true} direction="row" justify="space-around" alignItems="flex-start">
					<GameCard className="opponents_stack"/>
					<Card className={classes.multicard_display}>
						<CardDisplay className="opponents_hand" count={this.state}/>
					</Card>
					<GameCard className="opponents_discard" count={this.state.opponentsDiscard.length}/>
					<GameCard className="opponents_deck" count={this.state.opponentsDeck.length}/>
				</Grid>

				<CardDisplay className="opponents_field"/>
				<CardDisplay className="player_field"/>

				<Grid container={true} direction="row" justify="space-around" alignItems="flex-end">
					<GameCard className="player_deck" count={this.state.playerDeck.length}/>
					<GameCard className="player_discard" count={this.state.playerDiscard.length}/>
					<Card className={classes.multicard_display}>
						<CardDisplay className="player_hand"/>
					</Card>
					<GameCard className="player_stack"/>
				</Grid>
			</Grid>
		</div> )
	}
}
export default withStyles( styles )( Game );
