import React, { Component } from "react";
import "./Landing.css"
import { Link } from "react-router-dom"

class Landing extends Component {
	render() {
		return ( <div className="Landing_container">
			<Link to="/game" className="Landing_button">startgame</Link>
			<h1 className="Landing_header">ELEMENTS</h1>

		</div> )
	}
}

export default Landing
