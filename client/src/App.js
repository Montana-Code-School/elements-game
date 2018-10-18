import React, { Component } from 'react';
import './App.css';
import openSocket from 'socket.io-client'

class App extends Component {
	constructor() {
		super();
		this.state = {
			socket: openSocket( 'http://localhost:5000' ),
			message: 'Waiting for another player...',
			yourTurn: false
		}

	}
	// if ( e.currentTarget.className === 'deck' ) {
	// 	click = ( e, this.state.hand ) => {
	// 		this
	// 			.state
	// 			.socket
	// 			.emit( 'click', e.currentTarget.id, )
	// 	}
	// }
	// click = ( e, ) => {
	// 	if ( e.currentTarget.id === 'deck' ) {
	// 	 need to pass hand
	// 		this
	// 			.state
	// 			.socket
	// 			.emit( 'click', e.currentTarget.id, this.state.hand )
	// 	} else if ( e.currentTarget.id = 'hand' ) {
	// 	 need to pass deck
	// 		this
	// 			.state
	// 			.socket
	// 			.emit( 'click', e.currentTarget.id, this.state.deck )
	// 	}
	// 	this
	// 		.state
	// 		.socket
	// 		.emit( 'click', e.currentTarget.className )
	// }

	render() {
		return ( <div className="App">
			<h1 className="tag" onClick={this.click}>Hi</h1>
			<div className="deck" onClick={this.click}>
				<p></p>
			</div>
		</div> );
	}
}

export default App;
