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
      } else {
        this.state = GAME_STATE.TITLE_SCREEN;
      }
    }
  };

  exports.StateManager = StateManager;
})(this);
