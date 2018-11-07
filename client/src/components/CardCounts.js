import React, {Component} from "react";
import {Grid} from "@material-ui/core";
import CardCount from "./CardCount"
//Component displays counters for all multi-card displays.
export default class CardCounts extends Component {
  render() {
    return (
      <Grid
        container={true}
        direction="row"
        justify="space-around"
        alignItems="center">
        <CardCount>{this.props.cards.water}</CardCount>
        <CardCount>{this.props.cards.earth}</CardCount>
        <CardCount>{this.props.cards.light}</CardCount>
        <CardCount>{this.props.cards.shadow}</CardCount>
        <CardCount>{this.props.cards.fire}</CardCount>
      </Grid>
    )
  }
}
