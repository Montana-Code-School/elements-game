import React, { Component } from "react";
import CardDisplay from "./CardDisplay";
import CardCount from "./CardCount";

export default class ModalContentStyle extends Component {

	render() {
		return ( <div>
			<p>{this.props.message}</p>
			<CardDisplay onClick={this.props.onClick} className={this.props.className}/>
			<CardCount cards={this.props.field}/>
		</div> )
	}
}
