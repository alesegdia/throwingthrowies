var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Famjam8;
(function (Famjam8) {
    var Cloud = (function () {
        function Cloud(game, pos_x, pos_y) {
            var _this = this;
            this._sprite = game.add.sprite(pos_x, pos_y, 'cloud');
            var t = 1000;
            var tween = game.add.tween(this._sprite).to({ y: pos_y - 20 }, t, Phaser.Easing.Cubic.In, true);
            tween.onComplete.addOnce(function () {
                _this._sprite.destroy();
            });
        }
        return Cloud;
    }());
    var ScorePopup = (function () {
        function ScorePopup(game, pos_x, pos_y, points) {
            var _this = this;
            this._text = game.add.text(pos_x, pos_y, "+" + points.toString(), { font: "60px Arial", fill: "#000" });
            var t = 500;
            var tween = game.add.tween(this._text).to({ y: pos_y - 20 }, t, Phaser.Easing.Cubic.Out, true);
            tween.onComplete.addOnce(function () {
                _this._text.destroy();
            });
        }
        return ScorePopup;
    }());
    var Throwie = (function () {
        function Throwie(game) {
            var self = this;
            this._dead = false;
            this._smashed = false;
            this._game = game;
            this._sprite = this._game.add.sprite(-150, -40, 'player-sheet');
            this._sprite.renderOrderID = 100;
            this._sprite.scale.x = 0.2;
            this._sprite.scale.y = 0.2;
            var t = game.rnd.integerInRange(500, 2000);
            this._tweenScale = this._game.add.tween(this._sprite).to({ x: this._game.width, y: this._game.height - 340 }, t, Phaser.Easing.Cubic.In, true);
            this._tweenMovement = this._game.add.tween(this._sprite.scale).to({ x: 1.4, y: 1.4 }, t, Phaser.Easing.Cubic.In, true);
            this._tweenMovement.onComplete.addOnce(function () {
                self._dead = true;
                self._smashed = true;
            }, this);
        }
        Throwie.prototype.x = function () {
            return this._sprite.x;
        };
        Throwie.prototype.y = function () {
            return this._sprite.y;
        };
        Throwie.prototype.smashed = function () {
            return this._smashed;
        };
        Throwie.prototype.didPoint = function () {
            return this._didPoint;
        };
        Throwie.prototype.points = function () {
            return this._points;
        };
        Throwie.prototype.update = function () {
            if (this._sprite.x > 500 && this._sprite.y > 500) {
                this.explode();
                this.destroy();
                this._didPoint = true;
                this._points = Math.round((128 / (this.distance())));
            }
        };
        Throwie.prototype.distance = function () {
            var x1, y1, x2, y2, dx, dy;
            x1 = this._sprite.x;
            y1 = this._sprite.y;
            x2 = 600;
            y2 = 530;
            dx = Math.abs(x1 - x2);
            dy = Math.abs(y1 - y2);
            return Math.sqrt(dx * dx + dy * dy);
        };
        Throwie.prototype.dead = function () {
            return this._dead;
        };
        Throwie.prototype.explode = function () {
            new Cloud(this._game, this._sprite.x, this._sprite.y);
        };
        Throwie.prototype.destroy = function () {
            this._sprite.destroy();
            this._dead = true;
        };
        Throwie.prototype.fall = function () {
            var _this = this;
            this._tweenScale.stop();
            this._tweenMovement.stop();
            var t = 500;
            this._tweenMovement = this._game.add.tween(this._sprite).to({ y: this._sprite.y + 500, x: this._sprite.x + 300 }, t, Phaser.Easing.Quadratic.In, true);
            this._tweenScale = this._game.add.tween(this._sprite.scale).to({ y: 0.1, x: 0.1 }, t, Phaser.Easing.Cubic.In, true);
            this._tweenMovement.onComplete.addOnce(function () {
                _this.destroy();
            });
        };
        return Throwie;
    }());
    var Game = (function () {
        function Game() {
            this.game = new Phaser.Game(800, 600, Phaser.CANVAS, 'content');
            this.game.state.add("GameplayState", GameplayState, false);
            this.game.state.start("GameplayState", true, true);
        }
        return Game;
    }());
    Famjam8.Game = Game;
    var GameplayState = (function (_super) {
        __extends(GameplayState, _super);
        function GameplayState() {
            return _super.call(this) || this;
        }
        GameplayState.prototype.preload = function () {
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
        };
        GameplayState.prototype.throwThrowie = function () {
            console.log("throwing throwie");
        };
        GameplayState.prototype.create = function () {
            var diana = this.game.add.sprite(641, 551, 'diana');
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
            this.game.input.onDown.add(function (evt) {
                self.throwies[0].fall();
                wilhelm_sound.play();
            }, this);
            this._sound = this.game.add.audio("ok", 0.5);
            this._fallen = this.game.add.audio("fallen", 0.5);
            this._smash = this.game.add.audio("smash", 0.2);
            this.texto = this.game.add.text(650, 50, (0).toString(), { font: "35px Arial", fill: "#000" });
        };
        GameplayState.prototype.update = function () {
            console.log("update");
            if (this.throwies[0].dead() == true) {
                if (this.throwies[0].didPoint()) {
                    this._sound.play();
                    new ScorePopup(this.game, this.throwies[0].x() + 10, this.throwies[0].y() - 50, this.throwies[0].points());
                    this.lastPoints = this.lastPoints + this.throwies[0].points();
                }
                else if (this.throwies[0].smashed()) {
                    this._smash.play();
                }
                else {
                    this.lastPoints -= 4;
                    this._fallen.play();
                }
                this.texto.setText(this.lastPoints.toString());
                this.throwies[0].destroy();
                this.throwies.pop();
                this.throwies.push(new Throwie(this.game));
            }
            this.throwies[0].update();
        };
        GameplayState.prototype.render = function () {
            this.game.debug.font = "90px Courier";
            this.game.debug.font = "14px Sans";
        };
        return GameplayState;
    }(Phaser.State));
    Famjam8.GameplayState = GameplayState;
})(Famjam8 || (Famjam8 = {}));
window.onload = function () {
    var game = new Famjam8.Game();
};
