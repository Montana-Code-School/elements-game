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
		this.id = "";
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
module.exports = {
	Room,
	Player,
}
