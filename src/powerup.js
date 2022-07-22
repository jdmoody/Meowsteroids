(function(root){
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Powerup = Asteroids.Powerup = function (dimX, dimY) {
    var randPosY = Math.floor(Math.random() * (dimY + 1));
    var randPosX = Math.floor(Math.random() * (dimX + 1));
    this.pos = [randPosY, randPosX];
    this.vel = [0, 0];
    this.growing = true;
    this.turnRight = true;
    this.radius = 35;
    this.direction = 0;
  };

  Asteroids.inherits(Powerup, Asteroids.MovingObject);

  Powerup.prototype.draw = function(ctx) {
    var img = document.getElementById("catnip");
                  
    var xOffset = img.width / -2;
    var yOffset = img.height / -2;
    
    if (this.growing) {
      this.radius++;
    } else {
      this.radius--;
    }
    
    if (this.radius >= 70) {
      this.growing = false;
    } else if (this.radius <= 40) {
      this.growing = true;
    }
    
    if (this.turnRight) {
      this.direction++;
    } else {
      this.direction--;
    }
    
    if (this.direction <= -10) {
      this.turnRight = true;
    } else if (this.direction >= 10){
      this.turnRight = false;
    }
    
    ctx.save();
    ctx.translate(this.pos[1], this.pos[0]);
    ctx.scale(this.radius/50, this.radius/50);
    ctx.rotate(this.direction/50);
    ctx.drawImage(img, xOffset, yOffset);
    ctx.restore();
  };
})(this);