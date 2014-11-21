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
  var StateManager = function() {
    this.state = GAME_STATE.TITLE_SCREEN;
    this.counter = 0;
  };

  StateManager.prototype = {
    tick: function() {
      if(this.state === GAME_STATE.BETWEEN_ROUNDS || this.state === GAME_STATE.SPAWN_MOLES) {
        this.counter++;
        if(this.counter >= STATE_CONTROLLER[this.state]) {
          this.counter = 0;
          this.incrementState();
        }
      }
    },


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
