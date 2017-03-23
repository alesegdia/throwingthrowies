/// <reference path="../lib/phaser/typescript/phaser.d.ts" />

module Famjam8 {

	class Cloud {

		_sprite:Phaser.Sprite

		constructor(game: Phaser.Game, pos_x: number, pos_y: number) {
			this._sprite = game.add.sprite(pos_x, pos_y, 'cloud');
			var t = 1000;
			var tween = game.add.tween(this._sprite).to({ y: pos_y - 20 }, t, Phaser.Easing.Cubic.In, true);
			tween.onComplete.addOnce(() => {
				this._sprite.destroy();
			});
		}

	}

	class ScorePopup {

		_text:Phaser.Text

		constructor(game: Phaser.Game, pos_x: number, pos_y: number, points: number) {
			this._text= game.add.text(pos_x, pos_y, "+" + points.toString(), { font: "60px Arial", fill: "#000"});
			var t = 500;
			var tween = game.add.tween(this._text).to({ y: pos_y - 20 }, t, Phaser.Easing.Cubic.Out, true);
			tween.onComplete.addOnce(() => {
				this._text.destroy();
			});
		}

	}

	class Throwie {

		_sprite: Phaser.Sprite
		_game: Phaser.Game
		_dead: boolean
		_tweenScale: Phaser.Tween
		_tweenMovement: Phaser.Tween
		_didPoint: boolean

		public x() {
				return this._sprite.x;
		}

		public y() {
				return this._sprite.y;
		}

		_smashed : boolean

		public smashed() : boolean {
			return this._smashed;
		}

		constructor(game : Phaser.Game) {
			var self = this;
			this._dead = false;
			this._smashed = false;
			this._game = game;
			this._sprite = this._game.add.sprite(-150, -40, 'player-sheet');
			this._sprite.renderOrderID = 100;
			this._sprite.scale.x = 0.2;
			this._sprite.scale.y = 0.2;

			var t = game.rnd.integerInRange(500, 2000);

			this._tweenScale = this._game.add.tween(this._sprite).to({ x: this._game.width, y: this._game.height-340 }, t, Phaser.Easing.Cubic.In, true);
			this._tweenMovement = this._game.add.tween(this._sprite.scale).to({ x: 1.4, y: 1.4 }, t, Phaser.Easing.Cubic.In, true);

			this._tweenMovement.onComplete.addOnce(function() {
				self._dead = true;
				self._smashed = true;
			}, this);

		}

		public didPoint() : boolean {
			return this._didPoint;
		}

		public points() : number {
			return this._points;
		}

		_points : number

		public update() : void {
			if( this._sprite.x > 500 && this._sprite.y > 500 ) {
				this.explode();
				this.destroy();
				this._didPoint = true;
				this._points = Math.round((128 / (this.distance())));
			}
		}

		// returns distance to center
		distance() : number {
			var x1, y1, x2, y2, dx, dy;
			x1 = this._sprite.x;
			y1 = this._sprite.y;
			x2 = 600;
			y2 = 530;
			dx = Math.abs(x1 - x2);
			dy = Math.abs(y1 - y2);
			return Math.sqrt(dx * dx + dy * dy);
		}

		public dead() : boolean {
			return this._dead;
		}

		private explode() : void {
			new Cloud(this._game, this._sprite.x, this._sprite.y);
		}

		public destroy() {
			this._sprite.destroy();
			this._dead = true;
		}

		public fall() {
			this._tweenScale.stop();
			this._tweenMovement.stop();

			var t = 500;
			this._tweenMovement = this._game.add.tween(this._sprite).to({ y: this._sprite.y + 500, x: this._sprite.x + 300 }, t, Phaser.Easing.Quadratic.In, true);
			this._tweenScale = this._game.add.tween(this._sprite.scale).to({ y: 0.1, x: 0.1 }, t, Phaser.Easing.Cubic.In, true);

			this._tweenMovement.onComplete.addOnce(() => {
				this.destroy()
			});
			/*debugger;
			this._tweenMovement = this._game.add.tween(this._sprite).to({ y: this._sprite.y + 300, x: this._sprite.x + 300 });
			this._tweenMovement.onComplete.addOnce(() => { this._dead = true; });*/
		}

	}

