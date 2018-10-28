const Card = theme => ( {
	card: {
		width: "8%",
		marginTop: "1%",
		marginBottom: "1%",
		margin: ".1%",
	},
	multicardDisplayCard: {
		width: "10%",
		marginTop: "1%",
		marginBottom: "1%",
		margin: ".1%",
	},
	multicardDisplay: {
		width: "45%",
		height: "40%",
		margin: "1%"
	},
	field: {
		width: "40%",
		height: "40%",
	},
	chat: {
		width: "25%",
		height: "70%",
	},
	page: {
		width: "100%",
		height: "inherit",
		margin: "auto",
		// margin: "auto", paddingTop: "1", paddingLeft: "18%", paddingRight: "18%",
		[theme.breakpoints.between( "xs", "sm" )]: {
			paddingTop: "5%",
			backgroundColor: "blue"
		},
		[ theme.breakpoints.only( "md" ) ]: {
			paddingTop: "5%",
			// paddingBottom: "5%",
			backgroundColor: "green",
		},
		[theme.breakpoints.between( "lg", "xl" )]: {
			paddingTop: "2%",
			// paddingBottom: "2%",
			backgroundColor: "red"
		},
	},
} );
export {
	Card
}
