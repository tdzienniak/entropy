(function (global) {

var app;

var VERSION = "0.1";

var Entropy = {
    getVersion: function () {
        return "v" + VERSION;
    }
};

global["Entropy"] = app = Entropy;

(function (app) {
    var _component_manifest = {};
    var _system_manifest = {};
    var _can_modify = true;
    var _next_c_id = 0;

    function Engine (game) {
        _can_modify = false;

        this.game = game;

        this._greatest_e_id = 0;
        this._e_ids_to_reuse = [];
        this._entities = [];
        this._current_e_id = null;
        this._components = [];
        this._component_pool = [];
        this._component_pool_size = 0;
        this._nodes = {};
        this._systems = new app.OrderedLinkedList();
        this._updating = false;
        this._entities_mapping = [];
        this._families = {
            none: []
        };
        this._e_family_index = [];

        //initializing component pool
        for (var i = 0; i < _next_c_id; i++) {
            this._component_pool[i] = [];
        }
    }

    Engine.component = function (name, component) {
        if (!_can_modify) {
            app.Game.error("Entropy: you can't specify components during system work - do it before initialization.");
        }

        if (typeof name !== "string" && !(name instanceof String)) {
            app.Game.error("Entropy: component name should be string.");
        }

        if (typeof component !== "object") {
            app.Game.error("Entropy: component should be plain object.");
        }

        if (typeof _component_manifest[name] !== "undefined") {
            app.Game.error("Entropy: you can't specify same component twice.");
        }

        _component_manifest[name] = [
            _next_c_id,
            component
        ];

        //Entropy.trigger("componentadded", this._greatest_c_id);

        _next_c_id += 1;
    };

    Engine.system = function (name, system) {
        if (!_can_modify) {
            app.Game.error("Entropy: you can't specify systems during system work - do it before initialization.");
        }

        if (typeof name !== "string" && !(name instanceof String)) {
            app.Game.error("Entropy: system name should be string.");
        }

        if (typeof system !== "object") {
            app.Game.error("Entropy: system should be plain object.");
        }

        if (typeof _system_manifest[name] !== "undefined") {
            app.Game.error("Entropy: you can't specify same system twice.");
        }

        if (!("init" in system) || !("update" in system)) {
            app.Game.error("Entropy: system should specify 'init' and 'update' methods.");
        }

        _system_manifest[name] = system;
    };

    Engine.node = function (name, node) {
        //_node_manifest[name] = node;
    };

    Engine.prototype = {
        canModify: function () {
            return _can_modify;
        },
        createEntity: function (family) {
            if (typeof family !== "string") {
                app.Game.error("Entropy: family name should be string.");
            }

            family = family || "none";

            if (this._e_ids_to_reuse.length !== 0) {
                var id = this._e_ids_to_reuse.pop();
            } else {
                var id = this._greatest_e_id++;

                this._entities[id] = [];
                this._components[id] = [];

                for (var i = 0; i < this._next_c_id; i++) {
                    this._entities[id][i] = false;
                    this._components[id][i] = false;
                }
            }

            this._entities_mapping[id] = {};

            //adding entity to family
            if (!(family in this._families)) {
                this._families[family] = [];
            }

            this._families[family].push(id);
            this._e_family_index[id] = family;

            this._current_e_id = id;

            return id;
        },
        removeEntity: function (id) {
            for (var i = 0; i < this._entities[id].length; i++) {
                if (this._entities[id][i]) {
                    this._entities[id][i] = false;

                    var component_name = this._components[id][i]._name;
                    var component_id = i;

                    this._component_pool[component_id].push(this._components[id][i]);

                    //for informational purposes
                    this._component_pool_size++;

                    this._components[id][i] = false;
                }
            }

            this._entities_mapping[id] = null;

            var family = this._e_famlily_mapping[id];
            var f_id = this._families[family].indexOf(id);

            this._families[family].splice(f_id, 1);

            this._e_ids_to_reuse.push(id);

            return this;
        },
        add: function (id, name) {
            if (typeof id === "number") {
                var args = Array.prototype.slice.call(arguments, 2);
            } else {
                //this function can be used either with two or one parameter
                //if used wiht one, the only parameter is the name of component to add
                //but has been mapped to id argument
                var c_name = id; 

                id = this._current_e_id;

                var args = Array.prototype.slice.call(arguments, 1);
            }
            
            var c_id = _component_manifest[c_name][0];

            if (this._component_pool[c_id].length !== 0) {
                var new_c = this._component_pool[c_id].pop();
                this._component_pool_size--;
            } else {
                var new_c = {};
            }

            this._entities[id][c_id] = true;
            this._entities_mapping[id][c_name.toLowerCase()] = this._components[id][c_id] = _component_manifest[c_name][1].init.apply(new_c, args);

            return this;
        },
        remove: function (id, name) {
            if (typeof id === "number") {
                var args = Array.prototype.slice.call(arguments, 2);
            } else {
                //this function can be used either with two or one parameter
                //if used wiht one, the only parameter is the name of component to add
                //but has been mapped to id argument
                var name = id; 

                id = this._current_e_id;

                var args = Array.prototype.slice.call(arguments, 1);
            }

            var c_id = _component_manifest[name][0];

            this._component_pool[name].push(this._components[id][c_id]);

            this._components[id][c_id] = false;
            this._entities[id][c_id] = false;

            delete this._entities_mapping[name.toLowerCase()];

            return this;
        },
        getComponents: function (c_array) {
            var c_matched = [];

            for (var i = 0, len = c_array.length; i < len; i++) {
                c_array[i] = _component_manifest[c_array[i]][0];
            }

            for (var e_id = 0, len = this._entities.length; e_id < len; e_id++) {
                var temp = [];

                for (var c_id = 0, len2 = c_array.length; c_id < len2; c_id++) {
                    if (this._entities[e_id][c_array[c_id]]) {
                        temp.push(this._components[e_id][c_array[c_id]]);
                    }
                }

                if (temp.length === c_array.length) {
                    c_matched.push(temp.slice(0)) //copying temp array
                }
            }

            return c_matched;
        },
        getEntitiesWith: function (c_array) {
            var e_matched = [];

            for (var i = 0, len = c_array.length; i < len; i++) {
                c_array[i] = _component_manifest[c_array[i]][0];
            }

            for (var e_id = 0, len = this._entities.length; e_id < len; e_id++) {
                var found = 0;

                for (var c_id = 0, len2 = c_array.length; c_id < len2; c_id++) {
                    if (this._entities[e_id][c_array[c_id]]) {
                        found += 1;
                    }
                }

                if (found === c_array.length) {
                    e_matched.push(this._entities_mapping[e_id]) //copying temp array
                }
            }

            return e_matched;
        },
        addSystem: function (name, priority) {
            var args = Array.prototype.slice.call(arguments, 2);

            var system = _system_manifest[name];

            system.game = this.game;
            system._name = name;

            system.init.apply(system, args);

            this._systems.insert(system, priority);

            return this;
        },
        removeSystem: function (system) {
            if (!this.isUpdating()) {
                this._systems.remove(system);
            }
        },
        isSystemActive: function (name) {
            var node = this._systems.head;

            while (node) {
                if (node.data._name === name) {
                    return true;
                }

                node = node.next;
            }

            return false;
        },
        update: function (delta) {
            this._updating = true;

            for (var node = this._systems.head; node; node = node.next) {
                node.data.update(delta);
            }

            //Entropy.trigger("updatecomplete");

            this._updating = false;
        },
        isUpdating: function () {
            return this._updating;
        },
        getComponentPoolSize: function () {
            return this._component_pool_size;
        }
    };

    app["Engine"] = Engine;
})(app);

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
            Game.error("wrong number of arguments for ent. pattern.")
        }

        _e_patterns[name] = {
            family: family,
            pattern: obj
        };
    };

    Game.log = function (message) {
        console.log(message);
    };

    Game.error = function (message) {
        throw new Error(["Entropy: ", message].join(" "));
    };

    Game.prototype = {
        constans: function (name, value) {
            if (typeof name !== "string" || name === "") {
                Game.error("constans name should be non-empty string.");
            }

            if (name in _consts) {
                if (typeof value === "undefined") {
                    return _consts[name];
                } else {
                    Game.error("can't define same constans twice.");
                }
            } else {
                _consts[name] = value;

                return true;
            }
        },
        changeState: function (name) {
            if (typeof name !== "string" || !(name in _states)) {
                Game.error("no such state or state name not a string.");
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

(function (app) {
    //var key_names = ["BACKSPACE", "TAB", "ENTER", "SHIFT", "CTRL", "ALT", "PAUSE_BREAK", "CAPS_LOCK ", "ESCAPE", "SPACE", "PAGE_UP", "PAGE_DOWN", "END", "HOME", "LEFT_ARROW", "UP_ARROW", "RIGHT_ARROW", "DOWN_ARROW", "INSERT", "DELETE", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "LEFT_WINDOW_KEY", "RIGHT_WINDOW_KEY", "SELECT_KEY", "NUMPAD_0", "NUMPAD_1", "NUMPAD_2", "NUMPAD_3", "NUMPAD_4", "NUMPAD_5", "NUMPAD_6", "NUMPAD_7", "NUMPAD_8", "NUMPAD_9", "MULTIPLY", "ADD", "SUBTRACT", "DECIMAL_POINT", "DIVIDE", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F1", "F11", "F12", "NUM_LOCK", "SCROLL_LOCK", "SEMI_COLON", "EQUAL_SIGN", "COMMA", "DASH", "PERIOD", "FORWARD_SLASH", "GRAVE_ACCENT", "OPEN_BRACKET", "BACK_SLASH", "CLOSE_BRAKET", "SINGLE_QUOTE"];

    var _keys = {
        "BACKSPACE": 8,
        "TAB": 9,
        "ENTER": 13,
        "SHIFT": 16,
        "CTRL": 17,
        "ALT": 18,
        "PAUSE_BREAK": 19,
        "CAPS_LOCK ": 20,
        "ESCAPE": 27,
        "SPACE": 32,
        "PAGE_UP": 33,
        "PAGE_DOWN": 34,
        "END": 35,
        "HOME": 36,
        "LEFT_ARROW": 37,
        "UP_ARROW": 38,
        "RIGHT_ARROW": 39,
        "DOWN_ARROW": 40,
        "INSERT": 45,
        "DELETE": 46,
        "0": 48,
        "1": 49,
        "2": 50,
        "3": 51,
        "4": 52,
        "5": 53,
        "6": 54,
        "7": 55,
        "8": 56,
        "9": 57,
        "A": 65,
        "B": 66,
        "C": 67,
        "D": 68,
        "E": 69,
        "F": 70,
        "G": 71,
        "H": 72,
        "I": 73,
        "J": 74,
        "K": 75,
        "L": 76,
        "M": 77,
        "N": 78,
        "O": 79,
        "P": 80,
        "Q": 81,
        "R": 82,
        "S": 83,
        "T": 84,
        "U": 85,
        "V": 86,
        "W": 87,
        "X": 88,
        "Y": 89,
        "Z": 90,
        "LEFT_WINDOW_KEY": 91,
        "RIGHT_WINDOW_KEY": 92,
        "SELECT_KEY": 93,
        "NUMPAD_0": 96,
        "NUMPAD_1": 97,
        "NUMPAD_2": 98,
        "NUMPAD_3": 99,
        "NUMPAD_4": 100,
        "NUMPAD_5": 101,
        "NUMPAD_6": 102,
        "NUMPAD_7": 103,
        "NUMPAD_8": 104,
        "NUMPAD_9": 105,
        "MULTIPLY": 106,
        "ADD": 107,
        "SUBTRACT": 109,
        "DECIMAL_POINT": 110,
        "DIVIDE": 111,
        "F1": 112,
        "F2": 113,
        "F3": 114,
        "F4": 115,
        "F5": 116,
        "F6": 117,
        "F7": 118,
        "F8": 119,
        "F9": 120,
        "F1": 121,
        "F11": 122,
        "F12": 123,
        "NUM_LOCK": 144,
        "SCROLL_LOCK": 145,
        "SEMI_COLON": 186,
        "EQUAL_SIGN": 187,
        "COMMA": 188,
        "DASH": 189,
        "PERIOD": 190,
        "FORWARD_SLASH": 191,
        "GRAVE_ACCENT": 192,
        "OPEN_BRACKET": 219,
        "BACK_SLASH": 220,
        "CLOSE_BRACKET": 221,
        "SINGLE_QUOTE": 222
    };

    var _pressed_keys = [];

    function Input (game) {
        this.game = game;

        for (var i = 0; i < 256; i++) {
                _pressed_keys[i] = false;
            }

            window.addEventListener("keydown", function (e) {
                _pressed_keys[e.keyCode] = true;
            });

            window.addEventListener("keyup", function (e) {
                _pressed_keys[e.keyCode] = false;
            });
    }

    Input.prototype = {
        isPressed: function (name) {
            return _pressed_keys[_keys[name]];
        },
        getPressedKeys: function () {
            var keys = {};

            for (var name in _keys) {
                keys[name] = _pressed_keys[_keys[name]];
            }

            return keys;
        }
    };

    app["Input"] = Input;
})(app);

/**
 * Ordered single linked list implementation.
 * 
 * @author "Tymoteusz Dzienniak"
 * @license MIT license
 */

(function (app) {

    /**
     * Linked list conctructor.
     * It initializes head and tail properties with null value.
     */
    function OrderedLinkedList () {
        this.head = this.tail = null;
    }

    /**
     * Returns node object.
     * @param {any} data data to store in node
     */
    var Node = function (data) {
        return {
            next: null,
            priority: null,
            data: data
        };
    };

    OrderedLinkedList.prototype = {

        /**
         * Adds new node at the end of the list.
         * Function is only a syntax sugar.
         * @param  {any} data any valid JavaScript data
         * @return {OrderedLinkedList} this
         */
        append: function (data) {
            return this.insert(data);
        },

        /**
         * Removes given node from list.
         * @param  {Node} node
         * @return {undefined}
         */
        remove: function (node) {
            if (node === this.head) {
                this.head = this.head.next;

                return this;
            }

            var i = this.head;

            while (i.next !== node) {
                i = i.next;
            }

            i.next = node.next;

            if (node === this.tail) {
                this.tail = i;
            }

            node = null;

            return this;
        },
        /**
         * Insert new node into list.
         * 
         * @param  {any} data     data to store in list node
         * @param  {number} priority [optional] if specified, function inserts data before node with higher priority
         * @return {object}       list instance             
         */
        insert: function (data, priority) {
            var node = Node(data);

            /*
             * list is empty
             */
            if (this.head === null) {
                node.priority = priority || 0;
                this.head = this.tail = node;

                return this;
            }

            var current = this.head;

            node.priority = priority || this.tail.priority;

            /*
             * list contains only one node (head === tail)
             */
            if (current.next === null) {
                if (current.priority <= node.priority) {
                    current.next = node;
                    this.tail = current.next;
                } else {
                    this.head = node;
                    this.head.next = this.tail = current;
                }

                return this;
            }

            /*
             * node priority is greater or equal tail priority
             * node should become tail
             */
            if (node.priority >= this.tail.priority) {
                this.tail.next = node;
                this.tail = node;

                return this;
            }

            /*
             * node priority is less than head priority
             * node should become head
             */
            if (node.priority < this.head.priority) {
                node.next = this.head;
                this.head = node;

                return this;
            }

            /*
             * list has more than one node
             */
            while (current.next !== null) { 
               if (current.next.priority > node.priority) {
                    node.next = current.next;
                    current.next = node;

                    break;
                }

                current = current.next;
            }

            return this;
        },
        /**
         * Iterates over all list nodes, starting from head, calling function for every node.
         * @param  {Function} fn [description]
         * @return {[type]}      [description]
         */
        iterate: function (fn) {
            for (var node = this.head; node; node = node.next) {
                fn(this, node);
            }
        }
    };

    app["OrderedLinkedList"] = OrderedLinkedList;
})(app);

(function (app) {
    var FPS = 60,
        MAX_FRAME_TIME = 1000 / FPS * 2,
        PAUSED = false,
        USE_RAF = true,
        ticks = 0,
        callbacks = [],
        raf = requestAnimationFrame,
        last_time_value = 0,
        is_running = false,
        currentFPS = FPS;

    var event = {};

    function Ticker (game) {
        this.game = game;
    }

    function tick (time) {
        if (PAUSED) {
            is_running = false;
            return;
        }

        if ( ! USE_RAF) {
            var time = time || new Date().getTime();
        }

        var delta = time - last_time_value;

        if (delta >= MAX_FRAME_TIME) {
            delta = 1000 / FPS;
        }

        last_time_value = time;

        /*if (ticks % FPS === 0) {
            currentFPS = Math.round(1000 / delta);
        }*/

        event.delta = delta;
        event.ticks = ticks;
        event.paused = PAUSED;

        for (var i = 0, len = callbacks.length; i < len; i++) {
            callbacks[i][1].call(callbacks[i][0], delta, event);
        }

        ticks++;

        if (USE_RAF) {
            raf(tick);
        }
    }

    Ticker.prototype = {
        useRAF: function (bool) {
            USE_RAF = bool;
        },
        currentFPS: function () {
            return Math.round(currentFPS);
        },
        setFPS: function (fps) {
            FPS = fps || FPS;
        },
        getFPS: function () {
            return FPS;
        },
        getTicks: function () {
            return ticks;
        },
        pause: function () {
            PAUSED = true;

            if (!USE_RAF) {
                window.clearInterval(ticker);
            }
        },
        resume: function () {
            if (PAUSED && !is_running) {
                is_running = true;
                PAUSED = false;

                if (!USE_RAF) {
                    ticker(tick, FPS);
                } else {
                    tick();
                }
            }
        },
        addListener: function (that, callback) {
            callbacks.push([that, callback]);
        },
        start: function () {
            if (USE_RAF) {
                ticker = (function () {
                    return  window.requestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            function (callback, fps) {
                                window.setTimeout(callback, 1000 / fps);
                            };
                })();
            } else {
                ticker = function (callback, fps) {
                    return window.setInterval(callback, 1000 / fps);
                };
            }

            is_running = true;
            
            raf(tick);
            //ticker(tick);
        }
    };

    app["Ticker"] = Ticker;
})(app);

})(this);