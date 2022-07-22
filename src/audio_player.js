(function (root) {
  var Asteroids = (root.Asteroids = root.Asteroids || {});

  var AudioPlayer = (Asteroids.AudioPlayer = function () {
    this.muted = false;
  });

  AudioPlayer.prototype.playBulletSound = function () {
    if (this.muted === false) {
      var laser = new Audio("./assets/audios/pewpew.wav");
      laser.volume = 0.05;
      laser.play();
    }
  };

  AudioPlayer.prototype.playExplosion = function () {
    if (this.muted === false) {
      var boom = new Audio("./assets/audios/explosion.wav");
      boom.volume = 0.2;
      boom.play();
    }
  };

  AudioPlayer.prototype.playPowerupSound = function () {
    var bloop = new Audio("./assets/audios/bloop.wav");
    bloop.volume = 0.5;
    bloop.play();
  };

  AudioPlayer.prototype.playMusic = function () {
    this.meow = document.getElementById("meow");
    this.meow.volume = 0.05;

    this.meow.addEventListener(
      "ended",
      function () {
        this.currentTime = 0;
        this.play();
      },
      false
    );

    this.meow.play();
  };

  AudioPlayer.prototype.pauseMusic = function () {
    this.meow.pause();
  };

  AudioPlayer.prototype.restartMusic = function () {
    this.meow.currentTime = 0;
  };

  AudioPlayer.prototype.muteMusic = function () {
    this.meow.muted = !this.meow.muted;
  };
})(this);
