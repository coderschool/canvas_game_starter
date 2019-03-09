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

canvas = document.querySelector("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 488;

let maxCount = 2;
let totalTime = 30;

// document.body.appendChild(canvas);

let bgReady, dinoReady, eggReady;
let bgImage, dinoImage, eggImage;

var deadline = new Date(Date.parse(new Date()) + 1 * 1 * 1 * totalTime * 1000);

let newGameBtn = document.getElementById("resetBtn");
newGameBtn.addEventListener("click", Reset);

let secondsSpan = document.getElementById("remain-time");

var timeinterval;

var backgroundMusic;

var img = [
  "1.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png",
  "6.png",
  "7.png",
  "8.png",
  "9.png",
  "10.png",
  "11.png",
  "12.png",
  "13.png",
  "14.png",
  "15.png",
  "16.png"
];

initializeClock("remain-time", deadline);

function loadImages() {
  bgImage = new Image(); //create new Img Element
  bgImage.onload = function() {
    //// execute drawImage statements here
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background2.png";
  dinoImage = new Image();
  dinoImage.onload = function() {
    // show the dino image
    dinoReady = true;
  };
  dinoImage.src = "images/dino.png";

  eggImage = new Image();
  eggImage.onload = function() {
    // show the egg image
    eggReady = true;
  };
  eggImage.src = "images/eggFolder/1.png";
}

function getRandomImage() {
  var num = Math.floor(Math.random() * img.length);

  eggImage.src = "images/eggFolder/" + img[num];

  // show the egg image
}

//random color

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

let eggCount = 0;

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
  addEventListener(
    "keydown",
    function(key) {
      // keysDown[34] = true;
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
 *  and check to see if the egg has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function() {
  if (38 in keysDown) {
    // Player is holding up key
    dinoY -= 6;
    if (dinoY < 0) {
      dinoY = canvas.height;
    }
  }
  if (40 in keysDown) {
    // Player is holding down key
    dinoY += 6;
    if (dinoY > canvas.height) {
      dinoY = 0;
    }
  }
  if (37 in keysDown) {
    // Player is holding left key
    dinoX -= 6;
    dinoImage.src = "images/dino_left.png";
    if (dinoX < 0) {
      dinoX = canvas.width;
    }
  }
  if (39 in keysDown) {
    // Player is holding right key
    dinoX += 6;
    dinoImage.src = "images/dino.png";
    if (dinoX >= canvas.width) {
      dinoX = 0;
    }
  }

  if (
    dinoX <= eggX + 40 &&
    eggX <= dinoX + 40 &&
    dinoY <= eggY + 40 &&
    eggY <= dinoY + 40
  ) {
    eggCount += 1;
    getRandomImage();
    // Pick a new location for the egg.
    // Note: Change this to place the egg at a new, random location.
    eggX = Math.floor(Math.random() * 480);
    eggY = Math.floor(Math.random() * 380);
  }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function() {
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
};

function win() {
  ctx.font = "20px Comic Sans MS";
  ctx.fillStyle = "red";
  ctx.fillText("Congrats. You win", 150, 150);
  stopTimer(timeinterval);

  let gameLevel2 = document.getElementById("level2");
  gameLevel2.style.display = "block";
}

function lose() {
  ctx.font = "20px Comic Sans MS";
  ctx.fillStyle = "red";
  ctx.fillText("Sorry, try next time", 150, 150);
  stopTimer(timeinterval);
}

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our dino and egg)
 * render (based on the state of our game, draw the right things)
 */

var main = function() {
  var currentRemainingTime = secondsSpan.innerHTML;

  if (currentRemainingTime !== "0" && eggCount >= 0 && eggCount < maxCount) {
    update();
    render();
    let eggCountNum = document.getElementById("eggCountHTML");
    eggCountNum.innerHTML = eggCount;
  }

  if (eggCount === maxCount) {
    win();
  }

  if (currentRemainingTime === "0") {
    lose();
  }

  // ctx.font = "12px Comic Sans MS";
  // ctx.fillStyle = "red";

  // ctx.fillText(`Remaining time: ${remainTime}s`, 50, 40);
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

function Reset() {
  location.reload();
}

function initializeClock(id, endtime) {
  var timer = document.getElementById(id);

  function updateClock() {
    var t = getTimeRemaining(endtime);

    secondsSpan.innerHTML = ("0" + t.seconds).slice(-2);

    if (t.total <= 0) {
      secondsSpan.innerHTML = "0";
    }
  }

  updateClock();
  timeinterval = setInterval(updateClock, 1000);
}

function stopTimer(clock) {
  clearInterval(clock);
  // secondsSpan.innerHTML = "0";
}

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);

  return {
    total: t,

    seconds: seconds
  };
}

function closeForm(element) {
  document.getElementById(element).style.display = "none";
}

function submitName() {
  let userInputName = document.getElementById("nameInput").value;

  let player = document.getElementById("playerName");
  player.innerHTML = "Hello " + userInputName + "!";
  closeForm("myForm");
}

let submitButton = document.getElementById("submitBtn");
submitButton.addEventListener("click", submitName);

// Let's play this game!

backgroundMusic = document.getElementById("myBgMusic");

function playAudio() {
  myBgMusic.play();
}
let volOnBtn = document.getElementById("volOn");
volOnBtn.addEventListener("click", playAudio);

function pauseAudio() {
  myBgMusic.pause();
}
let volOffBtn = document.getElementById("volOff");
volOffBtn.addEventListener("click", pauseAudio);

function toggle() {
  var x = document.getElementById("instruction");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

let hintBtn = document.getElementById("playHint");
hintBtn.addEventListener("click", toggle);

loadImages();

setupKeyboardListeners();

main();
// let userInput = prompt("Please enter your name");
// let player = document.getElementById("playerName");
// player.innerHTML = userInput;
// console.log("username", userInput);
