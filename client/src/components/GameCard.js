import React, { Component } from "react";
import { CardMedia, withStyles } from "@material-ui/core";
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
				image="https://s3-us-west-2.amazonaws.com/elements-photos/deck.png"/>
		} else if ( this.props.className === "opponentsDiscard" ) {
			return <CardMedia
				component="img"
				alt={this.props.className}
				className={`${ this.props.className} ${ classes.card }`}
				image="https://s3-us-west-2.amazonaws.com/elements-photos/opponentDiscard.png"/>
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
				image="https://s3-us-west-2.amazonaws.com/elements-photos/staged.png"/>
		} else if ( this.props.className === "opponentsStack" ) {
			return <CardMedia
				component="img"
				alt={this.props.className}
				className={`${ this.props.className} ${ classes.card }`}
				image="https://s3-us-west-2.amazonaws.com/elements-photos/opponentStaged.png"/>
		} else if ( this.props.className === "opponentsDeck" ) {
			return <CardMedia
				component="img"
				alt={this.props.className}
				className={`${ this.props.className} ${ classes.card }`}
				image="https://s3-us-west-2.amazonaws.com/elements-photos/opponentDeck.png"/>
		} else if ( this.props.parent === "field" ) {
			return <CardMedia
				component="img"
				alt={this.props.className}
				className={`${ this.props.className} ${ classes.fieldCard }`}
				image={`https://s3-us-west-2.amazonaws.com/elements-photos/${ this.props.className }.png`}
				onClick={this.props.onClick}/>
		} else {
			return <CardMedia
				component="img"
				alt={this.props.className}
				className={`${ this.props.className} ${ classes.multicardDisplayCard }`}
				image={`https://s3-us-west-2.amazonaws.com/elements-photos/${ this.props.className }.png`}
				onClick={this.props.onClick}/>
		}
	}
}
export default withStyles( styles )( GameCard );
