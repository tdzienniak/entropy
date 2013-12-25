(function (app) {
    _consts = {};

    var _states = {
        dummy: {
            onEnter: function (game) {
                //dummy enter
            },
            onReturn: function (game) {
                //dummy return
            },
            onExit: function (game) {
                //dummy exit
            }
        }
    };

    var _current_state = "dummy";
    var _entered_states = {};

    function Game (starting_state) {
        this.input = new app["Input"]();
        this.engine = new app["Engine"]();
        this.ticker = new app["Ticker"]();

        this.ticker.addListener(this.engine, this.engine.update);

        this.changeState(starting_state);
    }

    Game.addState = function (name, state_obj) {
        if (typeof name !== "string") {
            throw new Error("Entropy: ")
        }
    };

    Game.prototype = {
        constans: function (name, value) {
            if (typeof name !== "string" || name === "") {
                throw new Error("Entropy: constans name should be non-empty string.");
            }

            if (name in _consts) {
                if (typeof value === "undefined") {
                    return _consts[name];
                } else {
                    throw new Error("Entropy: can't define same constans twice.");
                }
            } else {
                _consts[name] = value;

                return true;
            }
        },
        changeState: function (name) {
            if (typeof name !== "string" || !(name in _states)) {
                throw new Error("Entropy: no such state or state name not a string.");
            }

            var args = Array.prototype.slice.call(arguments, 1);
            args.unshift(this);

            _states[_current_state].onExit.apply(_states[_current_state], args);

            if (name in _entered_states) {
                _states[name].onReturn.apply(_states[name], args);
            } else {
                _states[name].onEnter.apply(_states[name], args);
                _entered_states[name] = true;
            }
            
            _current_state = name;

            return true;
        },
        log: function (message) {
            console.log(message);
        }
    };

    app["Game"] = Game;
})(app);