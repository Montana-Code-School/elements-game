module.export = function () {
	const clients = new Map();
	addClient( client ) {
		this.clients.set( client.id, { client } );
	}
	deleteClient( client ) {
		this.clients.delete( client.id );
	}
	return { addClient, deleteClient, };
}
