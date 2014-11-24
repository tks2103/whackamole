"use strict";

var ENTITY_SORT_ORDER = {
  "Board":    0,
  "Mole":     1,
  "Hole":     2,
  "Text":     3,
  "TextImg":  4
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

  var TextImg = function(value) {
    this.value  = value;
    this.type   = "TextImg";
    this.id     = generateId();
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

    clearAllText: function() {
      var markedForDeletion = [];
      for(var key in this.entities) {
        if(this.entities.hasOwnProperty(key)) {
          var entity = this.entities[key];
          if(entity.type == "Text" || entity.type == "TextImg") {
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

    generateTextImg: function(value) {
      var text = new TextImg(value);
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
