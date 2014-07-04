/**
 * @license BitSet.js v1.0.0 05/03/2014
 * http://www.xarg.org/2014/03/javascript-bit-array/
 *
 * Copyright (c) 2014, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/

/**
 * BitSet Class
 * 
 * @param {number|String=} alloc The number of bits to use at max, or a bit-string to copy
 * @param {number=} value The default value for the bits
 * @constructor
 **/

(function () {

function BitSet(alloc, value) {

    if (alloc === undefined) {
        alloc = 31;
    } else if (typeof alloc === 'string') {
        alloc = alloc['length'];
    }
    
    if (value !== 1) {
        value = 0;
    } else {
        value = 2147483647;
    }

    /**
     * @const
     * @type {number}
     */
    var size = 31;

    /**
     * 
     * @type {number}
     */
    var length = Math.ceil(alloc / size);

    for (var i = length; i--; ) {
        this[i] = value;
    }

    if (typeof alloc === 'string') {

        for (i = alloc['length']; i--; ) {
            this['set'](i, alloc.charAt(i));
        }
    }

    var transformRange = function(obj, from, to, mode) {

        // determine param type
        if (to === undefined) {

            if (from === undefined) {
                from = 0;
                to = length * size - 1;
            } else {
                to = from;
            }
        }

        // check range
        if (from < 0 || to < from || size * length <= to) {
            return null;
        }

        for (var i = length; i--; ) {

            // determine local start and end
            var s = Math.max(from, i * size);
            var e = Math.min(to, size - 1 + size * i);

            if (s <= e) {

                /**
                 * @type {number}
                 Original derivated formula: ~(((1 << (e % size - s % size + 1)) - 1) << s % size)
                 Simplified: */
                var mask = ~(1 << (1 + e % size)) + (1 << s % size);

                if (mode === 0)
                    obj[i] &= mask;
                else
                    obj[i] ^= ~mask;
            }
        }
        return obj;
    };

    this['size'] = size * length;
    this['length'] = length;


    /**
     * Creates the bitwise AND of two sets. The result is stored in-place.
     *
     * Ex:
     * bs1 = new BitSet(10);
     * bs2 = new BitSet(10);
     *
     * bs1.and(bs2);
     * 
     * @param {BitSet} obj A bitset object
     * @returns {BitSet} this
     */
    this['and'] = function(obj) {

        if (obj instanceof BitSet) {

            for (var i = length; i--; ) {
                this[i] &= obj[i] || 0;
            }
        }
        return this;
    };


    /**
     * Creates the bitwise OR of two sets. The result is stored in-place.
     *
     * Ex:
     * bs1 = new BitSet(10);
     * bs2 = new BitSet(10);
     *
     * bs1.or(bs2);
     * 
     * @param {BitSet} obj A bitset object
     * @returns {BitSet} this
     */
    this['or'] = function(obj) {

        if (obj instanceof BitSet) {

            for (var i = length; i--; ) {
                this[i] |= obj[i] || 0;
            }
        }
        return this;
    };


    /**
     * Creates the bitwise NAND of two sets. The result is stored in-place.
     *
     * Ex:
     * bs1 = new BitSet(10);
     * bs2 = new BitSet(10);
     *
     * bs1.nand(bs2);
     * 
     * @param {BitSet} obj A bitset object
     * @returns {BitSet} this
     */
    this['nand'] = function(obj) {

        if (obj instanceof BitSet) {

            for (var i = length; i--; ) {
                this[i] = ~(this[i] & (obj[i] || 0));
            }
        }
        return this;
    };


    /**
     * Creates the bitwise NOR of two sets. The result is stored in-place.
     *
     * Ex:
     * bs1 = new BitSet(10);
     * bs2 = new BitSet(10);
     *
     * bs1.or(bs2);
     * 
     * @param {BitSet} obj A bitset object
     * @returns {BitSet} this
     */
    this['nor'] = function(obj) {

        if (obj instanceof BitSet) {

            for (var i = length; i--; ) {
                this[i] = ~(this[i] | (obj[i] || 0));
            }
        }
        return this;
    };


    /**
     * Creates the bitwise NOT of a set. The result is stored in-place.
     *
     * Ex:
     * bs1 = new BitSet(10);
     *
     * bs1.not();
     * 
     * @returns {BitSet} this
     */
    this['not'] = function() {

        for (var i = length; i--; ) {
            this[i] = ~this[i];
        }
        return this;
    };

    /**
     * Creates the bitwise XOR of two sets. The result is stored in-place.
     *
     * Ex:
     * bs1 = new BitSet(10);
     * bs2 = new BitSet(10);
     *
     * bs1.xor(bs2);
     * 
     * @param {BitSet} obj A bitset object
     * @returns {BitSet} this
     */
    this['xor'] = function(obj) {

        if (obj instanceof BitSet) {

            for (var i = length; i--; ) {
                this[i] = (this[i] ^ (obj[i] || 0));
            }
        }
        return this;
    };


    /**
     * Compares two BitSet objects
     * 
     * Ex:
     * bs1 = new BitSet(10);
     * bs2 = new BitSet(10);
     * 
     * bs1.equals(bs2) ? 'yes' : 'no'
     *
     * @param {BitSet} obj A bitset object
     * @returns {boolean} Whether the two BitSets are similar
     */
    this['equals'] = function(obj) {

        if (obj instanceof BitSet) {

            if (obj['length'] !== length) {
                return false;
            }

            for (var i = length; i--; ) {

                if (obj[i] !== this[i])
                    return false;
            }

        } else {
            return false;
        }
        return true;
    };

    /**
     * Tests if one bitset is subset of another
     *
     * @param {BitSet} obj BitSet object to test against
     * @returns {boolean} true if 
     */
    this['subsetOf'] = function(obj) {
        if (obj instanceof BitSet) {
            if (obj['length'] !== length) {
                return false;
            }

            for (var i = length; i--; ) {
                if ((obj[i] & this[i]) !== this[i]) {
                    return false;
                }
            }
        } else {
            return false;
        }

        return true;
    }

    /**
     * Clones the actual object
     * 
     * Ex:
     * bs1 = new BitSet(10);
     * bs2 = bs1.clone();
     *
     * @returns {BitSet} A new BitSet object, containing a copy of the actual object
     */
    this['clone'] = function() {

        /**
         * 
         * @type {BitSet}
         */
        var tmp = new BitSet(this['size']);

        for (var i = length; i--; ) {
            tmp[i] = this[i];
        }
        return tmp;
    };

    /**
     * Check if the BitSet is empty, means all bits are unset
     * 
     * Ex:
     * bs1 = new BitSet(10);
     * 
     * bs1.isEmpty() ? 'yes' : 'no'
     *
     * @returns {boolean} Whether the bitset is empty
     */
    this['isEmpty'] = function() {

        for (var i = length; i--; ) {
            if (0 !== this[i])
                return false;
        }
        return true;
    };

    /**
     * Overrides the toString method to get a binary representation of the BitSet
     *
     * @returns string A binary string
     */
    this['toString'] = function(sep) {

        var str = "";
        for (var i = length; i--; ) {

            if (i + 1 < length && sep !== undefined)
                str += String(sep);

            var tmp = this[i].toString(2);
            str += (new Array(1 + size - tmp['length']).join("0"));
            str += tmp;
        }
        return str;
    };

    /**
     * Calculates the number of bits set
     * 
     * Ex:
     * bs1 = new BitSet(10);
     * 
     * var num = bs1.cardinality();
     *
     * @returns {number} The number of bits set
     */
    this['cardinality'] = function() {

        for (var n, num = 0, i = length; i--; ) {

            for (n = this[i]; n; n &= n - 1, num++) {
            }
        }
        return num;
    };


    /**
     * Calculates the Most Significant Bit / log base two
     * 
     * Ex:
     * bs1 = new BitSet(10);
     * 
     * var logbase2 = bs1.msb();
     * 
     * var truncatedTwo = Math.pow(2, logbase2); // May overflow!
     *
     * @returns {number} The index of the highest bit set
     */
    this['msb'] = function() {

        for (var i = length; i--; ) {

            var v = this[i];
            var c = 0;

            if (v) {

                for (; (v >>= 1); c++) {

                }
                return size * i + c;
            }
        }
        return 0;
    };


    /**
     * Set a single bit flag
     * 
     * Ex:
     * bs1 = new BitSet(10);
     * 
     * bs1.set(3, 1);
     *
     * @param {number} ndx The index of the bit to be set
     * @param {number=} value Optional value that should be set on the index (0 or 1)
     * @returns {BitSet} this
     */
    this['set'] = function(ndx, value) {

        if (value === undefined) {
            value = 1;
        }

        if (0 <= ndx && ndx < size * length) {

            var slot = ndx / size | 0;

            this[slot] ^= (1 << ndx % size) & (-(value & 1) ^ this[slot]);

            return this;
        }
        return null;
    };

    /**
     * Set a range of bits
     * 
     * Ex:
     * bs1 = new BitSet();
     * 
     * bs1.setRange(0, 5, "01011");
     * bs1.setRange(10, 15, 1);
     *
     * @param {number} from The start index of the range to be set
     * @param {number} to The end index of the range to be set
     * @param {number|String=} value Optional value that should be set on the index (0 or 1), or a bit string of the length of the window
     * @returns {BitSet} this
     */
    this['setRange'] = function(from, to, value) {

        if (from <= to && 0 <= from && to < size * length) {

            if (typeof value === "string") {

                // If window size is != string length, abort
                if (to - from !== value.length) {
                    return null;
                }

                for (var i = 0; i < value.length; i++) {
                    this['set'](i + from, value.charAt(value.length - i - 1));
                }

            } else {

                if (undefined === value) {
                    value = 1;
                }

                for (var i = from; i <= to; i++) {
                    this['set'](i, value);
                }
            }

            return this;
        }
        return null;
    };

    /**
     * Get a single bit flag of a certain bit position
     * 
     * Ex:
     * bs1 = new BitSet();
     * var isValid = bs1.get(12);
     * 
     * @param {number} ndx the index to be fetched
     * @returns {number|null} The binary flag
     */
    this['get'] = function(ndx) {

        if (0 <= ndx && ndx < size * length) {

            return (this[ndx / size | 0] >> (ndx % size)) & 1;
        }
        return null;
    };

    /**
     * Gets an entire range as a new bitset object
     * 
     * Ex:
     * bs1 = new BitSet();
     * bs1.getRange(4, 8);
     * 
     * @param {number} from The start index of the range to be get
     * @param {number} to The end index of the range to be get
     * @returns {BitSet} A new smaller bitset object, containing the extracted range 
     */
    this['getRange'] = function(from, to) {

        if (from <= to && 0 <= from && to < size * length) {

            var tmp = new BitSet(to - from + 1);

            // Quite okay for a first naive implementation, needs improvement
            for (var i = from; i <= to; i++) {
                tmp['set'](i - from, this['get'](i));
            }
            return tmp;
        }
        return null;
    };

    /**
     * Clear a range of bits by setting it to 0
     * 
     * Ex:
     * bs1 = new BitSet();
     * bs1.clear(); // Clear entire set
     * bs1.clear(5); // Clear single bit
     * bs1.clar(3,10); // Clear a bit range
     * 
     * @param {number=} from The start index of the range to be cleared
     * @param {number=} to The end index of the range to be cleared
     * @returns {BitSet} this
     */
    this['clear'] = function(from, to) {

        return transformRange(this, from, to, 0);
    };

    /**
     * Flip/Invert a range of bits by setting
     * 
     * Ex:
     * bs1 = new BitSet();
     * bs1.flip(); // Flip entire set
     * bs1.flip(5); // Flip single bit
     * bs1.flip(3,10); // Flip a bit range
     * 
     * @param {number=} from The start index of the range to be flipped
     * @param {number=} to The end index of the range to be flipped
     * @returns {BitSet} this
     */
    this['flip'] = function(from, to) {

        return transformRange(this, from, to, 1);
    };
}

 this.BitSet = BitSet;
})();

