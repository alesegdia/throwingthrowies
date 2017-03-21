var MyGame = (function () {
    function MyGame() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
    }
    MyGame.prototype.preload = function () {
        this.game.load.image('ball', 'assets/diana.png');
    };
    MyGame.prototype.create = function () {
        var ball = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'ball');
        ball.anchor.setTo(0.5, 0.5);
    };
    return MyGame;
}());
window.onload = function () {
    var game = new MyGame();
};
