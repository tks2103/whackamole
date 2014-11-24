"use strict";

var canvas    = document.getElementById("game"),
    imgLoader = new ImageLoader();

imgLoader.loaded = function() {
  var game = new Game(canvas, [], imgLoader.images);
  game.startLoop();
}.bind(this);
imgLoader.loadImages();
