const userTemplates = require( '../config/users' )

module.exports = function () {
	// mapping of all connected clients
	const clients = new Map()

	function addClient( client ) {
		clients.set( client.id, { client } )
	}

	function removeClient( client ) {
		clients.delete( client.id )
	}

	function getAvailableUsers() {
		const usersTaken = new Set( Array.from( clients.values() ).filter( c => c.user ).map( c => c.user.name ) )
		return userTemplates.filter( u => !usersTaken.has( u.name ) )
	}

	function getUserByClientId( clientId ) {
		return ( clients.get( clientId ) || {} ).user
	}

	return { addClient, removeClient, getUserByClientId }
}
