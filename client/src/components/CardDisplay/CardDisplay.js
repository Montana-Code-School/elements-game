import React, {Component} from "react";
import Card from "../Card/Card"
import "./CardDisplay.css"

export default class CardDisplay extends Component {
  clickHandler = ( e ) => {
		this
      .state
			.socket
			.emit( 'click', e.currentTarget.className )
	}
  render() {
    if (this.props.className === "opponents_hand") {
      return (
        <div className="card_display_container">
          <Card className="card_back" />
          <Card className="card_back" />
          <Card className="card_back" />
          <Card className="card_back" />
          <Card className="card_back" />
        </div>
      )
    } else {
      return(
      <div className="card_display_container">
        <Card className="water" />
        <Card className="earth" />
        <Card className="light" />
        <Card className="shadow" />
        <Card className="fire" />
      </div>
  ) }
  }
}
