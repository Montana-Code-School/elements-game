import React, { Component } from "react";
import { CardMedia, withStyles, } from "@material-ui/core";
import { Card as styles } from "./AllStyles";

// Component determines which card image will be displayed
// depending on its position on the field.
class GameCard extends Component {
	render() {
		const { classes } = this.props;
		if ( this.props.className === "playerDeck" ) {
			return <CardMedia
				component="img"
				alt={this.props.className}
				className={`${ this.props.className} ${ classes.card }`}
				image="https://s3-us-west-2.amazonaws.com/elements-photos/deck.png"/>
		} else if ( this.props.className === "opponentDiscard" ) {
			return <CardMedia
				component="img"
				alt={this.props.className}
				className={`${ this.props.className} ${ classes.card }`}
				image="https://s3-us-west-2.amazonaws.com/elements-photos/opponentDiscard.png"/>
		} else if ( this.props.className === "playerDiscard" ) {
			return <CardMedia
				component="img"
				alt={this.props.className}
				className={`${ this.props.className} ${ classes.card }`}
				image="https://s3-us-west-2.amazonaws.com/elements-photos/discard.png"/>
		} else if ( this.props.className === "playerStack" ) {
			return <CardMedia
				component="img"
				className={`${ this.props.className} ${ classes.card }`}
				image={(
					this.props.isStaged !== "" )
					? "https://s3-us-west-2.amazonaws.com/elements-photos/staged." +
								"png"
					: null}/>
		} else if ( this.props.className === "opponentStack" ) {
			return <CardMedia
				component="img"
				className={`${ this.props.className} ${ classes.card }`}
				image={(
					this.props.isStaged !== "" )
					? "https://s3-us-west-2.amazonaws.com/elements-photos/opponen" +
								"tStaged.png"
					: null}/>
		} else if ( this.props.className === "opponentDeck" ) {
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
