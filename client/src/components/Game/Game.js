import React, { Component } from "react";
import CardDisplay from "../CardDisplay/CardDisplay"
import "./Game.css"
import Card from "../Card/Card"
import Grid from "@material-ui/core/Grid";

class Game extends Component {
	state = {
		deck: [],
		opponentsDeck: [],
		myHand: [],
		opponentsHand: [],
		myPlayingBoard: [],
		oppentsPlayingBoard: [],
		stagedCard: null,
		opponentStagedCard: null,
	}
	render() {
		return ( <div>
			<Grid container="container" direction="column" justify="space-evenly" alignItems="center">
				<Grid container="container" direction="row" justify="space-evenly" alignItems="center">
					<div className="opponents_stack_area">
						<Card className="opponents_stack"/>
					</div>
					<div className="opponents_hand_area">
						<CardDisplay className="opponents_hand"/>
					</div>
					<div className="opponents_deck_area">
						<Card className="opponents_deck"/>
						<Card className="opponents_discard"/>
					</div>
				</Grid>

				<div className="field">
					<CardDisplay className="opponents_field"/>
					<CardDisplay className="player_field"/>
				</div>
				<Grid container="container" direction="row" justify="space-evenly" alignItems="center">

					<div className="player_deck_area">
						<Card className="player_discard"/>
						<Card className="player_deck"/>
					</div>
					<div className="player_hand_area">
						<CardDisplay className="player_hand"/>
					</div>
					<div className="player_stack_area">
						<Card className="player_stack"/>
					</div>

				</Grid>
			</Grid>
		</div> )

	}
}

export default Game
