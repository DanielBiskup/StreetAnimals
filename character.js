class Oscillator {
  constructor(
    min,
    max,
    changePerSecond,
    getValue,
    setValue
  ) {
    this.scalingUp = true;
    this.minScale = min;
    this.maxScale = max;
    this.changePerSecond = changePerSecond;
    this.getValue = getValue;
    this.setValue = setValue;
  }
  update(dtsec) {
    let old_scale = this.getValue();
    let new_scale;

    if (this.scalingUp) {
      new_scale = old_scale + this.changePerSecond * dtsec;
      if (new_scale >= this.maxScale) {
        this.scalingUp = false;
      }
    } else {
      new_scale = old_scale - this.changePerSecond * dtsec;
      if (new_scale <= this.minScale) {
        this.scalingUp = true;
      }
    }
    this.setValue(new_scale);
  }
}

class Character {
  constructor(canvas, renderer) {
    this.renderer = renderer;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.scale = 5.0;
    this.speed_pps = 100.0 + 100.0 * Math.random(); // speed in pixels per second
    this.action = 'walk';

    (() => {
      const minScale = 1.0;
      const maxScale = 10.0;
      const scaleChangePerSecond = 5.0;
      this.scaleOscillator = new Oscillator(
        minScale,
        maxScale,
        scaleChangePerSecond,
        () => this.scale,
        (v) => {
          this.scale = v;
        }
      );
    })();

    this.animatedSprite = new AnimatedSprite(
      images.player,
      animationData,
      renderer
    );

    this.animatedSprite.startAnimation(this.action);
    this.originalWidth = this.animatedSprite.frameWidth;
    this.originalHeight = this.animatedSprite.frameHeight;
    this.hitboxHeight = this.originalHeight;
    this.hitboxWidth = this.originalWidth;
    this.hitboxX = this.x;
    this.hitboxY = this.y;
  }

  #debug_draw() {
    this.renderer.drawRect(
      this.spriteX,
      this.spriteY,
      this.animatedSprite.frameWidth * this.scale,
      this.animatedSprite.frameHeight * this.scale,
      'cyan',
      12
    );

    this.renderer.drawDot(
      this.spriteX,
      this.spriteY,
      'cyan'
    );

    // Hitbox and its origin:
    this.renderer.drawRect(
      this.hitboxX,
      this.hitboxY,
      this.hitboxWidth,
      this.hitboxHeight,
      'red',
      6
    );
    this.renderer.drawDot(
      this.hitboxX,
      this.hitboxY,
      'red'
    );

    // Anchor position:
    this.renderer.drawDot(this.x, this.y, 'lime');
  }
  draw() {
    // The animated sprite and its origin:
    this.animatedSprite.draw(
      this.spriteX,
      this.spriteY,
      this.scale
    );

    this.#debug_draw();
  }

  update(dtsec) {
    // Update Components:
    this.animatedSprite.update(dtsec);
    // this.scaleOscillator.update(dtsec);

    // The hitbox values are relative to the orignal
    // unscaled width and height of the hitbox.
    // The hitbox offset helps in cases where for example
    // only the lower half of the image is take up by
    // a characters drawing. We don't want a hitbox that is
    // twice as high the character.
    // All four values are ecpected to be between 0.0 and 1.0.
    const relHitboxWidth = 1.0;
    const relHitboxHeight = 0.6;
    const relHitboxOffsetX = 0.0;
    const relHitboxOffsetY = 0.65;

    this.hitboxWidth =
      this.originalWidth * relHitboxWidth * this.scale;
    this.hitboxHeight =
      this.originalHeight * relHitboxHeight * this.scale;

    this.hitboxX = this.x - 0.5 * this.hitboxWidth;
    this.hitboxY = this.y - 0.5 * this.hitboxHeight;

    this.spriteX =
      this.hitboxX - this.hitboxWidth * relHitboxOffsetX;
    this.spriteY =
      this.hitboxY - this.hitboxHeight * relHitboxOffsetY;

    // Logic:
    if (this.action === 'walk') {
      if (this.x > canvas.width) {
        this.x = 0 - this.hitboxWidth;
        this.y =
          Math.random() * canvas.height - this.hitboxHeight;
      } else {
        this.x += this.speed_pps * dtsec;
      }
    }
  }
}
