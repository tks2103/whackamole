'use strict';

var RIGHT_MOUSE = 0,
    LEFT_MOUSE  = 1;

;(function(exports) {
  function registerMouseButton(e) {
    if (e.which !== undefined || e.button !== undefined) {
      if (e.which === 3 || e.button === 2) {
        return RIGHT_MOUSE;
      } else if (e.which === 1 || e.button === 0 || e.button === 1) {
        return LEFT_MOUSE;
      }
    }
  }

  var InputManager = function(canvas) {
    var that = this;
    this.mouseState = {};

    canvas.addEventListener('mousedown', function(e) {
      that.setMouseState(registerMouseButton(e), true);
    });

    canvas.addEventListener('mouseup', function(e) {
      that.setMouseState(registerMouseButton(e), false);
    });
  };

  InputManager.prototype = {
    setMouseState: function(key, value) {
      this.mouseState[key] = value;
    },

    isLeftPressed: function() {
      return this.mouseState[LEFT_MOUSE];
    }
  };

  exports.InputManager = InputManager;
})(this);
