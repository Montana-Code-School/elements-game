import React, { Component } from "react";
import CardDisplay from "./CardDisplay";
import CardCounts from "./CardCounts";

export default class ModalContentStyle extends Component {

	render() {
		return ( <div>
			<p>{this.props.message}</p>
			<CardDisplay onClick={this.props.onClick} className={this.props.className}/>
			<CardCounts cards={this.props.field}/>
		</div> )
	}
}