/**
* @author       Tymoteusz Dzienniak <tymoteusz.dzienniak@outlook.com>
* @license      {@link https://github.com/RainPhilosopher/Entropy/blob/master/LICENSE|MIT License}
*/

(function () {

/* Fancy intro message */
console.log(
    "%c %c %c Entropy 0.1 - Entity System Framework for JavaScript %c %c ",
    "background: rgb(200, 200,200);", 
    "background: rgb(80, 80, 80);",
    "color: white; background: black;",
    "background: rgb(80, 80, 80);",
    "background: rgb(200, 200, 200);"
);

var root = {};

(function (Entropy) {
    "use strict";
    
    var Utils = {
        isString: function (value) {
            return typeof value === "string" || value instanceof String;
        },
        isObject: function (value) {
            return typeof value === "object";
        },
        isArray: function (value) {
            return Object.prototype.toString.call(value) === '[object Array]'; 
        },
        isUndefined: function (value) {
            return typeof value === "undefined";
        },
        extend: function (destination) {
            var sources = this.slice(arguments, 1);

            sources.forEach(function (source) {
                for (var property in source) {
                    if (source.hasOwnProperty(property)) {
                        destination[property] = source[property];
                    }
                }
            });
        },
        slice: function (arr, index) {
            return Array.prototype.slice.call(arr, index);
        }
    };

    Entropy.Utils = Utils;
    
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

    var Utils = Entropy.Utils;
    var EventEmitter = Entropy.EventEmitter;
    
    var VERSION = 0.1;

    Entropy.DEBUG = true;

    Entropy.getVersion = function () {
        return "v" + VERSION;
    };

    Entropy.log = function (message) {
        if (Entropy.DEBUG) {
            console.log(["Entropy:", message].join(" "));
        }
    };

    Entropy.error = function (message) { 
        throw new Error(["Entropy:", message].join(" "));
    };

    Entropy.warning = function (message) {
        if (Entropy.DEBUG) {
            console.warn(["Entropy:", message].join(" "));
        }
    };

    Entropy.Const = function (name, value) {
        if (typeof name !== "string" || name === "") {
            Entropy.error("constans name should be non-empty string.");
        }

        name = name.toUpperCase();

        if (Entropy.hasOwnProperty(name)) {
            Entropy.error("can't define same constans twice.");
        } else {
            Object.defineProperty(Entropy, name, {
                value: value
            });
        }
    };

    EventEmitter.call(Entropy);
    Utils.extend(Entropy, EventEmitter.prototype);

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
            time = time || 0;
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
            event.time = time;
            event.paused = _paused;

            this.emit("tick", event);

            _ticks++;
        }
    });

    Entropy.Ticker = Ticker;

})(root);

