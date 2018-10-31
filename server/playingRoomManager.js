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
	function getAllRooms() {
		return rooms.values()
	}
	function findRoomByClient( id ) {
		const roomsArr = Array.from( rooms )
		const roomRes = roomsArr.filter( roomArr => {
			if ( roomArr[ 1 ].player1 !== null && roomArr[ 1 ].player2 !== null ) {
				return roomArr[ 1 ].player1.clientId === id || roomArr[ 1 ].player2.clientId === id
			} else if ( roomArr[ 1 ].player2 === null ) {
				return roomArr[ 1 ].player1.clientId === id
			} else if ( roomArr[ 1 ].player1 === null ) {
				return roomArr[ 1 ].player2.clientId === id
			}
		} );
		if ( roomRes[ 0 ] !== undefined ) 
			return roomRes[ 0 ][ 0 ];
		else 
			return {}
		}
	function deleteRoom( roomName ) {
		rooms.delete( roomName );
	}
	return {
		getRoomById,
		addRoom,
		deleteRoom,
		updateRoom,
		findRoomByClient,
		getAllRooms
	}
}
