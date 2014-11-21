;(function(exports) {
  var Renderer = function(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
  };

  Renderer.prototype = {
    drawMole: function(mole) {
      this.ctx.fillRect(mole.x, mole.y, mole.width, mole.height);
    },

    clear: function() {
      this.canvas.width = this.canvas.width;
    }
  };
})(this);
