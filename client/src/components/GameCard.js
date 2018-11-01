import React, { Component } from "react";
import { CardMedia, withStyles, } from "@material-ui/core";
import { Card as styles } from "./AllStyles";
import DiscardPile from "./DiscardPile";
class GameCard extends Component {
	render() {
		const { classes } = this.props;
		if ( this.props.className === "playerDeck" ) {
			return <CardMedia
				component="img"
				alt={this.props.className}
				className={`${ this.props.className} ${ classes.card }`}
				image={require( `../images/deck.png` )}/>
		} else if ( this.props.className === "opponentsDiscard" ) {
			return <CardMedia
				component="img"
				alt={this.props.className}
				className={`${ this.props.className} ${ classes.card }`}
				image={require( `../images/opponentDiscard.png` )}/>
		} else if ( this.props.className === "playerDiscard" ) {
			return <DiscardPile
				className={this.props.className}
				cards={this.props.cards}
				onClick={this.props.onClick}/>
		} else if ( this.props.className === "playerStack" ) {
			return <CardMedia
				component="img"
				alt={this.props.className}
				className={`${ this.props.className} ${ classes.card }`}
				image={require( `../images/staged.png` )}/>
		} else if ( this.props.className === "opponentsStack" ) {
			return <CardMedia
				component="img"
				alt={this.props.className}
				className={`${ this.props.className} ${ classes.card }`}
				image={require( `../images/opponentStaged.png` )}/>
		} else if ( this.props.className === "opponentsDeck" ) {
			return <CardMedia
				component="img"
				alt={this.props.className}
				className={`${ this.props.className} ${ classes.card }`}
				image={require( `../images/opponentDeck.png` )}/>
		} else {
			return <CardMedia
				component="img"
				alt={this.props.className}
				className={`${ this.props.className} ${ classes.multicardDisplayCard }`}
				image={require( `../images/${ this.props.className }.png` )}
				onClick={this.props.onClick}/>
		}
	}
}
export default withStyles( styles )( GameCard );
