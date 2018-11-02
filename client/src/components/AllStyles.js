const Card = theme => ( {
	card: {
		width: "8%",
		marginTop: "1%",
		marginBottom: "1%",
		margin: ".1%"
	},
	multicardDisplayCard: {
		width: "10%",
		marginTop: "1%",
		marginBottom: "1%",
		margin: ".1%"
	},
	multicardDisplay: {
		width: "45%",
		height: "40%",
		margin: "1%",
	},
	field: {
		width: "40%",
		height: "40%"
	},
	chat: {
		width: "25%",
		height: "70%"
	},
	page: {
		width: "90%",
		height: "90%",
		background: "linear-gradient(to right bottom, #430089, #82ffa1)",
		paddingTop: "8.5%",
		paddingLeft: "5%",
		paddingRight: "5%",
		[theme.breakpoints.between( "md", "xl" )]: {
			paddingTop: "3%",
			paddingBottom: "2.5%",
		},
	},
} );

// const Chat = theme => {
// * { 		margin: 0; 		padding: 0; 		box-sizing: border-box;
// }   body { 		font: 13px Helvetica, Arial; 	}   form {
// background: #000; 		padding: 3px; 		position: fixed;
// bottom: 0; 		width: 100%; 	}   form input { border: 0;
// padding: 10px; width: 90%; margin-right: .5%; }   form
// button { width: 9%; background: rgb(130, 224, 255);
// border: none; padding: 10px; }   #messages {
// list-style-type: none; margin: 0; padding: 0; } #messages
// li { padding: 5px 10px; }   #messages li:nth-child(odd) {
// background: #eee; }   #messages { margin-bottom: 40px } }
export {
	Card,
	// Chat,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
}
