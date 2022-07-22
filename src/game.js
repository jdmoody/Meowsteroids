(function (root) {
  var Asteroids = (root.Asteroids = root.Asteroids || {});

  var Game = (Asteroids.Game = function (canvasEl) {
    this.ctx = canvasEl.getContext("2d");
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
    Game.DIM_Y = window.innerHeight;
    Game.DIM_X = window.innerWidth;
    canvasEl.width = Game.DIM_X;
    canvasEl.height = Game.DIM_Y - 5;
    this.ship = new Asteroids.Ship();
    this.asteroids = this.addAsteroids(4);
    this.timer = Date.now();
    this.points = 0;
    this.level = 0;
    this.muted = false;
    this.audioPlayer = new Asteroids.AudioPlayer();
    game = this;
  });

  Game.FPS = 16;

  Game.prototype.addAsteroids = function (numAsteroids) {
    var asteroids = [];
    for (var i = 0; i < numAsteroids; i++) {
      var new_asteroid = Asteroids.Asteroid.randomAsteroid(
        Game.DIM_X,
        Game.DIM_Y
      );
      if (!this.ship.isCollidedWith(new_asteroid)) {
        asteroids.push(new_asteroid);
      } else {
        i--;
      }
    }
    return asteroids;
  };

  Game.prototype.checkKeys = function () {
    var my_game = this;
    if (key.isPressed("up")) this.ship.power(0.15);
    if (key.isPressed("left")) this.ship.turn(-0.75);
    if (key.isPressed("right")) this.ship.turn(0.75);
    if (key.isPressed("space")) this.ship.fireBullet(this.audioPlayer);
  };

  Game.prototype.checkCollisions = function () {
    for (var i = 0; i < this.asteroids.length; i++) {
      if (this.ship.isCollidedWith(this.asteroids[i])) {
        this.endRun();
      }
    }
    if (this.powerup && this.ship.isCollidedWith(this.powerup)) {
      this.activatePowerup();
      this.powerup = null;
    }
  };

  Game.prototype.endRun = function () {
    this.timer = Date.now() - this.timer;
    this.stop();
    // this.meow.pause();
    // this.meow.currentTime = 0;
    this.audioPlayer.pauseMusic();
    this.audioPlayer.restartMusic();
    this.userInput = "";
  };

  Game.prototype.restart = function () {
    this.stop();
    key.unbind("enter");
    this.audioPlayer.pauseMusic();
    this.ship = new Asteroids.Ship();
    this.asteroids = this.addAsteroids(4);
    this.timer = Date.now();
    this.points = 0;
    this.level = 0;
    this.start();
  };

  Game.prototype.removeAsteroids = function () {
    for (var i = 0; i < this.asteroids.length; i++) {
      if (this.asteroids[i].delete === true) {
        this.points++;
        this.audioPlayer.playExplosion();
        var oldAst = this.asteroids.splice(i, 1)[0];
        oldAst.makeBabies(this);
      }
    }
  };

  Game.prototype.removeBullets = function () {
    for (var i = 0; i < this.ship.bullets.length; i++) {
      if (this.ship.bullets[i].delete === true) {
        this.ship.bullets.splice(i, 1);
      }
    }
  };

  Game.prototype.addPowerup = function () {
    if (
      (Math.floor((Date.now() - this.timer) / 1000) % 60 == 0 ||
        this.points % 25 == 0) &&
      !this.powerup
    ) {
      this.powerup = new Asteroids.Powerup(Game.DIM_X, Game.DIM_Y);
    }
  };

  Game.prototype.activatePowerup = function () {
    var game = this;
    this.audioPlayer.playPowerupSound();
    this.ship.hyperBullets = true;
    setTimeout(function () {
      game.ship.hyperBullets = false;
    }, 5000);
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.asteroids.forEach(function (asteroid) {
      asteroid.draw(ctx);

      if (asteroid.explosion) {
        asteroid.explosion.draw(ctx);
      }
    });

    this.ship.bullets.forEach(function (bullet) {
      bullet.draw(ctx);
    });

    this.ship.rainbows.forEach(function (rainbow) {
      rainbow.draw(ctx);
    });

    this.ship.draw(ctx);

    if (this.powerup) {
      this.powerup.draw(ctx);
    }
  };

  Game.prototype.move = function () {
    this.asteroids.forEach(function (asteroid) {
      asteroid.move(Game.DIM_Y, Game.DIM_X);
    });

    this.ship.move(Game.DIM_Y, Game.DIM_X);
    this.ship.createRainbow();

    var game = this;
    this.ship.bullets.forEach(function (bullet) {
      bullet.move(Game.DIM_Y, Game.DIM_X);
      bullet.hitAsteroids(game.asteroids, game);
    });
  };

  Game.prototype.showTime = function (ctx) {
    var seconds = Math.floor((Date.now() - this.timer) / 1000);
    ctx.fillStyle = "black";
    ctx.font = "25px Atari";
    ctx.fillText(seconds, 5, 30);
  };

  Game.prototype.showPoints = function (ctx) {
    ctx.fillStyle = "black";
    ctx.font = "25px Atari";
    ctx.fillText("Points:" + this.points, 5, Game.DIM_Y - 5);
  };

  Game.prototype.showMute = function (ctx) {
    ctx.fillStyle = "black";
    ctx.font = "25px Atari";

    if (this.audioPlayer.muted) {
      ctx.fillText("Un(m)ute", Game.DIM_X - 200, 30);
    } else {
      ctx.fillText("(M)ute", Game.DIM_X - 175, 30);
    }
  };

  Game.prototype.muteGame = function () {
    this.audioPlayer.muted = !this.audioPlayer.muted;
    this.audioPlayer.muteMusic();
  };

  Game.prototype.incrementLevel = function () {
    if (this.asteroids.length === 0) {
      this.level++;
      this.asteroids = this.addAsteroids(5 + this.level * 3);
    }
  };

  Game.prototype.step = function (ctx) {
    this.move();
    this.draw(ctx);
    this.removeBullets();
    this.removeAsteroids();
    this.incrementLevel();
    this.showTime(ctx);
    this.showPoints(ctx);
    this.showMute(ctx);
    this.addPowerup();
    this.checkCollisions();
    this.checkKeys();
  };

  Game.prototype.run = function () {
    var game = this;

    window.onload = function () {
      game.ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      game.ctx.fillRect(Game.DIM_X / 2 - 400, Game.DIM_Y / 2 - 100, 740, 200);
      game.ctx.fillStyle = "black";
      game.ctx.font = "25px Atari";
      game.ctx.fillText(
        "Welcome to Meowsteroids!",
        Game.DIM_X / 2 - 325,
        Game.DIM_Y / 2
      );
      game.ctx.fillText(
        "Press Enter to Play",
        Game.DIM_X / 2 - 270,
        Game.DIM_Y / 2 + 40
      );

      key("enter", function () {
        game.start();
      });
    };
  };

  Game.prototype.start = function () {
    key.unbind("enter");
    key("m", function (event, handler) {
      game.muteGame();
    });
    var ctx = this.ctx;
    var game = this;
    this.game_timer = window.setInterval(function () {
      game.step(ctx);
    }, Game.FPS);
    this.audioPlayer.playMusic();
  };

  Game.prototype.stop = function () {
    clearInterval(this.game_timer);
  };
})(this);
