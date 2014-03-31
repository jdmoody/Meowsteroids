(function(root){
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Explosion = Asteroids.Explosion = function (pos, radius) {
    this.pos = pos;
    this.radius = radius;
  };
  
  function sleep(millis, callback, explosion, ctx, i) {
      setTimeout(function()
              { callback(explosion, ctx, i); }
      , millis);
  };
  
  Explosion.prototype.draw_frame = function(explosion, ctx, frame) {
    var img = document.getElementById("explosion-"+frame);
    var xOffset = img.width / -2;
    var yOffset = img.height / -2;
    ctx.save();
    ctx.translate(explosion.pos[1], explosion.pos[0]);
    ctx.scale(explosion.radius/30, explosion.radius/30);
    ctx.rotate(explosion.direction);
    ctx.drawImage(img, xOffset, yOffset);
    ctx.restore();
  };
  
  Explosion.prototype.draw = function(ctx) {
    for(var i=0; i<5; i++) {
      sleep(i * 52, this.draw_frame, this, ctx, i)
    }
  };
})(this);