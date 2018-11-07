import React, { Component } from "react";
import ModalContentDisplay from "./ModalContentDisplay";
import { Modal } from "@material-ui/core";
import { Link } from "react-router-dom";

//Lines 7 through 40 are styles for all modals.
const modalStyle = {
	position: "fixed",
	zIndex: 1040,
	top: 0,
	bottom: 0,
	left: 0,
	right: 0
};

const backdropStyle = {
	...modalStyle,
	zIndex: "auto",
	backgroundColor: "#000",
	opacity: 0.5
};

const buttonStyle = {
	margin: "1%",
	fontWeight: "bold"
};

const dialogStyle = {
	fontWeight: "bold",
	textAlign: "center",
	position: "absolute",
	top: "45%",
	left: "50%",
	transform: "translate(-45%, -50%)",
	border: "1px solid #e5e5e5",
	borderRadius: "5%",
	background: "radial-gradient(white, #2f4f4f)",
	boxShadow: "0 5px 15px rgba(0,0,0,.5)",
	padding: 20
};

// Component determines which modal to create depending on
// which action is triggered.
class CustomModal extends Component {

	// Function to determine what buttons need to be displayed
	// on the modal.
	getButtonOptions = () => {
		switch ( this.props.buttonFlag ) {
			case "choiceButton":
				return ( <div>
					<button style={buttonStyle} onClick={this.props.accept}>Yes</button>
					<button style={buttonStyle} onClick={this.props.decline}>No</button>
				</div> );
			case "homeButton":
				return ( <Link to="/">
					<button style={buttonStyle}>Ok</button>
				</Link> );
			case "noWaterButton":
				return ( <button style={buttonStyle} onClick={this.props.decline}>Ok</button> );
			case "closeButton":
				return ( <button style={buttonStyle} onClick={this.props.closeModal}>Close</button> );
			default:
				return null
		}
	};

	// Function that determines which message to display inside
	// of modal.
	getMessage = () => {
		if ( this.props.afterFlip === "lightAction" ) {
			return "Please select an element in your discard to put in your ha" +
					"nd."
		} else if ( this.props.afterFlip === "fireAction" ) {
			return "Please select one of your opponent's elements on the field" +
					" to discard.";
		} else if ( this.props.afterFlip === "shadowAction" ) {
			return "Please select an element in your hand to discard.";
		} else if ( ( this.props.afterFlip === "counterAction" ) ) {
			return "Please select another element to discard along with water.";
		}
	};

	//renders modal Component
	render() {
		return ( <Modal
			style={modalStyle}
			backdropstyle={backdropStyle}
			open={this.props.isOpen}>
			{
				this.props.afterFlip === ""
					? <div style={dialogStyle}>
							<p>{this.props.field}</p>
							{this.getButtonOptions()}</div>
					: <div style={dialogStyle}>
							<ModalContentDisplay
								message={this.getMessage()}
								onClick={this.props.onClick}
								className={`${ this.props.afterFlip }Modal`}
								field={this.props.field}/>
						</div>
			}
		</Modal> )
	};
};

export default CustomModal;
