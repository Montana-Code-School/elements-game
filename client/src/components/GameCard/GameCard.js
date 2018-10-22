import React, { Component } from "react";
import { CardMedia, withStyles, Card, CardContent, } from '@material-ui/core'
import { Card as styles } from "../Game/AllStyles"
class GameCard extends Component {

	render() {
		const { classes, count } = this.props;
		const deckOrStack = this.props.className === "player_deck" || this.props.className === "opponents_deck" || this.props.className === "player_stack" || this.props.className === "opponents_stack";
		if ( deckOrStack ) {
			return <CardMedia component="img" alt={this.props.className} className={`${ this.props.className} ${ classes.card }`} image={require( `../../images/card_back.png` )}/>
		} else if ( this.props.className === "opponents_discard" || this.props.className === "player_discard" ) {
			return <CardMedia component="img" alt={this.props.className} className={`${ this.props.className} ${ classes.card }`} image={require( `../../images/discard.png` )}/>
		} else {
			return <CardMedia component="img" alt={this.props.className} className={`${ this.props.className} ${ classes.card }`} image={require( `../../images/${ this.props.className }.png` )} onClick={this.props.onClick}/>
		}
	}
}
export default withStyles( styles )( GameCard );
