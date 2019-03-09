
let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 429;
document.body.appendChild(canvas);

let result = document.getElementById("count");
let timer = document.getElementById("timer");
let startBtn = document.getElementById("start"); //do more: add shortcut to start by keyboard, or only press first key.
let resetBtn = document.getElementById("reset");
let myTimer;
let count = 0;
let foo = false;
let t = 0;

let bgReady, zoombieReady, monsterReady, plantReady, fixedReady;
let bgImage, zoombieImage, monsterImage, plantImage, fixedImage;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/bg-zombie.png";
  zoombieImage = new Image();
  zoombieImage.onload = function () {
    // show the hero image
    zoombieReady = true;
  };
  zoombieImage.src = "images/zoombie-1.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";
}

/** 
 * Setting up our characters.
 * 
 * Note that zoombieX represents the X position of our hero.
 * zoombieY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */

let zoombieX = canvas.width / 2;
let zoombieY = canvas.height / 2;

let monsterX = 100;
let monsterY = 100;

/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
*/
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}


/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function () {
  if (38 in keysDown) { // Player is holding up key
    zoombieY -= 5;
  }
  if (40 in keysDown) { // Player is holding down key
    zoombieY += 5;
  }
  if (37 in keysDown) { // Player is holding left key
    zoombieX -= 5;
  }
  if (39 in keysDown) { // Player is holding right key
    zoombieX += 5;
  }

  if( zoombieX <0) {
    zoombieX = 0;
  }
  if (zoombieX> canvas.width - zoombieImage.width) {
    zoombieX = canvas.width - zoombieImage.width;
  }
  if( zoombieY <0) {
    zoombieY = 0;
  }
  if (zoombieY> canvas.height - zoombieImage.height) {
    zoombieY = canvas.height - zoombieImage.height;
  }
  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  if (
    zoombieX <= (monsterX + 32)
    && monsterX <= (zoombieX + 32)
    && zoombieY <= (monsterY + 32)
    && monsterY <= (zoombieY + 32)
  ) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
    monsterX = monsterX + 50;
    monsterY = monsterY + 70;
  }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (zoombieReady) {
    ctx.drawImage(zoombieImage, zoombieX, zoombieY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function () {
  update(); 
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers. 
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();