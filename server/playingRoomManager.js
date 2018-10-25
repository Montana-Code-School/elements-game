module.export = function () {
	class DataStore {
		constructor() {
			this.rooms = new Map();
			this.clients = new Map();
		};
		getRoomById( roomName ) {
			this
				.rooms
				.filter( room => room.name === roomName );
		};
		addRoom( room ) {
			this
				.rooms
				.set( room.name, { room } )
		};
		deleteRoom( room ) {
			this
				.rooms
				.delete( room.name );
		}
		addClient( client ) {
			this
				.clients
				.set( client.id, { client } );
		}
		deleteClient( client ) {
			this
				.clients
				.delete( client.id );
		}
	}
	data = new DataStore
	class Pile {
		constructor( fire, water, light, shadow, earth ) {
			this.fire = fire;
			this.water = water;
			this.light = light;
			this.shadow = shadow;
			this.earth = earth;
		}
	}
	class Player {
		constructor() {
			this.deck = new Pile( 5, 5, 5, 5, 5 );
			this.field = new Pile( 0, 0, 0, 0, 0 );
			this.hand = new Pile( 0, 0, 0, 0, 0 );
			this.discard = new Pile( 0, 0, 0, 0, 0 );
			this.stagedCard = "empty";
		}
	}
	class Room {
		constructor( name ) {
			this.name = name;
			this.player1 = new Player;
			this.player2 = new Player;
			this.turn = "player1";
		}
	}
	return { Room }
}
