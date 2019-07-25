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
canvas.width = 1380;
canvas.height = 820;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady, eagleReady;
let bgImage, heroImage, monsterImage, eagleImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/bg.png";

  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/monkey3.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/banana3.png";

  eagleImage = new Image();
  eagleImage.onload = function () {
    // show the eagle image
    eagleReady = true;
  };
  eagleImage.src = "images/eagle2.png";
}

/** 
 * Setting up our characters.
 * 
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let monsterX = 100;
let monsterY = 100;

let eagleX = 100;
let eagleY = 100;

let score = 0;

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
  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);


  if (38 in keysDown) { // Player is holding up key
    heroY -= 10;
  }
  if (40 in keysDown) { // Player is holding down key
    heroY += 10;
  }
  if (37 in keysDown) { // Player is holding left key
    heroX -= 10;
  }
  if (39 in keysDown) { // Player is holding right key
    heroX += 10;
  }

  if (heroX <= -10) {
    heroX = canvas.width -10;
  }

  if (heroX >= canvas.width) {
    heroX = 0
  }

  if (heroY >= canvas.height - 10) {
    heroY = 0;
  }

  if (heroY <= -10) {
    heroY = canvas.height -10;
  }

  
  let heroTouchMonster = heroX <= (monsterX + 15)
  && monsterX <= (heroX + 50)
  && heroY <= (monsterY + 27)
  && monsterY <= (heroY + 50)

  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  if (heroTouchMonster) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
    score += 1;
    console.log(score)
    monsterX = Math.floor(Math.random() * 500);
    monsterY = Math.floor(Math.random() * 470);
  }
};


/**
 * This function, render, runs as often as possible.
 */
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  if (eagleReady) {
    ctx.drawImage(eagleImage, eagleX, eagleY);
  }
  ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 100);
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