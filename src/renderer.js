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
