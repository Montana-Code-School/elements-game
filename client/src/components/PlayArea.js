import React, { Component } from "react";
import CardDisplay from "./CardDisplay";
import GameCard from "./GameCard";
import CustomModal from "./Modal";
import { Grid, Card, withStyles, } from "@material-ui/core";
import CardCount from "./CardCount"

class PlayArea extends Component {
  getCount = ( cards ) => {
    let count = 0;
    for ( let cardType in cards ) {
      count += cards[ cardType ];
    }
    return count;
  };
  render () {
    return(
      <Grid
        container={true}
        direction="row"
        justify="space-around"
      alignItems="center">
        <p>{this.props.playerInfo.deck}</p>
        <GameCard className=`${this.props.playerName}Deck`/>
        <p>{this.getCount(this.props.playerInfo.discard)}</p>
        <GameCard
          className=`${this.props.playerName}Discard`
          onClick={this.clickHandler}
          cards={this.props.playerInfo.discard}/>
        <Card className={classes.multicardDisplay}>
          <CardDisplay
            className="playerHand"
            onClick={this.clickHandler}/>
          <CardCount cards={this.props.playerInfo.hand}/>
        </Card>
        <p>{
            this.state.playerInfo.stagedCard === ""
              ? "0"
              : "1"
        }</p>
        <GameCard className="playerStack"/>
      </Grid>
    )
  }
}
