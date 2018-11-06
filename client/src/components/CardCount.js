import React, { Component } from "react";

const countStyle = {
	textShadow: "2px 0 10px yellow, -2px 0 10px yellow",
	color: "white"
}

export default class CardCount extends Component {
	state = {
		showTransition: false
	}

	componentDidUpdate( props, state ) {
		if ( props.children !== this.props.children ) {
			this.setState( {
				showTransition: true
			}, this.setTransitionTime )
		}
	}

	setTransitionTime = () => {
		setTimeout( () => {
			this.setState( { showTransition: false } )
		}, 3000 )

	}

	render() {
		return ( <p style={this.state.showTransition
				? countStyle
				: null}>
			{this.props.children}
		</p> )
	}
}
