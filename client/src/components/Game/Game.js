import React, {Component} from "react";
import CardDisplay from "../CardDisplay/CardDisplay"
import "./Game.css"
import Card from "../Card/Card"



class Game extends Component{
  state = {
    deck: [],
    opponentsDeck: [],
    myHand: [],
    opponentsHand: [],
    myPlayingBoard: [],
    oppentsPlayingBoard: [],
    stagedCard: null,
    opponentStagedCard: null
  }
  // onPlayCard() {
  // }
  render() {
    return (
      <div>
        <div className="opponent">
          <Card className="opponents_stack"/>
          <CardDisplay className="opponents_hand"/>
          <Card className="opponents_deck"/>
          <Card className="opponents_discard"/>
        </div>
        <div className="field">
          <CardDisplay className="opponents_field"/>
          <CardDisplay className="player_field"/>
        </div>
        <div className="player">
          <Card className="player_discard"/>
          <Card className="player_deck"/>
          <CardDisplay className="player_hand"/>
          <Card className="player_stack"/>
        </div>
      </div>
    )

  }
}

export default Game
