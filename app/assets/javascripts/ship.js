(function(root){
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Ship = Asteroids.Ship = function () {
    this.pos = [Asteroids.Game.DIM_Y / 2, Asteroids.Game.DIM_X / 2];
    this.vel = [0, 0];
    this.direction = Math.PI/2;
    
    this.recharge = Date.now();
    this.radius = 10;
    this.bullets = [];
    this.hyperBullets = false;
  };

  Asteroids.inherits(Ship, Asteroids.MovingObject);

  Ship.prototype.draw = function(ctx) {
    var img = document.getElementById("nyan");
                  
    var xOffset = img.width / -2;
    var yOffset = img.height / -2;
    ctx.save();
    ctx.translate(this.pos[1], this.pos[0]);
    ctx.rotate(this.direction);
    ctx.drawImage(img, xOffset, yOffset);
    ctx.restore();
  };

  Ship.prototype.power = function(dir) {
    this.vel[0] += dir * -Math.sin(this.direction);
    this.vel[1] += dir * -Math.cos(this.direction);
  };

  Ship.prototype.turn = function(dir) {
    this.direction += dir / 5;
  };

  Ship.prototype.fireBullet = function(audioPlayer) {
    if (((Date.now() - this.recharge) > 200) || this.hyperBullets) {
      this.recharge = Date.now();
      var bullet = new Asteroids.Bullet(this.pos, this.direction);
      this.bullets.push(bullet);
      
      audioPlayer.playBulletSound();
    }
  };

})(this);