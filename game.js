/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/


let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
// canvas.width = 800;
// canvas.height = 740;
document.body.appendChild(canvas);

let bgReady, dinoReady, eggReady;
let bgImage, dinoImage, eggImage;
let gameScore, eggCatch;

function loadImages() {
  bgImage = new Image(); //create new Img Element
  bgImage.onload = function () { //// execute drawImage statements here
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background2.png";
  dinoImage = new Image();
  dinoImage.onload = function () {
    // show the dino image
    dinoReady = true;
  };
  dinoImage.src = "images/dino.png";

  eggImage = new Image();
  eggImage.onload = function () {
    // show the egg image
    eggReady = true;
  };
  eggImage.src = "images/egg.png";



}

/** 
 * Setting up our characters.
 

 * Note that dinoX represents the X position of our dino.
 * dinoY represents the Y position.
 * We'll need these values to know where to "draw" the dino.
 * 
 * The same applies to the egg.
 */

let dinoX = canvas.width / 2;
let dinoY = canvas.height / 2;

let eggX = 100;
let eggY = 100;

let eggIsCaught = false;







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
 *  and check to see if the egg has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function () {
  if (38 in keysDown) { // Player is holding up key
    dinoY -= 6;
  }
  if (40 in keysDown) { // Player is holding down key
    dinoY += 6;
  }
  if (37 in keysDown) { // Player is holding left key
    dinoX -= 6;
  }
  if (39 in keysDown) { // Player is holding right key
    dinoX += 6;
  }
  dinoX = Math.min(canvas.width - 100, dinoX);
  dinoX = Math.max(0, dinoX);
  dinoY = Math.min(canvas.height - 145, dinoY);
  dinoY = Math.max(0, dinoY);



  // Check if player and egg collided. Our images
  // are about 32 pixels big.
  if (
    dinoX <= (eggX + 40) &&
    eggX <= (dinoX + 40) &&
    dinoY <= (eggY + 40) &&
    eggY <= (dinoY + 40)
  ) {
    // Pick a new location for the egg.
    // Note: Change this to place the egg at a new, random location.
    eggX = Math.floor(Math.random() * 450);
    eggY = Math.floor(Math.random() * 350);
  }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (dinoReady) {
    ctx.drawImage(dinoImage, dinoX, dinoY);
  }
  if (eggReady) {
    ctx.drawImage(eggImage, eggX, eggY);
  }
  ctx.font = "15px Comic Sans MS";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("Total Socre", 50, 20);
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our dino and egg)
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