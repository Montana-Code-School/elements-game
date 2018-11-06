import React, { Component } from "react";
import { Modal } from "@material-ui/core";
import { Link } from "react-router-dom";

const modalStyle = {
	position: "fixed",
	zIndex: 1040,
	top: 0,
	bottom: 0,
	left: 0,
	right: 0,
};

const backdropStyle = {
	...modalStyle,
	zIndex: "auto",
	backgroundColor: "#000",
	opacity: 0.5,
};

const dialogStyle = {
	position: "absolute",
	width: 400,
	top: "45%",
	left: "50%",
	transform: "translate(-45%, -50%)",
	border: "1px solid #e5e5e5",
	backgroundColor: "white",
	boxShadow: "0 5px 15px rgba(0,0,0,.5)",
	padding: 20,
};

class CustomModal extends Component {

	getButtonOptions() {
		switch ( this.props.buttonFlag ) {
			case "choiceButton":
				return ( <div>
					<button onClick={this.props.accept}>Yes</button>
					<button onClick={this.props.decline}>No</button>
				</div> );
			case "homeButton":
				return ( <Link to="/">
					<button>Ok</button>
				</Link> );
			case "noWaterButton":
				return ( <button onClick={this.props.decline}>Ok</button> );
			case "closeButton":
				return ( <button onClick={this.props.closeModal}>Close</button> );
			default:
				return null
		}
	}
	render() {
		return ( <div>
			<Modal
				style={modalStyle}
				backdropstyle={backdropStyle}
				open={this.props.isOpen}>
				<div style={dialogStyle}>
					{this.props.children}
					{this.getButtonOptions()}
				</div>
			</Modal>
		</div> );
	}

}

export default CustomModal;
