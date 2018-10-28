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
	function playCard( card, roomName ) {
		socket.emit( "click", card, roomName );
	}
	function getPlayedCard( onPlayedCard ) {
		socket.on( "cardPlayed", onPlayedCard );
	}
	function counterOffer( roomName ) {
		socket.emit( "counterOffer", roomName );
	}
	function getCounterOffer( onCounterOffer ) {
		console.log( 'getting offer' );
		socket.on( "counterOffer", onCounterOffer );
	}
	function flipCard( roomName ) {
		socket.emit( "flipCard", roomName );
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
		playCard,
		getPlayedCard,
		counterOffer,
		getCounterOffer,
	}
}
