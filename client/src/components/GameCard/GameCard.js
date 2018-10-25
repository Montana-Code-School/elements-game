import React, { Component } from "react";
import { CardMedia, withStyles } from "@material-ui/core"
import { Card as styles } from "../Game/AllStyles"
import DiscardPile from "../DiscardPile/DiscardPile"
class GameCard extends Component {

	render() {
		const { classes } = this.props;
		const deckOrStack = this.props.className === "playerDeck" || this.props.className === "opponentsDeck" || this.props.className === "playerStack" || this.props.className === "opponentsStack";
		if ( deckOrStack ) {
			return <CardMedia component="img" alt={this.props.className} className={`${ this.props.className} ${ classes.card }`} image={require( `../../images/cardBack.png` )}/>
		} else if ( this.props.className === "opponentsDiscard" ) {
			return <CardMedia component="img" alt={this.props.className} className={`${ this.props.className} ${ classes.card }`} image={require( `../../images/discard.png` )}/>
		} else if (this.props.className === "playerDiscard" ) {
			return <DiscardPile className={this.props.className} />
		} else {
			return <CardMedia component="img" alt={this.props.className} className={`${ this.props.className} ${ classes.card }`} image={require( `../../images/${ this.props.className }.png` )} onClick={this.props.onClick}/>
		}
	}
}
export default withStyles( styles )( GameCard );
