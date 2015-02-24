'use strict';

var raf = global.requestAnimationFrame;
var extend = require('node.extend');
var config = require('./config');
var Stats = require('../lib/stats');

var EventEmitter = require('./event');

/**
 * @class Ticker
 * @param {Game} game    Game instance
 */
function Ticker (game, variant) {
    EventEmitter.call(this);

    this.game = game;

    this.TIME_FACTOR = config('time_factor');
    this.MAX_FRAME_TIME = config('max_frame_time');

    this._loopVariant = variant;
    this._paused = false;
    this._running = false;
    this._ticks = 0;
    this._currentFPS = 0;
    this._rafID = 0;
    this._debug = false;
}

extend(Ticker.prototype, EventEmitter.prototype);
extend(Ticker.prototype, {
    getCurrentFPS: function () {
        return this._currentFPS;
    },
    getTicks: function () {
        return this._ticks;
    },
    setTimeFactor: function (factor) {
        this.TIME_FACTOR = factor;
    },
    /**
     * @method pause
     * @return {[type]} [description]
     */
    pause: function () {
        if (!this.isRunning() || this.isPaused()) {
            return false;
        }

        this._paused = true;
        this.emit('pause');

        return true;
    },
    /**
     * @method resume
     * @return {[type]} [description]
     */
    resume: function () {
        if (!this.isRunning() || !this.isPaused()) {
            return false;
        }

        this._paused = false;
        this.emit('resume');

        return true;
    },
    /**
     * @method start
     * @return {[type]} [description]
     */
    start: function () {
        var self = this;

        if (this.isPaused()) {
            return this.resume();
        }

        if (this.isRunning()) {
            return false;
        }

        var last = performance.now();
        var event = {};
        
        this._rafID = raf(tick);
        this._running = true;

        this.emit('start');

        function tick (time) {
            self._rafID = raf(tick);

            var now = performance.now();
            var delta = now - last; //miliseconds

            if (self._paused) {
                return;
            }

            self._ticks += 1;

            if (delta >= self.MAX_FRAME_TIME) {
                delta = self.MAX_FRAME_TIME;
            }

            event.delta = delta * self.TIME_FACTOR;
            event.ticks = self._ticks;

            if (self._debug) {
                self._stats.begin();
            }

            //self.game.engine.update(event);
            self.emit('tick', event);
 
            if (self._debug) {
                self._stats.end();
            }
        }
    },
    /**
     * @method stop
     * @return {[type]} [description]
     */
    stop: function () {
        if (this._rafID === 0) {
            return false;
        }

        global.cancelAnimationFrame(this._rafID);
        this._running = this._paused = false;
        this.emit('stop');

        return true;
    },
    isPaused: function () {
        return this._paused;
    },
    isRunning: function () {
        return this._running;
    },
    debug: function (debug) {
        if (this._stats == null) {
            this._stats = new Stats();
        }

        if (debug) {
            this._stats.domElement.style.position = 'absolute';
            this._stats.domElement.style.right = '0px';
            this._stats.domElement.style.top = '0px';

            document.body.appendChild(this._stats.domElement);

            this._debug = true;
        } else {
            document.body.removeChild(this._stats.domElement);
            this._debug = false;
        }

    }
});

module.exports = Ticker;