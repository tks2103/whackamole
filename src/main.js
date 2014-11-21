"use strict";

function generateGrid(x, y) {
  var locations = [];
  for(var i = 0; i < x; i++) {
    for(var j = 0; j < y; j++) {
      locations.push({ location: { x: i * 50 + 40, y: j * 50 + 40 } });
    }
  }
  return locations;
}


var canvas    = document.getElementById("game"),
    moles     = generateGrid(10, 4).map(function(loc) { loc.type = "Mole"; return loc; }),
    holes     = generateGrid(10, 4).map(function(loc) { loc.type = "Hole"; return loc; }),
    entities  = holes.concat(moles);
var game      = new Game(canvas, entities);

game.startLoop();
