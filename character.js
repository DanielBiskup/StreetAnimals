class Character {
  constructor(canvas, renderer) {
    this.renderer = renderer; 

    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;


    // speed in pixels per second
    this.speed_pps = 100.0 + 100.0 * Math.random();
    const characterActions = ['walk']
    this.action =
      characterActions[
        Math.floor(Math.random() * characterActions.length)
      ];
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
  }

  draw() {
    // The animated sprite and its origin:
    this.animatedSprite.draw(this.spriteX, this.spriteY);
    this.renderer.drawDot(this.spriteX, this.spriteY, 'cyan')

    // Hitbox and its origin:
    this.renderer.drawRect(this.hitboxX, this.hitboxY, this.hitboxWidth, this.hitboxHeight);
    this.renderer.drawDot(this.hitboxX, this.hitboxY, 'red');
    
    // Anchor position:
    this.renderer.drawDot(this.x, this.y, 'lime')
  }

  update(dtsec) {
    // Update Components:
    this.animatedSprite.update(dtsec);

    // The hitbox values are relative to the orignal
    // unscaled width and height of the hitbox.
    // The hitbox offset helps in cases where for example
    // only the lower half of the image is take up by
    // a characters drawing. We don't want a hitbox that is
    // twice as high the character.
    // All four values are ecpected to be between 0.0 and 1.0.
    const relHitboxWidth = 1.0;
    const relHitboxHeight = 0.7;
    const relHitboxOffsetX = 0.0;
    const relHitboxOffsetY = 0.5;

    const scale = 3.;
    this.hitboxWidth = this.originalWidth * relHitboxWidth * scale;
    this.hitboxHeight = this.originalHeight * relHitboxHeight * scale;
  
    let anchor;
    anchor = "center-of-bounding-box";
    // here (this.x, this.y) is taken to be the center of
    // the bounding box.

    // anchor = "top-left-corner-of-sprite";
    // for this option the this.x and this.y will get removed
    // further and further from the hitbox and the sprite
    // the more we increase the scale factor. This is why
    // I prefer "center-of-bounding-box"
    if (anchor === "top-left-corner-of-sprite") {
    this.hitboxX = this.x + (this.hitboxWidth * relHitboxOffsetX);
    this.hitboxY = this.y + (this.hitboxHeight * relHitboxOffsetY);
    this.spriteX = this.x;
    this.spriteY = this.y;
    } else if (anchor === 'center-of-bounding-box') {
    this.hitboxX = (this.x - 0.5 * this.hitboxWidth);
    this.hitboxY = (this.y - 0.5 * this.hitboxHeight);
    this.spriteX = this.hitboxX;
    this.spriteY = this.hitboxY - this.hitboxHeight * relHitboxOffsetY;
    }

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
