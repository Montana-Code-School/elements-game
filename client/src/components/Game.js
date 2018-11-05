import React, {Component} from "react";
import CardDisplay from "./CardDisplay";
import CustomModal from "./Modal";
import {Grid, Card, withStyles} from "@material-ui/core";
import {Card as styles} from "./AllStyles";
import socket from "./socket";
import CardCount from "./CardCount"
import PlayArea from "./PlayArea"

class Game extends Component {
  constructor() {
    super();
    this.state = {
      client: socket(),
      message: "Waiting for opponent to join the game.",
      turn: "",
      modal: {
        open: false,
        message: "",
        buttonFlag: ""
      },
      room: null,
      afterFlip: "",
      playerName: null,
      opponent: {
        deck: 25,
        discard: 0,
        stagedCard: "",
        hand: 0,
        field: {
          fire: 0,
          water: 0,
          light: 0,
          shadow: 0,
          earth: 0
        }
      },
      player: {
        deck: 25,
        hand: {
          fire: 0,
          water: 0,
          light: 0,
          shadow: 0,
          earth: 0
        },
        field: {
          fire: 0,
          water: 0,
          light: 0,
          shadow: 0,
          earth: 0
        },
        discard: {
          fire: 0,
          water: 0,
          light: 0,
          shadow: 0,
          earth: 0
        },
        stagedCard: ""
      }
    };
    this.state.client.join();
    this.state.client.getRoomJoin(this.onRoomJoin);
    this.state.client.getInitialDrawRes(this.onInitialDrawRes);
    this.state.client.getClickedCard(this.onClickedCard);
    this.state.client.getCounterOffer(this.onCounterOffer);
    this.state.client.getCounterOfferRes(this.onCounterOfferRes);
    this.state.client.getCounterActionRes(this.onCounterActionRes);
    this.state.client.getFlippedCardRes(this.onFlippedCardRes);
    this.state.client.getDrawCardRes(this.onDrawCardRes);
    this.state.client.getVictoryCheck(this.onVictoryCheck);
    this.state.client.getCardActionRes(this.onCardActionRes);
    this.state.client.getNewTurn(this.onNewTurn);
    this.state.client.getDisconnect(this.onDisconnect);
  }
  getCount = (cards) => {
    let count = 0;
    for (let cardType in cards) {
      count += cards[cardType];
    }
    return count;
  };
  onDisconnect = (data) => {
    this.setState({
      "modal": {
        "open": true,
        "message": data,
        "buttonFlag": "homeButton"
      }
    }, function() {
      this.state.client.disconnect();
    });
  }
  onRoomJoin = (data) => {
    this.setState({
      room: data.roomName,
      playerName: data.playerName,
      turn: data.turn
    }, function() {
      if (this.state.playerName !== this.state.turn) {
        this.state.client.initialDraw(this.state.room);
      }
    });
  }
  onInitialDrawRes = (data) => {
    const player = {
      ...this.state.player
    };
    const opponent = {
      ...this.state.opponent
    };
    if (this.state.playerName === this.state.turn) {
      player.hand = data.player1.hand;
      player.deck = this.getCount(data.player1.deck);
      opponent.hand = this.getCount(data.player2.hand);
      opponent.deck = this.getCount(data.player2.deck);
      this.setState({player, opponent, message: data.player1.message});
    } else {
      player.hand = data.player2.hand;
      player.deck = this.getCount(data.player2.deck);
      opponent.hand = this.getCount(data.player1.hand);
      opponent.deck = this.getCount(data.player1.deck);
      this.setState({player, opponent, message: data.player2.message});
    }
  }
  clickHandler = (e) => {
    if (this.state.turn !== this.state.playerName && this.state.afterFlip === "") {
      this.modalContent("closeButton", "It is not your turn.")
    } else if (this.state.turn === this.state.playerName && this.state.player.stagedCard !== "" && this.state.afterFlip === "") {
      this.setState({"message": "Element is already played, wait for opponent"})
    } else {
      let onClickedCardName = e.currentTarget.className.split(" ")[2];
      let parent = e.target.parentElement.className.split(" ")[3];
      if (((parent === "playerHand" || parent === "shadowActionModal") && this.state.player.hand[onClickedCardName] > 0) || (parent === "fireActionModal" && this.state.opponent.field[onClickedCardName] > 0) || (parent === "lightActionModal" && this.state.player.discard[onClickedCardName] > 0)) {
        this.closeModal();
        this.state.client.clickCard(e.currentTarget.className.split(" ")[2], this.state.room, this.state.afterFlip);
      } else if (parent === "counterActionModal") {
        if (onClickedCardName === "water" && this.state.player.hand[onClickedCardName] >= 2) {
          this.closeModal();
          this.state.client.clickCard(e.currentTarget.className.split(" ")[2], this.state.room, this.state.afterFlip);
        } else if (onClickedCardName !== "water" && this.state.player.hand[onClickedCardName] > 0) {
          this.closeModal();
          this.state.client.clickCard(e.currentTarget.className.split(" ")[2], this.state.room, this.state.afterFlip);
        }
      } else {
        this.modalContent("closeButton", "You are unable to play this element.")
      }
    }
  }
  onClickedCard = (data) => {
    const player = {
      ...this.state.player
    };
    const opponent = {
      ...this.state.opponent
    };
    if (data.playerName === this.state.playerName) {
      player.hand = data.hand;
      player.stagedCard = data.stagedCard
      this.setState({
        player
      }, function() {
        this.state.client.counterOffer(this.state.room);
      });
    } else {
      opponent.hand = this.getCount(data.hand);
      opponent.stagedCard = data.stagedCard;
      this.setState({opponent})
    }
  }
  onCounterOffer = (data) => {
    if (data.currentPlayer === this.state.playerName) {
      this.setState({message: data.message})
    } else {
      if (this.state.player.hand.water >= 1 && (this.state.player.hand.earth >= 1 || this.state.player.hand.shadow >= 1 || this.state.player.hand.light >= 1 || this.state.player.hand.fire >= 1)) {
        this.modalContent("choiceButton", "Would you like to counter?")
      } else if (this.state.player.hand.water === 0) {
        this.modalContent("noWaterButton", "You are unable to counter at this time.")
      }
    }
  }
  refuseCounter = () => {
    this.closeOfferModal("noCounter");
  }
  acceptCounter = () => {
    this.closeOfferModal("counter");
  }
  onCounterOfferRes = (result) => {
    if (result.result === "noCounter") {
      if (result.player === this.state.playerName) {
        this.state.client.flipCard(this.state.room);
      }
    } else if (result.result === "counter") {
      if (result.player === this.state.playerName) {
        this.setState({
          afterFlip: result.afterFlip
        }, this.modalContent("noButton", "This is the counter modal"))
      }
    } else {
      this.setState({"afterFlip": result.afterFlip})
    }
  }
  onCounterActionRes = (result) => {
    const player = {
      ...this.state.player
    };
    const opponent = {
      ...this.state.opponent
    };
    if (result.player === this.state.playerName) {
      player.hand = result.counteringPlayerHand;
      player.discard = result.counteringPlayerDiscard;
      opponent.stagedCard = result.playerStagedCard;
      opponent.discard = this.getCount(result.playerDiscard);
      this.setState({
        message: "Your opponent countered.",
        player,
        opponent,
        afterFlip: result.afterFlip
      }, function() {
        this.state.client.switchTurn(this.state.room);
      })
    } else {
      player.stagedCard = result.playerStagedCard;
      player.discard = result.playerDiscard;
      opponent.hand = this.getCount(result.counteringPlayerHand);
      opponent.discard = this.getCount(result.counteringPlayerDiscard);
      this.setState({opponent, player, afterFlip: result.afterFlip})
    }
  }
  onFlippedCardRes = (data) => {
    const player = {
      ...this.state.player
    };
    const opponent = {
      ...this.state.opponent
    };
    if (this.state.playerName === data.playerName) {
      opponent.field = data.field;
      opponent.stagedCard = data.stagedCard;
      opponent.hand = this.getCount(data.hand);
      opponent.deck = this.getCount(data.deck);
      this.setState({
        opponent,
        "afterFlip": data.afterFlip,
        "message": data.message
      }, function() {
        this.state.client.victoryCheck(this.state.room);
        if (this.state.afterFlip === "shadowAction") {
          if (this.state.opponent.hand === 0) {
            this.modalContent("closeButton", "There are no elements in your hand to discard.", this.state.client.clickCard.bind(this, "none", this.state.room, this.state.afterFlip))
          } else {
            this.modalContent("noButton")
          }
        } else if (this.state.afterFlip !== "shadowAction" && this.state.afterFlip !== "lightAction" && this.state.afterFlip !== "fireAction") {
          this.state.client.switchTurn(this.state.room);
        }
      });
    } else {
      player.deck = this.getCount(data.deck);
      player.hand = data.hand;
      player.field = data.field;
      player.stagedCard = data.stagedCard;
      this.setState({
        player,
        "afterFlip": data.afterFlip,
        "message": data.message
      }, function() {
        if (this.state.afterFlip === "lightAction") {
          if (this.getCount(this.state.player.discard) === 0) {
            this.modalContent("closeButton", "There are no elements in your discard.", this.state.client.clickCard.bind(this, "none", this.state.room, this.state.afterFlip))
          } else {
            this.modalContent("noButton")
          }
        } else if (this.state.afterFlip === "fireAction") {
          if (this.getCount(this.state.opponent.field) === 0) {
            this.modalContent("closeButton", "There are no elements on the opponents field", this.state.client.clickCard.bind(this, "none", this.state.room, this.state.afterFlip))
          } else {
            this.modalContent("noButton")
          }
        }
      });
    }
  }
  onDrawCardRes = (data) => {
    const player = {
      ...this.state.player
    };
    const opponent = {
      ...this.state.opponent
    };
    if (data.playerName === this.state.playerName) {
      player.hand = data.hand;
      player.deck = this.getCount(data.deck);
      this.setState({player, "message": data.playerMessage})
    } else {
      opponent.hand = this.getCount(data.hand);
      opponent.deck = this.getCount(data.deck);
      this.setState({opponent, "message": data.opponentsMessage})
    }
  }
  modalContent = (buttonFlag, message = "", triggerFunction = null) => {
    this.setState({
      modal: {
        open: true,
        message: message,
        buttonFlag: buttonFlag
      }
    }, function() {
      if (triggerFunction !== null) {
        triggerFunction()
      }
    })
  }
  onVictoryCheck = (data) => {
    if (data.playerMessage !== "keep playing") {
      if (this.state.playerName === data.playerName) {
        this.setState({
          afterFlip: ""
        }, this.modalContent("homeButton", data.playerMessage, this.state.client.disconnect.bind(this)))
      } else {
        this.setState({
          afterFlip: ""
        }, this.modalContent("homeButton", data.opponentsMessage, this.state.client.disconnect.bind(this)))
      }
    }
  }
  onCardActionRes = (data) => {
    const player = {
      ...this.state.player
    };
    const opponent = {
      ...this.state.opponent
    };
    switch (data.emitAction) {
      case "fireActionEmit":
        if (data.currentPlayer === this.state.playerName) {
          opponent.field = data.field;
          opponent.discard = this.getCount(data.discard);
          this.setState({"afterFlip": data.afterFlip, opponent})
        } else {
          player.field = data.field;
          player.discard = data.discard;
          this.setState({
            "afterFlip": data.afterFlip,
            player
          }, function() {
            this.state.client.switchTurn(this.state.room);
          })
        }
        break;
      case "lightActionEmit":
        if (data.currentPlayer === this.state.playerName) {
          player.discard = data.discard;
          player.hand = data.hand;
          this.setState({"afterFlip": data.afterFlip, player})
        } else {
          opponent.discard = this.getCount(data.discard);
          opponent.hand = this.getCount(data.hand);
          this.setState({
            "afterFlip": data.afterFlip,
            opponent
          }, function() {
            this.state.client.switchTurn(this.state.room);
          })
        }
        break;
      default:
        if (data.currentPlayer === this.state.playerName) {
          player.hand = data.hand;
          player.discard = data.discard
          this.setState({
            afterFlip: data.afterFlip,
            player
          }, function() {
            this.state.client.switchTurn(this.state.room)
          })
        } else {
          opponent.hand = this.getCount(data.hand);
          opponent.discard = this.getCount(data.discard);
          this.setState({afterFlip: data.afterFlip, opponent})
        }
        break;
    }
  }
  onNewTurn = (data) => {
    if (data.currentPlayer === this.state.playerName) {
      this.setState({
        "turn": data.turn,
        "message": data.playerMessage
      }, function() {
        this.state.client.drawCard(this.state.room);
      });
    } else {
      this.setState({"turn": data.turn, "message": data.opponnentsMessage});
    }
  }
  getModalContent = () => {
    if (this.state.afterFlip === "shadowAction" && this.state.opponent.hand > 0) {
      return (<div>
        <p>Please select an element in your hand to discard.</p>
        <CardDisplay onClick={this.clickHandler} className="shadowActionModal"/>
        <CardCount cards={this.state.player.hand}/>
      </div>)
    } else if (this.state.afterFlip === "lightAction" && this.getCount(this.state.player.discard) > 0) {
      return (<div>
        <p>Please select an element in your discard to put in your hand.</p>
        <CardDisplay onClick={this.clickHandler} className="lightActionModal"/>
        <CardCount cards={this.state.player.discard}/>
      </div>)
    } else if (this.state.afterFlip === "fireAction" && this.getCount(this.state.opponent.field) > 0) {
      return (<div>
        <p>Please select one of your opponent's elements on the field to discard.</p>
        <CardDisplay onClick={this.clickHandler} className="fireActionModal"/>
        <CardCount cards={this.state.opponent.field}/>
      </div>)
    } else if (this.state.afterFlip === "counterAction" && this.getCount(this.state.player.hand) >= 2) {
      return (<div>
        <p>Please select another element to discard along with water.</p>
        <CardDisplay onClick={this.clickHandler} className="counterActionModal"/>
        <CardCount cards={this.state.player.hand}/>
      </div>)
    } else {
      return <p>{this.state.modal.message}</p>
    }
  }
  closeModal = () => {
    this.setState({
      "modal": {
        "open": false
      }
    })
  }
  closeOfferModal = (result) => {
    this.setState({
      "modal": {
        "open": false
      }
    }, function() {
      this.state.client.sendCounterOfferRes(this.state.room, result);
    })
  }
  render() {
    const {classes} = this.props;
    return (<Card className={classes.page}>
      <CustomModal hasChoice={this.state.modal.hasChoice} decline={this.refuseCounter} accept={this.acceptCounter} isOpen={this.state.modal.open} buttonFlag={this.state.modal.buttonFlag} closeModal={this.closeModal}>
        {this.getModalContent()}
      </CustomModal>
      <Grid container={true} direction="column" justify="space-evenly" alignItems="center">
        <PlayArea playerName="opponent" playerInfo={this.state.opponent}/>
        <CardCount cards={this.state.opponent.field}/>
        <CardDisplay className="opponentField"/>
        <Grid container={true} direction="row" justify="left">
          <p className={classes.statusMessage}>{this.state.message}</p>
        </Grid>
        <CardDisplay className="playerField"/>
        <CardCount cards={this.state.player.field}/>
        <PlayArea clickHandler={this.clickHandler} playerName="player" playerInfo={this.state.player}/>
      </Grid>
    </Card>)
  }
}
export default withStyles(styles)(Game);
