/**
* @author       Tymoteusz Dzienniak <tymoteusz.dzienniak@outlook.com>
* @license      {@link https://github.com/RainPhilosopher/Entropy/blob/master/LICENSE|MIT License}
*/

(function () {

var root = {};

(function (Entropy) {

    var VERSION = 0.1;

    Entropy.getVersion = function () {
        return "v" + VERSION;
    };

})(root);

(function (Entropy) {
    "use strict";
    
    var Utils = {
        isString: function (value) {
            return typeof value === "string" || value instanceof String;
        },
        isUndefined: function (value) {
            return typeof value === "undefined";
        },
        extend: function (destination) {
            var sources = this.slice.call(arguments, 1);

            sources.forEach(function (source) {
                for (var property in source) {
                    if (source.hasOwnProperty(property)) {
                        destination[property] = source[property];
                    }
                }
            });
        },
        slice: Array.prototype.slice
    };

    Entropy.Utils = Utils;
    
})(root);

(function (Entropy) {
    "use strict";
    
    /**
     * Easing functions by Robert Panner
     * http://www.robertpenner.com/easing/
     *
     * t: current time, b: beginning value, c: change in value, d: duration
     */

    var Easing = {
        Linear: {
            In: function (t, b, c, d) {
                return c * t / d + b;
            }
        },
        Quadratic: {
            In: function (t, b, c, d) {
                t /= d;
                return c * t * t + b;
            },
            Out: function (t, b, c, d) {
                t /= d;
                return -c * t*(t-2) + b;
            },
            InOut: function (t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }
        },
        Cubic: {
            In: function (t, b, c, d) {
                t /= d;
                return c*t*t*t + b;
            },
            Out: function (t, b, c, d) {
                t /= d;
                t--;
                return c*(t*t*t + 1) + b;
            },
            InOut: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            }
        },
        Quartic: {
            In: function (t, b, c, d) {
                t /= d;
                return c*t*t*t*t + b;
            },
            Out: function (t, b, c, d) {
                t /= d;
                t--;
                return -c * (t*t*t*t - 1) + b;
            },
            InOut: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t*t + b;
                t -= 2;
                return -c/2 * (t*t*t*t - 2) + b;
            }
        },
        Quintic: {
            In: function (t, b, c, d) {
                t /= d;
                return c*t*t*t*t*t + b;
            },
            Out: function (t, b, c, d) {
                t /= d;
                t--;
                return c*(t*t*t*t*t + 1) + b;
            },
            InOut: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t*t*t + 2) + b;
            }
        },
        Sine: {
            In: function (t, b, c, d) {
                return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
            },
            Out: function (t, b, c, d) {
                return c * Math.sin(t/d * (Math.PI/2)) + b;
            },
            InOut: function (t, b, c, d) {
                return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
            }
        },
        Exponential: {
            In: function (t, b, c, d) {
                return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
            },
            Out: function (t, b, c, d) {
                return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
            },
            InOut: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
                t--;
                return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
            }
        },
        Circular: {
            In: function (t, b, c, d) {
                t /= d;
                return -c * (Math.sqrt(1 - t*t) - 1) + b;
            },
            Out: function (t, b, c, d) {
                t /= d;
                t--;
                return c * Math.sqrt(1 - t*t) + b;
            },
            InOut: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                t -= 2;
                return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
            }
        }
    };

    Entropy.Easing = Easing;

})(root);

