import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import CardCount from "./CardCount";

// Component appends CardCount for playerHand, field, and
// opponentField.
export default class CardCounts extends Component {
	render() {
		return (
			// Grid is used for styling to align the counts correctly
			// beneath the appropriate card. CardCount is called to
			// contain and style each number correctly.
			<Grid
				container={true}
				direction="row"
				justify="space-around"
				alignItems="center">
				<CardCount>{this.props.cards.water}</CardCount>
				<CardCount>{this.props.cards.earth}</CardCount>
				<CardCount>{this.props.cards.light}</CardCount>
				<CardCount>{this.props.cards.shadow}</CardCount>
				<CardCount>{this.props.cards.fire}</CardCount>
			</Grid>
		)
	};
};
