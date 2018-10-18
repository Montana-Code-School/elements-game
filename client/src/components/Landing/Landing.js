import React, { Component } from "react";
import "./Landing.css"
import { Link } from "react-router-dom"
import openSocket from 'socket.io-client'
const socket = openSocket( 'http://localhost:5000' )
class Landing extends Component {
	joinRoom = () => {

		socket.emit( "join" );
	}
	render() {
		return ( <div className="Landing_container">
			<Link to="/game" className="Landing_button" onClick={this.joinRoom}>startgame</Link>
			<h1 className="Landing_header">ELEMENTS</h1>

		</div> )
	}
}

export default Landing