(function (Entropy) {

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    function radToDeg(radians) {
        return radians * 180 / Math.PI;
    }

    var Vector = function (coords) {
        if (Object.prototype.toString.call(coords) === "[object Array]") {
            this.x = coords[0];
            this.y = coords[1];
            this.updatePolarCoords();
        } else if (typeof coords === 'object') {
            if (typeof coords.x === 'undefined') { //podano wspórzędne biegunowe
                this.angle = 0;
                this.rotate(coords.angle);

                this.length = coords.length;

                //uzupełnianie wspórzędnych kartezjańskich
                this.updateCartCoords();
            } else { //podano wspórzędne kartezjańskie
                this.x = coords.x;
                this.y = coords.y;

                //uzupełnianie współrzędnych biegunowych
                this.updatePolarCoords();
            }
        } else {
            throw new Error('Podałeś zły format współrzędnych!');
        }
    };

    var v = Vector.prototype;

    v.rotate = function (angle, return_new) {
        angle %= 360;
        return_new = return_new || false;

        if (return_new) {
            return new Vector({length: this.length, angle: this.angle + angle});
        } else {
            this.angle += angle;
            this.angle %= 360;

            this.updateCartCoords();

            return this;
        }
    };

    v.rotateRad = function (angle, return_new) {
        angle = angle % (2 * Math.PI);
        return_new = return_new || false;

        if (return_new) {
            return new Vector({length: this.length, angle: this.angle + radToDeg(angle)});
        } else {
            this.rotate(radToDeg(angle));

            return this;
        }
    };

    v.add = function (vector, return_new) {
        return_new = return_new || false;
        var x, y;

        if (Object.prototype.toString.call(vector) === "[object Array]") {
            x = vector[0];
            y = vector[1];
        } else if (typeof vector === 'object') {
            x = vector.x;
            y = vector.y;
        } else {
            throw new Error('Zły parametr.');
        }

        if (return_new) { //zwraca nowy wektor, nie modyfikuje obecnego
            return new Vector([this.x + x, this.y + y]);
        } else {
            this.x += x;
            this.y += y;

            this.updatePolarCoords();

            return this;
        }
    };

    v.scale = function (scalar, return_new) {
        return_new = return_new || false;

        if (return_new) { //zwraca nowy wektor, nie modyfikuje obecnego
            return new Vector([this.x * scalar, this.y * scalar]);
        } else {
            this.x *= scalar;
            this.y *= scalar;

            this.updatePolarCoords();
        }

        return this;
    };

    v.setAngle = function (angle, return_new) {
        return_new = return_new || false;

        if (return_new) {
            return new Vector({length: this.length, angle: angle});
        } else {
            this.angle = 0;
            this.rotate(angle);

            return this;
        }
    };

    v.getRadAngle = function () {
        return degToRad(this.angle);
    };

    v.truncate = function (desiredLength, return_new) {
        return_new = return_new || false;

        if (return_new) { //zwraca nowy wektor, nie modyfikuje obecnego
            return new Vector({
                angle: this.angle,
                length: desiredLength
            });
        } else {
            this.length = desiredLength;
            this.updateCartCoords();
        }

        return this;
    };

    v.normalize = function (return_new) {
        return this.truncate(1, return_new);
    };

    v.substract = function (vector, return_new) {
        return_new = return_new || false;
        var x, y;

        if (Object.prototype.toString.call(vector) === "[object Array]") {
            x = vector[0];
            y = vector[1];
        } else if (typeof vector === 'object') {
            x = vector.x;
            y = vector.y;
        } else {
            throw new Error('Zły parametr.');
        }

        if (return_new) { //zwraca nowy wektor, nie modyfikuje obecnego
            return new Vector([this.x - x, this.y - y]);
        } else {
            this.x -= x;
            this.y -= y;

            this.updatePolarCoords();

            return this;
        }
    };

    v.dot = function (vector) {
        var scalar;

        if (Object.prototype.toString.call(vector) === "[object Array]") {
            scalar = this.x * vector[0] + this.y * vector[1];
        } else if (typeof vector === 'object') {
            scalar = this.x * vector.x + this.y * vector.y;
        } else {
            throw new Error('Zły parametr.');
        }

        return scalar;
    };

    v.reverseX = function (return_new) {
        return_new = return_new || false;

        if (return_new) {
            return new Vector([-this.x, this.y]);
        } else {
            this.x = -this.x;
            this.updatePolarCoords();
        }
    };

    v.reverseY = function (return_new) {
        return_new = return_new || false;

        if (return_new) {
            return new Vector([this.x, -this.y]);
        } else {
            this.y = -this.y;
            this.updatePolarCoords();
        }
    };

    v.reverseBoth = function (return_new) {
        return_new = return_new || false;

        if (return_new) {
            return new Vector([-this.x, -this.y]);
        } else {
            this.x = -this.x;
            this.y = -this.y;
            this.updatePolarCoords();
        }

        return this;
    };

    v.minAngleTo = function (vector) {
        if (this.angle < 0) {
            this.angle += 360;
        }

        if (vector.angle < 0) {
            vector.angle += 360;
        }

        var angle = vector.angle - this.angle;

        if (angle > 180) {
            angle = 360 + this.angle - vector.angle;
        } else if (angle < -180) {
            angle = 360 - this.angle + vector.angle;
        }

        return angle;
    };

    v.negate = function (return_new) {
        return this.reverseBoth(return_new);
    };

    v.clone = function () {
        return new Vector([this.x, this.y]);
    };

    v.updatePolarCoords = function () {
        this.length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));

        this.angle = 0;
        this.rotate(radToDeg(Math.atan2(this.y, this.x) + 2 * Math.PI));
    };

    v.updateCartCoords = function () {
        this.x = Math.cos(degToRad(this.angle)) * this.length;
        this.y = Math.sin(degToRad(this.angle)) * this.length;
        //this.y = (this.angle === 180 || this.angle === -180) ? 0 : Math.sin(this.angle * Math.PI / 180) * this.length
    };

    v.debug = function () {
        return "x: " + this.x + ", y: " + this.y + ", angle: " + this.angle + ", length: " + this.length;
    };

    Entropy.Vector = Vector;
    
})(root);

