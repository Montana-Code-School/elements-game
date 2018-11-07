import React, { Component } from "react";

//static styling for all card counts
const constStyle = {
	fontWeight: "bold",
	color: "black",
	fontSize: "110%"
};

// variable styling indicating a card was drawn, played, or
// discarded
const countStyle = {
	textShadow: "2px 0 10px yellow, -2px 0 10px yellow",
	color: "white",
	fontWeight: "bold",
	fontSize: "110%"
};

//Component for the counters on the playfield and hand.
export default class CardCount extends Component {
	state = {
		showTransition: false
	};

	// function indicating a card was drawn, played, or
	// discarded.
	componentDidUpdate( props, state ) {
		if ( props.children !== this.props.children ) {
			this.setState( {
				showTransition: true
			}, this.setTransitionTime )
		}
	};

	//Sets timeout to switch between constStyle and countStyle
	setTransitionTime = () => {
		setTimeout( () => {
			this.setState( { showTransition: false } )
		}, 3000 )

	};

	// Uses a ternary operator to determine what style to give
	// to content based on whether the content has changed or
	// not.
	render() {
		return ( <p
			style={this.state.showTransition
				? countStyle
				: constStyle}>
			{this.props.children}
		</p> )
	}
};
