/// <reference path="../lib/phaser/typescript/phaser.d.ts" />

class MyGame {

	constructor() {
		this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create } );
	}

	game: Phaser.Game;

	preload() {
		this.game.load.image('ball', 'assets/diana.png');
	}

	create() {
		var ball = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'ball' );
		ball.anchor.setTo(0.5, 0.5);
	}

}

window.onload = () => {
	var game = new MyGame();
}