(function (Entropy) {
    "use strict";

    var Utils = Entropy.Utils;
    var EventEmitter = Entropy.EventEmitter;

    function Entity (name, game) {
        this.id = 0;
        this.name = name;
        this.pattern = {};
        this.engine = game.engine;
        this.game = game;
        this.components = {};
        this.recycled = false;
        this.bitset = new BitSet(100);

        this._inFinalState = false;
        this._stateChanges = [];
        this._stateObject = {};
        this._currentStates = [];

        this.engine.on("engine:updateFinished", this._applyStateChanges, this);
    }

    Utils.extend(Entity.prototype, {
        add: function (name) {
            var args = [];

            if (arguments.length > 1) {
                args = Utils.slice(arguments, 1);
            }

            var lowercase_name = name.toLowerCase();

            var component_pattern = this.engine.getComponentPattern(name);
        
            if (!(lowercase_name in this.components)) {
                this.components[lowercase_name] = this.engine.getNewComponent(name);
            } else {
                this.components[lowercase_name].deleted = false;
            }

            component_pattern.initialize.apply(
                this.components[lowercase_name],
                args
            );

            this.bitset.set(this.components[lowercase_name].bit);

            //this.engine.setComponentsIndex(this.id, this.components[lowercase_name].id);

            return this;
        },

        remove: function (name, soft_delete) {
            var lowercase_name = name.toLowerCase();
            
            if (soft_delete && this.components[lowercase_name].deleted) {
                //nothing to soft delete
                return this;
            }

            if (lowercase_name in this.components) {
                var component_pattern = this.engine.getComponentPattern(name);

                if (!soft_delete) {
                    this.engine.addComponentToPool(name, this.components[lowercase_name]);

                    delete this.components[lowercase_name];
                } else {
                    this.components[lowercase_name].deleted = true;
                }

                this.bitset.clear(this.components[lowercase_name].bit);

                //this.engine.unsetComponentsIndex(this.id, this.components[lowercase_name].id);
            }

            return this;
        },

        removeAllComponents: function (soft_delete) {
            for (var lowercase_name in this.components) {
                if (this.components.hasOwnProperty(lowercase_name)) {
                    this.remove(this.components[lowercase_name].name, soft_delete);
                }
            }

            return this;
        },

        setId: function (id) {
            this.id = id;
        },
        getPattern: function () {
            return this.pattern;
        },
        setPattern: function (pattern) {
            this.pattern = pattern;
        },

        setRecycled: function () {
            this.recycled = true;
        },

        addState: function (name, obj) {
            if (!this.states.hasOwnProperty(name)) {
                this.states[name] = obj;
            } else {
                app.Game.warning("such state already exists.");
            }

            return this;
        },

        enter: function (name) {
            if (this._inFinalState) {
                Entropy.log("entity " + this.name + " is in its final state.");
                return this;
            }

            var args = Utils.slice(arguments, 1);

            if (this.pattern.states && !this.pattern.states[name]) {
                Entropy.warning("there is no state " + name + " for entity " + this.name);
                return this;
            }

            var pattern = this.pattern.states[name];

            if (pattern.excluding) {
                this._exitAllStates();
            }

            this._stateChanges.push({
                name: name,
                action: "enter",
                args: args
            });

            return this;
        },
        exit: function (name) {
            if (this._inFinalState) {
                Entropy.warning("entity " + this.name + " is in its final state.");

                return this;
            }

            if (!this.in(name)) {
                Entropy.warning("entity " + this.name + " is not in state " + name + ". No exiting required.");

                return this;
            }

            var args = Utils.slice(arguments, 1);

            this._stateChanges.push({
                name: name,
                action: "exit",
                args: args
            });

            return this;
        },
        in: function () {
            if (arguments.length === 0) {
                return false;
            }

            var states = Utils.slice(arguments, 0);

            for (var i = states.length - 1; i > -1; i--) {
                var state = states[i];
                if (this._currentStates.indexOf(state) === -1) {
                    return false;
                }
            }

            return true;
        },
        _getStatePattern: function (name) {
            return this.engine._getStatePattern(this.name, name);
        },
        _exitAllStates: function () {
            this._currentStates.forEach(function (state) {
                this.exit(this.state);
            }, this);

            return this;
        },
        _applyStateChanges: function () {

            var change;

            while (change = this._stateChanges.shift()) {
                if (this._inFinalState) {
                    return;
                }

                if ("states" in this.pattern && change.name in this.pattern.states) {
                    if (
                        change.action === "enter" && this.in(change.name) ||
                        change.action === "exit" && !this.in(change.name)
                    ) {
                        continue;
                    }

                    var pattern = this.pattern.states[change.name];

                    this._stateObject[change.name] = this._stateObject[change.name] || {};

                    change.args.unshift(this._stateObject[change.name]);

                    pattern[change.action] && pattern[change.action].apply(this, change.args);

                    if (change.action === "enter") {
                        this._currentStates.push(change.name);
                    } else if (change.action === "exit") {
                        this._currentStates.splice(this._currentStates.indexOf(change.name), 1);
                        delete this._stateObject[change.name];
                    }

                    if (pattern.final) {
                        this._inFinalState = true;
                    }
                }
            }
        }
    });

    Entropy.Entity = Entity;

})(root);

