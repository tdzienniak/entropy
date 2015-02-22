'use strict';

var is = require('check-types');
var debug = require('../debug');
var extend = require('node.extend');

var EventEmitter = require('./event');
var State = require('./state');
var Engine = require('./engine');
var Inverse = require('inverse');
var Ticker = require('./ticker');

var states = {};

function Game (initialState) {
    EventEmitter.call(this);

    this.engine = new Engine(this);
    this.state = State(states, this);
    this.container = new Inverse();
    this.ticker = new Ticker(this);

    this.ticker.on('tick', this.engine.update, this.engine);

    this.state.change(initialState);
}

Game.State = function (state) {
    if (!is.object(state)) {
        return debug.warn('Registered state must be an object.');
    }

    if (!('transitions' in state)) {
        state.transitions = {};
    }

    state._initialized = false;
    state.manager = this;
    states[state.name] = state;
}

extend(Game.prototype, EventEmitter.prototype);
extend(Game.prototype, {
    start: function () {
        return this.ticker.start();
    },
    stop: function () {
        return this.ticker.stop();
    },
    pause: function () {
        return this.ticker.pause();
    },
    resume: function () {
        return this.ticker.resume();
    }
});

module.exports = Game;