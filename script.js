'use strict';

// Globals:
let canvas;
let ctx;

const images = {};
images.background = new Image();
images.background.src =
  './assets/stone-floor/StoneFloorTexture_1.png';
images.player = new Image();
// images.player.src = './non-free-assets/cuphead.png';
images.player.src = './assets/street_animals/1 Dog/Walk.png';

const numberOfCharacters = 10;
const characters = [];

window.onload = init;
function init() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = 1920;
  canvas.height = 1080;
  fitCanvasToWindow();

  let animationDataPath = './animationDataAnimal.json';
  fetch(animationDataPath)
    .then((response) => response.json())
    .then((data) => {
      animationData = data;
      const renderer = new Renderer(canvas, ctx);
      for (let i = 0; i < numberOfCharacters; i++) {
        characters.push(new Character(canvas, renderer));
      }
      // start the game loop
      window.requestAnimationFrame(gameLoop);
    });
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

class Renderer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    // Disable smoothing because we are dealing with
    // pixel art where we don't want any smoothing
    this.ctx.imageSmoothingEnabled = false;
  }

  drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    this.ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
  }
  
  drawRect(x,y,w,h) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = "6";
    this.ctx.rect(x, y, w, h);
    this.ctx.stroke();
  }
  
  drawDot(x,y, color) {
    const size = 20;
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x-size/2,y-size/2,size,size);
    this.ctx.stroke();
  }
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
let animationData;

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
