Simple Whack-A-Mole game!

# Installation

1. Clone Repo
2. npm install from repo root
3. gulp build
4. localhost:9000

# Thoughts

Mostly POJOs. Mostly a functional game engine.

Game.js is the brains of the operation. It has a game loop which handles state changes, input events, UI updates, etc. The game loop uses requestAnimationFrame.

Rendering is handled on a canvas element. Images need to be loaded before we can run the game. Image loading is handled in image.js. After the images are ready, a game instance is instantiated and the game loop is triggered.
