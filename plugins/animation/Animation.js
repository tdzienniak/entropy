var is = Entropy.Utils.is;

/**
 * Animation class.
 * 
 * @class Entropy.Animation
 * @param {Array}   frames [description]
 * @param {Number}  fps    [description]
 */
Animation = function (frames, fps, loop) {
    Entropy.EventEmitter.call(this);

    this._frames = frames;
    this._fps = fps || 30;
    this._loop = loop;

    this._state = Animation.INITIAL;
    this._frameTime = 1000 / fps;
    this._reversed = false;
    this._currentFrame = frames[0];
    this._currentFrameIndex = 0;
    this._currentFrameTime = 0;

    this._sprite = new PIXI.Sprite(frames[0].texture);

    this._sprite.anchor.x = 0.5;
    this._sprite.anchor.y = 0.5;
}

Entropy.Utils.extend(Animation.prototype, Entropy.EventEmitter.prototype);
Entropy.Utils.extend(Animation.prototype, {
    play: function () {
        if (this._state === Animation.PLAYING) {
            return;
        }

        this._state = Animation.PLAYING;

        this.emit('start')
    },
    stop: function () {
        if (this._state === Animation.PLAYING || this._state === Animation.PAUSED) {
            this._state = Animation.STOPPED;

            this._resetAnimation();

            this.emit('stop');
        }
    },
    pause: function () {
        if (this._state === Animation.PLAYING) {
            this._state = Animation.PAUSED;

            this.emit('pause');
        }
    },
    resume: function () {
        if (this._state === Animation.PAUSED) {
            this._state = Animation.PLAYING;

            this.emit('resume');
        }
    },
    reverse: function () {
        this._reversed = !this._reversed;
    },
    addFrame: function (frame) {
        this._frames.push();
    },
    nextFrame: function () {
        var nextFrameIndex;
        var nextFrame;

        if (this._reversed) {
            nextFrameIndex = this._currentFrameIndex - 1;
        } else {
            nextFrameIndex = this._currentFrameIndex + 1;
        }

        if (this._loop) {
            if (nextFrameIndex === -1) {
                nextFrameIndex = this._frames.length - 1;
            } else if (nextFrameIndex === this._frames.length) {
                nextFrameIndex = 0;
            }
        } else if (nextFrameIndex === -1 || nextFrameIndex === this._frames.length) {
            this._state = Animation.ENDED;

            this.emit('end')

            return;
        }

        nextFrame = this._frames[nextFrameIndex];

        if (nextFrame == null) {
            return;
        }

        this._currentFrame = nextFrame;
        this._currentFrameIndex = nextFrameIndex;

        this._updateSpriteTexture();
    },
    gotoFrame: function (frameIdentifier) {
        var frame;
        var frameIndex;

        if (is.number(frameIdentifier)) {
            frame = this._frames[frameIdentifier];
            frameIndex = frameIdentifier;
        } else if (is.unemptyString(frameIdentifier)) {
            for (var i = 0; i < this._frames.length; i++) {
                if (this._frames[i].name === frameIdentifier) {
                    frame = this._frames[i];
                    frameIndex = i;

                    break;
                }
            }
        } else {
            return;
        }

        if (frame == null) {
            return;
        }

        this._currentFrame = frame;
        this._currentFrameIndex = frameIndex;
        this._currentFrameTime = 0;

        this._updateSpriteTexture();
    },
    update: function (delta) {
        if (this._state !== Entropy.Animation.PLAYING) {
            return;
        }

        if (this._currentFrameTime >= this._frameTime) {
            this.emit('frameChange');

            this._currentFrame = this.nextFrame();

            this._currentFrameTime = 0;
        }

        this._currentFrameTime += delta;
    },
    getAnimationSprite: function () {
        return this._sprite;
    },
    _updateSpriteTexture: function () {
        this._sprite.texture = this._currentFrame.texture;
    },
    _resetAnimation: function () {
        this._currentFrame = this._frames[0];
        this._currentFrameIndex = 0;
        this._currentFrameTime = 0;

        this._updateSpriteTexture();
    }
})

Animation.PLAYING   = 0;
Animation.PAUSED    = 1;
Animation.STOPPED   = 2;
Animation.PLAYING   = 3;
Animation.INITIAL   = 4;
Animation.ENDED     = 5;

Entropy.Animation = Animation;