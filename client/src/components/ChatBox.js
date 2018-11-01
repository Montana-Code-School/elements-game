import React, { Component } from "react";

class ChatBox extends Component {

	render() {
		return ( <div>
			<ul id="messages"></ul>
			<form action="">
				<input id="m" autoComplete="off"/>
				<button>Send</button>
			</form>
		</div> );
	}

}

export default ChatBox;
