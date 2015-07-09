'use strict';

var is = require('check-types');
var debug = require('./debug');
var extend = require('node.extend');

var EventEmitter = require('./event');
var State = require('./state');
var Engine = require('./engine');
var Inverse = require('inverse');
var Ticker = require('./ticker');
var Plugin = require('./plugin');

/**
 * Main framework class. This is the only class, that needs to be instatiated by user.
 *
 * @class Game
 * @extends EventEmitter
 * @param {String} [initialState] initial state
 */
function Game (initialState) {
    EventEmitter.call(this);

    /**
     * Instance of Inverse class.
     * How to use:
     * [https://github.com/mcordingley/Inverse.js](https://github.com/mcordingley/Inverse.js)
     *
     * @property container
     * @type {Inverse}
     */
    this.container = new Inverse();
    
    /**
     * Instance of {{#crossLink "Engine"}}Engine{{/crossLink}} class.
     *
     * @property engine
     * @type {Engine}
     */
    this.engine = new Engine(this);
    
   /**
     * Instance of {{#crossLink "State"}}State{{/crossLink}} class.
     *
     * @property state
     * @type {State}
     */
    this.state = new State(this);
    
    /**
     * Instance of Ticker class.
     *
     * @property ticker
     * @type {Ticker}
     */
    
    this.ticker = new Ticker(this);
    /**
     * Instance of {{#crossLink "Plugin"}}Plugin{{/crossLink}} class.
     *
     * @property plugin
     * @type {Plugin}
     */
    this.plugin = new Plugin(this);

    this.ticker.on('tick', this.engine.update, this.engine);

    if (is.unemptyString(initialState)) {
        this.state.change(initialState);
    }
}

/**
 * Registers new state. This method simply calls State's {{#crossLink "State/Register:method"}}Register{{/crossLink}} static method.
 *
 * @example
 *     Entropy.Game.State({
 *         //state object here
 *     });
 *
 * @static
 * @method State
 * @param {Object} state state object
 */
Game.State = function (state) {
    State.Register(state);
}

extend(Game.prototype, EventEmitter.prototype);
extend(Game.prototype, {
    /**
     * Starts the game. See Ticker's {{#crossLink "Ticker/start:method"}}start{{/crossLink}} method for more details.
     *
     * @method start
     * @return {Boolean} succesfuly started or not
     */
    start: function () {
        var start = this.ticker.start();

        if (start) {
            this.emit('start');
        }

        return start;
    },

    /**
     * Stops the game. See Ticker's {{#crossLink "Ticker/stop:method"}}stop{{/crossLink}} method for more details.
     *
     * @method stop
     * @param {Boolean} clearEngine if `true`, engine will be cleared before ticker stop
     * @return {Boolean|Undefined} stop succesfuly stoped or not. If `clearEngine` is `true`, return value will be `undefined`
     */
    stop: function (clearEngine) {
        if (clearEngine) {
            this.engine.once('clear', function () {
                return this._stopAndEmit();
            }, this);

            //schedule engine clearing
            this.engine.clear();

            return;
        }

        return this._stopAndEmit();
    },
    _stopAndEmit: function () {
        var stop = this.ticker.stop();

        if (stop) {
            this.emit('stop');
        }

        return stop;
    },
    /**
     * Pauses the game. See Ticker's {{#crossLink "Ticker/pause:method"}}pause{{/crossLink}} method for more details.
     *
     * @method pause
     * @return {Boolean} [description]
     */
    pause: function () {
        var pause = this.ticker.pause();
    
        if (pause) {
            this.emit('pause');
        }

        return pause;
    },

    /**
     * Resumes the game. See Ticker's {{#crossLink "Ticker/resume:method"}}resume{{/crossLink}} method for more details.
     *
     * @method resume
     * @return {Boolean} [description]
     */
    resume: function () {
        var resume = this.ticker.resume();
    
        if (resume) {
            this.emit('resume');
        }

        return resume;
    }
});

module.exports = Game;