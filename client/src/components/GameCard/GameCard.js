import React, { Component } from "react";
import "./GameCard.css"
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
		return ( <CardMedia component="img" alt={this.props.className} className={`${ this.props.className} ${ classes.multicard_display }`} onClick={this.clickHandler} image={require( `../../images/${ this.props.className }.png` )}/> )
	}
}
export default withStyles( styles )( GameCard );
