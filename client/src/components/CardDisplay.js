import React, { Component } from "react";
import GameCard from "./GameCard";
import Grid from "@material-ui/core/Grid";
export default class CardDisplay extends Component {
	render() {
		if ( this.props.className === "opponentsHand" ) {
			return ( <Grid
				container={true}
				direction="row"
				justify="space-around"
				alignItems="center">
				<GameCard className="cardBack"/>
				<GameCard className="cardBack"/>
				<GameCard className="cardBack"/>
				<GameCard className="cardBack"/>
				<GameCard className="cardBack"/>
			</Grid> )
		} else if ( this.props.className === "playerHand" || this.props.className === "fireActionModal" || this.props.className === "lightActionModal" || this.props.className === "shadowActionModal" || this.props.className === "counterActionModal" ) {
			return ( <Grid
				container={true}
				direction="row"
				justify="space-around"
				alignItems="center"
				className={this.props.className}>
				<GameCard className="water" onClick={this.props.onClick}/>
				<GameCard className="earth" onClick={this.props.onClick}/>
				<GameCard className="light" onClick={this.props.onClick}/>
				<GameCard className="shadow" onClick={this.props.onClick}/>
				<GameCard className="fire" onClick={this.props.onClick}/>
			</Grid> )
		} else if ( this.props.className === "playerField" || this.props.className === "opponentsField" ) {
			return ( <Grid
				container={true}
				direction="row"
				justify="space-around"
				alignItems="center">
				<GameCard className="water" parent="field"/>
				<GameCard className="earth" parent="field"/>
				<GameCard className="light" parent="field"/>
				<GameCard className="shadow" parent="field"/>
				<GameCard className="fire" parent="field"/>
			</Grid> )
		} else {
			return ( <Grid
				container={true}
				direction="row"
				justify="space-around"
				alignItems="center">
				<GameCard className="water"/>
				<GameCard className="earth"/>
				<GameCard className="light"/>
				<GameCard className="shadow"/>
				<GameCard className="fire"/>
			</Grid> )
		}
	}
}
