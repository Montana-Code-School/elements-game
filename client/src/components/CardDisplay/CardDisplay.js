import React, { Component } from "react";
import GameCard from "../GameCard/GameCard"
import Grid from "@material-ui/core/Grid"

export default class CardDisplay extends Component {
	clickHandler = ( e ) => {
		this
			.state
			.socket
			.emit( 'click', e.currentTarget.className )
	}
	render() {
		if ( this.props.className === "opponents_hand" ) {
			return ( <Grid container={true} direction="row" justify="space-around" alignItems="center">
				<GameCard className="card_back"/>
				<GameCard className="card_back"/>
				<GameCard className="card_back"/>
				<GameCard className="card_back"/>
				<GameCard className="card_back"/>
			</Grid> )
		} else {
			return ( <Grid container={true} direction="row" justify="space-around" alignItems="center">

				<GameCard className="water"/>
				<GameCard className="earth"/>
				<GameCard className="light"/>
				<GameCard className="shadow"/>
				<GameCard className="fire"/>
			</Grid> )
		}
	}
}
