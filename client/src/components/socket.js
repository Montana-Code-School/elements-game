const io = require( 'socket.io-client' )
export default function () {
	const socket = io.connect( "http://localhost:5000" );

	function join() {
		socket.emit( "join" );
	};
	function getRoomJoin( onRoomJoin ) {
		socket.on( "roomJoin", onRoomJoin )
	}
	function initialDraw( roomName ) {
		socket.emit( "initialDraw", roomName );
	}
	function getInitialDrawRes( onInitialDrawRes ) {
		socket.on( "initialDrawRes", onInitialDrawRes );
	};
	function clickCard( card, roomName, afterFlip ) {
		socket.emit( "click", card, roomName, afterFlip );
	}
	function getClickedCard( onClickedCard ) {
		console.log("getClickedCard")
		socket.on( "cardClicked", onClickedCard );
	}
	function counterOffer( roomName ) {
		console.log("sending counter offer")
		socket.emit( "counterOffer", roomName );
	}
	function getCounterOffer( onCounterOffer ) {
		socket.on( "getCounterOffer", onCounterOffer );
	}

	function flipCard( roomName ) {
		socket.emit( "flipCard", roomName );
	}
	function getFlippedCardRes( onFlippedCardRes ) {
		console.log("get flipped card result")

		socket.on( "getFlippedCardRes", onFlippedCardRes );
	}
	function getDisconnect(onDisconnect){
		console.log("onDisconnect happened")
		socket.on("getDisconnect", onDisconnect)
	}
	socket.on( 'error', function ( err ) {
		console.log( 'received socket error:' )
		console.log( err )
	} );
	return {
		join,
		getRoomJoin,
		initialDraw,
		getInitialDrawRes,
		clickCard,
		getClickedCard,
		counterOffer,
		getCounterOffer,
		flipCard,
		getFlippedCardRes,
		getDisconnect
	}
}
