/**
 * Animation class.
 * 
 * @class Entropy.Animation
 * @param {Array}   frames [description]
 * @param {Number}  fps    [description]
 */
Entropy.Animation = function (frames, fps) {
    Entropy.EventEmitter.call(this);

    this._frames = frames;
    this._fps = fps;
}

Entropy.Utils.extend(Entropy.Animation.prototype, Entropy.EventEmitter.prototype);
Entropy.Utils.extend(Entropy.Animation.prototype, {
    play: function () {

    },
    stop: function () {

    },
    pause: function () {

    },
    resume: function () {

    },
    addFrame: function () {

    },
    update: function (delta) {

    }
})