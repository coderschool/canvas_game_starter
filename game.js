
let canvas;
let ctx;
let bgReady, zoombieReady, plantReady, fixedReady;
let bgImage, zoombieImage, plantImage, fixedImage;
let result = document.getElementById("count");
let timer = document.getElementById("timer");
let startBtn = document.getElementById("start"); //do more: add shortcut to start by keyboard, or only press first key.
let resetBtn = document.getElementById("reset");
let myTimer;
let count = 0;
let foo = false;
let t = 0;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 429;
document.body.appendChild(canvas);

//generate random Number from 0 to x-1
function random(x) {
  return Math.floor(Math.random() * x)
}

//moving around 
function changePosition() {
  let maxw = canvas.width - plantImage.width;
  let maxh = canvas.height - plantImage.height;
  let nh = Math.floor(Math.random()) * maxh;
  let nw = Math.floor(Math.random()) * maxw;
 
}


//load imgages
function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/bg-zombie.png";

  fixedImage = new Image();
  fixedImage.onload = function() {
    //show fixed zoombies
    fixedReady = true;
  }
  fixedImage.src = "images/fixed.png"

  zoombieImage = new Image();
  zoombieImage.onload = function () {
    // show the hero image
    zoombieReady = true;
  };
  zoombieImage.src = "images/zoombie-1.png";

  plantImage = new Image();
  plantImage.onload = function () {
    // show the plant image
    plantReady = true;
  };
  plantImage.src = "images/plant.png";
}

/** 
 * Setting up our characters.
 * 
 * Note that zoombieX represents the X position of our hero.
 * zoombieY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the plant.
 */

let zoombieX = canvas.width / 2;
let zoombieY = canvas.height / 2;

let plantX = 200;
let plantY = 100;

let f1_X = 300;
let f1_Y = 330;
let f2_X = 410;
let f2_Y = 130;

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
 *  and check to see if the plant has been caught!
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
  // Check if player and plant collided. Our images
  // are about 32 pixels big.
  if (
    zoombieX <= (plantX + plantImage.width)
    && plantX <= (zoombieX + plantImage.width)
    && zoombieY <= (plantY + plantImage.height)
    && plantY <= (zoombieY + plantImage.height)
  ) {
 
    // Pick a new location for the plant.
    plantX = random(canvas.width - plantImage.width);
    plantY = random(canvas.height - plantImage.height);
  }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (fixedReady) {
    ctx.drawImage(fixedImage, f1_X, f1_Y);
    ctx.drawImage(fixedImage, f2_X, f2_Y);
  }
  if (zoombieReady) {
    ctx.drawImage(zoombieImage, zoombieX, zoombieY);
  }
  if (plantReady) {
    ctx.drawImage(plantImage, plantX, plantY);
  }
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and plant)
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