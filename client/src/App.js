import React, { Component } from "react";
import "./App.css";
import Landing from "./components/Landing/Landing";
import Game from "./components/Game";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
class App extends Component {

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
