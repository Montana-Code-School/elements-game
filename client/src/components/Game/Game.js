import React, { Component } from "react";
import CardDisplay from "../CardDisplay/CardDisplay"
import GameCard from "../GameCard/GameCard"
import { Grid, Card, withStyles, } from "@material-ui/core";
import { Card as styles } from "./AllStyles"
class Game extends Component {
	state = {
		deck: [],
		opponentsDeck: [],
		myHand: [],
		opponentsHand: [],
		myPlayingBoard: [],
		oppentsPlayingBoard: [],
		stagedCard: null,
		opponentStagedCard: null
	}
	render() {
		const { classes } = this.props;
		console.log( "class", classes );
		return ( <div>
			<Grid container={true} direction="column" justify="space-evenly" alignItems="center">
				<Grid container={true} direction="row" justify="space-around" alignItems="flex-start">
					<GameCard className="opponents_stack"/>
					<Card className={classes.multicard_display}>
						<CardDisplay className="opponents_hand"/>
					</Card>
					<GameCard className="opponents_discard"/>
					<GameCard className="opponents_deck"/>
				</Grid>

				<CardDisplay className="opponents_field"/>
				<CardDisplay className="player_field"/>

				<Grid container={true} direction="row" justify="space-around" alignItems="flex-end">
					<GameCard className="player_deck"/>
					<GameCard className="player_discard"/>
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
