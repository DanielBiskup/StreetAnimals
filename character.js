class Character {
  constructor(canvas, renderer) {
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
    if (this.action === 'walk') {
      if (this.x > canvas.width) {
        this.x = 0 - this.width;
        this.y =
          Math.random() * canvas.height - this.height;
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
