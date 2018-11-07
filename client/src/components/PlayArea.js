import React, { Component } from "react";
import CardDisplay from "./CardDisplay";
import GameCard from "./GameCard";
import { Grid, Card, withStyles, } from "@material-ui/core";
import CardCounts from "./CardCounts";
import { Card as styles } from "./AllStyles";
import CardCount from "./CardCount";

class PlayArea extends Component {

	// Function that determines the total number of cards within
	// a players hand, deck, field, or discard.
	getCount = ( cards ) => {
		let count = 0;
		for ( let cardType in cards ) {
			count += cards[ cardType ];
		}
		return count;
	};

	// Conditionals within the render are determining which
	// player's side of the board to display based on props.
	render() {
		const { classes } = this.props;
		if ( this.props.playerName === "opponent" ) {
			return ( <Grid
				container={true}
				direction="row"
				justify="space-around"
				alignItems="center">
				<GameCard
					isStaged={this.props.playerInfo.stagedCard}
					className="opponentStack"/>
				<CardCount>{this.props.playerInfo.hand}</CardCount>
				<Card className={classes.multicardDisplay}>
					<CardDisplay className="opponentHand"/>
				</Card>
				<CardCount>{this.props.playerInfo.discard}</CardCount>
				<GameCard className="opponentDiscard"/>
				<CardCount>{this.props.playerInfo.deck}</CardCount>
				<GameCard className="opponentDeck"/>
			</Grid> )
		} else {
			return ( <Grid
				container={true}
				direction="row"
				justify="space-around"
				alignItems="center">
				<CardCount>{this.props.playerInfo.deck}</CardCount>
				<GameCard className="playerDeck"/>
				<CardCount>{this.getCount( this.props.playerInfo.discard )}
				</CardCount>
				<GameCard className="playerDiscard"/>
				<Card className={classes.multicardDisplay}>
					<CardDisplay
						className="playerHand"
						onClick={this.props.clickHandler}/>
					<CardCounts cards={this.props.playerInfo.hand}/>
				</Card>
				<GameCard
					isStaged={this.props.playerInfo.stagedCard}
					className="playerStack"/>
			</Grid> )

		}
	};
};
export default withStyles( styles )( PlayArea );
