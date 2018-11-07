const Card = theme => ( {
//sets dimensions for single card piles on the player's boards
	card: {
		width: "7%",
		marginTop: "1%",
		margin: ".1%"
	},
//styles for field, hands, and modals displaying 5 cards.
	multicardDisplayCard: {
		width: "15%",
		marginTop: "1%",
		margin: ".1%"
	},
//container for the cards.
	multicardDisplay: {
		width: "45%",
		height: "50%",
		margin: ".1%",
		background: "transparent",
	},
	//styles for actual card.
	fieldCard: {
		width: "7%",
		margin: ".1%"
	},
	//defines boundary of actual page.
	page: {
		width: "90%",
		height: "98%",
		background: "radial-gradient(white, #2f4f4f)",
		paddingTop: ".5%",
		paddingBottom: ".5%",
		paddingLeft: "5%",
		paddingRight: "5%"
	},
	//styles for both information boxes
	statusMessage: {
		background: "inherit",
		padding: "0.5%",
		boxShadow: "2px -2px 4px black",
		borderRadius: "10px",
		fontWeight: "bold",
		color: "black",
		fontSize: "110%"

	},
	//style for blank space where staged card is played
	emptyStaged: {
		height: "30px",
		width: "15px",
		marginTop: "1%",
		margin: ".1%",
		backgroundColor: "inherit",
		boxShadow: "2px -2px 4px black"
	}
} );

export {
	Card
}
