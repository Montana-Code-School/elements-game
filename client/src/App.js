import React, { Component } from 'react';
import './App.css';
import openSocket from 'socket.io-client'
import Landing from './components/Landing/Landing';
import Game from './components/Game/Game';
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";

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
	  return (
      <Router>
        <Switch>
          <Route path="/game" component={Game} />
          <Route path="/" component={Landing} />
        </Switch>
      </Router>
    )
	}
}

export default App;
