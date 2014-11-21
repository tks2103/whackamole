"use strict";

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
  };

  Game.prototype = {

    generateTitleText: function() {
      this.entityManager.generateText({ x: 110, y: 250 }, 30, "WHACK THAT MOLE!");
      this.entityManager.generateText({ x: 208, y: 270 }, 20, "click to start");
    },


    generateNextRoundText: function() {
      this.entityManager.generateText({ x: 180, y: 250 }, 30, "GET READY!");
      this.entityManager.generateText({ x: 208, y: 270 }, 20, "here they come");
      this.entityManager.clearMoles();
    },


    generateWhackMoleText: function() {
      this.entityManager.generateText({ x: 180, y: 250 }, 30, "WHACK 'EM!");
      this.entityManager.generateText({ x: 208, y: 270 }, 20, "doooo it");
      this.generateMoles();
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

        if(mole !== null) {
          mole.state = (mole.state === 1 ? 0 : 1);
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


    detectTimedStateChange: function(callback) {
      if(this.stateManager.counter > STATE_CONTROLLER[this.stateManager.state]) {
        this.stateManager.counter = 0;
        this.stateManager.incrementState();
        this.entityManager.clearText();
        callback();
      }
    },


    processGame: function() {
      if(this.stateManager.state == GAME_STATE.TITLE_SCREEN) {
        if(this.inputManager.isLeftReleased()) {
          this.stateManager.incrementState();
          this.entityManager.clearText();
          this.generateNextRoundText();
        }
      } else if(this.stateManager.state == GAME_STATE.BETWEEN_ROUNDS) {
        this.detectTimedStateChange(this.generateWhackMoleText.bind(this));
      } else if(this.stateManager.state == GAME_STATE.SPAWN_MOLES) {
        this.detectMoleClick();
        this.detectTimedStateChange(this.generateNextRoundText.bind(this));
      }
      this.inputManager.tick();
      this.stateManager.tick();
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
