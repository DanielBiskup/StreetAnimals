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
    this.animatedSprite.draw(this.x, this.y);
    
    this.renderer.drawRect(this.hitboxX, this.hitboxY, this.hitboxWidth, this.hitboxHeight);
    this.renderer.drawDot(this.x, this.y);
  }

  update(dtsec) {
    // Update Components:
    this.animatedSprite.update(dtsec);

    // The hitbox values are relative to the orignal
    // unscaled width and height of the object:
    const hitboxOffsetX = 0.0;
    const hitboxOffsetY = 0.5;
    const hitboxWidth = 1.0;
    const hitboxHeight = 0.7;
    const scale = 3.;
    this.hitboxWidth = this.originalWidth * hitboxWidth * scale;
    this.hitboxHeight = this.originalHeight * hitboxHeight * scale;
    this.hitboxX = this.x + (this.hitboxWidth * hitboxOffsetX);
    this.hitboxY = this.y + (this.hitboxHeight * hitboxOffsetY);
  
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
    // if (this.action === 'up') {
    //   if (this.y < 0 - this.height) {
    //     this.y = canvas.height;
    //     this.x = Math.random() * canvas.width;
    //   } else {
    //     this.y -= this.speed;
    //   }
    // }
    // if (this.action == 'down right') {
    //   if (this.y > canvas.height || this.x > canvas.width) {
    //     this.y = 0 - this.height;
    //     this.x = Math.random() * canvas.width;
    //   } else {
    //     this.x += this.speed;
    //     this.y += this.speed;
    //   }
    // }
  }
}
