let canvas, ctx;
let timeStart, timeEnd, totalTime;
let timeAllow = 20;
let isRestart = false;
let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;

let monsterX = 100;
let monsterY = 100;
let countMonsterCaught = 0;
let keysDown = {};

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function() {
    bgReady = true;
  };
  bgImage.src = "images/background.png";

  heroImage = new Image();
  heroImage.onload = function() {
    heroReady = true;
  };
  heroImage.src = "images/hero.png";

  monsterImage = new Image();
  monsterImage.onload = function() {
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";
}

function setupKeyboardListeners() {
  addEventListener(
    "keydown",
    function(key) {
      if (!timeStart) {
        timeStart = performance.now();
        console.log(timeStart);
      }
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

const generateLocation = canvas => {
  let x = Math.random() * canvas.width + 1;
  let y = Math.random() * canvas.height + 1;
  return { x, y };
};

const update = () => {
  if (38 in keysDown) {
    //UP
    heroY -= 2;
  }
  if (40 in keysDown) {
    //DOWN
    heroY += 2;
  }
  if (37 in keysDown) {
    //LEFT
    heroX -= 2;
  }
  if (39 in keysDown) {
    //RIGHT
    heroX += 2;
  }

  let { characterX, characterY } = notExceedCanvasBoundary(heroX, heroY);
  heroX = characterX;
  heroY = characterY;

  if (
    heroX <= monsterX + 32 &&
    monsterX <= heroX + 32 &&
    heroY <= monsterY + 32 &&
    monsterY <= heroY + 32
  ) {
    countMonsterCaught++;
    let { x, y } = generateLocation(canvas); // destructuring
    monsterX = x; //generate new location for Monster
    monsterY = y;
  }

  if (countMonsterCaught > 3) {
    gameOver();
  }
};

const notExceedCanvasBoundary = (characterX, characterY) => {
  characterX = Math.min(characterX, canvas.width - 40);
  characterX = Math.max(characterX, 0);
  characterY = Math.min(characterY, canvas.height - 40);
  characterY = Math.max(characterY, 0);
  return { characterX, characterY };
};

const resetGlobalVariable = () => {
  heroX = canvas.width / 2;
  heroY = canvas.height / 2;
  let { x, y } = generateLocation(canvas); // destructuring
  monsterX = x; //generate new location for Monster
  monsterY = y;
};

const gameOver = () => {
  //Reset Location of Hero
  resetGlobalVariable();
  ctx.textAlign = "center";
  ctx.fillText(
    `You Win. Congratulations. Restart (Y/N)`,
    canvas.width / 2,
    canvas.height / 2
  );
  if (32 in keysDown) {
    console.log("Push Y");
  }
  countMonsterCaught = 0;
};

const render = function() {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }

  ctx.font = "15px Arial";
  ctx.fillText(`heroX: ${heroX} - heroY: ${heroY}`, 50, 100);
  ctx.fillText(`monsterX: ${monsterX} - monsterY: ${monsterY}`, 100, 200);

  //Display Count of Monster Caught
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.fillText(`Score: ${countMonsterCaught}`, 20, 40);

  //Display Timer
  ctx.fillText(`Timer: ${timeAllow}`, 360, 40);
};

//The main game loop.
//update + render
let main = function() {
  update();
  render();
  if (countMonsterCaught > 2) {
    gameOver();
  } else {
    requestAnimationFrame(main); // Request to do this again ASAP.
  }
};

var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
gameStart = () => {
  loadImages();
  setupKeyboardListeners();
  main();
};

gameStart();
