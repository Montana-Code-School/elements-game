module.exports = function () {
	// class DataStore { 	constructor() {
	rooms = new Map();
	// };
	function getRoomById( roomName ) {
		rooms.filter( room => room.name === roomName );
	};
	function addRoom( room ) {
		rooms.set( room.name, { room } )
		console.log( room )
	};
	function deleteRoom( room ) {
		rooms.delete( room.name );
	}
	// }
	return { getRoomById, addRoom, deleteRoom }
}
