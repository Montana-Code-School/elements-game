import React, { Component } from "react";
import CardDisplay from "./CardDisplay";
import GameCard from "./GameCard";
import { Grid, Card, withStyles, } from "@material-ui/core";
import CardCounts from "./CardCounts"
import {Card as styles} from "./AllStyles";


class PlayArea extends Component {
  getCount = ( cards ) => {
    let count = 0;
    for ( let cardType in cards ) {
      count += cards[ cardType ];
    }
    return count;
  };
  render () {
    const {classes} = this.props;
    if (this.props.playerName === "opponent") {
      return(
        <Grid
          container={true}
          direction="row"
          justify="space-around"
        alignItems="center">
        <p>{
            this.props.playerInfo.stagedCard === ""
              ? "0"
              : "1"
        }</p>
        <GameCard className="opponentStack"/>
        <p>{this.props.playerInfo.hand}</p>
        <Card className={classes.multicardDisplay}>
        <CardDisplay className="opponentHand"/>
        </Card>
        <p>{this.props.playerInfo.discard}</p>
        <GameCard className="opponentDiscard"/>
          <p>{this.props.playerInfo.deck}</p>
          <GameCard className="opponentDeck"/>
        </Grid>
      )
    } else {
      return(
        <Grid
          container={true}
          direction="row"
          justify="space-around"
        alignItems="center">
          <p>{this.props.playerInfo.deck}</p>
          <GameCard className="playerDeck"/>
          <p>{this.getCount(this.props.playerInfo.discard)}
          </p>
          <GameCard className="playerDiscard" />
          <Card className={classes.multicardDisplay}>
          <CardDisplay className="playerHand" onClick={this.props.clickHandler}/>
            <CardCounts cards={this.props.playerInfo.hand}/>
          </Card>
          <p>{
              this.props.playerInfo.stagedCard === ""
                ? "0"
                : "1"
          }</p>
          <GameCard className="playerStack"/>
        </Grid>
      )

    }
  }
}
export default withStyles(styles)(PlayArea);