	export class Game {
		game: Phaser.Game;
		constructor() {
			this.game = new Phaser.Game(800, 600, Phaser.CANVAS, 'content');
			this.game.state.add("GameplayState", GameplayState, false);
			this.game.state.start("GameplayState", true, true);
		}
	}

	export class GameplayState extends Phaser.State {
		game: Phaser.Game;
		throwies: Throwie[];
		constructor() {
			super();
		}
		preload() {
			this.game.load.image('diana', 'assets/diana.png');
			this.game.load.image('montanias', 'assets/montanias.png');
			this.game.load.image('cuerda', 'assets/cuerda.png');
			this.game.load.image('cloud', 'assets/nube.png');
			this.game.load.spritesheet('player-sheet', 'assets/throwies.png', 200, 200, 2);
			this.game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
			this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;
			this.game.scale.startFullScreen();
			this.game.scale.refresh();
			this.game.load.audio('wilhelm', 'assets/wilhelm.mp3');
			this.game.load.audio('ok', 'assets/ok.wav');
			this.game.load.audio('fallen', 'assets/fallen.wav');
			this.game.load.audio('smash', 'assets/smash.wav');
			this.game.scale.forcePortrait = true;

		}
		throwThrowie () {
			console.log("throwing throwie");
		}

		lastPoints : number
		create() {
			var diana = this.game.add.sprite( 641, 551, 'diana' );
			diana.anchor.setTo(0.5, 0.5);

			var montanias = this.game.add.sprite(256, 558, 'montanias');
			montanias.anchor.setTo(0.5, 0.5);

			var cuerda = this.game.add.sprite(0, -138, 'cuerda');
			cuerda.anchor.setTo(0, 0);

			this.lastPoints = 60;

			cuerda.renderOrderID = 99;

			this.game.stage.backgroundColor = "#5fcde4";

			this.throwies = [];
			this.throwies.push(new Throwie(this.game));

			var self = this;
			var wilhelm_sound = this.game.add.audio('wilhelm');
			this.game.input.onDown.add(function(evt){
				self.throwies[0].fall();
				wilhelm_sound.play();
			}, this);

			this._sound = this.game.add.audio("ok", 0.5);
			this._fallen = this.game.add.audio("fallen", 0.5);
			this._smash = this.game.add.audio("smash", 0.2);

			this.texto= this.game.add.text(650, 50, (0).toString(), { font: "35px Arial", fill: "#000"});

		}
		texto : Phaser.Text

		_sound : Phaser.Sound
		_fallen : Phaser.Sound
		_smash : Phaser.Sound

		update() {
			console.log("update");
			if( this.throwies[0].dead() == true ) {
				if( this.throwies[0].didPoint() ) {
					this._sound.play();
					new ScorePopup(this.game, this.throwies[0].x()+10, this.throwies[0].y() - 50, this.throwies[0].points());
					this.lastPoints = this.lastPoints + this.throwies[0].points();
				} else if( this.throwies[0].smashed() ){
					this._smash.play();
				} else {
					this.lastPoints -= 4;
					this._fallen.play();
				}
				this.texto.setText(this.lastPoints.toString());
				this.throwies[0].destroy();
				this.throwies.pop();
				this.throwies.push(new Throwie(this.game));
			}
			this.throwies[0].update();
		}

		render() {
			this.game.debug.font = "90px Courier";
			this.game.debug.font = "14px Sans";
			//this.game.debug.text(this.lastPoints.toString(), 100, 100, "black");
		}

	}
}

window.onload = () => {
	var game = new Famjam8.Game();
}
