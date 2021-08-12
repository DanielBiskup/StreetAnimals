class AnimatedSprite {
  constructor(spriteSheet, animationData, renderer) {
    // Systems
    this.renderer = renderer;

    // Data
    this.spriteSheet = spriteSheet;
    this.animationData = animationData;

    // Initilize from data
    this.ticker = 0.0;
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

  draw(x, y, scale) {
    this.renderer.drawSprite(
      this.spriteSheet,
      this.frameWidth * this.column,
      this.frameHeight * this.row,
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      this.frameWidth * scale,
      this.frameHeight * scale
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
