import React, { Component } from "react";
import { CardMedia, withStyles } from "@material-ui/core";
import CustomModal from "./Modal";
import { Card as styles } from "./AllStyles";
import CardDisplay from "./CardDisplay";
import { Grid } from "@material-ui/core";


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
				image={require( `../images/discard_back.png` )}/>
			<CustomModal isOpen={this.state.showModal} closeModal={this.close}>
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
			</CustomModal>
		</div> );
	}

}

export default withStyles( styles )( DiscardPile )
