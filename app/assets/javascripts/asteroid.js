(function(root){
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Asteroid = Asteroids.Asteroid = function (pos, vel, radius) {
    this.pos = pos;
    this.vel = vel;
    this.radius = radius;
    this.delete = false;
    this.explosion = null;
    this.turnSpeed = (Math.random() * 0.2 - 0.1)
    this.direction = Math.random() * (Math.PI + 1);
  };

  Asteroids.inherits(Asteroid, Asteroids.MovingObject);

  Asteroid.prototype.draw = function(ctx) {
    var img = document.getElementById("grump");
                  
    var xOffset = img.width / -2;
    var yOffset = img.height / -2;
    
    this.direction += this.turnSpeed
    
    ctx.save();
    ctx.translate(this.pos[1], this.pos[0]);
    ctx.scale(this.radius/150, this.radius/150);
    ctx.rotate(this.direction);
    ctx.drawImage(img, xOffset, yOffset);
    ctx.restore();
    
    if (this.delete) {
      this.explosion = new Asteroids.Explosion([this.pos[0], this.pos[1]], this.radius);
    }
  };
  
  Asteroid.prototype.makeBabies = function(game) {
    var num = (this.radius === 50 ? 2 : 3)
    if (this.radius > 30) {
      for (var i = 0; i < num; i++) {
        var vel = Asteroid.randomVec();
        var pos = [this.pos[0], this.pos[1]]
        var baby = new Asteroid(pos, vel, this.radius - 10);
        game.asteroids.push(baby);
      }
    }
  };

  Asteroid.randomAsteroid = function (dimX, dimY) {
    var randPosY = Math.floor(Math.random() * (dimY + 1));
    var randPosX = Math.floor(Math.random() * (dimX + 1));
    if (randPosY % 2 === 0) {
      randPosY = 0;
    } else { randPosX = 0; }
    var pos = [randPosY, randPosX];
    var vel = Asteroid.randomVec();
    return new Asteroid(pos, vel, 50);
  };

  Asteroid.randomVec = function () {
    randVelY = (Math.random() * (5) - 2);
    randVelX = (Math.random() * (5) - 2);
    return [randVelY, randVelX];
  }
})(this);