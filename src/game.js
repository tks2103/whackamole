"use strict";

var GAME_STATE = {
  TITLE_SCREEN: 0,
  BETWEEN_ROUNDS: 1,
  SPAWN_MOLES: 2,
  GAME_COMPLETE: 3
};

var STATE_CONTROLLER = {};
STATE_CONTROLLER[GAME_STATE.BETWEEN_ROUNDS] = 120;
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
      this.entityManager.generateTextImg("WhackAMoleText.png");
    },


    generateNextRoundText: function() {
      this.entityManager.generateTextImg("GetReadyText.png");
    },


    generateWhackMoleText: function() {
      this.entityManager.generateTextImg("WhackEmText.png");
    },


    generateCompletedText: function() {
      this.entityManager.generateTextImg("GameOverText.png");
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
