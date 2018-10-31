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
		socket.on( "cardClicked", onClickedCard );
	}
	function counterOffer( roomName, onCounterOffer ) {
		socket.emit( "counterOffer", roomName );
	}
	function getCounterOffer( onCounterOffer ) {
		socket.on( "getCounterOffer", onCounterOffer );
	}
	function flipCard( roomName ) {
		socket.emit( "flipCard", roomName );
	}
	function sendCounterOfferRes( roomName, result ) {
		socket.emit( "sendCounterOfferRes", roomName, result )
	}
	function getCounterOfferRes( onCounterOfferRes ) {
		socket.on( "getCounterOfferRes", onCounterOfferRes );
	}
	function getFlippedCardRes( onFlippedCardRes ) {
		socket.on( "onFlippedCardRes", onFlippedCardRes );
	}
	function drawCard( roomName, currentPlayer ) {
		socket.emit( "drawCard", roomName, currentPlayer );
	}
	function drawCardRes( onDrawCardRes ) {
		socket.on( "drawCardRes", onDrawCardRes );
	}
	function disconnect() {
		socket.disconnect();
	}
	function getDisconnect( onDisconnect ) {
		console.log( "onDisconnect happened" )
		socket.on( "getDisconnect", onDisconnect );
	}
	function listenerOff( emit, onDrawCardRes ) {
		console.log( `turning off listener to ${ emit }` )
		socket.off( `${ emit }`, onDrawCardRes );
	}
	socket.on( 'error', function ( err ) {
		console.log( 'received socket error:' )
		console.log( err )
	} );
	// socket.setTimeout(function () {    console.log('2 seconds
	// passed, closing the socket');    socket.close();  },
	// 5000);
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
		disconnect,
		getDisconnect,
		sendCounterOfferRes,
		getCounterOfferRes,
		drawCard,
		drawCardRes,
		listenerOff,
	}
}
