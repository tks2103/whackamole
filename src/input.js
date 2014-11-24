'use strict';

var RIGHT_MOUSE = 0,
    LEFT_MOUSE  = 1;

var MOUSE_BUTTON_TYPE = {
  RIGHT_MOUSE: 0,
  LEFT_MOUSE: 1
};

var MOUSE_BUTTON_STATE = {
  UNPRESSED: 0,
  PRESSED: 1,
  RELEASED: 2
};

;(function(exports) {
  function registerMouseButton(e) {
    if (e.which !== undefined || e.button !== undefined) {
      if (e.which === 3 || e.button === 2) {
        return MOUSE_BUTTON_TYPE.RIGHT_MOUSE;
      } else if (e.which === 1 || e.button === 0 || e.button === 1) {
        return MOUSE_BUTTON_TYPE.LEFT_MOUSE;
      }
    }
  }

  function registerMousePosition(e, canvas) {
    var mousePosition;
    if (e.pageX) {
      mousePosition = { x: e.pageX, y: e.pageY };
    } else if (e.clientX) {
      mousePosition = { x: e.clientX, y: e.clientY };
    }
    mousePosition.x -= canvas.offsetLeft;
    mousePosition.y -= canvas.offsetTop;
    return mousePosition;
  }

  var InputManager = function(canvas) {
    var that = this;
    this.mouseState = {};
    this.mousePosition = { x: -1, y: -1 };

    canvas.addEventListener('mousedown', function(e) {
      that.setMouseState(registerMouseButton(e), MOUSE_BUTTON_STATE.PRESSED);
    });

    canvas.addEventListener('mouseup', function(e) {
      that.setMouseState(registerMouseButton(e), MOUSE_BUTTON_STATE.RELEASED);
    });

    canvas.addEventListener('mousemove', function(e) {
      that.setMousePosition(registerMousePosition(e, this));
    });
  };

  InputManager.prototype = {
    setMouseState: function(key, value) {
      this.mouseState[key] = value;
    },

    setMousePosition: function(position) {
      this.mousePosition = position;
    },

    isLeftPressed: function() {
      return this.mouseState[MOUSE_BUTTON_TYPE.LEFT_MOUSE] == MOUSE_BUTTON_STATE.PRESSED;
    },

    isLeftReleased: function() {
      return this.mouseState[MOUSE_BUTTON_TYPE.LEFT_MOUSE] == MOUSE_BUTTON_STATE.RELEASED;
    },

    unpressMouseButtons: function() {
      for(var key in this.mouseState) {
        if(this.mouseState.hasOwnProperty(key)) {
          if(this.mouseState[key] == MOUSE_BUTTON_STATE.RELEASED) {
            this.mouseState[key] = MOUSE_BUTTON_STATE.UNPRESSED;
          }
        }
      }
    },

    tick: function() {
      this.unpressMouseButtons();
    },

    getMousePosition: function() {
      return this.mousePosition;
    }
  };

  exports.InputManager = InputManager;
})(this);
