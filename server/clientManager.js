const classes = require( "./roomAndPlayerClasses" )
const { Player } = classes;
module.exports = function () {
	const clients = new Map();
	function addClient( client ) {
		clients.set( client.id, new Player( client, client.id ) );
	}
	function getPlayerByClientId( clientId ) {
		return ( clients.get( clientId ) || {} )
	}
	function deleteClient( client ) {
		clients.delete( client.id );
	}
	return { addClient, deleteClient, getPlayerByClientId };
}
