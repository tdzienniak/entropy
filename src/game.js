(function (Entropy) {
    "use strict";

    var Utils = Entropy.Utils;

    var FN = 0, BINDING = 1, ARGS = 2;

    var _queue = [];
    var _states = {};
    var _current_state = {
        transitions: {}
    };

    var _consts = {};

    function Game (starting_state) {
        this.input = new Entropy.Input(this);
        this.engine = new Entropy.Engine(this);
        this.ticker = new Entropy.Ticker(this);

        this.ticker.on("tick", this.engine.update, this.engine);

        this.changeState(starting_state);
    }

    Game.State = function (state) {
        if (typeof state !== "object") {
            Game.error("State must be an object.");
            return;
        }

        if (!("transitions" in state)) {
            state.transitions = {};
        }

        state.initialized = false;

        _states[state.name] = state;
    };

    Game.log = function (message) {
        console.log(["Entropy: ", message].join(" "));
    };

    Game.error = function (message) {
        throw new Error(["Entropy: ", message].join(" "));
    };

    Game.warning = function (message) {
        console.warn(["Entropy: ", message].join(" "));
    };

    Game.constans = function (name, value) {
        if (typeof name !== "string" || name === "") {
            Game.error("constans name should be non-empty string.");
        }

        name = name.toUpperCase();

        if (Game.hasOwnProperty(name)) {
            Game.error("can't define same constans twice.");
        } else {
            Object.defineProperty(Game, name, {
                value: value
            });
        }
    };

    /**
     * [dummy description]
     * @param  {Function} done
     * @return {[type]}
     */
    function dummy (done) {
        done();
    }

    /**
     * [shift description]
     * @return {[type]}
     */
    function shift() {
        if (typeof _queue[0] === "undefined") {
            return;
        }

        var fn = _queue[0][FN] || dummy;
        var binding = _queue[0][BINDING] || null;
        var args = _queue[0][ARGS] || [];

        _queue.shift();

        args.push(next);
        
        fn.apply(binding, args);
    }

    /**
     * [next description]
     * @return {Function}
     */
    function next() {
        shift();
    }

    /**
     * [setCurrentState description]
     * @param {[type]}   state
     * @param {Function} callback
     */
    function setCurrentState (state, callback) {
        _current_state = state;
        callback();
    }

    Utils.extend(Game.prototype, {
        changeState: function (name) {
            var args = Utils.slice.call(arguments, 1);

            var next_state = _states[name];

            _current_state.onExit && _queue.push([_current_state.onExit, _current_state, [this]]);

            if (!next_state.initialized) {
                next_state.initialize && _queue.push([next_state.initialize, next_state, [this]]);

                next_state.initialized = true;
            }

            if (name in _current_state.transitions) {
                args.unshift(next_state);
                args.unshift(this);

                _queue.push([
                    _current_state[_current_state.transitions[name]],
                    _current_state,
                    args
                ]);

                args.shift();
                args.shift();
            }

            _queue.push([setCurrentState, null, [next_state]]);

            args.unshift(this);

            next_state.onEnter && _queue.push([next_state.onEnter, next_state, args]);

            shift();
        },
        setRenderer: function (renderer) {
            this.renderer = renderer;
        },
        setStage: function (stage) {
            this.stage = stage;
        },
        start: function () {
            this.ticker.start();

            Game.log("Game starded!");
        },
        pause: function () {
            this.ticker.pause();

            Game.log("Game paused!");
        },
        resume: function () {
            this.ticker.resume();

            Game.log("Game resumed!");
        }
    });

    Entropy.Game = Game;
})(root);