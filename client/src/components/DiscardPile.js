import React, { Component } from "react";
import { Modal, CardMedia, withStyles } from "@material-ui/core";
import { Card as styles } from "./AllStyles";
import CardDisplay from "./CardDisplay";
import { Grid } from "@material-ui/core";


let rand = () => ( Math.floor( Math.random() * 20 ) - 10 );
const modalStyle = {
	position: "fixed",
	zIndex: 1040,
	top: 0,
	bottom: 0,
	left: 0,
	right: 0
};

const backdropStyle = {
	...modalStyle,
	zIndex: "auto",
	backgroundColor: "#000",
	opacity: 0.5
};

const dialogStyle = function () {
	// we use some psuedo random coords so nested modals don"t sit right on top of
	// each other.
	let top = 50 + rand();
	let left = 50 + rand();

	return {
		position: "absolute",
		width: 400,
		top: top + "%",
		left: left + "%",
		transform: `translate(-${ top}%, -${ left }%)`,
		border: "1px solid #e5e5e5",
		backgroundColor: "white",
		boxShadow: "0 5px 15px rgba(0,0,0,.5)",
		padding: 20
	};
};
class DiscardPile extends Component {
	state = {
		showModal: false
	};
	close = () => {
		this.setState( { showModal: false } );
	};

	open = () => {
		this.setState( { showModal: true } )
	};
	render() {
		const { classes, cards } = this.props;
		return ( <div className={classes.card}>
			<CardMedia
				onClick={this.open}
				component="img"
				alt={this.props.className}
				className={this.props.className}
				image={require( `../images/discard.png` )}/>
			<Modal
				style={modalStyle}
				backdropstyle={backdropStyle}
				open={this.state.showModal}
				onClose={this.close}>
				<div style={dialogStyle()}>
					<CardDisplay/>
					<Grid
						container={true}
						direction="row"
						justify="space-around"
						alignItems="center">
						<p>{cards[ "water" ]}</p>
						<p>{cards[ "earth" ]}</p>
						<p>{cards[ "light" ]}</p>
						<p>{cards[ "shadow" ]}</p>
						<p>{cards[ "fire" ]}</p>
					</Grid>
				</div>
			</Modal>
		</div> );
	}

}

export default withStyles( styles )( DiscardPile )
