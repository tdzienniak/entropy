'use strict';

var is = require('check-types');
var slice = Array.prototype.slice;
var states = [];

/**
 * This class is an implementation of simple state manager.
 *
 * @class State
 * @param {Game} game Game instance
 */
function State(game) {
    var queue = [];
    var current = {
        transitions: {}
    };

    var shifting = false;

    var shift = function () {
        var queueHead = queue.shift();

        if (queueHead == null) {
            shifting = false;
            return;
        }

        shifting = true;

        var fn = queueHead.fn;
        var binding = queueHead.binding;
        var args = queueHead.args || [];

        args.push(next);

        fn.apply(binding, args);
    };

    var next = function () {
        shift();
    };

    var setCurrentState = function (state, done) {
        current = state;
        return done();
    };

    var setInitialized = function (state, done) {
        state._initialized = true;
        return done();
    };

    var initializeState = function (state, done) {
        if (is.function(state.initialize)) {
            return state.initialize(game, done);
        }

        return done();
    };

    var enterState = function (state, done) {
        if (is.function(state.enter)) {
            return state.enter(game, done);
        }

        return done();
    };

    var exitState = function (done) {
        if (is.function(current.exit)) {
            return current.exit(game, done);
        }

        return done();
    };

    var doTransition = function (to, next) {
        var args = slice.call(arguments, 2);

        if (to in current.transitions) {
            var transFn = current[current.transitions[to]];

            return transFn.apply(current, [game, next].concat(args));
        }

        var done = args.pop();

        return done();
    };

    /**
     * Changes state to one identified by `name` parameter.
     * Changing state process looks roughly like this:
     *  1. calling current state's `exit` method (if present)
     *  2. calling next state's `initialize` method (if present and state wasn't initialized)
     *  3. calling transition function (if present)
     *  4. calling next state's `enter` method (if present)
     *
     * Transition functions are called when transitionig from one state to another. They are called after current state
     * `exit` method and before next state's `enter` method. If the next state is not initailizes, its `initialize` method is
     * called after `exit` and before transition method. Transition arguments are (in order):
     *  - Game instance
     *  - next state object
     *  - [here come arguments given after `name`]
     *  - done callback
     *
     * @method change
     * @chainable
     * @param  {String} ...name state to change into. Any addidtional parameter will be applied to transition method.
     * @return {State}          State instance
     */
    this.change = function (name) {
        if (!is.string(name) || !(name in states)) {
            console.warn('State %s does not exists - change will not occur.', name);
            return;
        }

        var args = slice.call(arguments, 1);
        var next = states[name];

        if (next.manager == null) {
            next.manager = this;
        }

        queue.push({
            fn: exitState
        });

        if (!next._initialized) {
            queue.push({
                fn: initializeState,
                args: [next]
            });

            queue.push({
                fn: setInitialized,
                args: [next]
            });
        }

        queue.push({
            fn: doTransition,
            args: [name, next].concat(args)
        });

        queue.push({
            fn: enterState,
            args: [next]
        });

        queue.push({
            fn: setCurrentState,
            args: [next]
        });

        if (!shifting) {
            return shift();
        }
    };

    /**
     * Returns name of the current state.
     *
     * @method current
     * @return {String} name of the current state
     */
    this.current = function () {
        return current.name;
    };

    /**
     * Checks whether state machine is in state identified by name.
     *
     * @method isIn
     * @param  {String}  state states name
     * @return {Boolean}
     */
    this.isIn = function (state) {
        return state === current.name;
    };

    this.feed = function (state) {
        return this.register(state);
    };

    this.register = function (state) {
        if (!is.object(state)) {
            return console.warn('Registered state must be an object.');
        }

        if (!('transitions' in state)) {
            state.transitions = {};
        }

        state._initialized = false;
        state.manager = this;
        states[state.name] = state;

        return this;
    };
}

/**
 * Registers new state. Registered states are shared between State instances.
 * State methods are asynchronous. Their last argument is always a callback function, that must be called
 * when the function finishes. This is handy when you want implement smooth transitions
 * between states using animations (for example, jQuery animations), that are very often asynchronous.
 *
 * @example
 *     State.Register({
 *         name: "initialize",
 *         initialize: function (game, done) {
 *             console.log('State initialized.');
 *
 *             return done();
 *         },
 *         enter: function (game, done) {
 *             console.log('State entered.');
 *
 *             return done();
 *         },
 *         exit: function (game, done) {
 *             console.log('State exited.');
 *
 *             return done();
 *         },
 *         trnsitions: {
 *             menu: "toMenu"
 *         },
 *         toMenu: function (game, nextState, done) {
 *             console.log('Transitioning from `initialize` to `menu`.');
 *
 *             return done();
 *         }
 *     });
 * @static
 * @method Register
 * @param {Object} state state object (see example)
 */
State.Register = function (state) {
    if (!is.object(state)) {
        return debug.warn('Registered state must be an object.');
    }

    if (!('transitions' in state)) {
        state.transitions = {};
    }

    state._initialized = false;
    states[state.name] = state;
}

module.exports = State;