// class pile that being used to represent deck,hand,field
// and discard
class Pile {
	constructor( fire, water, light, shadow, earth ) {
		this.fire = fire;
		this.water = water;
		this.light = light;
		this.shadow = shadow;
		this.earth = earth;
	}
}

// class player that keeps information about each user
// separately
class Player {
	constructor( clientInfo, clientId ) {
		this.clientInfo = clientInfo;
		this.clientId = clientId;
		this.deck = new Pile( 5, 5, 5, 5, 5 );
		this.field = new Pile( 0, 0, 0, 0, 0 );
		this.hand = new Pile( 0, 0, 0, 0, 0 );
		this.discard = new Pile( 0, 0, 0, 0, 0 );
		this.stagedCard = "";
	}
}

// class room that contain information about one playing
// room and both users in it
class Room {
	constructor( roomName, clientInfo ) {
		this.name = roomName;
		this.turn = clientInfo.id;
		this.afterFlip = null;
		this.player1 = new Player( clientInfo, clientInfo.id );
		this.player2 = null;
	}
}

module.exports = {
	Room,
	Player
}
