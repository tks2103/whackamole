"use strict";

var GAME_STATE = {
  TITLE_SCREEN: 0,
  BETWEEN_ROUNDS: 1,
  SPAWN_MOLES: 2,
  GAME_COMPLETE: 3
};

var STATE_CONTROLLER = {};
STATE_CONTROLLER[GAME_STATE.BETWEEN_ROUNDS] = 180;
STATE_CONTROLLER[GAME_STATE.SPAWN_MOLES] = 300;

;(function(exports) {
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
    return { x: x * 50 + 40, y: y * 50 + 40 };
  };

  var Game = function(canvas, board) {
    this.renderer         = new Renderer(canvas);
    this.inputManager     = new InputManager(canvas);
    this.entityManager    = new EntityManager();
    this.stateManager     = new StateManager();

    this.generateTitleText();

    var holes             = generateGrid(10, 4).map(function(loc) { loc.type = "Hole"; return loc; });

    this.initEntities(board.concat(holes));
    this.score = 0;
    this.counter = 0;
  };

  Game.prototype = {

    generateTitleText: function() {
      this.entityManager.generateText({ x: 110, y: 250 }, 30, "WHACK THAT MOLE!");
      this.entityManager.generateText({ x: 208, y: 270 }, 20, "click to start");
    },


    generateNextRoundText: function() {
      this.entityManager.generateText({ x: 180, y: 250 }, 30, "GET READY!");
      this.entityManager.generateText({ x: 208, y: 270 }, 20, "here they come");
    },


    generateWhackMoleText: function() {
      this.entityManager.generateText({ x: 180, y: 250 }, 30, "WHACK 'EM!");
      this.entityManager.generateText({ x: 208, y: 270 }, 20, "doooo it");
    },

    generateMoles: function() {
      var numMoles = Math.floor(Math.random() * 4 + 3),
          moles = [];

      for(var i = 0; i < numMoles; i++) {
        var locx = Math.floor(Math.random() * 9 + 1),
            locy = Math.floor(Math.random() * 3  + 1);

        this.entityManager.generateMole(generateLocation(locx, locy));
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
          this.stateManager.incrementState();
          this.entityManager.clearText();
          this.generateNextRoundText();
          this.entityManager.clearMoles();
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