(function (Entropy) {
    var Entity = Entropy.Entity;
    var Utils = Entropy.Utils;
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

        this._current_node = this.head;
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
            var args = Utils.slice(arguments, 2);

            var node = this.head;

            while (node) {
                 fn.call(binding, node.data, node.data.components, node, this);

                if (this.break_iteration) break;

                node = node.next;
            }

            this.break_iteration = false;
        },
        reset: function () {
            this._currentNode = this.head;

            return this;
        },
        next: function () {
            if (this._currentNode === null) {
                return null;
            }

            var returnNode = this._currentNode;
            this._currentNode = this._currentNode.next;

            return returnNode;
        },
        components: function (name) {
            if (this._currentNode === null) {
                return null;
            }

            if (typeof name === "string") {
                if (name in this._currentNode.data.components) {
                    return this._currentNode.data.components[name];
                } else {
                    Entropy.warning(["component", name, "is not present in entity", this._currentNode.data.name, "(", this._currentNode.data.id, ")"].join(" "));

                    return null;
                }
            } else {
                return this._currentNode.data.components;
            }
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

    Game.Const = function (name, value) {
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
            var args = Utils.slice(arguments, 1);

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

        this._greatestEntityId = 0;
        this._entityIdsToReuse = [];
        this._entities = [];
        this._entitiesCount = 0;

        this._searchingBitSet = new BitSet(100);
        this._excludingBitSet = new BitSet(100);

        this._componentsIndex = [];
        this._componentsPool = new Pool();

        this._entitiesPool = new Pool();

        this._systems = new OrderedLinkedList();

        this._families = {
            NONE: new Family("NONE")
        };

        /**
         * Pool with functional families - used as generic linked list containers.
         * @type {Array}
         */
        this._functionalFamiliesPool = [];

        /**
         * Used functional families. This array is cleared after each update. Its members are transfered to
         * functional families pool.
         * @type {Array}
         */
        this._usedFunctionalFamilies = [];

        /**
         * Initializing functional families pool.
         */
        for (var i = 0; i < 20; i++) {
            this._functionalFamiliesPool.push(new Family('FUNC_' + i));
        }

        /**
         * Entities marked for removal at the end of 'update' loop.
         * @type {Array}
         */
        this._entitiesToRemove = [];

        /**
         * Placeholder family, currently not used.
         * @type {Family}
         */
        this.BLANK_FAMILY = new Family("BLANK_FAMILY");

        /**
         * Flag indicating whether engine is updating (is in its 'update' loop) or not.
         * @type {Boolean}
         */
        this._updating = false;

        /*
         * Setting this flag to 'false' prevent further engine modifications (adding entities, components etc.).
         */
        _can_modify = false;


        EventEmitter.call(this);

        /*
         * Adding standard event listeners.
         */
        this.on("engine:updateFinished", this._removeMarkedEntities, this);
        this.on("engine:updateFinished", this._transferFunctionalFamilies, this);
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

        _componentPatterns[component.name] = {
            bit: _next_component_id,
            pattern: component
        };

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
            return _componentPatterns[name].pattern;
        },
        getNewComponent: function (name) {
            var bit = _componentPatterns[name].bit;

            if (this._componentsPool.has(bit)) {
                var component = this._componentsPool.pop(bit);
                component.deleted = false;

                return component;
            } else {
                return {
                    bit: bit,
                    name: name,
                    deleted: false
                };
            }
        },
        addComponentToPool: function (name, obj) {
            return this._componentsPool.push(_componentPatterns[name].bit, obj);
        },
        setComponentsIndex: function (entityId, componentId) {
            this._componentsIndex[entityId][componentId] = true;
        },
        unsetComponentsIndex: function (entityId, componentId) {
            this._componentsIndex[entityId][componentId] = false;
        },
        create: function (name) {
            var args = Utils.slice(arguments, 1);
            args.unshift(this.game);

            var entity = this._getNewEntity(name);
            var pattern = this._getEntityPattern(name);

            pattern.create.apply(entity, args);

            this._addEntityToFamilies(entity);
            this._addEntityToEngine(entity);

            return this;
        },
        remove: function (entity) {
            //already removed
            if (Utils.isUndefined(this._entities[entity.id])) {          
                return;
            }

            var args = Utils.slice(arguments, 2);
            args.unshift(this.game);

            var pattern = entity.getPattern();

            pattern.remove && pattern.remove.apply(entity, args);

            this._removeEntityFromFamilies(entity);
            entity.removeAllComponents(true);

            this._entitiesPool.push(entity.name, entity);

            delete this._entities[entity.id];

            this._entityIdsToReuse.push(entity.id);

            this._entitiesCount -= 1;

            return this;
        },
        removeAllEntities: function () {
            if ( ! this.isUpdating()) {
                this._entities.forEach(function (entity) {
                    this.remove(entity);
                }, this);
            } else {
                Entropy.Game.warning("entities couldn't be removed because engine's still running.");
            }

            return this;
        },
        markForRemoval: function (entity) {
            this._entitiesToRemove.push(entity);
        },
        getEntity: function (id) {
            if (!Utils.isUndefined(this._entities[id])) {
                return this._entities[id];
            } else {
                return null;
            }
        },
        getEntitiesWith: function (components) {
            var matchedEntities = [];

            this._searchingBitSet.clear();
            this._excludingBitSet.clear();

            if (!Utils.isArray(components) && Utils.isObject(components)) {
                components.without && components.without.forEach(function (component) {
                    this._excludingBitSet.set(_componentPatterns[component].bit);
                }, this);

                components = components.with;
            }

            if (Utils.isArray(components)) {
                components.forEach(function (component) {
                    this._searchingBitSet.set(_componentPatterns[component].bit);
                }, this);
            }

            for (var entityId = 0, max = this._entities.length; entityId < max; entityId += 1) {
                if (
                    !Utils.isUndefined(this._entities[entityId]) &&
                    this._searchingBitSet.subsetOf(this._entities[entityId].bitset) &&
                    this._excludingBitSet.and(this._entities[entityId].bitset).isEmpty()
                ) {
                    matchedEntities.push(this._entities[entityId]);
                }
            }

            return matchedEntities;
        },
        getEntitiesByName: function (names) {

        },
        getAllEntities: function () {
            return this._entities.map(function (entity) {
                return entity;
            });
        },
        getFamily: function (family) {
            if (!Utils.isString(family)) {
                Entropy.error("family name must be a string.");
            }

            if (family in this._families) {
                this._families[family].reset();

                return this._families[family];
            } else {
                return this.BLANK_FAMILY;
            }
        },
        addSystem: function (name, priority) {
            var args = Utils.slice(arguments, 2);
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
                var args = Utils.slice(arguments, 1);
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
        clear: function () {
            this.once("engine:updateFinished", function (e) {
                this.removeAllSystems();
                this.removeAllEntities();
            }, this);
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

            this.emit("engine:updateFinished", null);
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
        _createComponentsIndex: function (entityId) {
            this._componentsIndex[entityId] = [];

            for (var i = 0; i < _next_component_id; i += 1) {
                this._componentsIndex[entityId][i] = false;
            }
        },
        _addEntityToFamilies: function (entity) {
            var families = this._getFamiliesOfEntity(entity.name);

            for (var i = 0, max = families.length; i < max; i += 1) {
                var family = families[i];

                if (!(family in this._families)) {
                    this._families[family] = new Family(family);
                    //this.on('engine:updateFinished', this._families[family].reset, this._families[family]);
                }

                this._families[family].append(entity);
            }
        },
        _removeEntityFromFamilies: function (entity) {
            var families = this._getFamiliesOfEntity(entity.name);

            for (var i = 0, max = families.length; i < max; i += 1) {
                var family = families[i];
                
                this._families[family].remove(entity);
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

            if (this._entityIdsToReuse.length !== 0) {
                id = this._entityIdsToReuse.pop();
            } else {
                id = this._greatestEntityId;
                this._greatestEntityId += 1;

                this._createComponentsIndex(id);
            }

            return id;
        },
        _getNewEntity: function (name) {
            var entity = this._entitiesPool.pop(name);

            if (!entity) {
                entity = new Entity(name, this.game);   
                entity.setPattern(this._getEntityPattern(name));
            }

            entity.setId(this._getIdForNewEntity());

            return entity;
        },
        _getEntityPattern: function (name) {
            if (name in _entityPatterns) {
                return _entityPatterns[name].pattern;
            } else {
                Entropy.Game.error(["pattern for entity", name, "does not exist."].join(" "));
            }
        },
        _transferFunctionalFamilies: function () {
            var usedFunctionalFamily;

            while (usedFunctionalFamily = this._usedFunctionalFamilies.pop()) {
                usedFunctionalFamily.clear();
                this._functionalFamiliesPool.push(usedFunctionalFamily);
            }

            return this;
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