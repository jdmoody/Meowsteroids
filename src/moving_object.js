(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var MovingObject = Asteroids.MovingObject = function (pos, vel, radius,
                                                        color) {
    this.pos = pos;
    this.vel = vel;
    this.radius = radius;
    this.color = color;
  };

  Asteroids.inherits = function (InheritingClass, BaseClass) {
    function Surrogate () {};
    Surrogate.prototype = BaseClass.prototype;
    InheritingClass.prototype = new Surrogate();
  };

  MovingObject.prototype.move = function (DIM_Y, DIM_X) {
    posY = (this.pos[0] + this.vel[0]);
    posX = (this.pos[1] + this.vel[1]);

    if (posY < 0){
      this.pos[0] = DIM_Y - Math.abs(posY);
    } else {
      this.pos[0] = (this.pos[0] + this.vel[0]) % DIM_Y;
    }
    if (posX < 0){
      this.pos[1] = DIM_X - Math.abs(posX);
    } else {
      this.pos[1] = (this.pos[1] + this.vel[1]) % DIM_X;
    }
  };

  MovingObject.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.arc(
      this.pos[1],
      this.pos[0],
      this.radius,
      0,
      2 * Math.PI,
      false
    );

    ctx.fill();
  };

  MovingObject.prototype.isCollidedWith = function(otherObject) {
    var yDistance = this.pos[0] - otherObject.pos[0];
    var xDistance = this.pos[1] - otherObject.pos[1];
    var distanceFromCenters = Math.sqrt(Math.pow(yDistance, 2) +
                                        Math.pow(xDistance, 2));

    var sumOfRadii = this.radius + otherObject.radius;

    return ((sumOfRadii >= distanceFromCenters) ? true : false);
  };

})(this);