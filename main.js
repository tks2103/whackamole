"use strict";

;(function(exports) {
  var Renderer = function(canvas, images) {
    this.canvas = canvas;
    this.images = images;
    this.ctx    = canvas.getContext('2d');
    this.canvas.width       = 800;
    this.canvas.height      = 450;
    this.canvas.offsetLeft  = 0;
    this.canvas.offsetTop   = 0;
  };

  Renderer.prototype = {
    drawEntities: function(entities) {
      entities.forEach(function(entity) {
        if(entity.type === "Board") {
          this.drawBoard(entity);
        } else if(entity.type === "Hole") {
          this.drawHole(entity);
        } else if(entity.type === "Mole") {
          this.drawMole(entity);
        } else if(entity.type === "Text") {
          this.drawText(entity);
        } else {
          throw "Invalid Entity Type";
        }
      }.bind(this));
    },

    drawBoard: function(board) {
      var image = this.images["Fields.png"];
      this.ctx.drawImage(image, 0, 0, board.size.width, board.size.height);
    },

    drawMole: function(mole) {
      var image;
      if(mole.state === 1) {
        image = this.images["Mole_Hit.png"];
      } else {
        image = this.images["Mole_Normal.png"];
      }
      var width = mole.size.width,
          height = mole.size.height;
      this.ctx.drawImage(image, mole.location.x - width / 2, mole.location.y - height / 2, width, height);
    },

    drawHole: function(hole) {
      var holeImg = this.images["Mole_Hole.png"],
          mudImg = this.images["Mole_Hole_Mud.png"];
      this.ctx.drawImage(holeImg,
                         hole.location.x - hole.size.width / 2,
                         hole.location.y + hole.size.height / 2 - hole.size.height / 4 + 5,
                         hole.size.width, hole.size.height / 4);
      this.ctx.drawImage(mudImg,
                         hole.location.x - hole.size.width / 2,
                         hole.location.y + hole.size.height / 2 - hole.size.height / 5 + 5,
                         hole.size.width, hole.size.height / 5);
    },

    drawText: function(text) {
      this.ctx.fillStyle = "rgb(0,0,0)";
      this.ctx.font = "" + text.size + "px Arial";
      this.ctx.fillText(text.value, text.location.x, text.location.y)
    },

    clear: function() {
      this.canvas.width = this.canvas.width;
    }
  };

  exports.Renderer = Renderer;
})(this);

;(function(exports) {
  var StateManager = function() {
    this.state = GAME_STATE.TITLE_SCREEN;
  };

  StateManager.prototype = {

    incrementState: function(completed) {
      if(completed) {
        this.state = GAME_STATE.GAME_COMPLETE;
      } else if(this.state === GAME_STATE.TITLE_SCREEN) {
        this.state = GAME_STATE.BETWEEN_ROUNDS;
      } else if (this.state === GAME_STATE.BETWEEN_ROUNDS) {
        this.state = GAME_STATE.SPAWN_MOLES;
      } else if (this.state === GAME_STATE.SPAWN_MOLES) {
        this.state = GAME_STATE.BETWEEN_ROUNDS;
      } else if (this.state === GAME_STATE.GAME_COMPLETE) {
        this.state = GAME_STATE.BETWEEN_ROUNDS;
      }
    }
  };

  exports.StateManager = StateManager;
})(this);

"use strict";

var ENTITY_SORT_ORDER = {
  "Board": 0,
  "Mole": 1,
  "Hole": 2,
  "Text": 3
};

