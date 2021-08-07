const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

// load background image
backgroundImg = new Image();
backgroundImg.src =
  './assets/stone-floor/StoneFloorTexture_1.png';

// load images
const images = {};
images.player = new Image();
const characterActions = ['up', 'right', 'down right'];
const numberOfCharacters = 10;
const characters = [];

class Character {
  constructor() {
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

for (i = 0; i < numberOfCharacters; i++) {
  characters.push(new Character());
}
images.player.src = './non-free-assets/cuphead.png';

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
  ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}
function drawBackground() {
  backgroundPattern = ctx.createPattern(
    backgroundImg,
    'repeat'
  );
  ctx.fillStyle = backgroundPattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animate() {
  drawBackground();
  for (i = 0; i < numberOfCharacters; i++) {
    characters[i].draw();
    characters[i].update();
  }
}

window.onload = setInterval(animate, 1000 / 20);
window.addEventListener('resize', () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});
