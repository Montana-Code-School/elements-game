//require 'socket.io-client'
const io = require( 'socket.io-client' )

export default function () {
	// http://192.168.137.112:5000/
	// https://elements-game.herokuapp.com/" opening socket and
	// specifiying address it should listen to
	const socket = io.connect( "https://elements-game.herokuapp.com/" );

	function join() {
		// sending message to server about client wanting to join
		// the room
		socket.emit( "join" );
	};

	function getRoomJoin( onRoomJoin ) {
		//listener to the roomJoin event  from the server
		socket.on( "roomJoin", onRoomJoin );
	};

	function initialDraw( roomName ) {
		//sending message to the server about making initial draw
		socket.emit( "initialDraw", roomName );
	};

	function getInitialDrawRes( onInitialDrawRes ) {
		// listener to the game state from server after initial draw
		// result
		socket.on( "initialDrawRes", onInitialDrawRes );
	};

	function clickCard( card, roomName, afterFlip ) {
		// sending message to the server about the click that was
		// made
		socket.emit( "click", card, roomName, afterFlip );
	};

	function getClickedCard( onClickedCard ) {
		// listener to the game state from the server after card was
		// clicked
		socket.on( "cardClicked", onClickedCard );
	};

	function counterOffer( roomName ) {
		// sending message to the server to trigger counter offer
		// for opponent
		socket.emit( "counterOffer", roomName );
	};

	function getCounterOffer( onCounterOffer ) {
		//listener to the counter offer from server
		socket.on( "getCounterOffer", onCounterOffer );
	};

	function sendCounterOfferRes( roomName, result ) {
		// sending message to the server about players decision to
		// counter
		socket.emit( "sendCounterOfferRes", roomName, result );
	};

	function getCounterOfferRes( onCounterOfferRes ) {
		// listener to the information from server depending on
		// players decisions to counter
		socket.on( "getCounterOfferRes", onCounterOfferRes );
	};

	function getCounterActionRes( onCounterActionRes ) {
		//listener to the game state after counter action result
		socket.on( "onCounterActionRes", onCounterActionRes );
	};

	function flipCard( roomName ) {
		//sending message to the server to trigger flipCard function
		socket.emit( "flipCard", roomName );
	};

	function getFlippedCardRes( onFlippedCardRes ) {
		//listener to the game state after card was flipped
		socket.on( "onFlippedCardRes", onFlippedCardRes );
	};

	function getCardActionRes( onCardActionRes ) {
		// listener to the game state after card effect was
		// triggered
		socket.on( "cardActionRes", onCardActionRes );
	}
	function drawCard( roomName ) {
		//sending message to the server to trigger drawCard function
		socket.emit( "drawCard", roomName );
	};

	function getDrawCardRes( onDrawCardRes ) {
		//listener to the game state after card was drawn
		socket.on( "drawCardRes", onDrawCardRes );
	};

	function victoryCheck( roomName ) {
		//sending message to the server to make victory check
		socket.emit( "victoryCheck", roomName );
	};

	function getVictoryCheck( onVictoryCheck ) {
		//listener to the result of victory check function
		socket.on( "onVictoryCheck", onVictoryCheck );
	};

	function switchTurn( roomName ) {
		//sending message to the server to switch turns
		socket.emit( "switchTurn", roomName );
	};

	function getNewTurn( onNewTurn ) {
		//listener to the game state after turns were switched
		socket.on( "getNewTurn", onNewTurn );
	};

	function disconnect() {
		//manually disconnect user
		socket.disconnect();
	};

	function getDisconnect( onDisconnect ) {
		//listener to the disconnect message from server
		socket.on( "getDisconnect", onDisconnect );
	};

	//listener to errors from server
	socket.on( 'error', function ( err ) {
		console.log( 'received socket error:' );
		console.log( err );
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
		disconnect,
		getDisconnect,
		sendCounterOfferRes,
		getCounterOfferRes,
		getCounterActionRes,
		drawCard,
		getDrawCardRes,
		victoryCheck,
		switchTurn,
		getNewTurn,
		getVictoryCheck,
		getCardActionRes,
	}
}
