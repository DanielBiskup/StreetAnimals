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

class Hitbox {
  constructor(
    relWidth,
    relHeight,
    originalOffsetX,
    originalOffsetY,
    scale,
    getCenterX,
    getCenterY
  ) {
    this.x = 0;
    this.y = 0;
    this.scale = scale;
    this.getCenterX = getCenterX;
    this.getCenterY = getCenterY;
    this.originalOffsetX = originalOffsetX;
    this.originalOffsetY = originalOffsetY;

    // The hitbox dimensions and offset are given relative
    // in the coordinate frame of the original sprite image.
    //
    // The hitbox offset helps in cases where for example
    // only the lower half of the image is take up by
    // a characters drawing. We don't want a hitbox that is
    // twice as high the character.
    this.hitboxWidthInSource = relWidth;
    this.hitboxHeightInSource = relHeight;
    this.update();
  }
  update() {
    this.hitboxWidth =
      this.hitboxWidthInSource * this.scale();
    this.hitboxHeight =
      this.hitboxHeightInSource * this.scale();

    // Not sure if those two lines belong here or somewhere else
    this.hitboxOffsetX =
      this.originalOffsetX * this.scale();
    this.hitboxOffsetY =
      this.originalOffsetY * this.scale();

    this.x = this.getCenterX() - 0.5 * this.hitboxWidth;
    this.y = this.getCenterY() - 0.5 * this.hitboxHeight;
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

    this.hitbox = new Hitbox(
      1.0 * this.originalWidth,
      0.6 * this.originalHeight,
      0 * this.originalWidth,
      0.4 * this.originalHeight,
      () => this.scale,
      () => this.x,
      () => this.y
    );
  }

  debug_draw() {
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
      this.hitbox.x,
      this.hitbox.y,
      this.hitbox.hitboxWidth,
      this.hitbox.hitboxHeight,
      'red',
      6
    );
    this.renderer.drawDot(
      this.hitbox.x,
      this.hitbox.y,
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

    this.debug_draw();
  }

  update(dtsec) {
    // Update Components:
    true && this.animatedSprite.update(dtsec);
    true && this.scaleOscillator.update(dtsec);
    true && this.hitbox.update();

    this.spriteX =
      this.hitbox.x - this.hitbox.hitboxOffsetX;
    this.spriteY =
      this.hitbox.y - this.hitbox.hitboxOffsetY;

    // Logic:
    if (this.action === 'walk') {
      if (this.x > canvas.width) {
        this.x = 0 - this.hitbox.hitboxWidth;
        this.y =
          Math.random() * canvas.height -
          this.hitbox.hitboxHeight;
      } else {
        this.x += this.speed_pps * dtsec;
      }
    }
  }
}
