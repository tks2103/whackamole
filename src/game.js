"use strict";

;(function(exports) {
  var Game = function(canvas) {
    this.renderer         = new Renderer(canvas);
    this.inputManager     = new InputManager(canvas);
    this.entityManager    = new EntityManager();
  };

  Game.prototype = {
    processInput: function() {
    },

    processGame: function() {
    },

    render: function() {
    },

    loop: function() {
      this.processInput();
      this.processGame();
      this.render();
      window.requestAnimationFrame(this.loop.bind(this));
    },

    startLoop: function() {
      window.requestAnimationFrame(this.loop.bind(this));
    }
  };

  exports.Game = Game;
})(this);
