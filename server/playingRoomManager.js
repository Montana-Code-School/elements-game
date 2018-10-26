const classes = require( "./roomAndPlayerClasses" )
const { Room } = classes;
module.exports = function () {
	const rooms = new Map();
	function getRoomById( roomName ) {
		return rooms.get( roomName );
	};
	function addRoom( roomName, clientInfo ) {
		rooms.set( roomName, new Room( roomName, clientInfo ) );
		return getRoomById( roomName );
	};
	function updateRoom( room ) {
		deleteRoom( room.name );
		rooms.set( room.name, room );
		return getRoomById( room.name );
	}

	function deleteRoom( room ) {
		rooms.delete( room.name );
	}
	return { getRoomById, addRoom, deleteRoom, updateRoom, }
}
