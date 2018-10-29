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
function findRoomByClient(id) {
	const roomsArr = Array.from(rooms)
	const roomRes = roomsArr.filter(roomArr => (roomArr[1].player1.clientId === id || roomArr[1].player2.clientId === id) )
	return roomRes[0][0];
}
	function deleteRoom( room ) {
		rooms.delete( room.name );
	}
	return { getRoomById, addRoom, deleteRoom, updateRoom, findRoomByClient }
}
