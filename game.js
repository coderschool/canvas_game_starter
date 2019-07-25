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

let bgReady, monkeyReady, goriReady, bananaReady, pineappleReady, eagleReady, eagle1Ready;
let bgImage, monkeyImage, goriImage, bananaImage,pineappleImage, eagleImage, eagle1Image;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;

let game = {
  startspeed: 1,
  difficulty: 1,
  level: 1,
};

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function() {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/bg.png";

  monkeyImage = new Image();
  monkeyImage.onload = function() {
    // show the monkey image
    monkeyReady = true;
  };
  monkeyImage.src = "images/monkey3.png";

  goriImage = new Image();
  goriImage.onload = function() {
    // show the monkey image
    goriReady = true;
  };
  goriImage.src = "images/gori1.png";

  bananaImage = new Image();
  bananaImage.onload = function() {
    // show the banana image
    bananaReady = true;
  };
  bananaImage.src = "images/banana3.png";

  pineappleImage = new Image();
  pineappleImage.onload = function() {
    // show the pineapple image
    pineappleReady = true;
  };
  pineappleImage.src = "images/pineapple1.png";

  eagleImage = new Image();
  eagleImage.onload = function() {
    // show the eagle image
    eagleReady = true;
  };
  eagleImage.src = "images/eagle2.png";

  eagle1Image = new Image();
  eagle1Image.onload = function() {
    // show the eagle image
    eagle1Ready = true;
  };
  eagle1Image.src = "images/eagle3.png";
}

/**
 * Setting up our characters.
 *
 * Note that monkeyX represents the X position of our monkey.
 * monkeyY represents the Y position.
 * We'll need these values to know where to "draw" the monkey.
 *
 * The same applies to the banana.
 */

let monkeyX = canvas.width / 2;
let monkeyY = canvas.height / 2;

let goriX = canvas.width / 2;
let goriY = canvas.height / 2;

const getRandom = (x) => Math.floor(Math.random() * x);


let bananaX = getRandom(1200);
let bananaY = getRandom(700);

let pineappleX = getRandom(1200);
let pineappleY = getRandom(700);

let eagleX = getRandom(1200);
let eagleY = getRandom(700);

let eagle1X = getRandom(1200);
let eagle1Y = getRandom(700);




let scoreMonkey = 0;
let scoreGori = 0;


let keysDown = {};
function setupKeyboardListeners() {

  addEventListener(
    "keydown",
    function(key) {
      keysDown[key.keyCode] = true;
    },
    false
  );

  addEventListener(
    "keyup",
    function(key) {
      delete keysDown[key.keyCode];
    },
    false
  );
}




