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

//Timer
let timeUpdate = function () {
  t++;
  timer.innerText = `${t} s`;
};

//stop timing
let stopTimer = function (t) {
  clearInterval(t);
};

//START
function start() {
  count = 0;
  t = 0;
  myTimer = setInterval(timeUpdate, 1000);
  setupKeyboardListeners();
}

//generate random Number from 0 to x-1
function random(x) {
  return Math.floor(Math.random() * x)
}

function countAndShow() {
  //count times a plant has caught
  if (count < 3) {
    count++;
    result.innerText = `${count}`;
  } else if (count === 3) {
    stopTimer(myTimer);
    //stopKeyboarListeners();
  }
}



let bgReady, zoombieReady, plantReady, fixedReady;
let bgImage, zoombieImage, plantImage, fixedImage;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "/images/bg-zombie.png";

  zoombieImage = new Image();
  zoombieImage.onload = function () {
    // show the zoombie image
    zoombieReady = true;
  };
  zoombieImage.src = "images/zoombie-1.png";

  plantImage = new Image();
  plantImage.onload = function () {
    // show the plant image
    plantReady = true;
  };
  plantImage.src = "/images/plant.png";

  fixedImage = new Image();
  fixedImage.onload = function () {
    fixedReady = true;
  };
  fixedImage.src = "/images/fixed-1.png"

}

/*
 * Setting up our characters.
 */

let zoombieX = canvas.width / 2;
let zoombieY = canvas.height / 2;


let fixedX = 200;
let fixedY = 200;

/*
 * setup keyboardListener and remove keyboardListener
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
 */

let update = function () {
  alert('update works')
  if (38 in keysDown) {
    // Player is holding up key

    zoombieY -= 5;
  }
  if (40 in keysDown) {
    // Player is holding down key

    zoombieY += 5;
  }
  if (37 in keysDown) {
    // Player is holding left key
    zoombieX -= 5;
  }
  if (39 in keysDown) {
    // Player is holding right key
    zoombieX += 5;
  }

  //to limit objects move inside canvas
  // if(zoombieX> canvas.width - zoombieImage.width) {
  //   zoombieX = canvas.width - zoombieImage.width;
  // }


  // Check if player and plant collided. Our images
  // are about 32 pixels big.
  if (
    zoombieX <= plantX + 32 &&
    plantX <= zoombieX + 32 &&
    zoombieY <= plantY + 32 &&
    plantY <= zoombieY + 32
  ) {
    // Pick a new location for the plant.
    plantX = random(944);
    plantY = random(373);
    countAndShow();
  }
};

/* RENDER */
let render = function () {
  alert('render ok')
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  // if (fixedReady) {
  //   ctx.drawImage(fixedImage, 360, 340);
  //   ctx.drawImage(fixedImage, 520, 140);
  // }
  // if (zoombieReady) {
  //   ctx.drawImage(zoombieImage, zoombieX, zoombieY);
  // }
  // if (plantReady) {
  //   ctx.drawImage(plantImage, plantX, plantY);
  // }

};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our zoombie and plant)
 * render (based on the state of our game, draw the right things)
 */
let main = function () {
  alert("main ok")
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
startBtn.addEventListener("click", start);
loadImages();

//setupKeyboardListeners();
main();




// function changePosition(myItem) {
//   let h = canvas.height - plantImage.height;
//   let w = canvas.width - plantImage.width;
//   let nh = Math.floor(Math.random()) * h;
//   let nw = Math.floor(Math.random()) * w;

//   myItem.animate({plantX: nh, plantY: nw}, 2000, changePosition(myItem) )

// }