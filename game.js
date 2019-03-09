
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

//Timing

function timeUpdate() {
  t++;
  timer.innerText = `${t} s`;
 };

 function start() {
  count = 0;
  t = 0;
  myTimer = setInterval(timeUpdate, 1000);
  setupKeyboardListeners();
  
}

function stopTimer(t) {
  clearInterval(t);
};

  startBtn.addEventListener('click', start);

//**Count number of plant caught 

function countAndShow() {
  //count times a plant has caught
  if (count < 10) {
    count++;
    result.innerText = `plant: ${count}, still ${10 -count}`;
  } else if (count === 10) {
    stopTimer(myTimer);
    stopKeyboarListeners();
  }
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
 * Keyboard Listeners & Stop keyboard listener
 *
*/
let keysDown = {};

let handleKeyUp = function (key) {
  delete keysDown[key.keyCode];
};

let handleKeyDown = function (key) {
  keysDown[key.keyCode] = true;
};

function setupKeyboardListeners() {
  addEventListener("keydown", handleKeyDown, false);

  addEventListener("keyup", handleKeyUp, false);
  foo = true;
}

function stopKeyboarListeners() {
  removeEventListener("keydown", handleKeyDown, false);
  removeEventListener("keyup", handleKeyUp, false);
  keysDown = {};
}


/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the plant has been caught!
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
// check if zoombie out of canvas
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

  //check if zoombie run into fixed zoombies
  // if(zoombieX + zoombieImage.width >=  )


  // Check if player and plant collided. Our images
  // are about 56 pixels big.
  if (
    zoombieX <= (plantX + plantImage.width)
    && plantX <= (zoombieX + plantImage.width)
    && zoombieY <= (plantY + plantImage.height)
    && plantY <= (zoombieY + plantImage.height)
  ) {
     // Pick a new location for the plant.
    plantX = random(canvas.width - plantImage.width);
    plantY = random(canvas.height - plantImage.height);
    countAndShow();
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