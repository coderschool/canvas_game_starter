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
canvas.width = 800;
canvas.height = 500;
canvas.style.border = "thick solid #66b3ff";
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/ocean-background.jpg";

  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/mermaid.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/fish-1.png";
}

/** 
  Setting up our characters.
  Note that heroX represents the X position of our hero.
  heroY represents the Y position.
  We'll need these values to know where to "draw" the hero.
  The same applies to the monster.
*/

let heroX = canvas.width / 2; //X position of hero  
let heroY = canvas.height / 2; // Y position of hero

// let monsterX = 100; //X position of monster
// let monsterY = 100; //Y position of monster

let monsterX = Math.floor((Math.random() * canvas.width - 100)); //X position of monster
let monsterY = Math.floor((Math.random() * canvas.height - 100)); //Y position of monster
 
// Speed and direction movement of monster
let monsterSpeed = 5;
let monsterDirectionX = 1;
let monsterDirectionY = 1;

// I do not think I will need the below functionin this case
// function getRandomInt(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
// }


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

/** 38 is keycode of arrowUp;
   40 is keycode of arrowDown;
   37 is keycode of arrowLeft;
   39 is keycode of arrowRight;
*/

let score = 0;
let previousTime = 0;
let time = 0;
const SECONDS_PER_ROUND = 30;


let startTime = Date.now();
let roundStartTime = Date.now();
let roundTime = 0;

// Update time spent on playing.
function updateTime() {
  let currentTime = Date.now();
  time = Math.floor((currentTime - startTime) / 1000);
  roundTime = Math.floor( (currentTime - roundStartTime) / 1000);
}

let update = function () {
    if (38 in keysDown) { // Player is holding up key
      heroY -= 5; //
    }
    if (40 in keysDown) { // Player is holding down key
      heroY += 5;
    }
    if (37 in keysDown) { // Player is holding left key
      heroX -= 5;
    }
    if (39 in keysDown) { // Player is holding right key
      heroX += 5;
    }

    // Movement of monster
    if(monsterX + 40 >canvas.width || monsterX <= 0) {
      monsterDirectionX = monsterDirectionX * -1;
    }
    monsterX += (monsterSpeed * monsterDirectionX);
    
    if(monsterY + 40 > canvas.height || monsterY <= 0) {
      monsterDirectionY = monsterDirectionY * -1;
    }
    monsterY += (monsterSpeed * monsterDirectionY);

    // Check if player and monster collided. Our images
    // are about 32 pixels big.

    if (
      heroX <= (monsterX + 32) &&
      monsterX <= (heroX + 32) &&
      heroY <= (monsterY + 32) &&
      monsterY <= (heroY + 32)
    ) {
      // Pick a new location for the monster.
      // Note: Change this to place the monster at a new, random location.
      // Also update score.
      monsterX = Math.floor(Math.random() * canvas.width);
      monsterY = Math.floor(Math.random() * canvas.height);
      score = score + 1;
      roundStartTime = Date.now();
    }

    if (score >= 3 && score <10) {
      monsterImage.src = "images/fish-2.png";
    }
    if (score > 10 && score <20) {
      monsterImage.src = "images/fish-3.png";
    }

      if (heroX >= canvas.width) {
        heroX = 0;
      }
      if (heroX < 0) {
        heroX = canvas.width;
      }
      if (heroY >= canvas.height) {
        heroY = 0;
      }
      if (heroY < 0) {
        heroY = canvas.height;
      }
    };

    /**
     * This function, render, runs as often as possible.
     */
    let render = function () {
      if (bgReady) {
        ctx.drawImage(bgImage, 0, 0, 800, 500);
      }
      if (heroReady) {
        ctx.drawImage(heroImage, heroX, heroY, heroImage.width = 40, heroImage.height = 40);
      }
      if (monsterReady) {
        ctx.drawImage(monsterImage, monsterX, monsterY, monsterImage.width = 40, monsterImage.height = 40);
      }
      ctx.font = "20px Arial";
      ctx.fillText(`Your score: ${score}`, 10, 50);
      ctx.fillText(`Time spend: ${time} seconds`, 10, 80);
      ctx.fillText(`Time left per round: ${SECONDS_PER_ROUND - roundTime} seconds`, 10, 110);
    };

    /**
     * The main game loop. Most every game will have two distinct parts:
     * update (updates the state of the game, in this case our hero and monster)
     * render (based on the state of our game, draw the right things)
     */
    var main = function () {
      updateTime();
      update();
      render();
      // Request to do this again ASAP. This is a special method
      // for web browsers. 
      if (score < 20) {
        requestAnimationFrame(main);
      }
      if (score >= 20) {
        ctx.font = "30px Arial";
        ctx.fillText('Wow, it took this long to catch 20 of us! :D', 10, canvas.height / 2);
      }
    };

    // Cross-browser support for requestAnimationFrame.
    // Safely ignore this line. It's mostly here for people with old web browsers.
    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    // Let's play this game!
    loadImages();
    setupKeyboardListeners();
    main();