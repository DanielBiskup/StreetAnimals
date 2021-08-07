'use strict';
let canvas;
let ctx;

// one dictionary for all images:
const images = {};

// load background image
images.background = new Image();
images.background.src =
  './assets/stone-floor/StoneFloorTexture_1.png';

// load player image
images.player = new Image();
images.player.src = './non-free-assets/cuphead.png';

const characterActions = ['up', 'right', 'down right'];
const numberOfCharacters = 10;
const characters = [];

window.onload = init;
function init() {
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  for (let i = 0; i < numberOfCharacters; i++) {
    characters.push(new Character(canvas));
  }
  // start the game loop
  window.requestAnimationFrame(gameLoop);
}

window.addEventListener('resize', () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});

let secondsPassed;
let oldTimeStamp = 0.0;

class FpsCounter {
  constructor() {
    this.fps;
    this.fpsRenderBuffer = 0;
    this.timeSinceLastFpsUpdate = 0.1;
  }
  update(dtsec) {
    this.fps = Math.round((1 / dtsec) * 100) / 100;
    this.timeSinceLastFpsUpdate += dtsec;
    if (this.timeSinceLastFpsUpdate > 0.5) {
      this.fpsRenderBuffer = this.fps;
      this.timeSinceLastFpsUpdate = 0.0;
    }
  }
  draw(ctx) {
    /** In chrome requestAnimationFrame's callback doesn't
     *  get called faster than 60Hz. That's the FPS are
     *  a stable 60FPS.
     */
    function financial(x) {
      return Number.parseFloat(x).toFixed(2);
    }
    ctx.font = '25px Arial';
    ctx.fillStyle = 'greenyellow';
    ctx.fillText(
      'FPS: ' + financial(this.fpsRenderBuffer),
      10,
      30
    );
  }
}

let fpsCounter = new FpsCounter(ctx);

function gameLoop(timeStamp) {
  // calculate time delta
  let millisecondsPassed = timeStamp - oldTimeStamp;
  secondsPassed = millisecondsPassed / 1000;
  oldTimeStamp = timeStamp;

  mainUpdate(secondsPassed, ctx);
  window.requestAnimationFrame(gameLoop);
}

class Character {
  constructor(canvas) {
    this.width = 103.0625;
    this.height = 113.125;
    this.frameX = 3;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.speed = Math.random() * 3.5 + 1.5;
    this.action =
      characterActions[
        Math.floor(Math.random() * characterActions.length)
      ];
    if (this.action === 'up') {
      this.frameY = 0;
      this.minFrame = 4;
      this.maxFrame = 15;
    } else if (this.action === 'right') {
      this.frameY = 3;
      this.minFrame = 3;
      this.maxFrame = 13;
    } else if (this.action === 'jump') {
      this.frameY = 7;
      this.minFrame = 0;
      this.maxFrame = 9;
    } else if (this.action === 'down right') {
      this.frameY = 4;
      this.minFrame = 4;
      this.maxFrame = 15;
    }
  }
  draw() {
    drawSprite(
      images.player,
      this.width * this.frameX,
      this.height * this.frameY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );

    // animate sprites
    if (this.frameX < this.maxFrame) this.frameX++;
    else this.frameX = this.minFrame;
  }
  update() {
    if (this.action === 'right') {
      if (this.x > canvas.width) {
        this.x = 0 - this.width;
        this.y =
          Math.random() * canvas.height - this.height;
      } else {
        this.x += this.speed;
      }
    }
    if (this.action === 'up') {
      if (this.y < 0 - this.height) {
        this.y = canvas.height;
        this.x = Math.random() * canvas.width;
      } else {
        this.y -= this.speed;
      }
    }
    if (this.action == 'down right') {
      if (this.y > canvas.height || this.x > canvas.width) {
        this.y = 0 - this.height;
        this.x = Math.random() * canvas.width;
      } else {
        this.x += this.speed;
        this.y += this.speed;
      }
    }
  }
}

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
  ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

function drawBackground() {
  let backgroundPattern = ctx.createPattern(
    images.background,
    'repeat'
  );
  ctx.fillStyle = backgroundPattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCharacters() {
  for (let i = 0; i < numberOfCharacters; i++) {
    characters[i].draw();
    characters[i].update();
  }
}

function mainUpdate(dtsec, ctx) {
  /**
   *  dtsec is the time passed since last frame in seconds.
   *  The abbreviation stands for
   *    "[D]elta [T]ime in [SEC]onds"
   */
  drawBackground();
  drawCharacters();
  fpsCounter.update(dtsec);
  fpsCounter.draw(ctx);
}
