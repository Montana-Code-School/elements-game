import React, {Component} from "react";


class Game extends Component{
  state = {
    deck: [],
    opponentsDeck: [],
    myHand: [],
    oppoentsHand: [],
    myPlayingBoard: [],
    oppentsPlayingBoard: [],
    stagedCard: null,
    opponentStagedCard: null
  }
  onPlayCard() {
    socket.do
  }
  render() {
    return (
      <Card type="" count={this.state.deck.length} />
      <Hand playCard={this.onPlayCard}/>
      <Board />
    )

  }
}

export default Game
