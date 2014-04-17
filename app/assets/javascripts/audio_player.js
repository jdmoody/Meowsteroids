(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});
  
  var AudioPlayer = Asteroids.AudioPlayer = function () {
    this.muted = false;
  }
  
  AudioPlayer.prototype.playBulletSound = function () {
    if (this.muted === false) {
      var laser = new Audio("audios/pewpew.wav");
      laser.volume = 0.05;
      laser.play();
    }
  } 
})(this);