/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the banana has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function() {

  // eagle
  let eagleDirectionX = 1;
  let eagleSpeed = game.startspeed - 15;
  eagleX += eagleSpeed * eagleDirectionX;
  eagleY = eagleY;

  if (eagleX <= -10) {
    eagleX = canvas.width - 10
    eagleY = Math.floor(Math.random() * 820) - 10;
  }

  if (eagleX >= canvas.width) {
    eagleX = 0
    eagleY = Math.floor(Math.random() * 820) - 10;
  }


  // eagle1
  let eagle1DirectionX = 1;
  let eagle1Speed = game.startspeed + 15;
  eagle1X += eagle1Speed * eagle1DirectionX;
  eagle1Y = eagle1Y;

  if (eagle1X <= -10) {
    eagle1X = canvas.width - 10
    eagle1Y = Math.floor(Math.random() * 1300) - 10;
  }

  if (eagle1X >= canvas.width - 10) {
    eagle1X = 0
    eagle1Y = Math.floor(Math.random() * 1300) - 10;
  }




  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  if (38 in keysDown) {
    // Player is holding up key
    monkeyY -= 10;
  }
  if (40 in keysDown) {
    // Player is holding down key
    monkeyY += 10;
  }
  if (37 in keysDown) {
    // Player is holding left key
    monkeyX -= 10;
  }
  if (39 in keysDown) {
    // Player is holding right key
    monkeyX += 10;
  }


  if (87 in keysDown) {
    // Player is holding up key
    goriY -= 10;
  }
  if (83 in keysDown) {
    // Player is holding down key
    goriY += 10;
  }
  if (65 in keysDown) {
    // Player is holding left key
    goriX -= 10;
  }
  if (68 in keysDown) {
    // Player is holding right key
    goriX += 10;
  }
















  if (monkeyX <= -10) {
    monkeyX = canvas.width - 10;
  }

  if (monkeyX >= canvas.width) {
    monkeyX = 0;
  }

  if (monkeyY >= canvas.height - 10) {
    monkeyY = 0;
  }

  if (monkeyY <= -10) {
    monkeyY = canvas.height - 10;
  }

  if (goriX <= -10) {
    goriX = canvas.width - 10;
  }

  if (goriX >= canvas.width) {
    goriX = 0;
  }

  if (goriY >= canvas.height - 10) {
    goriY = 0;
  }

  if (goriY <= -10) {
    goriY = canvas.height - 10;
  }





  let monkeyTouchBanana =
    monkeyX <= bananaX + 15 &&
    bananaX <= monkeyX + 50 &&
    monkeyY <= bananaY + 27 &&
    bananaY <= monkeyY + 50;

  if (monkeyTouchBanana) {
    scoreMonkey += 1;
    // console.log(scoreMonkey);
    bananaX = Math.floor(Math.random() * 1300);
    bananaY = Math.floor(Math.random() * 820);
  }

  let monkeyTouchPineapple =
  monkeyX <= pineappleX + 15 &&
  pineappleX <= monkeyX + 50 &&
  monkeyY <= pineappleY + 27 &&
  pineappleY <= monkeyY + 50;

if (monkeyTouchPineapple) {
  scoreMonkey += 5;
  // console.log(scoreMonkey);
  pineappleX = Math.floor(Math.random() * 1300);
  pineappleY = Math.floor(Math.random() * 820);
}

  let monkeyTouchEagle =
  monkeyX <= eagleX + 100 &&
  eagleX <= monkeyX + 50 &&
  monkeyY <= eagleY + 100 &&
  eagleY <= monkeyY + 50;

  if (monkeyTouchEagle) {
    scoreMonkey -= 10;
    // console.log(scoreMonkey);
    eagleX = Math.floor(Math.random() * 1200);
    eagleY = Math.floor(Math.random() * 820);
};

let monkeyTouchEagle1 =
monkeyX <= eagle1X + 100 &&
eagle1X <= monkeyX + 50 &&
monkeyY <= eagle1Y + 100 &&
eagle1Y <= monkeyY + 50;

if (monkeyTouchEagle1) {
  // Pick a new location for the banana.
  // Note: Change this to place the banana at a new, random location.
  scoreMonkey -= 10;
  // console.log(scoreMonkey);
  eagle1X = Math.floor(Math.random() * 1200);
  eagle1Y = Math.floor(Math.random() * 820);
};









let goriTouchBanana =
    goriX <= bananaX + 15 &&
    bananaX <= goriX + 50 &&
    goriY <= bananaY + 27 &&
    bananaY <= goriY + 50;

  if (goriTouchBanana) {
    scoreGori += 1;
    // console.log(scoreGori);
    bananaX = Math.floor(Math.random() * 1300);
    bananaY = Math.floor(Math.random() * 820);
  }

  let goriTouchPineapple =
  goriX <= pineappleX + 15 &&
  pineappleX <= goriX + 50 &&
  goriY <= pineappleY + 27 &&
  pineappleY <= goriY + 50;

if (goriTouchPineapple) {
  scoreGori += 5;
  // console.log(scoreGori);
  pineappleX = Math.floor(Math.random() * 1300);
  pineappleY = Math.floor(Math.random() * 820);
}

  let goriTouchEagle =
  goriX <= eagleX + 100 &&
  eagleX <= goriX + 50 &&
  goriY <= eagleY + 100 &&
  eagleY <= goriY + 50;

  if (goriTouchEagle) {
    scoreGori -= 10;
    // console.log(scoreGori);
    eagleX = Math.floor(Math.random() * 1200);
    eagleY = Math.floor(Math.random() * 820);
};

let goriTouchEagle1 =
goriX <= eagle1X + 100 &&
eagle1X <= goriX + 50 &&
goriY <= eagle1Y + 100 &&
eagle1Y <= goriY + 50;

if (goriTouchEagle1) {
  // Pick a new location for the banana.
  // Note: Change this to place the banana at a new, random location.
  scoreGori -= 10;
  // console.log(scoreGori);
  eagle1X = Math.floor(Math.random() * 1200);
  eagle1Y = Math.floor(Math.random() * 820);
};

document.getElementById("scoreMonkey").innerHTML = "Monkey Score: " + scoreMonkey;
document.getElementById("scoreGori").innerHTML = "Gori Score: " + scoreGori;

}




/**
 * This function, render, runs as often as possible.
 */
var render = function() {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (monkeyReady) {
    ctx.drawImage(monkeyImage, monkeyX, monkeyY);
  }
  if (goriReady) {
    ctx.drawImage(goriImage, goriX, goriY);
  }
  if (bananaReady) {
    ctx.drawImage(bananaImage, bananaX, bananaY);
  }
  if (pineappleReady) {
    ctx.drawImage(pineappleImage, pineappleX, pineappleY);
  }
  if (eagleReady) {
    ctx.drawImage(eagleImage, eagleX, eagleY);
  }
  if (eagle1Ready) {
    ctx.drawImage(eagle1Image, eagle1X, eagle1Y);
  }
  ctx.fillText(
    `Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`,
    20,
    100
  );
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our monkey and banana)
 * render (based on the state of our game, draw the right things)
 */
var main = function() {
  update();
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers.
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();
