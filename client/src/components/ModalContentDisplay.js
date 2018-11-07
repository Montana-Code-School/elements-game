import React, { Component } from "react";
//import custom components
import CardDisplay from "./CardDisplay";
import CardCounts from "./CardCounts";

// This component sets up the way content is formatted
// within every modal in the game. It can change based on
// what props are passed to it.
export default class ModalContentStyle extends Component {
	render() {
		return ( <div>
			<p>{this.props.message}</p>
			<CardDisplay
				onClick={this.props.onClick}
				className={this.props.className}/>
			<CardCounts cards={this.props.field}/>
		</div> )
	}
};