(function (Entropy) {
    "use strict";

    var Utils = Entropy.Utils;

    function EventEmitter () {
        this._events = {};
    }

    Utils.extend(EventEmitter.prototype, {
        on: function (event, fn, binding, once) {
            once = once || false;

            if (typeof binding !== "object") {
                binding = null;
            }

            if (!(event in this._events)) {
                this._events[event] = {
                    listeners: []
                };
            }

            this._events[event].listeners.push({
                fn: fn,
                binding: binding,
                once: once
            });
        },
        once: function (event, fn, binding) {
            this.on(event, fn, binding, true);
        },
        emit: function (event, eventObject) {
            if (!(event in this._events)) {
                return;  
            }

            var i = 0;
            var listener;

            while (i < this._events[event].listeners.length) {
                listener = this._events[event].listeners[i];

                listener.fn.call(listener.binding, eventObject);

                if (listener.once) {
                    this._events[event].listeners.splice(i, 1);
                } else {
                    i += 1;
                }
            }
        },
        off: function (event, fn) {
            if (!(event in this._events)) {
                return;
            }

            for (var i = 0; i < this._events[event].listeners.length; i += 1) {
                if (this._events[event].listeners[i].fn === fn) {
                    this._events[event].listeners.splice(i, 1);
                    return;
                }
            }
        },
        allOff: function () {
            this._events = {};
        }
    });

    Entropy.EventEmitter = EventEmitter;

})(root);


