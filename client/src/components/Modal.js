import React, { Component } from "react";
import { Modal } from "@material-ui/core";
import { Link } from "react-router-dom";

let rand = () => ( Math.floor( Math.random() * 20 ) - 10 );
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

const dialogStyle = function () {
	// we use some psuedo random coords so nested modals don"t
	// sit right on top of each other.
	let top = 50 + rand();
	let left = 50 + rand();

	return {
		position: "absolute",
		width: 400,
		top: top + "%",
		left: left + "%",
		transform: `translate(-${ top}%, -${ left }%)`,
		border: "1px solid #e5e5e5",
		backgroundColor: "white",
		boxShadow: "0 5px 15px rgba(0,0,0,.5)",
		padding: 20
	};
};

class CustomModal extends Component {

	getButtonOptions() {
		let buttonOptions = <button onClick={this.props.closeModal}>Close</button>
		if ( this.props.hasChoice ) {
			buttonOptions = [
				<button onClick={this.props.accept}>Yes</button>,
				<button onClick={this.props.decline}>No</button>,
			]
		} else if (this.props.hasExit) {
			buttonOptions = <Link to="/">
				<button>Ok</button>
			</Link>
		}
		return buttonOptions;
	}

	render() {
		return ( <div>
			<Modal
				style={modalStyle}
				backdropstyle={backdropStyle}
				open={this.props.isOpen}
				onClose={this.props.closeModal}>
				<div style={dialogStyle()}>
					{this.props.children}
					{this.getButtonOptions()}
				</div>
			</Modal>
		</div> );
	}

}

export default CustomModal;
