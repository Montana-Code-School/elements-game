const classes = require( "./roomAndPlayerClasses" )
//export player class from roomAndPlayerClasses.js
const { Player } = classes;
module.exports = function () {

	//create clients map
	const clients = new Map();

	function addClient( client ) {
		//add new user to the map
		clients.set( client.id, new Player( client, client.id ) );
	};

	function deleteClient( client ) {
		//delete user from the map
		clients.delete( client.id );
	};

	return { addClient, deleteClient };
}
