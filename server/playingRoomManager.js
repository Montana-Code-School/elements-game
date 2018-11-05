// import room class from roomAndPlayerClasses.js
const classes = require( "./roomAndPlayerClasses" )
const { Room } = classes;

module.exports = function () {
	//create rooms Map
	const rooms = new Map();

	//get infrormation about room by room name
	function getRoomById( roomName ) {
		return rooms.get( roomName );
	};

	//add new room to the rooms map
	function addRoom( roomName, clientInfo ) {
		rooms.set( roomName, new Room( roomName, clientInfo ) );
		//return created room
		return getRoomById( roomName );
	};

	function updateRoom( room ) {
		//delete previous information about the room
		deleteRoom( room.name );
		//create new room with updated information
		rooms.set( room.name, room );
	};

	//find room name that user belongs to
	function findRoomByClient( id ) {
		//transform map of rooms to an array
		const roomsArr = Array.from( rooms )
		//filter through and array
		const roomRes = roomsArr.filter( roomArr => {
			//if there is two users in the room
			if ( roomArr[ 1 ].player1 !== null && roomArr[ 1 ].player2 !== null ) {
				//return information about user who made a request
				return roomArr[ 1 ].player1.clientId === id || roomArr[ 1 ].player2.clientId === id
				// if there is only one user left in the room return
				// information about another one
			} else if ( roomArr[ 1 ].player2 === null ) {
				return roomArr[ 1 ].player1.clientId === id
			} else if ( roomArr[ 1 ].player1 === null ) {
				return roomArr[ 1 ].player2.clientId === id
			}
		} );
		//if filter function result contains information
		if ( roomRes[ 0 ] !== undefined ) {
			//return name of the room
			return roomRes[ 0 ][ 0 ];
		} else {
			return {}
		}
	};

	//delete room with passed room name from map of rooms
	function deleteRoom( roomName ) {
		rooms.delete( roomName );
	};

	return { getRoomById, addRoom, deleteRoom, updateRoom, findRoomByClient }
}
