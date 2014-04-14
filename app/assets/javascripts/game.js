(function(root){
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Game = Asteroids.Game = function(canvasEl) {
    this.ctx = canvasEl.getContext("2d");
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
    Game.DIM_Y = window.innerHeight;
    Game.DIM_X = window.innerWidth;
    canvasEl.width = Game.DIM_X;
    canvasEl.height = Game.DIM_Y - 5;
    this.ship = new Asteroids.Ship();
    this.asteroids = this.addAsteroids(5);
    this.timer = Date.now();
    this.points = 0;
    this.level = 0;
    this.muted = false
    game = this;
    $('body').on('keydown', function(event) {
      if (event.keyCode == 77) {
        game.muteGame();
      }
    });
  };

  Game.FPS = 16;

  Game.prototype.addAsteroids = function(numAsteroids) {
    var asteroids = [];
    for(var i = 0; i < numAsteroids; i++){
      var new_asteroid = Asteroids.Asteroid.
                         randomAsteroid(Game.DIM_X, Game.DIM_Y);
      if (!this.ship.isCollidedWith(new_asteroid)) {
        asteroids.push(new_asteroid);
      }
      else {
        i--;
      }
    };
    return asteroids;
  };

  Game.prototype.checkKeys = function() {
    var my_game = this;
    if(key.isPressed("up")) this.ship.power(0.15);
    if(key.isPressed("left")) this.ship.turn(-0.75);
    if(key.isPressed("right")) this.ship.turn(0.75);
    if(key.isPressed("space")) this.ship.fireBullet();
  }

  Game.prototype.checkCollisions = function() {
    for(var i = 0; i < this.asteroids.length; i++){
      if (this.ship.isCollidedWith(this.asteroids[i])) {
        this.timer = Date.now() - this.timer;
        this.stop();
        this.meow.pause();
        this.meow.currentTime = 0;
        var game = this;
        this.userInput = '';
        key('enter', function() { game.restart(); });
        var highscores;
        $.ajax({
          type: "GET",
          dataType: "json",
          url: "/highscores/",
          success: function (data) {
            game.highScores = data;
            game.handleScores();
          }
        });
      }
    };
    if (this.powerup && this.ship.isCollidedWith(this.powerup)) {
      this.activatePowerup();
      this.powerup = null;
    }
  };
  
  Game.prototype.handleScores = function() {
    var game = this;
    
    this.highScores.forEach(function(score) {
      console.log(score.initials);
      console.log(score.score);
    });
    
    if (this.isHighScore()) {
      this.deathMessage("You got a high score!");
      key('a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,backspace',
           function(event, handler) {
             event.preventDefault();
             game.inputInitial(handler.shortcut);
      });
    } else {
      this.deathMessage("You've been overwhelmed by grumpiness!");
    }
    
    // $.ajax({
    //   url: "/highscores/",
    //   type: "POST",
    //   data: {
    //     initials: input.value(),
    //     score: game.points
    //   },
    //   complete: function () {
    //     
    //   }
    
    
  };
  
  Game.prototype.inputInitial = function (keyPressed) {
    if (keyPressed === 'backspace' && this.userInput.length > 0) {
      this.userInput = this.userInput.substring(0, this.userInput.length - 1);
    } else if (keyPressed !== 'backspace' && this.userInput.length < 3) {
      this.userInput += keyPressed.toUpperCase();
    }
    
    this.drawInitials();
  };
  
  Game.prototype.drawInitials = function () {
    var inputText = '';
    for (var i = 0; i < 3; i++) {
      inputText += (this.userInput[i]) ? this.userInput[i] : '_';
      inputText += (i !== 2) ? ' ' : '';
    }
    this.ctx.fillStyle = "#FFFFFF"
    this.ctx.fillRect(Game.DIM_X/2, Game.DIM_Y/2 + 155, 100, 50)
    this.ctx.fillStyle = "#111111"
    this.ctx.fillText(inputText, Game.DIM_X/2, Game.DIM_Y/2 + 180);
  };
  
  Game.prototype.isHighScore = function() {
    if (this.highScores.length < 10 && this.points > 0) {
      return true;
    } else if (this.points > this.highScores[this.highScores.length - 1].score) {
      return true;
    }
    return false;
  };
  
  Game.prototype.deathMessage = function(msg) {
    var tryAgain = "(Press Enter to try again)";
    this.ctx.fillStyle = "black";
    this.ctx.font = '16px Atari';
    this.ctx.fillText(msg, Game.DIM_X/2 - 325, Game.DIM_Y/2);
    this.ctx.fillText(tryAgain, Game.DIM_X/2 - 250, Game.DIM_Y/2 + 25) 
  }
  
  Game.prototype.restart = function() {
    this.stop();
    key.unbind('enter');
    this.meow.pause();
    this.ship = new Asteroids.Ship();
    this.asteroids = this.addAsteroids(5);
    this.timer = Date.now();
    this.points = 0;
    this.level = 0;
    this.start();
  }

  Game.prototype.removeAsteroids = function() {
    for(var i = 0; i < this.asteroids.length; i++) {
      if (this.asteroids[i].delete === true) {
        this.points++;
        var boom = new Audio("audios/explosion.wav");
        boom.volume = 0.20;
        boom.play();
        var oldAst = this.asteroids.splice(i, 1)[0];
        oldAst.makeBabies(this);
      }
    }
    
  };

  Game.prototype.removeBullets = function() {
    for(var i = 0; i < this.ship.bullets.length; i++) {
      if (this.ship.bullets[i].delete === true) {
        this.ship.bullets.splice(i, 1);
      }
    }
  };
  
  Game.prototype.addPowerup = function () {
    if (((Math.floor((Date.now() - this.timer) / 1000)) % 60 == 0 || 
        this.points % 25 == 0) &&
        !this.powerup) {
      this.powerup = new Asteroids.Powerup(Game.DIM_X, Game.DIM_Y);
    }
  };
  
  Game.prototype.activatePowerup = function () {
    var game = this;
    var bloop = new Audio("audios/bloop.wav");
    bloop.volume = 0.5;
    bloop.play();
    this.ship.hyperBullets = true;
    setTimeout(function () {
      game.ship.hyperBullets = false;
    }, 5000);
  };

  Game.prototype.draw = function(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.asteroids.forEach(function (asteroid) {
      asteroid.draw(ctx);
      
      if (asteroid.explosion) {
        asteroid.explosion.draw(ctx);
      }
    });

    this.ship.bullets.forEach( function(bullet){
      bullet.draw(ctx);
    });

    this.ship.draw(ctx);
    
    if (this.powerup) {
      this.powerup.draw(ctx);
    }
  };

  Game.prototype.move = function() {
    this.asteroids.forEach(function (asteroid) {
      asteroid.move(Game.DIM_Y, Game.DIM_X);
    });

    this.ship.move(Game.DIM_Y, Game.DIM_X);

    var game = this;
    this.ship.bullets.forEach( function(bullet) {
      bullet.move(Game.DIM_Y, Game.DIM_X);
      bullet.hitAsteroids(game.asteroids, game);
    });
  };
  
  Game.prototype.showTime = function(ctx) {
    var seconds = Math.floor((Date.now() - this.timer) / 1000);
    ctx.fillStyle = "black";
    ctx.font = '25px Atari';
    ctx.fillText(seconds, 5, 30); 
  };
  
  Game.prototype.showPoints = function(ctx) {
    ctx.fillStyle = "black";
    ctx.font = '25 px Atari';
    ctx.fillText("Points:" + this.points, 5, Game.DIM_Y - 5)
  };
  
  Game.prototype.showMute = function (ctx) {
    ctx.fillStyle = "black";
    ctx.font = '25 px Atari';
    
    if (this.muted) {
      ctx.fillText("Un(m)ute", Game.DIM_X - 200, 30);
      ctx.fillText("Music", Game.DIM_X - 150, 60);
    } else {
      ctx.fillText("(M)ute", Game.DIM_X - 175, 30);
      ctx.fillText("Music", Game.DIM_X - 150, 60);
    }
  };
  
  Game.prototype.muteGame = function () {
    var game = this;
    $('audio').each(function() {
      if (game.muted) {
        this.muted = false;
      } else {
        this.muted = true;
      }
    });
    this.muted = !this.muted;
  };
  
  Game.prototype.incrementLevel = function() {
    if (this.asteroids.length === 0) {
      this.level++;
      this.asteroids = this.addAsteroids(5 + this.level * 3);
    }
  };

  Game.prototype.step = function(ctx) {
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
  
  Game.prototype.startMeow = function() {
    this.meow = document.getElementById("meow");
    this.meow.volume = 0.25;
    this.meow.play();
  };

  Game.prototype.start = function(canvasEl) {
    var ctx = this.ctx
    ctx.fillText("Music", Game.DIM_X - 200, 60);
    var game = this;
    this.game_timer = window.setInterval(function () {
      game.step(ctx);
    }, Game.FPS);
    this.startMeow();
  };

  Game.prototype.stop = function() {
    clearInterval(this.game_timer);
  };

})(this);