import React, { Component } from "react";
import { CardMedia, withStyles, } from "@material-ui/core";
import { Card as styles } from "./AllStyles";
import DiscardPile from "./DiscardPile";
class GameCard extends Component {
	render() {
		const { classes } = this.props;
		const deckOrStack = this.props.className === "playerDeck" || this.props.className === "opponentsDeck" || this.props.className === "playerStack" || this.props.className === "opponentsStack";
		if ( deckOrStack ) {
			return <CardMedia
				component="img"
				alt={this.props.className}
				className={`${ this.props.className} ${ classes.card }`}
				image={require( `../images/cardBackx.png` )}/>
		} else if ( this.props.className === "opponentsDiscard" ) {
			return <CardMedia
				component="img"
				alt={this.props.className}
				className={`${ this.props.className} ${ classes.card }`}
				image={require( `../images/discard_back.png` )}/>
		} else if ( this.props.className === "playerDiscard" ) {
			return <DiscardPile
				className={this.props.className}
				cards={this.props.cards}
				onClick={this.props.onClick}/>
		} else {
			return <CardMedia
				component="img"
				alt={this.props.className}
				className={`${ this.props.className} ${ classes.multicardDisplayCard }`}
				image={require( `../images/${ this.props.className }x.png` )}
				onClick={this.props.onClick}/>
		}
	}
}
export default withStyles( styles )( GameCard );
