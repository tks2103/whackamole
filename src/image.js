'use strict';

var images = [
  "Fields.png",
  "Mole_Hit.png",
  "Mole_Hole_Mud.png",
  "Mole_Hole.png",
  "Mole_Normal.png",
  "WhackAMoleText.png",
  "GetReadyText.png",
  "WhackEmText.png",
  "GameOverText.png"
];

;(function(exports) {
  var ImageLoader = function() {
    this.images = {};
    this.loaded = null;
  };

  ImageLoader.prototype = {
    loadImages: function() {
      var that = this;

      images.forEach(function(img) {
        var image = new Image();
        image.onload = function() {
          that.images[img] = image;
          that.checkLoaded();
        };
        image.src = "img/" + img;
      }.bind(this));
    },


    checkLoaded: function() {
      var ct = 0;
      for(var key in this.images) {
        if(this.images.hasOwnProperty(key)) {
          ct++;
        }
      }
      if(ct == images.length) {
        if(this.loaded !== null) {
          this.loaded();
        }
      }
    }
  };

  exports.ImageLoader = ImageLoader;
})(this);
