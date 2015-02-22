'use strict';

var is = require('check-types');
var slice = Array.prototype.slice;

module.exports = function (states, game) {
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

    return {
        change: function (name) {
            if (!is.string(name) || !(name in states)) {
                console.warn('State %s does not exists - change will not occur.', name);
                return;
            }

            var args = slice.call(arguments, 1);

            var next = states[name];

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
        },
        current: function () {
            return current.name;
        },
        isIn: function (state) {
            return state === current.name;
        },
        feed: function (state) {
            return this.register(state);
        },
        register: function (state) {
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
        }
    };
};
