const AllStyles = {};

const Card = theme => ( {
	card: {
		width: "10%",
		marginTop: "1%",
		marginBottom: "1%",
		margin: ".1%",
	},
	multicard_display: {
		marginTop: "1%",
		marginBottom: "1%",
		width: "50%",
		height: "40%",
		margin: "1%"
	},
	page: {
		width: "100%",
		height: "100%",
		[
			theme
				.breakpoints
				.between( 'xs', 'sm' )
		]: {
			paddingLeft: "14%",
			paddingRight: "10%",
			paddingTop: "1%",
			backgroundColor: "blue",
		},
		[ theme
				.breakpoints
				.only( 'md' ) ]: {
			maxWidth: "900px",
			maxHeight: "800px",
			paddingLeft: "14%",
			paddingRight: "10%",
			paddingTop: "1%",
			backgroundColor: "green",
		},
		[
			theme
				.breakpoints
				.between( 'lg', 'xl' )
		]: {
			maxWidth: "1000px",
			maxHeight: "750px",
			paddingLeft: "14%",
			paddingRight: "10%",
			paddingTop: "1%",
			backgroundColor: "red",
		},
		// height: "100%",
		// maxWidth: "100%",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
	},
} );
export {
	AllStyles,
	Card,
}
