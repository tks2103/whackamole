"use strict";

;(function(exports) {
  var Renderer = function(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.canvas.width   = window.innerWidth / 2;
    this.canvas.height  = window.innerHeight / 2;
  };

  Renderer.prototype = {
    drawEntities: function(entities) {
      entities.forEach(function(entity) {
        console.log("drawing " + entity.type);
        if(entity.type === "Board") {
          this.drawBoard(entity);
        } else if(entity.type === "Hole") {
          this.drawHole(entity);
        } else if(entity.type === "Mole") {
          this.drawMole(entity);
        } else {
          throw "Invalid Entity Type";
        }
      }.bind(this));
    },

    drawBoard: function(board) {
      this.ctx.fillStyle = "rgb(128,128,0)";
      this.ctx.fillRect(0, 0, board.size.width, board.size.height);
    },

    drawMole: function(mole) {
      this.ctx.fillStyle = "rgb(255,0,0)";
      this.ctx.fillRect(mole.location.x - mole.size.width / 2,
                        mole.location.y - mole.size.height / 2,
                        mole.size.width, mole.size.height);
    },

    drawHole: function(hole) {
      this.ctx.fillStyle = "rgb(0,255,255)";
      this.ctx.fillRect(hole.location.x - hole.size.width / 2,
                        hole.location.y - hole.size.height / 2,
                        hole.size.width, hole.size.height);
    },

    clear: function() {
      this.canvas.width = this.canvas.width;
    }
  };

  exports.Renderer = Renderer;
})(this);

"use strict";

;(function(exports) {
  var _idct = 0;
  function generateId() {
    _idct++;
    return _idct;
  };

  var Mole = function(location, size, state) {
    this.location = location;
    this.size = size;
    this.type = "Mole";
    this.state = state;
    this.id = generateId();
  };

  var Hole = function(location, size) {
    this.location = location;
    this.size = size;
    this.type = "Hole";
    this.id = generateId();
  };

  var Board = function() {
    this.size = { width: window.innerWidth, height: window.innerHeight };
    this.type = "Board";
    this.id = generateId();
  };

  var EntityManager = function() {
    this.entities = {};
    this.generateBoard();
  };

  EntityManager.prototype = {
    holeSize: function() {
      return { width: 40, height: 40 };
    },

    moleSize: function() {
      return { width: 30, height: 30 };
    },

    generateHole: function(location) {
      var hole = new Hole(location, this.holeSize());
      this.entities[hole.id] = hole;
    },

    generateMole: function(location) {
      var mole = new Mole(location, this.moleSize(), 0);
      this.entities[mole.id] = mole;
    },

    generateBoard: function() {
      var board = new Board();
      this.entities[board.id] = board;
    },

    entityArray: function() {
      var ary = []
      for(var key in this.entities) {
        if(this.entities.hasOwnProperty(key)) {
          ary.push(this.entities[key]);
        }
      }
      return ary;
    }
  }

  exports.EntityManager = EntityManager;
})(this);

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

"use strict";

var canvas = document.getElementById("game"),
    game   = new Game(canvas);

game.startLoop();
