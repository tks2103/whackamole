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
