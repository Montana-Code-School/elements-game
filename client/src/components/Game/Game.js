import React, {Component} from "react";
import CardDisplay from "../CardDisplay/CardDisplay"
import GameCard from "../GameCard/GameCard"
import {Grid, Card, withStyles} from "@material-ui/core";
import {Card as styles} from "./AllStyles"

function getCount(cards) {
  let count = 0
  for (let cardType in cards) {
    count += cards[cardType]
  }
  return count
}

class Game extends Component {
  state = {
    afterFlip: "",
    opponentsDeck: 25,
    opponentsHand: 0,
    opponentsDiscard: 0,
    opponentsStagedCard: null,
    opponentsField: {
      fire: 0,
      water: 0,
      light: 0,
      shadow: 0,
      earth: 0
    },

    playerDeck: {
      fire: 5,
      water: 5,
      light: 5,
      shadow: 5,
      earth: 5
    },
    playerHand: {
      fire: 0,
      water: 0,
      light: 0,
      shadow: 0,
      earth: 0
    },
    playerField: {
      fire: 0,
      water: 0,
      light: 0,
      shadow: 0,
      earth: 0
    },
    playerDiscard: {
      fire: 0,
      water: 0,
      light: 0,
      shadow: 0,
      earth: 0
    },
    playerStagedCard: 0
  }

  componentDidMount() {
    this.draw_card()
    this.draw_card()
    this.draw_card()
    this.draw_card()
  }
  draw_card = () => {
    let random = Math.floor(Math.random() * Object.keys(this.state.playerDeck).length);
    Object.keys(this.state.playerDeck).forEach((key, index) => {
      if (index === random) {
        if (this.state.playerDeck[key] === 0) {
          this.draw_card();
        } else {
          this.setState({
            [`playerDeck['${key}']`]: this.state.playerDeck[key]--,
            [`playerDeck['${key}']`]: this.state.playerHand[key] ++
          });
        }
      }
    })
  }
  onFlip = (e) => {
        this.setState({
          'playerStack': null,
           [`playerField['${e.currentTarget.alt}']`]: this.state.playerField[`'${e.currentTarget.alt}'`],
        })
				switch (e.currentTarget.alt) {
					case "fire":
						this.state.afterFlip = "destroy opponent's card"
						break;
					case "earth":
						this.draw_card()
						break;
					case "light":
					this.state.afterFlip="select card from discard"
					//open discard pile
						break;
					case "shadow":
					this.state.afterFlip="opponent discards card"
					//propmpt oppont to click the card to discard
						break;
					}
			}
      clickHandler = (e) => {
        switch (this.state.afterFlip) {
          case "destroy opponent's card": this.setState({
					[`opponentsField['${e.currentTarget.alt}']`]: this.state.opponentsField [`'${e.currentTarget.alt}'`]--,
					'opponentsDiscard': this.state.opponentsDiscard++})

            break;
          case "select card from hand":
            break;
          case "select card from discard":
            break;
          case "opponent discards card":
            break;
            // this.props.playerHand[e.currentTarget.className]
        }
      }
      render() {
        const {classes} = this.props;
        // console.log( this.state.playerDeck, this.state.playerHand );
        return (<div>
          <Grid container={true} direction="column" justify="space-evenly" alignItems="center">
            <Grid container={true} direction="row" justify="space-around" alignItems="flex-start">
              <GameCard className="opponents_stack"/>
              <Card className={classes.multicard_display}>
                <CardDisplay className="opponents_hand" count={getCount(this.state.opponentsHand)}/>
              </Card>
              <GameCard className="opponents_discard" count={getCount(this.state.opponentsDiscard)}/>
              <GameCard className="opponents_deck" count={this.state.opponentsDeck}/>
            </Grid>

            <CardDisplay className="opponents_field" count={getCount(this.state.opponentsField)} onClick={this.clickHandler}/>
            <CardDisplay className="player_field" count={getCount(this.state.playerField)} onClick={this.clickHandler}/>

            <Grid container={true} direction="row" justify="space-around" alignItems="flex-end">
              <GameCard className="player_deck" count={getCount(this.state.playerDeck)}/>
              <GameCard className="player_discard" count={getCount(this.state.playerDiscard.length)} onClick={this.clickHandler}/>
              <Card className={classes.multicard_display}>
                <CardDisplay className="player_hand" count={getCount(this.state.playerHand)} onClick={this.clickHandler}/>
              </Card>
              <GameCard className="player_stack" count={this.state.playerStagedCard===0 ?"0":"1"}/>
            </Grid>
          </Grid>
        </div>)
      }
  }
  export default withStyles(styles)(Game);
