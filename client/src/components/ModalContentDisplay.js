import React, {Component} from "react";
import CardDisplay from "./CardDisplay";
import CardCount from "./CardCount";

export default ModalContentStyle  extends Component{
  //"afterFlip"(className), message, clickHandler, field
  getModalContent = () => {
    if (this.props.afterFlip === "shadowAction" && this.state.opponent.hand > 0) {
      return (
        <div>
          <p>Please select an element in your hand to discard.</p>
          <CardDisplay onClick={this.props.onClick} className="shadowActionModal"/>
          <CardCount cards={this.state.player.hand}/>
        </div>
      )
    } else if (this.props.afterFlip === "lightAction" && this.getCount(this.state.player.discard) > 0) {
      return (
        <div>
          <p>Please select an element in your discard to put in your hand.</p>
          <CardDisplay onClick={this.props.onClick} className="lightActionModal"/>
          <CardCount cards={this.state.player.discard}/>
        </div>
      )
    } else if (this.props.afterFlip === "fireAction" && this.getCount(this.state.opponent.field) > 0) {
      return (
        <div>
          <p>Please select one of your opponent's elements on the field to discard.</p>
          <CardDisplay onClick={this.props.onClick} className="fireActionModal"/>
          <CardCount cards={this.state.opponent.field}/>
        </div>
      )
    } else if (this.props.afterFlip === "counterAction" && this.getCount(this.state.player.hand) >= 2) {
      return (
        <div>
          <p>Please select another element to discard along with water.</p>
          <CardDisplay onClick={this.props.onClick} className="counterActionModal"/>
          <CardCount cards={this.state.player.hand}/>
        </div>
      )
    } else {
      return <p>{this.state.modal.message}</p>
    }
  }
  render(){
    return()
  }
}
