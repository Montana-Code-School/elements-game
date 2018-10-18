import React, { Component } from "react";
import { CardMedia, withStyles } from '@material-ui/core'
import { Card as styles } from "../Game/AllStyles"
class GameCard extends Component {
	clickHandler = ( e ) => {
		console.log( this.props.className, " clicked" )
		// this
		//   .state
		// 	.socket
		// 	.emit( 'click', e.currentTarget.className )
	}
	render() {
		const { classes } = this.props;
		if ( this.props.className === "player_deck" || this.props.className === "opponents_deck" || this.props.className === "player_stack" || this.props.className === "opponents_stack" ) 
			return ( <CardMedia component="img" alt={this.props.className} className={`${ this.props.className} ${ classes.card }`} onClick={this.clickHandler} image={require( `../../images/card_back.png` )}/> )
		else if ( this.props.className === "opponents_discard" || this.props.className === "player_discard" ) 
			return ( <CardMedia component="img" alt={this.props.className} className={`${ this.props.className} ${ classes.card }`} onClick={this.clickHandler} image={require( `../../images/discard.png` )}/> )
		else 
			return ( <CardMedia component="img" alt={this.props.className} className={`${ this.props.className} ${ classes.card }`} onClick={this.clickHandler} image={require( `../../images/${ this.props.className }.png` )}/> )

	}
}
export default withStyles( styles )( GameCard );
