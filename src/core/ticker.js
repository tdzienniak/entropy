'use strict';

var raf = global.requestAnimationFrame;
var extend = require('node.extend');
var config = require('./config');
var Stats = require('../lib/stats');

var EventEmitter = require('./event');

/**
 * @class Ticker
 * @extends {EventEmitter}
 * @param {Game} game Game instance
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

/**
 * Fires when ticker starts ticking.
 *
 * @event start
 */

/**
 * Fires when ticker stops ticking.
 *
 * @event stop
 */

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
     * @return {Boolean} `true` if paused succesfuly, `false` otherwise
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
     * @return {Boolean} `true` if resumed succesfuly, `false` otherwise
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
     *
     *
     * @method start
     * @return {Boolean} `true` if starded succesfuly, `false` otherwise
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
     * @return {Boolean} `true` if stopped succesfuly, `false` otherwise
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
    /**
     * @method isPaused
     * @return {Boolean} `true` if paused, `false` otherwise
     */
    isPaused: function () {
        return this._paused;
    },
    /**
     * Running ticker is a ticker that constantly calls its timer function.
     * Paused ticker is also running.
     *
     * @method isRunning
     * @return {Boolean} `true` if running, `false` otherwise
     */
    isRunning: function () {
        return this._running;
    },
    /**
     * Turns __on__ or __off__ debugging features (FPS meter, frame time meter etc.).
     *
     * @method debug
     * @param  {Boolean} debug start or stop debugging
     */
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