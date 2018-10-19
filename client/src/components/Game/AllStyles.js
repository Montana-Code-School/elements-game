const AllStyles = {};

const Card = theme => ( {
	card: {
		width: "10%",
		marginTop: "1%",
		marginBottom: "1%",
		margin: ".1%"
	},
	multicard_display: {
		marginTop: "1%",
		marginBottom: "1%",
		width: "50%",
		height: "40%",
		margin: "1%",
	},
	page: {
		// marginLeft: "14%",
		// marginRight: "10%",
		// marginTop: "1%",
		paddingLeft: "14%",
		paddingRight: "10%",
		paddingTop: "1%",
		paddingTop: "1%",
		[
			theme
				.breakpoints
				.between( 'xs', 'sm' )
		]: {

			backgroundColor: "blue"
		},
		[ theme
				.breakpoints
				.only( 'md' ) ]: {
			maxWidth: "900px",
			maxHeight: "800px",
			backgroundColor: "green"
		},
		[
			theme
				.breakpoints
				.between( 'lg', 'xl' )
		]: {
			maxWidth: "1000px",
			maxHeight: "750px",
			backgroundColor: "red"
		},
		// height: "100%",
		// maxWidth: "100%",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
	}
} );
export {
	AllStyles,
	Card
}
