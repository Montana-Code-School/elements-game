module.exports = function () {
	const clients = new Map();
	function addClient( client ) {
		clients.set( client.id, { client } );
	}
	function deleteClient( client ) {
		clients.delete( client.id );
	}
	return { addClient, deleteClient, };
}
