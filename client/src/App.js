import React, { Component } from 'react';
import './App.css';
import openSocket from 'socket.io-client'
import Landing from './components/Landing/Landing';
import Game from './components/Game/Game';
import { Route, BrowserRouter as Router, Switch, } from "react-router-dom";

class App extends Component {
	constructor() {
		super();
		this.state = {
			socket: openSocket( 'http://localhost:5000' ),
			message: 'Waiting for another player...',
			yourTurn: false,
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
		return ( <Router>
			<Switch>
				<Route path="/game" component={Game}/>
				<Route path="/" component={Landing}/>
			</Switch>
		</Router> )
	}
}

export default App;
