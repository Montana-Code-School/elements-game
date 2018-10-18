import React, { Component } from "react";
import { CardMedia, withStyles } from '@material-ui/core'
import { Card as styles } from "../Game/AllStyles"
class GameCard extends Component {


	render() {
		const { classes, count } = this.props;
		const deckOrStack = this.props.className === "player_deck" || this.props.className === "opponents_deck" || this.props.className === "player_stack" || this.props.className === "opponents_stack"
		let card;
		if ( deckOrStack )
			card = (
				<CardMedia
					component="img"
					alt={this.props.className}
					className={`${ this.props.className} ${ classes.card }`}
					image={require( `../../images/card_back.png` )}
				/>
			)
		else if ( this.props.className === "opponents_discard" || this.props.className === "player_discard" )
			card = (
				<CardMedia
					component="img"
					alt={this.props.className}
					className={`${ this.props.className} ${ classes.card }`}
					image={require( `../../images/discard.png` )}
				/>
			)
		else
			card = (
				<CardMedia
					component="img"
					alt={this.props.className}
					className={`${ this.props.className} ${ classes.card }`}
					image={require( `../../images/${ this.props.className }.png` )}
					onClick={this.props.onClick}
				/>

		)
		if (!!count) {
			if(this.props.className==="player_stack"){
				console.log({count})
			}
			// console.log(this.props)
			card = (
				<div>
					{card}
					<p className="counter">{count}</p>
				</div>
			)
		}
		return card;

	}
}
export default withStyles( styles )( GameCard );
