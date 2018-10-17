import React, {Component} from "react";
import "./Card.css"

export default class Card extends Component {
  clickHandler = ( e ) => {
    console.log(this.props.className, " clicked" )
		// this
    //   .state
		// 	.socket
		// 	.emit( 'click', e.currentTarget.className )
	}
  render() {
    console.log(this.props.className);
    return(
      <div className={`${this.props.className} card`} onClick={this.clickHandler}><p>{this.props.className}</p>
      </div>

  )
}
}