(function (Entropy) {
    "use strict";
    
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
    function Node (data) {
            this.next = null;
            this.priority = null;
            this.data = data;
    }

    OrderedLinkedList.prototype = {

        /**
         * Adds new node at the end of the list.
         * Function is only a syntactic sugar.
         * @param  {any} data any valid JavaScript data
         * @return {OrderedLinkedList} this
         */
        append: function (data) {
            return this.insert(data);
        },

        /**
         * Removes given node (or node with given data) from list.
         * @param  {Node|data} node
         * @return {undefined}
         */
        remove: function (node) {
            if (node === this.head || node === this.head.data) {
                this.head = this.head.next;

                return this;
            }

            var i = this.head;

            while (i.next !== node && i.next.data !== node) {
                i = i.next;
            }

            i.next = node.next;

            if (node === this.tail || node === this.tail.data) {
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
            var node = new Node(data);

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
        },
        /**
         * Clears list.
         * @return {[type]} [description]
         */
        clear: function () {
            this.head = this.tail = null;
        }
    };

    Entropy.OrderedLinkedList = OrderedLinkedList;
})(root);

(function (Entropy) {

    function Pool () {
        this.size = 0;
        this.pool = {};
    }

    Entropy.Utils.extend(Pool.prototype, {
        push: function (key, value) {
            if (!(key in this.pool)) {
                this.pool[key] = [];
            }

            this.size += 1;

            return this.pool[key].push(value);
        },
        pop: function (key) {
            if (this.has(key)) {
                this.size -= 1;

                return this.pool[key].pop();
            } else {
                return false;
            }
        },
        has: function (key) {
            return key in this.pool && this.pool[key].length > 0;
        },
        size: function () {
            return this.size;
        }
    });

    Entropy.Pool = Pool;
})(root);

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// perf.now polyfill by Paul Irish
// relies on Date.now() which has been supported everywhere modern for years.
// as Safari 6 doesn't have support for NavigationTiming, we use a Date.now() timestamp for relative values
 
// if you want values similar to what you'd get with real perf.now, place this towards the head of the page
// but in reality, you're just getting the delta between now() calls, so it's not terribly important where it's placed
 
(function(){
 
  // prepare base perf object
  if (typeof window.performance === 'undefined') {
      window.performance = {};
  }
 
  if (!window.performance.now){
    
    var nowOffset = Date.now();
 
    if (performance.timing && performance.timing.navigationStart){
      nowOffset = performance.timing.navigationStart;
    }
 
 
    window.performance.now = function now(){
      return Date.now() - nowOffset;
    };
 
  }
 
})();

(function (Entropy) {
    "use strict";

    var EventEmitter = Entropy.EventEmitter;
    var Utils = Entropy.Utils;

    var FPS = 60;
    var MAX_FRAME_TIME = 1000 / FPS * 2;

    var _paused = false;
    var _ticks = 0;
    var _callbacks = [];
    var raf = window.requestAnimationFrame;
    var _last_time_value = 0;
    var _is_running = false;
    var _current_FPS = FPS;
    var _raf_id = -1;

    var event = {};

    function Ticker (game) {
        this.game = game;

        EventEmitter.call(this);
    }

    Utils.extend(Ticker.prototype, EventEmitter.prototype);

    Utils.extend(Ticker.prototype, {
        setFPS: function (fps) {
            FPS = fps || FPS;
        },
        getFPS: function () {
            return FPS;
        },
        getCurrentFPS: function () {
            return Math.round(_current_FPS);
        },
        getTicks: function () {
            return _ticks;
        },
        pause: function () {
            _paused = true;
        },
        resume: function () {
            if (_paused && !_is_running) {
                _is_running = true;
                _paused = false;
                this.emit("resume");
            }
        },
        start: function () {
            if (_paused) {
                this.resume();
            } else if (_is_running) {
                return;
            } else {
                _raf_id = raf(this._tick.bind(this));
                this.emit("start");

                return;  
            }
        },
        stop: function () {
            if (_raf_id !== -1) {
                window.cancelAnimationFrame(_raf_id);
                _paused = false;
                _is_running = false;

                this.emit("stop");
            }
        },
        _tick: function (time) {
            _raf_id= raf(this._tick.bind(this));

            if (_paused) {
                _is_running = false;
                return;
            }

            time = time || performance.now();

            var delta = time - _last_time_value;

            if (delta >= MAX_FRAME_TIME) {
                delta = 1000 / FPS;
            }

            _last_time_value = time;

            if (_ticks % FPS === 0) {
                _current_FPS = 1000 / delta;
            }

            event.delta = delta;
            event.ticks = _ticks;
            event.paused = _paused;

            this.emit("tick", event);

            _ticks++;
        }
    });

    Entropy.Ticker = Ticker;
    
})(root);

(function (Entropy) {
    "use strict";

    function Entity (name, game) {
        this.id = 0;
        this.name = name;
        this.engine = game.engine;
        this.game = game;
        this.components = {};
        this.recycled = false;

        this.states = {
            default: {
                onEnter: function () {},
                onExit: function () {}
            }
        };

        this.current_state = "default";
    }

    var p = Entity.prototype;

    p.add = function (name) {
        var args = [];

        if (arguments.length > 1) {
            args = Array.prototype.slice.call(arguments, 1);
        }

        var lowercase_name = name.toLowerCase();

        var component_pattern = this.engine.getComponentPattern(name);
    
        if (!this.components.hasOwnProperty(lowercase_name)) {
            this.components[lowercase_name] = this.engine.getNewComponent(name);
        } else {
            this.components[lowercase_name].deleted = false;
        }

        component_pattern.initialize.apply(
            this.components[lowercase_name],
            args
        );

        this.engine.setComponentsIndex(this.id, this.components[lowercase_name].id);

        return this;
    };

    p.remove = function (name, soft_delete) {
        var lowercase_name = name.toLowerCase();
        
        if (soft_delete && this.components[lowercase_name].deleted) {
            //nothing to soft delete
            return this;
        }

        if (this.components.hasOwnProperty(lowercase_name)) {
            var component_pattern = this.engine.getComponentPattern(name);

            if (!soft_delete) {
                this.engine.addComponentToPool(name, this.components[lowercase_name]);

                delete this.components[lowercase_name];
            } else {
                this.components[lowercase_name].deleted = true;
            }

            this.engine.unsetComponentsIndex(this.id, this.components[lowercase_name].id);
        }

        return this;
    };

    p.removeAllComponents = function (soft_delete) {
        for (var lowercase_name in this.components) {
            if (this.components.hasOwnProperty(lowercase_name)) {
                this.remove(this.components[lowercase_name].name, soft_delete);
            }
        }

        return this;
    };

    p.setId = function (id) {
        this.id = id;
    };

    p.setRecycled = function () {
        this.recycled = true;
    };

    p.addState = function (name, obj) {
        if (!this.states.hasOwnProperty(name)) {
            this.states[name] = obj;
        } else {
            app.Game.warning("such state already exists.");
        }

        return this;
    };

    p.state = function (name) {
        var args = [];

        if (arguments.length > 1) {
            args = Array.prototype.slice.call(arguments, 1);
        }

        this.states[this.current_state].onExit.apply(
            this.states[this.current_state],
            args);

        this.current_state = name;

        return this;
    };


    Entropy.Entity = Entity;

})(root);

(function (Entropy) {
    var Entity = Entropy.Entity;

    /**
     * Internal node constructor.
     * @param {any} data any type of data, in most cases an Entity instance
     * @private
     * @constructor
     */
    function Node (data) {
        this.data = data;
        this.next = null;
    }

    Node.prototype = {
        getComponents: function () {
            return this.data.components;
        }
    };

    /**
     * Family implemented as singly linked list.
     * @param {String} name Family name
     * @constructor
     */
    function Family (name) {
        /**
         * Family name.
         * @type {String}
         */
        this.name = name;

        /**
         * Linked list head. Null if list is empty.
         * @type {Node|null}
         */
        this.head = null;

        /**
         * Helper variable indicating whether brake current iteration or not.
         * @type {Boolean}
         */
        this.break_iteration = false;
    }

    Family.prototype = {
        /**
         * Appends data (entity) at the beginnig of the list. Appended node becomes new head.
         * @param  {Entity} entity entity object
         * @return {Family} Family instance
         */
        append: function (entity) {
            var node = new Node(entity);

            node.next = this.head;
            this.head = node;

            return this;
        },

        /**
         * Removes given node/entity from the family.
         * @param  {Node|Entity} data entity or node to remove
         * @return {Family}      Family instance
         */
        remove: function (data) {
            var node = this.findPrecedingNode(data);
            
            if (node === null) { //remove head
                this.head = this.head.next;
            } else if (node !== -1) {
                var obolete_node = node.next;
                node.next = node.next.next;
                //prepare for removal by GC
                obolete_node = null;
            }
        },

        /**
         * Finds node preceding given data.
         * @param  {Node|Entity} data Entity or Node instance
         * @returns {Node} if data is found
         * @returns {null} if data is head
         * @returns {Number} -1 if there is no such data
         */
        findPrecedingNode: function (data) {
            //if data is head, there is no preceiding node, null returned
            if (data instanceof Node && data === this.head ||
                data instanceof Entity && this.head.data === data) {
                return null;
            }

            var node = this.head;
            while (node) {
                if ((data instanceof Node && node.next === data) ||
                    (data instanceof Entity && node.next !== null && node.next.data === data)) {
                    return node;
                }

                node = node.next;
            }

            return -1;
        },

        /**
         * Calls given callback for each node in the family.
         * @param  {Function} fn      callback function
         * @param  {object}   binding [description]
         */
        iterate: function (fn, binding) {
            binding = binding || (function () { return this; })();

            var node = this.head;

            while (node) {

                fn.call(binding, node.data, node.data.components, node, this);

                if (this.break_iteration) break;

                node = node.next;
            }

            this.break_iteration = false;
        },
        breakIteration: function () {
            this.break_iteration = true;
        },
        one: function () {
            return this.head.data;
        }
    };

    Entropy.Family = Family;

})(root);

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

(function (Entropy) {
    "use strict";

    var Utils = Entropy.Utils;
    var EventEmitter = Entropy.EventEmitter;
    var Entity = Entropy.Entity;
    var Family = Entropy.Family;
    var Pool = Entropy.Pool;
    var OrderedLinkedList = Entropy.OrderedLinkedList;

    var _componentPatterns = {};
    var _systemPatterns = {};
    var _entityPatterns = {};
    var _can_modify = true;
    var _next_component_id = 0;

    function Engine (game) {
        this.game = game;

        this._greatest_entity_id = 0;
        this._entity_ids_to_reuse = [];
        this._entities = [];
        this._entitiesCount = 0;

        this._componentsIndex = [];
        this._componentsPool = new Pool();

        this._entitiesPool = new Pool();

        this._systems = new OrderedLinkedList();

        this._families = {
            none: new Family("none")
        };

        this._entity_to_family_mapping = [];

        this._entitiesToRemove = [];

        this.BLANK_FAMILY = new Family("empty");

        this._updating = false;

        _can_modify = false;

        //initializing component pool
        /*for (var i = 0; i < _next_component_id; i += 1) {
            this._componentsPool[i] = [];
        }*/
        EventEmitter.call(this);

        this.on("updateFinished", this._removeMarkedEntities, this);
    }

    Engine.Component = function (component) {
        if (!_can_modify) {
            Entropy.Game.error("Entropy: you can't specify components during system work - do it before initialization.");
        }

        if (typeof component !== "object") {
            Entropy.Game.error("Entropy: component should be plain object.");
        }

        if (typeof _componentPatterns[component.name] !== "undefined") {
            Entropy.Game.error("Entropy: you can't specify same component twice.");
        }

        _componentPatterns[component.name] = [
            _next_component_id,
            component
        ];

        _next_component_id += 1;
    };

    Engine.System = function (system) {
        if (!_can_modify) {
            Entropy.Game.error("Entropy: you can't specify systems during system work - do it before initialization.");
        }

        if (typeof system !== "object") {
            Entropy.Game.error("Entropy: system should be plain object.");
        }

        if (typeof _systemPatterns[system.name] !== "undefined") {
            Entropy.Game.error("Entropy: you can't specify same system twice.");
        }

        _systemPatterns[system.name] = system;
    };

    Engine.Entity = function (entity) {
        if (entity.family === "") {
            family = "none";
        }

        _entityPatterns[entity.name] = {
            families: entity.family.split("|"),
            pattern: entity
        };
    };

    Utils.extend(Engine.prototype, EventEmitter.prototype);

    Utils.extend(Engine.prototype, {
        canModify: function () {
            return _can_modify;
        },
        isUpdating: function () {
            return this._updating;
        },
        getComponentPoolSize: function () {
            return this._componentsPool.size();
        },
        getComponentPattern: function (name) {
            return _componentPatterns[name][1];
        },
        getNewComponent: function (name) {
            var id = _componentPatterns[name][0];

            if (this._componentsPool.has(id)) {
                var component = this._componentsPool.pop(id);
                component.deleted = false;

                return component;
            } else {
                return {
                    id: id,
                    name: name,
                    deleted: false
                };
            }
        },
        addComponentToPool: function (name, obj) {
            var id = _componentPatterns[name][0];

            return this._componentsPool.push(id, obj);
        },
        setComponentsIndex: function (entityId, componentId) {
            this._componentsIndex[entityId][componentId] = true;
        },
        unsetComponentsIndex: function (entityId, componentId) {
            this._componentsIndex[entityId][componentId] = false;
        },
        create: function (name) {
            var args = Utils.slice.call(arguments, 1);
            args.unshift(this.game);

            var entity = this._getNewEntity(name);
            var pattern = this._getEntityPattern(name);

            pattern.create.apply(entity, args);

            this._addEntityToFamilies(entity);
            this._addEntityToEngine(entity);

            return this;
        },
        remove: function (entity) {
            var args;
            var id = entity.id;
            var f, e_f_id;
            var families = this._getFamiliesOfEntity(entity.name);

            //already removed
            if (typeof this._entities[id] === "undefined") {          
                return;
            }

            args = Utils.slice.call(arguments, 2);
            args.unshift(this.game);

            for (var i = 0, max = families.length; i < max; i += 1) {
                f = families[i];
                
                this._families[f].remove(entity);
            }

            var pattern = this._getEntityPattern(entity.name);

            pattern.remove && pattern.remove.apply(entity, args);

            entity.removeAllComponents(true);

            this._entitiesPool.push(entity.name, entity);

            delete this._entities[id];
            delete this._entity_to_family_mapping[id];

            this._entity_ids_to_reuse.push(id);

            this._entitiesCount -= 1;

            return this;
        },
        removeAllEntities: function () {
            if ( ! this.isUpdating()) {
                this._entities.forEach(function (entity) {
                    this.remove(entity);
                }, this);
            } else {
                Entropy.Game.warning("entities couldn't be removed due to engine's still running.");
            }

            return this;
        },
        markForRemoval: function (e) {
            this._entitiesToRemove.push(e);
        },
        getEntity: function (id) {
            if (!Utils.isUndefined(this._entities[id])) {
                return this._entities[id];
            } else {
                return null;
            }
        },
        getEntitiesWith: function (c_array) {
            var e_matched = [];
            var i, max1, max2;
            var entity_id, c_id, found;

            c_array = c_array.map(function (name) {
                return _componentPatterns[name][0];
            });

            max1 = this._componentsIndex.length;
            for (entity_id = 0; entity_id < max1; entity_id += 1) {
                found = 0;

                max2 = c_array.length;
                for (i = 0; i < max2; i += 1) {
                    c_id = c_array[i];

                    if (this._componentsIndex[entity_id][c_id]) {
                        found += 1;
                    }
                }

                if (found === c_array.length) {
                    e_matched.push(this._entities[entity_id]); //copying temp array
                }
            }

            return e_matched;
        },
        getAllEntities: function () {
            return this._entities.map(function (entity) {
                return entity;
            });
        },
        getFamily: function (family) {
            if (!Utils.isString(family)) {
                Entropy.Game.error("Family name must be a string.");
            }

            if (family in this._families) {
                return this._families[family];
            } else {
                return this.BLANK_FAMILY;
            }
        },
        addSystem: function (name, priority) {
            var args = Utils.slice.call(arguments, 2);
            var pattern = _systemPatterns[name];

            var system = {};

            system.game = this.game;
            system.engine = this;

            Utils.extend(system, pattern);

            pattern.initialize && pattern.initialize.apply(system, args);

            this._systems.insert(system, priority);

            return this;
        },
        addSystems: function () {
            for (var i = 0; i < arguments.length; i += 1) {
                this.addSystem.apply(this, arguments[i]);
            }

            return this;
        },
        removeSystem: function (system) {
            if ( ! this.isUpdating()) {
                var args = Utils.slice.call(arguments, 1);
                var pattern = _systemPatterns[system.name];

                pattern.remove && pattern.remove.apply(system, args);

                this._systems.remove(system);
            }

            return this;
        },
        removeAllSystems: function () {
            while (this._systems.head) {
                this.removeSystem(this._systems.head.data);
            }

            return this;
        },
        isSystemActive: function (name) {
            var node = this._systems.head;

            while (node) {
                if (node.data.name === name) {
                    return true;
                }

                node = node.next;
            }

            return false;
        },
        update: function (event) {
            var delta = event.delta;

            this._beforeUpdate(delta, event);

            this._updating = true;

            var node = this._systems.head;
            while (node) {
                node.data.update(delta, event);
                node = node.next;
            }

            this._updating = false;

            this._afterUpdate(delta, event);

            this.emit("updateFinished", null);
        },
        _beforeUpdate: function (delta, event) {
            var node = this._systems.head;
            while (node) {
                node.data.beforeUpdate && node.data.beforeUpdate(delta, event);

                node = node.next;
            }
        },
        _afterUpdate: function (delta, event) {
            var node = this._systems.head;
            while (node) {
                node.data.afterUpdate && node.data.afterUpdate(delta, event);

                node = node.next;
            }
        },
        _removeMarkedEntities: function () {
            for (var i = 0, max = this._entitiesToRemove.length; i < max; i++) {
                this.remove(this._entitiesToRemove[i]);
            }

            this._entitiesToRemove.length = 0;
        },
        clear: function () {
            this.once("updateFinished", function (e) {
                this.removeAllSystems();
                this.removeAllEntities();
            }, this);
        },
        _createComponentsIndex: function (entityId) {
            this._componentsIndex[entityId] = [];

            for (var i = 0; i < _next_component_id; i += 1) {
                this._componentsIndex[entityId][i] = false;
            }
        },
        _addEntityToFamilies: function (entity) {
            var families =  this._getFamiliesOfEntity(entity.name);

            for (var i = 0, max = families.length; i < max; i += 1) {
                var family = families[i];

                if (!(family in this._families)) {
                    this._families[family] = new Family(family);
                }

                this._families[family].append(entity);
            }
        },
        _getFamiliesOfEntity: function(name) {
            return _entityPatterns[name].families;
        },

        /*_createPoolForEntity: function (name) {
            if (!this._entitiesPool.hasOwnProperty(name)) {
                this._entitiesPool[name] = [];
            }
        }*/
        _addEntityToEngine: function (entity) {
            this._entities[entity.id] = entity;

            this._entitiesCount += 1;
        },
        _getIdForNewEntity: function () {
            var id;

            if (this._entity_ids_to_reuse.length !== 0) {
                id = this._entity_ids_to_reuse.pop();
            } else {
                id = this._greatest_entity_id;
                this._greatest_entity_id += 1;

                this._createComponentsIndex(id);
            }

            return id;
        },
        _getNewEntity: function (name) {
            var entity = this._entitiesPool.pop(name) || new Entity(name, this.game);
            entity.setId(this._getIdForNewEntity());

            return entity;
        },
        _getEntityPattern: function (name) {
            if (name in _entityPatterns) {
                return _entityPatterns[name].pattern;
            } else {
                Entropy.Game.error(["pattern for entity", name, "does not exist."].join(" "));
            }
        }
    });


    Entropy.Engine = Engine;

})(root);

(function (Entropy) {
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
        "F10": 121,
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
    var _mouse_position = {
        x: 0,
        y: 0
    };

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
        },
        setMouseStagePosition: function (position) {
            _mouse_position = position;
        },
        getMouseStagePosition: function () {
            return _mouse_position;
        }
    };

    Entropy.Input = Input;
})(root);

    if (typeof define === "function" && define.amd) {
        define(function () {
            return root;
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = root;
    } else {
        this.Entropy = root;
    }
})();