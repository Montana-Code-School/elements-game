import React, { Component } from "react";
import CardDisplay from "../CardDisplay/CardDisplay"
import "./Game.css"
import GameCard from "../GameCard/GameCard"
import { Grid, Card, withStyles, } from "@material-ui/core";
import { AllStyles as styles } from "./AllStyles"
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
			<Grid container={true} direction="column" justify="space-around" alignItems="center">
				<Card className={classes.main_div}>
					<Grid container={true} direction="row" justify="space-around" alignItems="flex-start">
						<Card className={classes.card}>
							<GameCard className="card_back"/>
						</Card>
						<Card className={classes.card_display}>
							<CardDisplay className="opponents_hand"/>
						</Card>

						<Card className={classes.card}>
							<GameCard className="card_back"/>
						</Card>
						<Card className={classes.card}>
							<GameCard className="card_back"/>
						</Card>
					</Grid>
				</Card>
				<Card className={classes.main_div}>
					<Grid container={true} direction="row" justify="center" alignItems="center">
						<Card className={classes.card_display}>
							<CardDisplay className="opponents_field"/>
							<CardDisplay className="player_field"/>
						</Card>
					</Grid>
				</Card>
				<Card className={classes.main_div}>
					<Grid container={true} direction="row" justify="space-evenly" alignItems="flex-end">
						<Card className={classes.card}>
							<GameCard className="card_back"/>
						</Card>
						<Card className={classes.card}>
							<GameCard className="card_back"/>
						</Card>

						<Card className={classes.card_display}>
							<Grid container={true} direction="row" justify="space-evenly" alignItems="center">
								<CardDisplay className="player_hand"/>
							</Grid>
						</Card>
						<Card className={classes.card}>
							<GameCard className="card_back"/>
						</Card>
					</Grid>
				</Card>
			</Grid>
		</div> )
	}
}
export default withStyles( styles )( Game );
