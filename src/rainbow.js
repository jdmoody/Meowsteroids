(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});
  
  var Rainbow = Asteroids.Rainbow = function (pos, vel) {
    this.direction = Math.atan2(vel[0], vel[1])
    rainbow_start = [pos[0] - Math.sin(this.direction) * 10, 
                     pos[1] - Math.cos(this.direction) * 10];
    this.pos = rainbow_start;
    this.radius = 3;
    this.delete = false;
  }
  
  Asteroids.inherits(Rainbow, Asteroids.MovingObject);
  
  Rainbow.prototype.draw = function(ctx) {
    var img = document.getElementById("rainbow");
                  
    var xOffset = img.width / -2;
    var yOffset = img.height / -2;
    ctx.save();
    ctx.translate(this.pos[1], this.pos[0]);
    ctx.scale(this.radius/7, this.radius/7);
    ctx.rotate(this.direction);
    ctx.drawImage(img, xOffset, yOffset);
    ctx.restore();
  }
})(this);