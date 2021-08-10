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
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = 1920;
  canvas.height = 1080;
  fitCanvasToWindow();

  for (let i = 0; i < numberOfCharacters; i++) {
    characters.push(new Character(canvas));
  }
  // start the game loop
  window.requestAnimationFrame(gameLoop);
}

function fitCanvasToWindow() {
  const wx = document.body.clientWidth;
  const wy = document.body.clientHeight;
  // The the two lines above using document.body.clientWidth
  // work great, while using window.innerWidth below
  // used to cause problems, especially on mobile.
  //    const wx = window.innerWidth; //window width
  //    const wy = window.innerHeight; // window height
  let cx; // canvas width
  let cy; // canvas height
  const r = 16 / 9; // aspect ratio
  /**
   * cx/cy = r
   * cx = r * cy
   * cy = cx / r
   */
  if (wx / wy == r) {
    cx = wx;
    cy = wy;
  } else if (wx / wy > r) {
    cy = wy;
    cx = r * cy;
  } else if (wx / wy < r) {
    cx = wx;
    cy = cx / r;
  }
  canvas.style.width = `${cx}px`;
  canvas.style.height = `${cy}px`;
}

window.addEventListener('resize', () => {
  fitCanvasToWindow();
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
let animationData = {
  meta: {
    fps: 30,
    initialAnimation: 'jump',
    sheetWidth: 1649,
    sheetHeight: 905,
    numberOfColumns: 16,
    numberOfRows: 8,
  },
  animations: {
    up: {
      row: 0,
      minFrame: 4,
      maxFrame: 15,
    },
    right: {
      row: 3,
      minFrame: 3,
      maxFrame: 13,
    },
    jump: {
      row: 7,
      minFrame: 0,
      maxFrame: 9,
    },
    'down right': {
      row: 4,
      minFrame: 4,
      maxFrame: 15,
    },
  },
};

class AnimatedSprite {
  constructor(spriteSheet, animationData) {
    this.spriteSheet = spriteSheet;
    this.ticker = 0.0;

    // Initilize from data:
    this.animationData = animationData;
    this.fps = animationData.meta.fps; // fps of the animation
    this.frameWidth =
      animationData.meta.sheetWidth /
      animationData.meta.numberOfColumns;
    this.frameHeight =
      animationData.meta.sheetHeight /
      animationData.meta.numberOfRows;
    this.startAnimation(
      animationData.meta.initialAnimation
    );
  }

  startAnimation(action) {
    this.action = action;

    const actionAnimation =
      this.animationData['animations'][this.action];
    console.log(this.action);

    [this.row, this.minFrame, this.maxFrame] =
      Object.values(actionAnimation);
    this.column = this.minFrame;
  }

  draw(x, y) {
    drawSprite(
      this.spriteSheet,
      this.frameWidth * this.column,
      this.frameHeight * this.row,
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      this.frameWidth,
      this.frameHeight
    );
  }

  update(dtsec) {
    // animate sprites
    this.ticker += dtsec;
    if (this.ticker >= 1 / this.fps) {
      this.ticker = 0.0;
      if (this.column < this.maxFrame) this.column++;
      else this.column = this.minFrame;
    }
  }
}

class Character {
  constructor(canvas) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.speed = Math.random() * 3.5 + 1.5;
    this.action =
      characterActions[
        Math.floor(Math.random() * characterActions.length)
      ];
    this.animatedSprite = new AnimatedSprite(
      images.player,
      animationData
    );
    this.animatedSprite.startAnimation(this.action);
    this.width = this.animatedSprite.frameWidth;
    this.height = this.animatedSprite.frameHeight;
  }

  draw() {
    this.animatedSprite.draw(this.x, this.y);
  }

  update(dtsec) {
    // Update Components:
    this.animatedSprite.update(dtsec);

    // Logic:
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
  }
}

function updateCharacters(dtsec) {
  for (let i = 0; i < numberOfCharacters; i++) {
    characters[i].update(dtsec);
  }
}

function mainUpdate(dtsec, ctx) {
  /**
   *  dtsec is the time passed since last frame in seconds.
   *  The abbreviation stands for
   *    "[D]elta [T]ime in [SEC]onds"
   */

  // Background:
  drawBackground();

  // Characters:
  updateCharacters(dtsec);
  drawCharacters();

  // FPS Counter:
  fpsCounter.update(dtsec);
  fpsCounter.draw(ctx);
}
