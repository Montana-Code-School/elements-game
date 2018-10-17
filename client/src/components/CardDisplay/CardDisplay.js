import React, { Component } from "react";
import GameCard from "../GameCard/GameCard"
import "./CardDisplay.css"

export default class CardDisplay extends Component {
	clickHandler = ( e ) => {
		this
			.state
			.socket
			.emit( 'click', e.currentTarget.className )
	}
	render() {
		if ( this.props.className === "opponents_hand" ) {
			return ( <div className="card_display_container">
				<GameCard className="card_back"/>
				<GameCard className="card_back"/>
				<GameCard className="card_back"/>
				<GameCard className="card_back"/>
				<GameCard className="card_back"/>
			</div> )
		} else {
			return ( <div className="card_display_container">
				<GameCard className="water"/>
				<GameCard className="earth"/>
				<GameCard className="light"/>
				<GameCard className="shadow"/>
				<GameCard className="fire"/>
			</div> )
		}
	}
}
