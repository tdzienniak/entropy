(function (app) {
    _consts = {};

    var _states = {
        dummy: {
            init: function (game) {
                //dummy enter
            },
            enter: function (game) {
                //dummy return
            },
            exit: function (game) {
                //dummy exit
            }
        }
    };

    var _current_state = "dummy";
    var _initiated_states = {};
    var _e_patterns = {};

    function Game (starting_state) {
        this.input = new app["Input"](this);
        this.engine = new app["Engine"](this);
        this.ticker = new app["Ticker"](this);

        this.ticker.addListener(this.engine, this.engine.update);

        this.changeState(starting_state);
    }

    Game.addState = function (name, state_obj) {
        if (typeof name !== "string") {
            Game.error("state name should be type of string.");
        }

        _states[name] = state_obj;
    };

    Game.entityPattern = function (name, family, obj) {
        if (arguments.length !== 3) {
            Game.error("wrong number of arguments for ent. pattern.");
        }

        _e_patterns[name] = {
            family: family,
            pattern: obj
        };
    };

    Game.log = function (message) {
        console.log("Entropy: ", message);
    };

    Game.error = function (message) {
        throw new Error(["Entropy: ", message].join(" "));
    };

    Game.warning = function (message) {
        console.warn("Entropy: ", message);
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

    Game.prototype = {
        
        changeState: function (name) {
            if (typeof name !== "string" || !(name in _states)) {
                Game.error("no such state or state name not a string.");
            }

            var args = Array.prototype.slice.call(arguments, 1);
            args.unshift(this);

            _states[_current_state].exit && _states[_current_state].exit.apply(_states[_current_state], args);

            if (name in _initiated_states) {
                _current_state = name;
                _states[name].enter && _states[name].enter.apply(_states[name], args);
            } else {
                _current_state = name;
                _states[name].init && _states[name].init.apply(_states[name], args);
                _states[name].enter && _states[name].enter.apply(_states[name], args);
                _initiated_states[name] = true;
            }
            
            console.log(_current_state);
        },
        setRenderer: function (renderer) {
            this.renderer = renderer;
        },
        setStage: function (stage) {
            this.stage = stage;
        },
        create: function (name) {
            var args = Array.prototype.slice.call(arguments, 1);

            this.engine.createEntity(_e_patterns[name]["family"]);

            return _e_patterns[name].pattern.create.apply(this.engine, args);
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
    };

    app["Game"] = Game;
})(app);