import React, {Component} from "react";
import {CardMedia, withStyles} from "@material-ui/core";
import CustomModal from "./Modal";
import {Card as styles} from "./AllStyles";
import CardDisplay from "./CardDisplay";
import {Grid} from "@material-ui/core";
import CardCount from "./CardCount"

class DiscardPile extends Component {

	// This is code to show a discard modal. It has been disabled for now.
  // state = {
  //   showModal: false
  // };
  // close = () => {
  //   this.setState({showModal: false});
  // };
  // open = () => {
  //   this.setState({showModal: true})
  // };

	// <CustomModal isOpen={this.state.showModal} closeModal={this.close}>
	// 	<CardDisplay onClick={this.props.onClick}/>
	// 	<Grid container={true} direction="row" justify="space-around" alignItems="center">
	// 		<p>{cards["water"]}</p>
	// 		<p>{cards["earth"]}</p>
	// 		<p>{cards["light"]}</p>
	// 		<p>{cards["shadow"]}</p>
	// 		<p>{cards["fire"]}</p>
	// 	</Grid>
	// </CustomModal>

  render() {
    const {classes, cards} = this.props;
    return (<div className={classes.card}>
      <CardMedia onClick={this.open} component="img" alt={this.props.className} className={this.props.className} image="https://s3-us-west-2.amazonaws.com/elements-photos/discard.png"/>
    </div>);
  }
}

export default withStyles(styles)(DiscardPile)
