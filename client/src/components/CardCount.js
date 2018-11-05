import React, {Component} from "react";
import { Grid } from "@material-ui/core";

export default class CardCount extends Component {
  render () {
    return(
      <Grid
        container={true}
        direction="row"
        justify="space-around"
        alignItems="center">
        <p>{this.props.cards.water}</p>
        <p>{this.props.cards.earth}</p>
        <p>{this.props.cards.light}</p>
        <p>{this.props.cards.shadow}</p>
        <p>{this.props.cards.fire}</p>
      </Grid>
    )
  }
}
