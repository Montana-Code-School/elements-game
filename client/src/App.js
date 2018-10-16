import React, { Component } from 'react';
import './App.css';
import openSocket from 'socket.io-client'

class App extends Component {
	constructor() {
		super();
		this.state = {
			socket: openSocket( 'http://localhost:5000' ),
			message: 'Waiting for another player...',
			yourTurn: false,
		}

	}
	click = ( e ) => {
		this
			.state
			.socket
			.emit( 'click', e.currentTarget.id )
	}

	render() {
		return ( <div className="App">
			<h1 className="tag" onClick={this.click}>Hi</h1>
		</div> );
	}
}

export default App;