;(function(exports) {
  var _idct = 0;
  function generateId() {
    _idct++;
    return _idct;
  };

  var Mole = function(location, size, state) {
    this.location = location;
    this.size     = size;
    this.type     = "Mole";
    this.state    = state;
    this.id       = generateId();
  };

  var Hole = function(location, size) {
    this.location = location;
    this.size     = size;
    this.type     = "Hole";
    this.id       = generateId();
  };

  var Board = function() {
    this.size = { width: window.innerWidth, height: window.innerHeight };
    this.type = "Board";
    this.id   = generateId();
  };

  var Text = function(location, size, value) {
    this.location = location;
    this.size     = size;
    this.type     = "Text";
    this.value    = value;
    this.id       = generateId();
  };

  var EntityManager = function() {
    this.entities = {};
    this.generateBoard();
  };

  EntityManager.prototype = {

    clearMoles: function() {
      var markedForDeletion = [];
      for(var key in this.entities) {
        if(this.entities.hasOwnProperty(key)) {
          var entity = this.entities[key];
          if(entity.type == "Mole") {
            markedForDeletion.push(key);
          }
        }
      }

      this.batchDelete(markedForDeletion);
    },

    clearText: function() {
      var markedForDeletion = [];
      for(var key in this.entities) {
        if(this.entities.hasOwnProperty(key)) {
          var entity = this.entities[key];
          if(entity.type == "Text") {
            markedForDeletion.push(key);
          }
        }
      }

      this.batchDelete(markedForDeletion);
    },


    batchDelete: function(ary) {
      ary.forEach(function(key) {
        delete this.entities[key];
      }.bind(this));
    },


    holeSize: function() {
      return { width: 60, height: 60 };
    },

    moleSize: function() {
      return { width: 75, height: 75 };
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

    generateText: function(location, size, value) {
      var text = new Text(location, size, value);
      this.entities[text.id] = text;
    },

    isMoleAtLocation: function(location) {
      for(var id in this.entities) {
        if(this.entities.hasOwnProperty(id)) {
          var entity = this.entities[id];
          if(entity.type === "Mole") {
            if(location.x > entity.location.x - entity.size.width / 2 &&
               location.x < entity.location.x + entity.size.width / 2 &&
               location.y > entity.location.y - entity.size.height / 2 &&
               location.y < entity.location.y + entity.size.height / 2) {
              return entity;
            }
          }
        }
      }
      return null;
    },

    entityArray: function() {
      var ary = []
      for(var key in this.entities) {
        if(this.entities.hasOwnProperty(key)) {
          ary.push(this.entities[key]);
        }
      }

      ary.sort(function(a, b) {
        if(ENTITY_SORT_ORDER[a.type] > ENTITY_SORT_ORDER[b.type]) {
          return 1;
        }
        if(ENTITY_SORT_ORDER[a.type] < ENTITY_SORT_ORDER[b.type]) {
          return -1;
        }
        return 0;
      });

      return ary;
    }
  }

  exports.EntityManager = EntityManager;
})(this);

"use strict";

var GAME_STATE = {
  TITLE_SCREEN: 0,
  BETWEEN_ROUNDS: 1,
  SPAWN_MOLES: 2,
  GAME_COMPLETE: 3
};

var STATE_CONTROLLER = {};
STATE_CONTROLLER[GAME_STATE.BETWEEN_ROUNDS] = 20;
STATE_CONTROLLER[GAME_STATE.SPAWN_MOLES] = 180;

var XGRID = 9, YGRID = 4;

;(function(exports) {

  function cartesianProduct(ary1, ary2) {
    var ary3 = []
    for(var i = 0; i < ary1.length; i++) {
      for(var j = 0; j < ary2.length; j++) {
        ary3.push([i,j]);
      }
    }
    return ary3;
  }

  function generateArray(n) { return Array.apply(null, Array(n)).map(function(i, d) { return d; }) }

  function generateGrid(x, y) {
    var locations = [];
    for(var i = 0; i < x; i++) {
      for(var j = 0; j < y; j++) {
        locations.push({ location: generateLocation(i, j) });
      }
    }
    return locations;
  };

  function generateLocation(x, y) {
    return { x: x * 80 + 70, y: y * 80 + 90 };
  };

  var Game = function(canvas, board, images) {
    this.renderer         = new Renderer(canvas, images);
    this.inputManager     = new InputManager(canvas);
    this.entityManager    = new EntityManager();
    this.stateManager     = new StateManager();

    this.generateTitleText();

    var holes             = generateGrid(XGRID, YGRID).map(function(loc) { loc.type = "Hole"; return loc; });

    this.initEntities(board.concat(holes));
    this.score   = 0;
    this.counter = 0;
    this.round   = 0;
  };

  Game.prototype = {

    generateTitleText: function() {
      this.entityManager.generateText({ x: 110, y: 400 }, 30, "WHACK THAT MOLE!");
      this.entityManager.generateText({ x: 208, y: 420 }, 20, "click to start");
    },


    generateNextRoundText: function() {
      this.entityManager.generateText({ x: 180, y: 400 }, 30, "GET READY!");
      this.entityManager.generateText({ x: 208, y: 420 }, 20, "here they come");
    },


    generateWhackMoleText: function() {
      this.entityManager.generateText({ x: 180, y: 400 }, 30, "WHACK 'EM!");
      this.entityManager.generateText({ x: 208, y: 420 }, 20, "doooo it");
    },


    generateCompletedText: function() {
      this.entityManager.generateText({ x: 60, y: 400 }, 30, "GAME OVER! YOUR SCORE: " + this.score);
      this.entityManager.generateText({ x: 208, y: 420 }, 20, "click to try again!");
    },


    generateMoles: function() {
      var numMoles = Math.floor(Math.random() * 4 + 3),
          moles = [];

      var locxs = generateArray(XGRID), locys = generateArray(YGRID), locs = cartesianProduct(locxs, locys);

      for(var i = 0; i < numMoles; i++) {
        var aryPos  = Math.floor(Math.random() * locs.length),
            loc     = locs[aryPos];

            locs.splice(aryPos, 1);
        this.entityManager.generateMole(generateLocation(loc[0], loc[1]));
      }
    },


    detectMoleClick: function() {
      if(this.inputManager.isLeftReleased()) {
        var pos = this.inputManager.getMousePosition(),
            mole = this.entityManager.isMoleAtLocation(pos);

        if(mole !== null && mole.state !== 1) {
          mole.state = 1;
          this.score += 1;
        }
      }
    },


    initEntities: function(board) {
      board.map(function(entity) {
        if(entity.type == "Mole") {
          this.entityManager.generateMole(entity.location);
        } else if (entity.type == "Hole") {
          this.entityManager.generateHole(entity.location);
        }
      }.bind(this));
    },


    processGame: function() {
      if(this.stateManager.state == GAME_STATE.SPAWN_MOLES || this.stateManager.state == GAME_STATE.BETWEEN_ROUNDS) {
        this.counter++;
      }
      if(this.stateManager.state == GAME_STATE.TITLE_SCREEN) {
        if(this.inputManager.isLeftReleased()) {
          this.stateManager.incrementState();
          this.entityManager.clearText();
          this.generateNextRoundText();
        }
      } else if(this.stateManager.state == GAME_STATE.BETWEEN_ROUNDS) {
        if(this.counter >= STATE_CONTROLLER[this.stateManager.state]) {
          this.counter = 0;
          this.stateManager.incrementState();
          this.entityManager.clearText();
          this.generateWhackMoleText();
          this.generateMoles();
        }
      } else if(this.stateManager.state == GAME_STATE.SPAWN_MOLES) {
        this.detectMoleClick();
        if(this.counter >= STATE_CONTROLLER[this.stateManager.state]) {
          this.counter = 0;
          this.entityManager.clearText();
          this.entityManager.clearMoles();
          this.round += 1;
          if(this.round > 2) {
            this.stateManager.incrementState(true);
            this.generateCompletedText();
          } else {
            this.stateManager.incrementState();
            this.generateNextRoundText();
          }
        }
      } else if(this.stateManager.state == GAME_STATE.GAME_COMPLETE) {
        if(this.inputManager.isLeftReleased()) {
          this.stateManager.incrementState();
          this.entityManager.clearText();
          this.generateNextRoundText();
          this.score = 0;
          this.round = 0;
        }
      }
      this.inputManager.tick();
    },


    render: function() {
      this.renderer.drawEntities(this.entityManager.entityArray());
    },


    loop: function() {
      this.processGame();
      this.render();
      console.log(this.stateManager.state);
      window.requestAnimationFrame(this.loop.bind(this));
    },


    startLoop: function() {
      window.requestAnimationFrame(this.loop.bind(this));
    }
  };

  exports.Game = Game;
})(this);

'use strict';

var images = [
  "Fields.png",
  "Mole_Hit.png",
  "Mole_Hole_Mud.png",
  "Mole_Hole.png",
  "Mole_Normal.png"
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
    mousePosition.x += canvas.offsetLeft;
    mousePosition.y += canvas.offsetTop;
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

"use strict";

var canvas    = document.getElementById("game"),
    imgLoader = new ImageLoader();

imgLoader.loaded = function() {
  var game = new Game(canvas, [], imgLoader.images);
  game.startLoop();
}.bind(this);
imgLoader.loadImages();
