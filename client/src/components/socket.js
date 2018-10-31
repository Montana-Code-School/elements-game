const io = require( 'socket.io-client' )
export default function () {
	const socket = io.connect( "http://localhost:5000" );

	function join() {
		socket.emit( "join" );
	};
	function getRoomJoin( onRoomJoin ) {
		socket.on( "roomJoin", onRoomJoin );
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
	function counterOffer( roomName ) {
		socket.emit( "counterOffer", roomName );
	}
	function getCounterOffer( onCounterOffer ) {
		socket.on( "getCounterOffer", onCounterOffer );
	}
	function flipCard( roomName ) {
		socket.emit( "flipCard", roomName );
	}
	function sendCounterOfferRes( roomName, result ) {
		socket.emit( "sendCounterOfferRes", roomName, result );
	}
	function getCounterOfferRes( onCounterOfferRes ) {
		socket.on( "getCounterOfferRes", onCounterOfferRes );
	}
	function getFlippedCardRes( onFlippedCardRes ) {
		socket.on( "onFlippedCardRes", onFlippedCardRes );
	}
	function getCardActionRes( onCardActionRes ) {
		socket.on( "cardActionRes", onCardActionRes );
	}
	function drawCard( roomName, currentPlayer ) {
		socket.emit( "drawCard", roomName, currentPlayer );
	}
	function getDrawCardRes( onDrawCardRes ) {
		socket.on( "drawCardRes", onDrawCardRes );
	}
	function victoryCheck( roomName ) {
		socket.emit( "victoryCheck", roomName );
	}
	function getVictoryCheck( onVictoryCheck ) {
		socket.on( "onVictoryCheck", onVictoryCheck );
	}
	function disconnect() {
		socket.disconnect();
	}
	function getDisconnect( onDisconnect ) {
		socket.on( "getDisconnect", onDisconnect );
	}
	socket.on( 'error', function ( err ) {
		console.log( 'received socket error:' );
		console.log( err );
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
		getDrawCardRes,
		victoryCheck,
		getVictoryCheck,
		getCardActionRes,
	}
}
