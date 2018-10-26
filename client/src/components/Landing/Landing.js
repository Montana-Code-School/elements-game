import React, { Component } from "react";
import "./Landing.css";
import { Link } from "react-router-dom";

class Landing extends Component {
	render() {
		return ( <div className="landingContainer" id="landingPage">
			<Link to="/game" className="landingButton">startgame</Link>
			<h1 className="landingHeader">ELEMENTS</h1>
		</div> )
	}
}
export default Landing
