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
	constructor( clientInfo, clientId ) {
		this.clientInfo = clientInfo;
		this.clientId = clientId;
		this.deck = new Pile( 5, 5, 5, 5, 5 );
		this.field = new Pile( 0, 0, 0, 0, 0 );
		this.hand = new Pile( 0, 0, 0, 0, 0 );
		this.discard = new Pile( 0, 0, 0, 0, 0 );
		this.stagedCard = "empty";
	}
}
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
	Player,
}
