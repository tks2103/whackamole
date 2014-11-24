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
