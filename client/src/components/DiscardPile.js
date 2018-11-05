import React, {Component} from "react";
import {CardMedia, withStyles} from "@material-ui/core";
import CustomModal from "./Modal";
import {Card as styles} from "./AllStyles";
import CardDisplay from "./CardDisplay";
import {Grid} from "@material-ui/core";
import CardCount from "./CardCount"

class DiscardPile extends Component {
  state = {
    showModal: false
  };
  close = () => {
    this.setState({showModal: false});
  };

  open = () => {
    this.setState({showModal: true})
  };
  render() {
    const {classes} = this.props;
    return (<div className={classes.card}>
      <CardMedia onClick={this.open} component="img" alt={this.props.className} className={this.props.className} image={require(`../images/discard.png`)}/>
      <CustomModal isOpen={this.state.showModal} closeModal={this.close}>
        <CardDisplay onClick={this.props.onClick}/>
        <CardCount cards={this.props.cards}/>
      </CustomModal>
    </div>);
  }

}

export default withStyles(styles)(DiscardPile)
