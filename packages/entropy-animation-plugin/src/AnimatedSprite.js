const PIXI = require('pixi.js');

/**
 * Code in this class is based on PIXI AnimatedSprite class: https://github.com/pixijs/pixi.js/blob/dev/src/extras/AnimatedSprite.js
 */
export default class AnimatedSprite extends PIXI.Sprite
{
  /**
   * @param {PIXI.Texture[]|FrameObject[]} textures - an array of {@link PIXI.Texture} or frame
   *  objects that make up the animation
   */
  constructor(textures) {
    super(textures[0] instanceof PIXI.Texture ? textures[0] : textures[0].texture);

    /**
     * @private
     */
    this._textures = null;

    /**
     * @private
     */
    this._durations = null;

    this.textures = textures;

    /**
     * The speed that the AnimatedSprite will play at. Higher is faster, lower is slower
     *
     * @member {number}
     * @default 1
     */
    this.animationSpeed = 1;

    /**
     * Whether or not the animate sprite repeats after playing.
     *
     * @member {boolean}
     * @default true
     */
    this.loop = true;

    this.standardFrameDuration = 1000;

    /**
     * Function to call when a AnimatedSprite finishes playing
     *
     * @member {Function}
     */
    this.onComplete = null;

    /**
     * Function to call when a AnimatedSprite changes which texture is being rendered
     *
     * @member {Function}
     */
    this.onFrameChange = null;

    /**
     * Elapsed time since animation has been started, used internally to display current texture
     *
     * @member {number}
     * @private
     */
    this._currentTime = 0;


    this._currentFrameTime = 0;

    this.currentFrame = 0;

    /**
     * Indicates if the AnimatedSprite is currently playing
     *
     * @member {boolean}
     * @readonly
     */
    this.playing = false;
  }

  /**
   * Stops the AnimatedSprite
   *
   */
  stop() {
    if (!this.playing) {
      return;
    }

    this.playing = false;
  }

  /**
   * Plays the AnimatedSprite
   *
   */
  play() {
    if (this.playing) {
      return;
    }

    this.playing = true;
  }

  /**
   * Stops the AnimatedSprite and goes to a specific frame
   *
   * @param {number} frameNumber - frame index to stop at
   */
  gotoAndStop(frameNumber) {
    this.stop();

    const previousFrame = this.currentFrame;

    this._currentTime = frameNumber;

    if (previousFrame !== this.currentFrame) {
      this.updateTexture();
    }
  }

  /**
   * Goes to a specific frame and begins playing the AnimatedSprite
   *
   * @param {number} frameNumber - frame index to start at
   */
  gotoAndPlay(frameNumber) {
    const previousFrame = this.currentFrame;

    this._currentTime = frameNumber;

    if (previousFrame !== this.currentFrame) {
      this.updateTexture();
    }

    this.play();
  }

  /**
   * Updates the object transform for rendering.
   *
   * @private
   * @param {number} deltaTime - Time since last tick.
   */
  update(deltaTime) {
    if (!this.playing) {
      return;
    }

    const elapsed = this.animationSpeed * deltaTime;

    let currentFrameDuration;

    if (this._durations !== null) {
      currentFrameDuration = this._durations[this.currentFrame];
    } else {
      currentFrameDuration = this.standardFrameDuration;
    }

    this._currentFrameTime += elapsed;

    // następna klatka
    if (this._currentFrameTime > currentFrameDuration) {
      let nextFrame = this.currentFrame + 1;

      // koniec animacji
      if (!this.loop && nextFrame === this._textures.length) {
        this.gotoAndStop(nextFrame - 1);

        if (this.onComplete) {
          this.onComplete();
        }

        return;
      }

      // jeśli pętla to następna klatka jest pierwszą
      if (this.loop && nextFrame === this._textures.length) {
        nextFrame = 0;
      }

      this.currentFrame = nextFrame;
      this._currentFrameTime -= currentFrameDuration;
      this.updateTexture();
    }
  }

  /**
   * Updates the displayed texture to match the current frame index
   *
   * @private
   */
  updateTexture() {
    this._texture = this._textures[this.currentFrame];
    this._textureID = -1;

    if (this.onFrameChange) {
      this.onFrameChange(this.currentFrame);
    }
  }

  /**
   * Stops the AnimatedSprite and destroys it
   *
   */
  destroy() {
    this.stop();
    super.destroy();
  }

  /**
   * totalFrames is the total number of frames in the AnimatedSprite. This is the same as number of textures
   * assigned to the AnimatedSprite.
   *
   * @readonly
   * @member {number}
   * @default 0
   */
  get totalFrames() {
    return this._textures.length;
  }

  /**
   * The array of textures used for this AnimatedSprite
   *
   * @member {PIXI.Texture[]}
   */
  get textures() {
    return this._textures;
  }

  set textures(value) {
    if (value[0] instanceof PIXI.Texture) {
      this._textures = value;
      this._durations = null;
    } else {
      this._textures = [];
      this._durations = [];

      for (let i = 0; i < value.length; i++) {
        this._textures.push(value[i].texture);
        this._durations.push(value[i].time);
      }
    }
  }
}
