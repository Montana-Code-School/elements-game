import React, { Component } from "react";
import CardDisplay from "../CardDisplay/CardDisplay"
import GameCard from "../GameCard/GameCard"
import { Grid, Card, withStyles } from "@material-ui/core";
import { AllStyles as styles } from "../Game/AllStyles"
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
		const { classes } = this.props;
		return ( <div>
			<Grid container={true} direction="column" justify="space-around" alignItems="center">
				<Card className={classes.main_div}>
					<Grid container={true} direction="row" justify="space-around" alignItems="flex-start">
						<Card className={classes.card}>
							<GameCard className="card_back"/>
						</Card>
						<Card className={classes.card_display}>
							<CardDisplay className="card_back"/>
						</Card>

						<Card>
							<GameCard className="card_back"/>
							<GameCard className="card_back"/>
						</Card>
					</Grid>
				</Card>
			</Grid>
		</div> )
	}
}
export default withStyles( styles )( Game );
