let canvas;
let ctx;
let bgReady, zoombieReady, plantReady, fixedReady;
let bgImage, zoombieImage, plantImage, fixedImage;
let plantsUrl = ["/images/plant.png", "/images/plant-1.png", 
"/images/plant-2.png", "/images/plant-3.png"];
let startBtn = document.getElementById("start"); //do more: add shortcut to start by keyboard, or only press first key.
let info = document.getElementById("info");
let lifeCount = document.getElementById("life");
let myTimer;
let count = 0;
let t = 0;
let score = [];
let life = 3;


canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 429;
document.body.appendChild(canvas);

//generate random number from 0 to x-1
function random(x) {
  return Math.floor(Math.random() * x)
}

//Timing & Counting
function timeUpdate() {
  t++;
};

function stopTimer(t) {
  clearInterval(t);
};

//To start: press start btn or press enter
function start() {
  count = 0;
  t = 0;
  life = 3;
lifeCount.innerText = `Life left: ${life}`;
 myTimer = setInterval(timeUpdate, 1000);
  setupKeyboardListeners();
  
}

let enterPress = function (key) {
  // press Enter to start
  if(key.keyCode == 13) {
    start();
  }
 }

 startBtn.addEventListener('click', start);


 addEventListener("keydown", enterPress, false);

function countAndShow() {
  //count times a plant has caught
 
  if (count < 10) {
    count++;
  } 
  if (count === 10) {
    score.push(t);
  var best =  Math.min(...score);
    info.innerText = `recent score: ${t} s
    Your best:  ${best} s `;
    stopTimer(myTimer);
    stopKeyboarListeners();
  }
  
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
  fixedImage.onload = function () {
    //show fixed zoombies
    fixedReady = true;
  }
  fixedImage.src = "images/fixed-4.png";

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
  if (zoombieX < 0) {
    zoombieX = 0;
  }
  if (zoombieX > canvas.width - zoombieImage.width) {
    zoombieX = canvas.width - zoombieImage.width;
  }
  if (zoombieY < 0) {
    zoombieY = 0;
  }
  if (zoombieY > canvas.height - zoombieImage.height) {
    zoombieY = canvas.height - zoombieImage.height;
  }

  //check if zoombie run into obtables


  // Check if player and plant collided. Our images
  // are about 56 pixels big.
  if (
    zoombieX <= (plantX + plantImage.width) &&
    plantX <= (zoombieX + plantImage.width) &&
    zoombieY <= (plantY + plantImage.height) &&
    plantY <= (zoombieY + plantImage.height)
  ) {
    // Pick a new location for the plant.
    let i = random(4);
    plantImage.src = plantsUrl[i];
    plantX = random(canvas.width - plantImage.width);
    plantY = random(canvas.height - plantImage.height);
    countAndShow();
  }
  // Check if player and plant collided. Our images
  // are about 56 pixels big.

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

  //render time - count on canvas  
  ctx.font = "24px ZCOOL QingKe HuangYou";
  ctx.fillStyle = "red";
  let text = ctx.fillText(`${t}s . Plant: ${count} `, 840, 400);
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
main();


// Testing feature: A cold boom. life left reduces if our zoombie catch it 
var raf;
var img = new Image();
img.src = '/images/boom.png';

var ball = {
  x: 100,
  y: 100,
  vx: 6,
  vy: 6,
  draw: function() {
     ctx.drawImage(img, this.x, this.y);
    },
  pause: function() {
  }
};

function draw() {
   ball.draw();
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.y + ball.vy > canvas.height ||
      ball.y + ball.vy < 0) {
    ball.vy = -ball.vy;
  }
  if (ball.x + ball.vx > canvas.width ||
      ball.x + ball.vx < 0) {
    ball.vx = -ball.vx;
  }
  if (
    zoombieX <= (ball.x + 50) &&
    ball.x <= (zoombieX +50) &&
    zoombieY <= (ball.y + 50) &&
    ball.y <= (zoombieY + 50)
  ) {
    if(life >0) {
      ball.x = random(canvas.width - 50);
      ball.y = random(canvas.height - 50);
      life = life -1;
      lifeCount.innerText = `Life left: ${life}`;
    }
    if (life === 0) {
      lifeCount.innerText = `You LOSE`;
      stopTimer(myTimer);
      stopKeyboarListeners();
    
        }
  }
 raf = window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);