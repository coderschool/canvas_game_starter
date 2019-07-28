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
canvas.width = 1110;
canvas.height = 512;
// document.body.appendChild(canvas);
document.getElementById("gameContainer").appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;
let stoneReady, poolReady, bushReady, fireReady;
let stoneImage, poolImage, bushImage, fireImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
const endGameScore = 20;
let elapsedTime = 0;
let timePerGame = 0;
let score = 0;
let playerHighScore = 0;
//get high score from local storage
let highScore = localStorage.getItem("highScore");
document.getElementById("highScore").innerHTML = highScore;
// console.log("highScorehighScore", highScore);
let gameNumber = 1;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function() {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/backgroundN2.png";
  //hero
  heroImage = new Image();
  heroImage.onload = function() {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/shrekSmall.png";
  //monster
  monsterImage = new Image();
  monsterImage.onload = function() {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/blackGhost2.png";
  //stone
  stoneImage = new Image();
  stoneImage.onload = function() {
    // show the stone image
    stoneReady = true;
  };
  stoneImage.src = "images/stoneSmall.png";
  //pool
  poolImage = new Image();
  poolImage.onload = function() {
    // show the pool image
    poolReady = true;
  };
  poolImage.src = "images/pondFrog2.png";
  //bush
  bushImage = new Image();
  bushImage.onload = function() {
    // show the push image
    bushReady = true;
  };
  bushImage.src = "images/stoneSmall2.png";
  //fire
  fireImage = new Image();
  fireImage.onload = function() {
    // show the fire image
    fireReady = true;
  };
  fireImage.src = "images/fireSmall.png";
}

class gameObject {
  constructor(locationX, locationY, sizeX, sizeY) {
    this.X = locationX;
    this.Y = locationY;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
  }
}
class objectRange {
  constructor(minX, minY, maxX, maxY) {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }
}

// let hero.X = canvas.width / 2;
// let hero.Y = canvas.height / 2;

// let monster.X = Math.floor(Math.random() * (canvas.width - 10)) + 1;
// let monster.Y = Math.floor(Math.random() * (canvas.height - 10)) + 1;

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function moveObjectRandomly(object, objectRange) {
  const moveX = getRandomIntInclusive(objectRange.minX, objectRange.maxX);
  const moveY = getRandomIntInclusive(objectRange.minY, objectRange.maxY);
  object.X = moveX;
  object.Y = moveY;
  return object;
}

/**
 * Setting up our characters.
 *
 * Note that hero.X represents the X position of our hero.
 * hero.Y represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 *
 * The same applies to the monster.
 */
let hero = new gameObject(canvas.width / 2, canvas.height / 2, 65, 78);
const heroRange = new objectRange(
  10,
  10,
  canvas.width - 65,
  canvas.height - 78
);
let monster = new gameObject(100, 100, 50, 57);
console.log("monterere142", monster);

const monsterRange = new objectRange(
  10,
  10,
  canvas.width - monster.sizeX,
  canvas.height - monster.sizeY
);
console.log("monsterRange150", monsterRange);
// console.log(`hero.X: ${hero.X} and hero.Y: ${hero.Y}`);
let stone = new gameObject(canvas.width / 7, canvas.height / 4, 100, 67);
let pool = new gameObject(canvas.width - 480, 70, 150, 150);
let bush = new gameObject(canvas.width - 750, canvas.height - 150, 120, 78);
let fire = new gameObject(canvas.width - 100, canvas.height - 200, 60, 60);

let obstacle = [stone, pool, bush];
// let hero.X = canvas.width / 2;
// let hero.Y = canvas.height / 2;
// let monster.X = 100;
// let monster.Y = 100;

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

function isObjectOneColideObjectTwo(objectOne, ObjectTwo) {
  const isObj1CollideObj2 =
    objectOne.X <= ObjectTwo.X + ObjectTwo.sizeX &&
    ObjectTwo.X <= objectOne.X + objectOne.sizeX &&
    objectOne.Y <= ObjectTwo.Y + ObjectTwo.sizeY &&
    ObjectTwo.Y <= objectOne.Y + objectOne.sizeY;
  if (isObj1CollideObj2) {
    return true;
  } else {
    return false;
  }
}

/**Restart Game */
function playAgain() {
  //reset
  startTime = Date.now();
  score = 0;
  gameNumber = gameNumber + 1;

  document.getElementById("scoreNumber").innerHTML = score;
  document.getElementById("gameNumber").innerHTML = gameNumber;
  // document.getElementById("timePlay").innerHTML = elapsedTime;
}

function isObjectNotColideObstacle(object, obstacle) {
  const isObjColideObs =
    isObjectOneColideObjectTwo(object, obstacle[0]) ||
    isObjectOneColideObjectTwo(object, obstacle[1]) ||
    isObjectOneColideObjectTwo(object, obstacle[2]);
  if (isObjColideObs) {
    return false;
  } else {
    return true;
  }
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */
monster = moveObjectRandomly(monster, monsterRange);

if (isObjectNotColideObstacle(monster, obstacle)) {
  monster = moveObjectRandomly(monster, monsterRange);
}

let update = function() {
  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const isStillTimeAndScoreNotMax =
    elapsedTime <= SECONDS_PER_ROUND && score <= endGameScore;
  if (isStillTimeAndScoreNotMax) {
    document.getElementById("timePlay").innerHTML = elapsedTime;
    document.getElementById("scoreNumber").innerHTML = score;
  } else {
    // GAME OVER
    return;
  }

  if (38 in keysDown) {
    // Player is holding up key
    hero.Y -= 5;
  }
  if (40 in keysDown) {
    // Player is holding down key
    hero.Y += 5;
  }
  if (37 in keysDown) {
    // Player is holding left key
    hero.X -= 5;
  }
  if (39 in keysDown) {
    // Player is holding right key
    hero.X += 5;
  }

  if (hero.X <= 10) {
    hero.X = 10;
  }
  if (hero.X >= canvas.width - 20) {
    hero.X = canvas.width - 20;
  }
  if (hero.Y <= 10) {
    hero.Y = 10;
  }
  if (hero.Y >= canvas.height - 20) {
    hero.Y = canvas.height - 20;
  }
  // console.log("hero.Xhero.X", hero.X);
  // console.log("hero.Yhero.Y", hero.Y);
  // Check if player and monster collided. Our images
  // are about 32 pixels big.

  // const isHeroCollideMonster =
  //   hero.X <= monster.X + 32 &&
  //   monster.X <= hero.X + 32 &&
  //   hero.Y <= monster.Y + 32 &&
  //   monster.Y <= hero.Y + 32;
  // if (isObjectOneColideObjectTwo(hero, stone)) {
  // }
  if (isObjectOneColideObjectTwo(hero, monster)) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.

    score = score + 1;
    // console.log("scorescore", score);
    // console.log("hero.Xhero.X", hero.X);
    // console.log("hero.Yhero.Y", hero.Y);
    // document.getElementById("scoreNumber").innerHTML = score;

    if (score > playerHighScore) {
      playerHighScore = score;
      document.getElementById("playerHighScore").innerHTML = playerHighScore;
    }
    if (playerHighScore > highScore) {
      highScore = playerHighScore;
      document.getElementById("highScore").innerHTML = highScore;
      localStorage.setItem("highScore", highScore);
    }

    // monster.X = monster.X + 50;
    // monster.Y = monster.Y + 70;
    // monster.X = Math.floor(Math.random() * (canvas.width - 25)) + 1;
    // monster.Y = Math.floor(Math.random() * (canvas.height - 25)) + 1;
    // objectsMoveRandomly(monster.X, monster.Y);
    monster = moveObjectRandomly(monster, monsterRange);
    console.log(`monster(x,y)L307= (${monster.X},${monster.Y})`);
  }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function() {
  let remainTime = SECONDS_PER_ROUND - elapsedTime;
  const isStillTimeAndScoreNotMax =
    elapsedTime <= SECONDS_PER_ROUND && score <= endGameScore;
  if (isStillTimeAndScoreNotMax) {
    if (bgReady) {
      ctx.drawImage(bgImage, 0, 0);
    }
    if (heroReady) {
      ctx.drawImage(heroImage, hero.X, hero.Y);
    }
    if (monsterReady) {
      // ctx.clearRect(monster.X, monster.Y, 65, 74);
      // ctx.save();
      // ctx.globalAlpha = 0.5;
      ctx.drawImage(monsterImage, monster.X, monster.Y);
      // ctx.restore();
    }

    if (stoneReady) {
      ctx.drawImage(stoneImage, stone.X, stone.Y);
    }
    if (poolReady) {
      ctx.drawImage(poolImage, pool.X, pool.Y);
    }
    if (bushReady) {
      ctx.drawImage(bushImage, bush.X, bush.Y);
    }
    if (fireReady) {
      ctx.drawImage(fireImage, fire.X, fire.Y);
    }

    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Seconds Remaining: ${remainTime}`, 20, 50);
  } else {
    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    // GAME OVER
    return;
  }
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
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
