(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Entropy = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @license BitSet.js v1.1.0 06/02/2015
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
function BitSet(alloc, value) {

    if (alloc === undefined) {
        alloc = 31;
    } else if (typeof alloc === 'string') {
        alloc = alloc.length;
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

        for (i = alloc.length; i--; ) {
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

            var max = obj;
            var min = this;

            if (length > obj.length) {
                max = this;
                min = obj;
            }

            for (var i = max.length; i--; ) {

                if (i < min.length) {
                    if (max[i] !== min[i])
                        return false;
                } else if (max[i] !== 0) {
                    return false;
                }
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
    };

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

        if (ndx < 0) {
            return null;
        }

        if (value === undefined) {
            value = 1;
        }

        var slot = ndx / size;

        if (slot >= length) {

            // AUTO SCALE

            length = Math.ceil(slot);

            for (var i = this['length']; i < length; i++) {
                this[i] = 0;
            }

            this['size'] = size * length;
            this['length'] = length;
        }

        slot = Math.floor(slot);

        this[slot] ^= (1 << ndx % size) & (-(value & 1) ^ this[slot]);

        return this;

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

if (typeof module !== 'undefined' && module['exports']) {
    module['exports']['BitSet'] = BitSet;
}

},{}],2:[function(require,module,exports){
/*globals define, module, Symbol */

/**
 * This module exports functions for checking types
 * and throwing exceptions.
 */

(function (globals) {
    'use strict';

    var messages, predicates, functions, assert, not, maybe, either, collections, slice;

    messages = {
        like: 'Invalid type',
        instance: 'Invalid type',
        emptyObject: 'Invalid object',
        object: 'Invalid object',
        assigned: 'Invalid value',
        undefined: 'Invalid value',
        null: 'Invalid value',
        hasLength: 'Invalid length',
        emptyArray: 'Invalid array',
        array: 'Invalid array',
        arrayLike: 'Invalid array-like object',
        iterable: 'Invalid iterable',
        date: 'Invalid date',
        error: 'Invalid error',
        fn: 'Invalid function',
        match: 'Invalid string',
        contains: 'Invalid string',
        unemptyString: 'Invalid string',
        string: 'Invalid string',
        odd: 'Invalid number',
        even: 'Invalid number',
        inRange: 'Invalid number',
        greaterOrEqual: 'Invalid number',
        lessOrEqual: 'Invalid number',
        between: 'Invalid number',
        greater: 'Invalid number',
        less: 'Invalid number',
        positive: 'Invalid number',
        negative: 'Invalid number',
        integer: 'Invalid number',
        zero: 'Invalid number',
        number: 'Invalid number',
        boolean: 'Invalid boolean'
    };

    predicates = {
        like: like,
        instance: instance,
        emptyObject: emptyObject,
        object: object,
        assigned: assigned,
        undefined: isUndefined,
        null: isNull,
        hasLength: hasLength,
        emptyArray: emptyArray,
        array: array,
        arrayLike: arrayLike,
        iterable: iterable,
        date: date,
        error: error,
        function: isFunction,
        match: match,
        contains: contains,
        unemptyString: unemptyString,
        string: string,
        odd: odd,
        even: even,
        inRange: inRange,
        greaterOrEqual: greaterOrEqual,
        lessOrEqual: lessOrEqual,
        between: between,
        greater: greater,
        less: less,
        positive: positive,
        negative: negative,
        integer : integer,
        zero: zero,
        number: number,
        boolean: boolean
    };

    functions = {
        apply: apply,
        map: map,
        all: all,
        any: any
    };

    collections = [ 'array', 'arrayLike', 'iterable', 'object' ];
    slice = Array.prototype.slice;

    functions = mixin(functions, predicates);
    assert = createModifiedPredicates(assertModifier, assertImpl);
    not = createModifiedPredicates(notModifier, notImpl);
    maybe = createModifiedPredicates(maybeModifier, maybeImpl);
    either = createModifiedPredicates(eitherModifier);
    assert.not = createModifiedModifier(assertModifier, not);
    assert.maybe = createModifiedModifier(assertModifier, maybe);
    assert.either = createModifiedModifier(assertEitherModifier, predicates);

    collections.forEach(createOfPredicates);
    createOfModifiers(assert, assertModifier);
    createOfModifiers(not, notModifier);
    collections.forEach(createMaybeOfModifiers);

    exportFunctions(mixin(functions, {
        assert: assert,
        not: not,
        maybe: maybe,
        either: either
    }));

    /**
     * Public function `like`.
     *
     * Tests whether an object 'quacks like a duck'.
     * Returns `true` if the first argument has all of
     * the properties of the second, archetypal argument
     * (the 'duck'). Returns `false` otherwise.
     *
     */
    function like (data, duck) {
        var name;

        for (name in duck) {
            if (duck.hasOwnProperty(name)) {
                if (data.hasOwnProperty(name) === false || typeof data[name] !== typeof duck[name]) {
                    return false;
                }

                if (object(data[name]) && like(data[name], duck[name]) === false) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Public function `instance`.
     *
     * Returns `true` if an object is an instance of a prototype,
     * `false` otherwise.
     *
     */
    function instance (data, prototype) {
        if (data && isFunction(prototype) && data instanceof prototype) {
            return true;
        }

        return false;
    }

    /**
     * Public function `emptyObject`.
     *
     * Returns `true` if something is an empty object,
     * `false` otherwise.
     *
     */
    function emptyObject (data) {
        return object(data) && Object.keys(data).length === 0;
    }

    /**
     * Public function `object`.
     *
     * Returns `true` if something is a plain-old JS object,
     * `false` otherwise.
     *
     */
    function object (data) {
        return Object.prototype.toString.call(data) === '[object Object]';
    }

    /**
     * Public function `assigned`.
     *
     * Returns `true` if something is not null or undefined,
     * `false` otherwise.
     *
     */
    function assigned (data) {
        return !isUndefined(data) && !isNull(data);
    }

    /**
     * Public function `undefined`.
     *
     * Returns `true` if something is undefined,
     * `false` otherwise.
     *
     */
    function isUndefined (data) {
        return data === undefined;
    }

    /**
     * Public function `null`.
     *
     * Returns `true` if something is null,
     * `false` otherwise.
     *
     */
    function isNull (data) {
        return data === null;
    }

    /**
     * Public function `hasLength`.
     *
     * Returns `true` if something is has a length property
     * that equals `value`, `false` otherwise.
     *
     */
    function hasLength (data, value) {
        return assigned(data) && data.length === value;
    }

    /**
     * Public function `emptyArray`.
     *
     * Returns `true` if something is an empty array,
     * `false` otherwise.
     *
     */
    function emptyArray (data) {
        return array(data) && data.length === 0;
    }

    /**
     * Public function `array`.
     *
     * Returns `true` something is an array,
     * `false` otherwise.
     *
     */
    function array (data) {
        return Array.isArray(data);
    }

    /**
     * Public function `arrayLike`.
     *
     * Returns `true` something is an array-like object,
     * `false` otherwise.
     *
     */
    function arrayLike (data) {
        return assigned(data) && number(data.length);
    }

    /**
     * Public function `iterable`.
     *
     * Returns `true` something is an iterable,
     * `false` otherwise.
     *
     */
    function iterable (data) {
        if (typeof Symbol === 'undefined') {
            // Fall back to arrayLike predicate in pre-ES6 environments.
            return arrayLike(data);
        }

        return assigned(data) && isFunction(data[Symbol.iterator]);
    }

    /**
     * Public function `date`.
     *
     * Returns `true` something is a valid date,
     * `false` otherwise.
     *
     */
    function date (data) {
        return Object.prototype.toString.call(data) === '[object Date]' &&
            !isNaN(data.getTime());
    }

    /**
     * Public function `error`.
     *
     * Returns `true` if something is a plain-old JS object,
     * `false` otherwise.
     *
     */
    function error (data) {
        return Object.prototype.toString.call(data) === '[object Error]';
    }

    /**
     * Public function `function`.
     *
     * Returns `true` if something is function,
     * `false` otherwise.
     *
     */
    function isFunction (data) {
        return typeof data === 'function';
    }

    /**
     * Public function `match`.
     *
     * Returns `true` if something is a string
     * that matches `regex`, `false` otherwise.
     *
     */
    function match (data, regex) {
        return string(data) && !!data.match(regex);
    }

    /**
     * Public function `contains`.
     *
     * Returns `true` if something is a string
     * that contains `substring`, `false` otherwise.
     *
     */
    function contains (data, substring) {
        return string(data) && data.indexOf(substring) !== -1;
    }

    /**
     * Public function `unemptyString`.
     *
     * Returns `true` if something is a non-empty string,
     * `false` otherwise.
     *
     */
    function unemptyString (data) {
        return string(data) && data !== '';
    }

    /**
     * Public function `string`.
     *
     * Returns `true` if something is a string, `false` otherwise.
     *
     */
    function string (data) {
        return typeof data === 'string';
    }

    /**
     * Public function `odd`.
     *
     * Returns `true` if something is an odd number,
     * `false` otherwise.
     *
     */
    function odd (data) {
        return integer(data) && !even(data);
    }

    /**
     * Public function `even`.
     *
     * Returns `true` if something is an even number,
     * `false` otherwise.
     *
     */
    function even (data) {
        return number(data) && data % 2 === 0;
    }

    /**
     * Public function `integer`.
     *
     * Returns `true` if something is an integer,
     * `false` otherwise.
     *
     */
    function integer (data) {
        return number(data) && data % 1 === 0;
    }

    /**
     * Public function `inRange`.
     *
     * Returns `true` if something is a number in
     * the range `a` .. `b`, `false` otherwise.
     *
     */
    function inRange (data, a, b) {
        if (a < b) {
            return greaterOrEqual(data, a) && lessOrEqual(data, b);
        }

        return lessOrEqual(data, a) && greaterOrEqual(data, b);
    }

    /**
     * Public function `greaterOrEqual`.
     *
     * Returns `true` if something is a number greater
     * than or equal to `value`, `false` otherwise.
     *
     */
    function greaterOrEqual (data, value) {
        return number(data) && data >= value;
    }

    /**
     * Public function `lessOrEqual`.
     *
     * Returns `true` if something is a number less
     * than or equal to `value`, `false` otherwise.
     *
     */
    function lessOrEqual (data, value) {
        return number(data) && data <= value;
    }

    /**
     * Public function `between`.
     *
     * Returns `true` if something is a number
     * between `a` and `b`, `false` otherwise.
     *
     */
    function between (data, a, b) {
        if (a < b) {
            return greater(data, a) && less(data, b);
        }

        return less(data, a) && greater(data, b);
    }

    /**
     * Public function `greater`.
     *
     * Returns `true` if something is a number
     * greater than `value`, `false` otherwise.
     *
     */
    function greater (data, value) {
        return number(data) && data > value;
    }

    /**
     * Public function `less`.
     *
     * Returns `true` if something is a number
     * less than `value`, `false` otherwise.
     *
     */
    function less (data, value) {
        return number(data) && data < value;
    }

    /**
     * Public function `positive`.
     *
     * Returns `true` if something is a positive number,
     * `false` otherwise.
     *
     */
    function positive (data) {
        return greater(data, 0);
    }

    /**
     * Public function `negative`.
     *
     * Returns `true` if something is a negative number,
     * `false` otherwise.
     *
     * @param data          The thing to test.
     */
    function negative (data) {
        return less(data, 0);
    }

    /**
     * Public function `number`.
     *
     * Returns `true` if data is a number,
     * `false` otherwise.
     *
     */
    function number (data) {
        return typeof data === 'number' && isNaN(data) === false &&
               data !== Number.POSITIVE_INFINITY &&
               data !== Number.NEGATIVE_INFINITY;
    }

    /**
     * Public function `zero`.
     *
     * Returns `true` if something is zero,
     * `false` otherwise.
     *
     * @param data          The thing to test.
     */
    function zero (data) {
        return data === 0;
    }

    /**
     * Public function `boolean`.
     *
     * Returns `true` if data is a boolean value,
     * `false` otherwise.
     *
     */
    function boolean (data) {
        return data === false || data === true;
    }

    /**
     * Public function `apply`.
     *
     * Maps each value from the data to the corresponding predicate and returns
     * the result array. If the same function is to be applied across all of the
     * data, a single predicate function may be passed in.
     *
     */
    function apply (data, predicates) {
        assert.array(data);

        if (isFunction(predicates)) {
            return data.map(function (value) {
                return predicates(value);
            });
        }

        assert.array(predicates);
        assert.hasLength(data, predicates.length);

        return data.map(function (value, index) {
            return predicates[index](value);
        });
    }

    /**
     * Public function `map`.
     *
     * Maps each value from the data to the corresponding predicate and returns
     * the result object. Supports nested objects. If the data is not nested and
     * the same function is to be applied across all of it, a single predicate
     * function may be passed in.
     *
     */
    function map (data, predicates) {
        assert.object(data);

        if (isFunction(predicates)) {
            return mapSimple(data, predicates);
        }

        assert.object(predicates);

        return mapComplex(data, predicates);
    }

    function mapSimple (data, predicate) {
        var result = {};

        Object.keys(data).forEach(function (key) {
            result[key] = predicate(data[key]);
        });

        return result;
    }

    function mapComplex (data, predicates) {
        var result = {};

        Object.keys(predicates).forEach(function (key) {
            var predicate = predicates[key];

            if (isFunction(predicate)) {
                if (not.assigned(data)) {
                    result[key] = !!predicate._isMaybefied;
                } else {
                    result[key] = predicate(data[key]);
                }
            } else if (object(predicate)) {
                result[key] = mapComplex(data[key], predicate);
            }
        });

        return result;
    }

    /**
     * Public function `all`
     *
     * Check that all boolean values are true
     * in an array (returned from `apply`)
     * or object (returned from `map`).
     *
     */
    function all (data) {
        if (array(data)) {
            return testArray(data, false);
        }

        assert.object(data);

        return testObject(data, false);
    }

    function testArray (data, result) {
        var i;

        for (i = 0; i < data.length; i += 1) {
            if (data[i] === result) {
                return result;
            }
        }

        return !result;
    }

    function testObject (data, result) {
        var key, value;

        for (key in data) {
            if (data.hasOwnProperty(key)) {
                value = data[key];

                if (object(value) && testObject(value, result) === result) {
                    return result;
                }

                if (value === result) {
                    return result;
                }
            }
        }

        return !result;
    }

    /**
     * Public function `any`
     *
     * Check that at least one boolean value is true
     * in an array (returned from `apply`)
     * or object (returned from `map`).
     *
     */
    function any (data) {
        if (array(data)) {
            return testArray(data, true);
        }

        assert.object(data);

        return testObject(data, true);
    }

    function mixin (target, source) {
        Object.keys(source).forEach(function (key) {
            target[key] = source[key];
        });

        return target;
    }

    /**
     * Public modifier `assert`.
     *
     * Throws if `predicate` returns `false`.
     */
    function assertModifier (predicate, defaultMessage) {
        return function () {
            assertPredicate(predicate, arguments, defaultMessage);
        };
    }

    function assertPredicate (predicate, args, defaultMessage) {
        var message = args[args.length - 1];
        assertImpl(predicate.apply(null, args), unemptyString(message) ? message : defaultMessage);
    }

    function assertImpl (value, message) {
        if (value === false) {
            throw new Error(message || 'Assertion failed');
        }
    }

    function assertEitherModifier (predicate, defaultMessage) {
        return function () {
            var error;

            try {
                assertPredicate(predicate, arguments, defaultMessage);
            } catch (e) {
                error = e;
            }

            return {
                or: Object.keys(predicates).reduce(delayedAssert, {})
            };

            function delayedAssert (result, key) {
                result[key] = function () {
                    if (error && !predicates[key].apply(null, arguments)) {
                        throw error;
                    }
                };

                return result;
            }
        };
    }

    /**
     * Public modifier `not`.
     *
     * Negates `predicate`.
     */
    function notModifier (predicate) {
        return function () {
            return notImpl(predicate.apply(null, arguments));
        };
    }

    function notImpl (value) {
        return !value;
    }

    /**
     * Public modifier `maybe`.
     *
     * Returns `true` if predicate argument is  `null` or `undefined`,
     * otherwise propagates the return value from `predicate`.
     */
    function maybeModifier (predicate) {
        var modifiedPredicate = function () {
            if (!assigned(arguments[0])) {
                return true;
            }

            return predicate.apply(null, arguments);
        };

        // Hackishly indicate that this is a maybe.xxx predicate.
        // Without this flag, the alternative would be to iterate
        // through the maybe predicates or use indexOf to check,
        // which would be time-consuming.
        modifiedPredicate._isMaybefied = true;

        return modifiedPredicate;
    }

    function maybeImpl (value) {
        if (assigned(value) === false) {
            return true;
        }

        return value;
    }

    /**
     * Public modifier `either`.
     *
     * Returns `true` if either predicate is true.
     */
    function eitherModifier (predicate) {
        return function () {
            var shortcut = predicate.apply(null, arguments);

            return {
                or: Object.keys(predicates).reduce(nopOrPredicate, {})
            };

            function nopOrPredicate (result, key) {
                result[key] = shortcut ? nop : predicates[key];
                return result;
            }
        };

        function nop () {
            return true;
        }
    }

    /**
     * Public modifier `of`.
     *
     * Applies the chained predicate to members of the collection.
     */
    function ofModifier (target, type, predicate) {
        return function () {
            var collection, args;

            collection = arguments[0];

            if (!type(collection)) {
                return false;
            }

            collection = coerceCollection(type, collection);
            args = slice.call(arguments, 1);

            try {
                collection.forEach(function (item) {
                    if (
                        (target !== 'maybe' || assigned(item)) &&
                        !predicate.apply(null, [ item ].concat(args))
                    ) {
                        // HACK: Ideally we'd use a for...of loop and return here,
                        //       but that syntax is not supported by ES5. We could
                        //       use a transpiler and a build step but I'm happy
                        //       enough with this until ES6 is the baseline.
                        throw 0;
                    }
                });
            } catch (ignore) {
                return false;
            }

            return true;
        };
    }

    function coerceCollection (type, collection) {
        switch (type) {
            case arrayLike:
                return slice.call(collection);
            case object:
                return Object.keys(collection).map(function (key) {
                    return collection[key];
                });
            default:
                return collection;
        }
    }

    function createModifiedPredicates (modifier, object) {
        return createModifiedFunctions([ modifier, predicates, object ]);
    }

    function createModifiedFunctions (args) {
        var modifier, object, functions, result;

        modifier = args.shift();
        object = args.pop();
        functions = args.pop();

        result = object || {};

        Object.keys(functions).forEach(function (key) {
            Object.defineProperty(result, key, {
                configurable: false,
                enumerable: true,
                writable: false,
                value: modifier.apply(null, args.concat(functions[key], messages[key]))
            });
        });

        return result;
    }

    function createModifiedModifier (modifier, modified) {
        return createModifiedFunctions([ modifier, modified, null ]);
    }

    function createOfPredicates (key) {
        predicates[key].of = createModifiedFunctions(
            [ ofModifier.bind(null, null), predicates[key], predicates, null ]
        );
    }

    function createOfModifiers (base, modifier) {
        collections.forEach(function (key) {
            base[key].of = createModifiedModifier(modifier, predicates[key].of);
        });
    }

    function createMaybeOfModifiers (key) {
        maybe[key].of = createModifiedFunctions(
            [ ofModifier.bind(null, 'maybe'), predicates[key], predicates, null ]
        );
        assert.maybe[key].of = createModifiedModifier(assertModifier, maybe[key].of);
        assert.not[key].of = createModifiedModifier(assertModifier, not[key].of);
    }

    function exportFunctions (functions) {
        if (typeof define === 'function' && define.amd) {
            define(function () {
                return functions;
            });
        } else if (typeof module !== 'undefined' && module !== null && module.exports) {
            module.exports = functions;
        } else {
            globals.check = functions;
        }
    }
}(this));

},{}],3:[function(require,module,exports){
(function (root, factory) {
    if (typeof define === 'function' && define.amd) define([], factory);
    else if (typeof exports === 'object') module.exports = factory();
    else root.Inverse = factory();
})(this, function () {
    'use strict';
    
    var Inverse = function() {
        this._boundCallbacks = {};
        this._singletonCallbacks = {};
        this._instantiatedSingletons = {};
        this._registeredObjects = {};
    };
    
    Inverse.prototype.make = function(name) {
        if (this._registeredObjects.hasOwnProperty(name)) {
            return this._registeredObjects[name];
        }
        
        var args = Array.prototype.slice.call(arguments, 1);
        
        if (this._singletonCallbacks.hasOwnProperty(name)) {
            if (!this._instantiatedSingletons.hasOwnProperty(name)) {
                this._instantiatedSingletons[name] = this._singletonCallbacks[name].apply(this, args);
            }
            
            return this._instantiatedSingletons[name];
        }
        
        if (this._boundCallbacks.hasOwnProperty(name)) {
            return this._boundCallbacks[name].apply(this, args);
        }
        
        return null;
    };
    
    Inverse.prototype.bind = function(name, callback) {
        this._boundCallbacks[name] = callback;
    };
    
    Inverse.prototype.singleton = function(name, callback) {
        this._singletonCallbacks[name] = callback;
    };
    
    Inverse.prototype.register = function(name, object) {
        this._registeredObjects[name] = object;
    };
    
    return Inverse;
});

},{}],4:[function(require,module,exports){
module.exports = require('./lib/extend');


},{"./lib/extend":5}],5:[function(require,module,exports){
/*!
 * node.extend
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * @fileoverview
 * Port of jQuery.extend that actually works on node.js
 */
var is = require('is');

function extend() {
  var target = arguments[0] || {};
  var i = 1;
  var length = arguments.length;
  var deep = false;
  var options, name, src, copy, copy_is_array, clone;

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object' && !is.fn(target)) {
    target = {};
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    options = arguments[i]
    if (options != null) {
      if (typeof options === 'string') {
          options = options.split('');
      }
      // Extend the base object
      for (name in options) {
        src = target[name];
        copy = options[name];

        // Prevent never-ending loop
        if (target === copy) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if (deep && copy && (is.hash(copy) || (copy_is_array = is.array(copy)))) {
          if (copy_is_array) {
            copy_is_array = false;
            clone = src && is.array(src) ? src : [];
          } else {
            clone = src && is.hash(src) ? src : {};
          }

          // Never move original objects, clone them
          target[name] = extend(deep, clone, copy);

        // Don't bring in undefined values
        } else if (typeof copy !== 'undefined') {
          target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

/**
 * @public
 */
extend.version = '1.1.3';

/**
 * Exports module.
 */
module.exports = extend;


},{"is":6}],6:[function(require,module,exports){

/**!
 * is
 * the definitive JavaScript type testing library
 *
 * @copyright 2013-2014 Enrico Marino / Jordan Harband
 * @license MIT
 */

var objProto = Object.prototype;
var owns = objProto.hasOwnProperty;
var toStr = objProto.toString;
var symbolValueOf;
if (typeof Symbol === 'function') {
  symbolValueOf = Symbol.prototype.valueOf;
}
var isActualNaN = function (value) {
  return value !== value;
};
var NON_HOST_TYPES = {
  boolean: 1,
  number: 1,
  string: 1,
  undefined: 1
};

var base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
var hexRegex = /^[A-Fa-f0-9]+$/;

/**
 * Expose `is`
 */

var is = module.exports = {};

/**
 * Test general.
 */

/**
 * is.type
 * Test if `value` is a type of `type`.
 *
 * @param {Mixed} value value to test
 * @param {String} type type
 * @return {Boolean} true if `value` is a type of `type`, false otherwise
 * @api public
 */

is.a = is.type = function (value, type) {
  return typeof value === type;
};

/**
 * is.defined
 * Test if `value` is defined.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is defined, false otherwise
 * @api public
 */

is.defined = function (value) {
  return typeof value !== 'undefined';
};

/**
 * is.empty
 * Test if `value` is empty.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is empty, false otherwise
 * @api public
 */

is.empty = function (value) {
  var type = toStr.call(value);
  var key;

  if ('[object Array]' === type || '[object Arguments]' === type || '[object String]' === type) {
    return value.length === 0;
  }

  if ('[object Object]' === type) {
    for (key in value) {
      if (owns.call(value, key)) { return false; }
    }
    return true;
  }

  return !value;
};

/**
 * is.equal
 * Test if `value` is equal to `other`.
 *
 * @param {Mixed} value value to test
 * @param {Mixed} other value to compare with
 * @return {Boolean} true if `value` is equal to `other`, false otherwise
 */

is.equal = function (value, other) {
  var strictlyEqual = value === other;
  if (strictlyEqual) {
    return true;
  }

  var type = toStr.call(value);
  var key;

  if (type !== toStr.call(other)) {
    return false;
  }

  if ('[object Object]' === type) {
    for (key in value) {
      if (!is.equal(value[key], other[key]) || !(key in other)) {
        return false;
      }
    }
    for (key in other) {
      if (!is.equal(value[key], other[key]) || !(key in value)) {
        return false;
      }
    }
    return true;
  }

  if ('[object Array]' === type) {
    key = value.length;
    if (key !== other.length) {
      return false;
    }
    while (--key) {
      if (!is.equal(value[key], other[key])) {
        return false;
      }
    }
    return true;
  }

  if ('[object Function]' === type) {
    return value.prototype === other.prototype;
  }

  if ('[object Date]' === type) {
    return value.getTime() === other.getTime();
  }

  return strictlyEqual;
};

/**
 * is.hosted
 * Test if `value` is hosted by `host`.
 *
 * @param {Mixed} value to test
 * @param {Mixed} host host to test with
 * @return {Boolean} true if `value` is hosted by `host`, false otherwise
 * @api public
 */

is.hosted = function (value, host) {
  var type = typeof host[value];
  return type === 'object' ? !!host[value] : !NON_HOST_TYPES[type];
};

/**
 * is.instance
 * Test if `value` is an instance of `constructor`.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an instance of `constructor`
 * @api public
 */

is.instance = is['instanceof'] = function (value, constructor) {
  return value instanceof constructor;
};

/**
 * is.nil / is.null
 * Test if `value` is null.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is null, false otherwise
 * @api public
 */

is.nil = is['null'] = function (value) {
  return value === null;
};

/**
 * is.undef / is.undefined
 * Test if `value` is undefined.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is undefined, false otherwise
 * @api public
 */

is.undef = is.undefined = function (value) {
  return typeof value === 'undefined';
};

/**
 * Test arguments.
 */

/**
 * is.args
 * Test if `value` is an arguments object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

is.args = is.arguments = function (value) {
  var isStandardArguments = '[object Arguments]' === toStr.call(value);
  var isOldArguments = !is.array(value) && is.arraylike(value) && is.object(value) && is.fn(value.callee);
  return isStandardArguments || isOldArguments;
};

/**
 * Test array.
 */

/**
 * is.array
 * Test if 'value' is an array.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an array, false otherwise
 * @api public
 */

is.array = function (value) {
  return '[object Array]' === toStr.call(value);
};

/**
 * is.arguments.empty
 * Test if `value` is an empty arguments object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an empty arguments object, false otherwise
 * @api public
 */
is.args.empty = function (value) {
  return is.args(value) && value.length === 0;
};

/**
 * is.array.empty
 * Test if `value` is an empty array.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an empty array, false otherwise
 * @api public
 */
is.array.empty = function (value) {
  return is.array(value) && value.length === 0;
};

/**
 * is.arraylike
 * Test if `value` is an arraylike object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

is.arraylike = function (value) {
  return !!value && !is.boolean(value)
    && owns.call(value, 'length')
    && isFinite(value.length)
    && is.number(value.length)
    && value.length >= 0;
};

/**
 * Test boolean.
 */

/**
 * is.boolean
 * Test if `value` is a boolean.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a boolean, false otherwise
 * @api public
 */

is.boolean = function (value) {
  return '[object Boolean]' === toStr.call(value);
};

/**
 * is.false
 * Test if `value` is false.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is false, false otherwise
 * @api public
 */

is['false'] = function (value) {
  return is.boolean(value) && Boolean(Number(value)) === false;
};

/**
 * is.true
 * Test if `value` is true.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is true, false otherwise
 * @api public
 */

is['true'] = function (value) {
  return is.boolean(value) && Boolean(Number(value)) === true;
};

/**
 * Test date.
 */

/**
 * is.date
 * Test if `value` is a date.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a date, false otherwise
 * @api public
 */

is.date = function (value) {
  return '[object Date]' === toStr.call(value);
};

/**
 * Test element.
 */

/**
 * is.element
 * Test if `value` is an html element.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an HTML Element, false otherwise
 * @api public
 */

is.element = function (value) {
  return value !== undefined
    && typeof HTMLElement !== 'undefined'
    && value instanceof HTMLElement
    && value.nodeType === 1;
};

/**
 * Test error.
 */

/**
 * is.error
 * Test if `value` is an error object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an error object, false otherwise
 * @api public
 */

is.error = function (value) {
  return '[object Error]' === toStr.call(value);
};

/**
 * Test function.
 */

/**
 * is.fn / is.function (deprecated)
 * Test if `value` is a function.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a function, false otherwise
 * @api public
 */

is.fn = is['function'] = function (value) {
  var isAlert = typeof window !== 'undefined' && value === window.alert;
  return isAlert || '[object Function]' === toStr.call(value);
};

/**
 * Test number.
 */

/**
 * is.number
 * Test if `value` is a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a number, false otherwise
 * @api public
 */

is.number = function (value) {
  return '[object Number]' === toStr.call(value);
};

/**
 * is.infinite
 * Test if `value` is positive or negative infinity.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is positive or negative Infinity, false otherwise
 * @api public
 */
is.infinite = function (value) {
  return value === Infinity || value === -Infinity;
};

/**
 * is.decimal
 * Test if `value` is a decimal number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a decimal number, false otherwise
 * @api public
 */

is.decimal = function (value) {
  return is.number(value) && !isActualNaN(value) && !is.infinite(value) && value % 1 !== 0;
};

/**
 * is.divisibleBy
 * Test if `value` is divisible by `n`.
 *
 * @param {Number} value value to test
 * @param {Number} n dividend
 * @return {Boolean} true if `value` is divisible by `n`, false otherwise
 * @api public
 */

is.divisibleBy = function (value, n) {
  var isDividendInfinite = is.infinite(value);
  var isDivisorInfinite = is.infinite(n);
  var isNonZeroNumber = is.number(value) && !isActualNaN(value) && is.number(n) && !isActualNaN(n) && n !== 0;
  return isDividendInfinite || isDivisorInfinite || (isNonZeroNumber && value % n === 0);
};

/**
 * is.int
 * Test if `value` is an integer.
 *
 * @param value to test
 * @return {Boolean} true if `value` is an integer, false otherwise
 * @api public
 */

is.int = function (value) {
  return is.number(value) && !isActualNaN(value) && value % 1 === 0;
};

/**
 * is.maximum
 * Test if `value` is greater than 'others' values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is greater than `others` values
 * @api public
 */

is.maximum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.arraylike(others)) {
    throw new TypeError('second argument must be array-like');
  }
  var len = others.length;

  while (--len >= 0) {
    if (value < others[len]) {
      return false;
    }
  }

  return true;
};

/**
 * is.minimum
 * Test if `value` is less than `others` values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is less than `others` values
 * @api public
 */

is.minimum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.arraylike(others)) {
    throw new TypeError('second argument must be array-like');
  }
  var len = others.length;

  while (--len >= 0) {
    if (value > others[len]) {
      return false;
    }
  }

  return true;
};

/**
 * is.nan
 * Test if `value` is not a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is not a number, false otherwise
 * @api public
 */

is.nan = function (value) {
  return !is.number(value) || value !== value;
};

/**
 * is.even
 * Test if `value` is an even number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an even number, false otherwise
 * @api public
 */

is.even = function (value) {
  return is.infinite(value) || (is.number(value) && value === value && value % 2 === 0);
};

/**
 * is.odd
 * Test if `value` is an odd number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an odd number, false otherwise
 * @api public
 */

is.odd = function (value) {
  return is.infinite(value) || (is.number(value) && value === value && value % 2 !== 0);
};

/**
 * is.ge
 * Test if `value` is greater than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

is.ge = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value >= other;
};

/**
 * is.gt
 * Test if `value` is greater than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

is.gt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value > other;
};

/**
 * is.le
 * Test if `value` is less than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if 'value' is less than or equal to 'other'
 * @api public
 */

is.le = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value <= other;
};

/**
 * is.lt
 * Test if `value` is less than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if `value` is less than `other`
 * @api public
 */

is.lt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value < other;
};

/**
 * is.within
 * Test if `value` is within `start` and `finish`.
 *
 * @param {Number} value value to test
 * @param {Number} start lower bound
 * @param {Number} finish upper bound
 * @return {Boolean} true if 'value' is is within 'start' and 'finish'
 * @api public
 */
is.within = function (value, start, finish) {
  if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.number(value) || !is.number(start) || !is.number(finish)) {
    throw new TypeError('all arguments must be numbers');
  }
  var isAnyInfinite = is.infinite(value) || is.infinite(start) || is.infinite(finish);
  return isAnyInfinite || (value >= start && value <= finish);
};

/**
 * Test object.
 */

/**
 * is.object
 * Test if `value` is an object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an object, false otherwise
 * @api public
 */

is.object = function (value) {
  return '[object Object]' === toStr.call(value);
};

/**
 * is.hash
 * Test if `value` is a hash - a plain object literal.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a hash, false otherwise
 * @api public
 */

is.hash = function (value) {
  return is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
};

/**
 * Test regexp.
 */

/**
 * is.regexp
 * Test if `value` is a regular expression.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a regexp, false otherwise
 * @api public
 */

is.regexp = function (value) {
  return '[object RegExp]' === toStr.call(value);
};

/**
 * Test string.
 */

/**
 * is.string
 * Test if `value` is a string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a string, false otherwise
 * @api public
 */

is.string = function (value) {
  return '[object String]' === toStr.call(value);
};

/**
 * Test base64 string.
 */

/**
 * is.base64
 * Test if `value` is a valid base64 encoded string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a base64 encoded string, false otherwise
 * @api public
 */

is.base64 = function (value) {
  return is.string(value) && (!value.length || base64Regex.test(value));
};

/**
 * Test base64 string.
 */

/**
 * is.hex
 * Test if `value` is a valid hex encoded string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a hex encoded string, false otherwise
 * @api public
 */

is.hex = function (value) {
  return is.string(value) && (!value.length || hexRegex.test(value));
};

/**
 * is.symbol
 * Test if `value` is an ES6 Symbol
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a Symbol, false otherise
 * @api public
 */

is.symbol = function (value) {
  return typeof Symbol === 'function' && toStr.call(value) === '[object Symbol]' && typeof symbolValueOf.call(value) === 'symbol';
};

},{}],7:[function(require,module,exports){
var is = require('check-types');

var DEFAULT_CONFIG = {
    debug: 3,
    max_components_count: 100,
    max_frame_time: 20,
    time_factor: 1,
    default_fps: 60,
    ids_to_reuse_pool_size: 1000,
    initial_components_pool_size: 1000,
    initial_entities_pool_size: 1000
};

var USER_CONFIG = {};

module.exports = function (key, value) {
    if (is.not.unemptyString(key)) {
        return;
    }

    if (value == null) {
        if (key in USER_CONFIG) {
            return USER_CONFIG[key];
        }

        if (key in DEFAULT_CONFIG) {
            return DEFAULT_CONFIG[key];
        }
    } else {
        USER_CONFIG[key] = value;
    }
}
},{"check-types":2}],8:[function(require,module,exports){
'use strict';

var is = require('check-types');
var debug = require('./debug');

module.exports = function (key, value) {
    if (is.not.unemptyString(key)) {
        debug.warn('constans key should be non-empty string');
        return;
    }

    key = key.toUpperCase();

    if (key in this) {
        debug.warn('cannot define same constans twice: %s'. key);
        return;
    }

    Object.defineProperty(this, key, {
        value: value
    });

    return value;
};
},{"./debug":9,"check-types":2}],9:[function(require,module,exports){
'use strict';

var config = require('./config');

module.exports = {
    log: function () {
        if (config('debug') >= 3) {
            console.log.apply(console, arguments);
        }
    },
    warn: function () {
        if (config('debug') >= 2) {
            console.warn.apply(console, arguments);
        }
    },
    error: function () {
        if (config('debug') >= 1) {
            console.error.apply(console, arguments);
        }
    }
};
},{"./config":7}],10:[function(require,module,exports){
'use strict';

var extend = require('node.extend');
var config = require('./config');
var array = require('./fastarray');
var is = require('check-types');
var debug = require('./debug');
var register = require('./register');
var slice = Array.prototype.slice;

var Query = require('./query');
var EventEmitter = require('./event');
var Pool = require('./pool');
var Entity = require('./entity');

/**
 * Engine class. Class is used internaly. User should not instatiate this class.
 *
 * @class Engine
 * @extends EventEmitter
 * @constructor
 */
function Engine (game) {
    EventEmitter.call(this);

    /**
     * Instance of {{#crossLink "Game"}}Game{{/crossLink}} class.
     *
     * @property game
     * @type {Game}
     */
    this.game = game;

    /**
     * Indicates the greatest entity ID present in the system.
     * Used to generate new IDs.
     *
     * @property _greatestEntityID
     * @private
     * @type Number
     */
    this._greatestEntityID = 0;

    /**
     * Pool of currently not used entity IDs. Will be reused.
     *
     * @property _idsToReuse
     * @private
     * @type Pool
     */
    this._idsToReuse = new Pool(config('ids_to_reuse_pool_size'));

    /**
     * Systems that are processed every tick.
     *
     * @property _systems
     * @private
     * @type Array
     */
    this._systems = [];

    /**
     * Array with entities. Array index corresponds to ID of an entity.
     *
     * @property _entities
     * @private
     * @type Array
     */
    this._entities = array.alloc(10000);

    this._modifiedEntities = array.alloc(10000);
    this._modifiedEntitiesLength = 0;

    this._entitiesToAdd = new Pool(1000);
    this._entitiesToRemove = new Pool(1000);
    this._systemsToAdd = new Pool(1000);
    this._systemsToRemove = new Pool(1000);

    this._entitiesPool = {};
    this._componentsPool = {};

    this._queries = [];

    this._entitiesCount = 0;

    this._performClearing = false;

    //register.setCannotModify();

    //Initialize components and entities pools.
    register.listComponentsNames().forEach(function (name) {
        this._componentsPool[name] = new Pool(config('initial_components_pool_size'));
    }, this);

    register.listEntitiesNames().forEach(function (name) {
        this._entitiesPool[name] = new Pool(config('initial_entities_pool_size'));
    }, this);
}

extend(Engine.prototype, EventEmitter.prototype);
extend(Engine.prototype, {
    /**
     * Creates new entity using pattern identified by `name` parameter.
     * Every additional parameter will be applied to patterns `create` method.
     * Patterns `create` method is called imediatelly after calling this method.
     *
     * @example
     *     game.engine.create("Ball", 5, 5, 5); //x, y, radius
     *
     * @method create
     * @param  {String} ...name first argument is a name of entity (entity pattern). Every additional argument will be applied to patterns `create` method.
     * @return {Engine}         engine instance
     */
    create: function (name) {
        if (is.not.unemptyString(name)) {
            debug.warn('entity name must be a string');
            return this;
        }

        var entityPattern = register.getEntityPattern(name);

        if (is.not.object(entityPattern)) {
            debug.warn('entity pattern for %s does not exist', name);
            return this;
        }

        var args = slice.call(arguments, 1);
        args.unshift(this.game);

        if (this._entitiesPool[name] == null) {
            this._entitiesPool[name] = new Pool(config('initial_entities_pool_size'));
        }

        var entity = this._entitiesPool[name].get();
        entity = entity || new Entity(name, entityPattern, this);

        entityPattern.create.apply(entity, args);

        this._entitiesToAdd.put(entity);

        return this;
    },
    /**
     * Removes entity from engine.
     * Entity removal does not happen imediatelly, but after current update cycle.
     *
     * @example
     *     //somwhere in the system 'update' method
     *     if (entity.components.hp.quantity <= 0) { //entity is dead, remove
     *         game.engine.remove(entity);
     *     }
     *
     * @method remove
     * @param  {Entity} entity Entity instance
     * @return {Engine}        Engine instance
     */
    remove: function (entity) {
        if (is.not.object(entity)) {
            debug.error('entity to remove has to be an object.')

            return this;
        }

        this._entitiesToRemove.put(entity);

        return this;
    },
    getAllEntities: function () {

    },
    /**
     * Returns array of entities satisfying given {{#crossLink "Query"}}query{{/crossLink}} conditions.
     * Returned arrays length does not correspond with matched entities quantity.
     * To loop over entities start from 0 index, and then check if element is different than 0.
     * This method guaranties, that entities will be arranged as subsequent array slice, starting from 0 index and ending on element equal to 0.
     * The array is in this form for performance reasons.
     *
     * @example
     *     //in systems 'initialize' method...
     *     this.query = new Entropy.Engine.Query(["Position", "Velocity"]);
     *
     *     //in systems 'update' method
     *     var movingEntities = this.engine.getEntities(this.query);
     *
     *     //here do something with entities in loop
     *     ...
     *
     * @method getEntities
     * @param  {Query}  query query object
     * @return {Array}  array of matched entities
     */
    getEntities: function (query) {
        if (this._queries.indexOf(query) === -1) {
            this._initializeQuery(query);
        }

        return query.entities;
    },
    /**
     * Creates new system object and adds it to the engine. System patterns `initialize` method is called (if present).
     * It can be called in two ways - with first argument being either:
     * - system name - then system has priority as defined by patterns `priority` property or 0.
     * - array with two elements - system name and its desired priority. In this case patterns `priority` property is simply skiped.
     *
     * @example
     *     game.engine.addSystem("Renderer", rendererObject);
     *
     *     //or
     *
     *     game.engine.addSystem(["Renderer", 1], rendererObject);
     *
     * @method addSystem
     * @param {String|Array} ...name name of a system or array with two elements - name of a system and desired priority (see example). Additional arguments are applied to patterns `initialize` method.
     * @return {Engine} engine instance
     */
    addSystem: function (name) {
        var systemName, priority;

        if (is.array(name)) {
            if (name.length !== 2) {
                debug.warn('To add system with priority you must provide an array with two elements - [systemName, priority] - as a first parameter.');
                return this;
            }

            systemName = name[0];
            priority = name[1];
        } else if (is.unemptyString(name)) {
            systemName = name;
        } else {
            debug.warn('First argument for addSystem method must be either system name or array with system name and desired priority.');
            return this;
        }

        var pattern = register.getSystemPattern(systemName);

        if (is.not.object(pattern)) {
            debug.warn('There is no system %s.', systemName);
            return this;
        }

        if (pattern.singleton) {
            for (var i = 0, len = this._systems.length; i < len; i++) {
                if (this._systems[i].name === pattern.name) {
                    debug.info('System you want to add is a singleton and there is one already present in the engine. Returning...');
                    return this;
                }
            }
        }

        var args = Array.prototype.slice.call(arguments, 1);

        if (priority == null) {
            if (is.number(pattern.priority)) {
                priority = pattern.priority;
            } else {
                priority = 0;
            }
        }

        var newSystem = extend(true, {}, pattern);
        newSystem.priority = priority;
        newSystem.engine = this;
        newSystem.game = this.game;

        if (is.function(newSystem.initialize)) {
            newSystem.initialize.apply(newSystem, args);
        }


        this._systemsToAdd.put(newSystem);

        return this;
    },
    removeSystem: function (system) {
        var systemObject;
        
        if (is.object(system)) {
            systemObject = system;
        } else if (is.unemptyString(system)) {
            for (var i = 0; i < this._systems.length; i++) {
                systemObject = this._systems[i];
                if (systemObject.name === system) {
                    break;
                }
            }
        } else {
            debug.warn('System to remove has to be an object or a string (system name).');
            
            return this;
        }

        this._systemsToRemove.put(systemObject);

        return this;
    },
    enableSystem: function (system) {
        this._toggleSystem(system, false);
    },
    disableSystem: function (system) {
        this._toggleSystem(system, true);
    },
    _toggleSystem: function (system, onOff) {
        if (system == null) {
            return;
        }

        if (is.object(system)) {
            system._disabled = onOff;
        } else if (is.unemptyString(system)) {
            var systemObject;
            for (var i = 0; i < this._systems.length; i++) {
                systemObject = this._systems[i];
                if (systemObject.name === system) {
                    systemObject._disabled = onOff;
                    
                    return;
                }
            }
        }
    },
    markModifiedEntity: function (entity) {
        if (entity.id === 0) {
            return;
        }

        if (array.indexOf(this._modifiedEntities, this._modifiedEntitiesLength, entity.id) !== -1) {
            return;
        }

        array.push(this._modifiedEntities, this._modifiedEntitiesLength++, entity.id);
    },
    /**
     * @method clear
     * @return {[type]} [description]
     */
    clear: function () {
        var entity;
        for (var i = 1; i <= this._greatestEntityID; i++) {
            entity = this._entities[i];

            if (entity == null || entity.id === 0) {
                continue;
            }

            this._entitiesToRemove.put(entity);
        }

        for (var i = 0, len = this._systems.length; i < len; i++) {
            this._systemsToRemove(this._systems[i]);
        }

        this._performClearing = true;

        return this;
    },
    update: function (event) {
        var delta = event.delta;
        var system;

        for (var i = 0, len = this._systems.length; i < len; i++) {
            system = this._systems[i];

            if (system._disabled) {
                continue;
            }

            system.update(delta);
        }

        this._removeEntities();
        this._addEntities();
        this._modifyEntities();
        this._removeSystems();
        this._addSystems();
        this._fetchQueries();

        if (this._performClearing) {
            this.emit('clear');
            this._performClearing = false;
        }
    },
    _removeEntities: function () {
        var entityToRemove, i, len,
            index,
            indexOfEntity,
            name,
            query,
            queries = this._queries,
            systemEntities = this._entities;

        while (entityToRemove = this._entitiesToRemove.get()) {
            if (entityToRemove.id === 0) {
                continue;
            }

            for (i = 0, len = queries.length; i < len; i++) {
                query = queries[i];

                if (!query.satisfiedBy(entityToRemove)) {
                    continue;
                }

                index = query.index;
                indexOfEntity = array.indexOf(index, query.indexLength, entityToRemove.id);

                if (indexOfEntity !== -1) {
                    query.touched = true;
                    array.removeAtIndexConst(index, query.indexLength--, indexOfEntity);
                }
            }

            if (is.function(entityToRemove.pattern.remove)) {
                entityToRemove.pattern.remove.call(entityToRemove, this.game);
            }

            systemEntities[entityToRemove.id] = 0;
            entityToRemove.id = 0;

            name = entityToRemove.name;

            this._entitiesPool[name].put(entityToRemove);
            this._entitiesCount -= 1;
        }
    },
    _addEntities: function () {
        var id, i, len,
            entityToAdd,
            query,
            queries = this._queries,
            systemEntities = this._entities;

        while (entityToAdd = this._entitiesToAdd.get()) {

            id = this._generateEntityID();

            if (id > systemEntities.length) {
                array.extend(systemEntities, Math.round(1.25 * systemEntities.length));
            }

            entityToAdd.id = id;
            systemEntities[id] = entityToAdd;

            for (i = 0, len = this._queries.length; i < len; i++) {
                query = queries[i];

                if (!query.satisfiedBy(entityToAdd)) {
                    continue;
                }

                query.touched = true;
                array.push(query.index, query.indexLength++, id);
            }

            this._entitiesCount += 1;
        }
    },
    _modifyEntities: function () {
         var i = 0, j, index, indexLength, len,
            query,
            queries = this._queries,
            modifiedEntity,
            systemEntities = this._entities,
            modifiedEntities = this._modifiedEntities;

        while (modifiedEntity = systemEntities[modifiedEntities[i]]) {

            modifiedEntity.applyModifications();

            for (j = 0, len = this._queries.length; j < len; j++) {
                query = queries[j];

                index = query.index;
                indexLength = query.indexLength;

                var satisfied = query.satisfiedBy(modifiedEntity);
                var indexOfEntity =  array.indexOf(index, indexLength, modifiedEntity.id);

                if (satisfied && indexOfEntity === -1) {
                    query.touched = true;
                    array.push(index, query.indexLength++, modifiedEntity.id);
                } else if (!satisfied && indexOfEntity !== -1) {
                    query.touched = true;
                    array.removeAtIndexConst(index, query.indexLength--, indexOfEntity);
                }
            }

            i++;
        }
        array.clear(this._modifiedEntities, this._modifiedEntitiesLength);
        this._modifiedEntitiesLength = 0;
    },
    _removeSystems: function () {
        var systemToRemove;
        while (systemToRemove = this._systemsToRemove.get()) {
             var indexOfSystem = this._systems.indexOf(systemToRemove);

            if (indexOfSystem === -1) {
                //debug.warn('Nothing to remove.');
                continue;
            }

            if (is.function(systemToRemove.remove)) {
                systemToRemove.remove();
            }

            array.removeAtIndex(this._systems, indexOfSystem);
        }
    },
    _addSystems: function () {
        var systemToAdd, len;
        while (systemToAdd = this._systemsToAdd.get()) {
            var insertionIndex = 0;
            var priority = systemToAdd.priority;
            for (len = this._systems.length; insertionIndex < len; insertionIndex++) {
                if (this._systems[insertionIndex].priority > priority) {
                    break;
                }
            }

            this._systems.splice(insertionIndex, 0, systemToAdd);
        }
    },
    _fetchQueries: function () {
        var i, id, index, len,
            query,
            systemEntities = this._entities,
            queries = this._queries;

        for (i = 0, len = this._queries.length; i < len; i++) {
            query = queries[i];
            if (!query.touched) {
                continue;
            }

            index = query.index;
            var entities = query.entities;
            var entitiesLength = 0;
            var j = 0;
            while (id = index[j]) {
                array.push(entities, entitiesLength++, systemEntities[id]);
                j += 1;
            }

            array.push(entities, entitiesLength, 0);
            query.entitiesLength = entitiesLength;
            query.touched = false;
        }
    },
    _getNewComponent: function (name) {
        var component;
        var componentPattern = register.getComponentPattern(name);
        var poolJustCreated = false;

        if (is.not.object(componentPattern)) {
            return null;
        }

        if (this._componentsPool[name] == null) {
            this._componentsPool[name] = new Pool(config('initial_components_pool_size'));

            poolJustCreated = true;
        }

        component = this._componentsPool[name].get();

        if (component == null) {
            component = {
                _pattern: componentPattern
            };
        } else if (is.function(component._pattern.reset)) {
            component._pattern.reset.call(component);
        }

        return component;
    },
    _addComponentToPool: function (component) {
        if (this._componentsPool[name] == null) {
            this._componentsPool[name] = new Pool(config('initial_components_pool_size'));
        }
        
        this._componentsPool[component._pattern.name].put(component);
    },
    /**
     * Returns ID for an entity. Reuses old IDs or creates new.
     *
     * @private
     * @method _generateEntityID
     * @return {Number} new ID
     */
    _generateEntityID: function () {
        var id = this._idsToReuse.get();

        if (id == null) {
            id = ++this._greatestEntityID;
        }

        return id;
    },
    /**
     * Initializes new query. Performs initial entity search.
     *
     * @private
     * @method  _initializeQuery
     * @param {Object} query query object
     */
    _initializeQuery: function (query) {
        //TODO: add check for existing query

        var entities = array.alloc(1000);
        var entitiesLength = 0;
        var index = array.alloc(1000);
        var indexLength = 0;

        var entity;
        for (var i = 1, greatestID = this._greatestEntityID; i <= greatestID; i++) {
            entity = this._entities[i];
            if (entity === 0) {
                continue;
            }

            if (query.satisfiedBy(entity)) {
                array.push(index, indexLength++, entity.id);
                array.push(entities, entitiesLength++, entity);
            }
        }

        extend(query, {
            entities: entities,
            entitiesLength: entitiesLength,
            index: index,
            indexLength: indexLength,
            touched: false
        });

        this._queries.push(query);
    }
});

module.exports = Engine;
},{"./config":7,"./debug":9,"./entity":11,"./event":12,"./fastarray":13,"./pool":17,"./query":18,"./register":19,"check-types":2,"node.extend":4}],11:[function(require,module,exports){
'use strict';

var is = require('check-types');
var debug = require('./debug');
var extend = require('node.extend');
var config = require('./config');
var register = require('./register');
var slice = Array.prototype.slice;

var EventEmitter = require('./event');
var BitSet = require('bitset.js').BitSet;

/**
 * Entity class. Class is used internaly. User should not instatiate this class.
 *
 * @class Entity
 * @constructor
 * @param {String} name    entity name
 * @param {Object} pattern entity pattern
 * @param {Engine} engine  Engine instance
 */
function Entity(name, pattern, engine) {
    EventEmitter.call(this);

    this.engine = engine;
    this.pattern = pattern;

    this.bitset = new BitSet(config('max_components_count'));
    this._modifications = [];

    this.id = 0;
    this.name = name;
    this.components = {};

    this._setDefaults();
}

extend(Entity.prototype, EventEmitter.prototype);
extend(Entity.prototype, {
    /**
     * Adds new component to an entity. Component is either created from scratch or reused from pool. In later case, component patterns `reset` method is called (if present).\
     * Component patterns `initialize` method is called with additional arguments passed to `add` method.
     * Addition does not happen imediately, but is postponed to nearest update cycle.
     *
     * @example
     *     //`this` is a reference to Entity instance
     *     //code like this often can be seen in entity pattern `create` method
     *     this.add("Position", 1, 1);
     *
     * @method add
     * @param {String} ...name name of component to add. Addidtional parameters are applied to component patterns `initialize` method.
     * @return {Entity} Entity instance
     */
    add: function (name) {
        if (is.not.unemptyString(name)) {
            debug.warn('component name must be a non-empty string');
            return this;
        }

        var lowercaseName = name.toLowerCase();

        var component = this.components[lowercaseName];
        if (component == null) {
            component = this.engine._getNewComponent(lowercaseName);

            if (component == null) {
                debug.warn('there is no component pattern with name %s', name);
                return this;
            }
        } else if (is.function(component._pattern.reset)) {
            component._pattern.reset.call(component);
        }

        var args = slice.call(arguments, 1);
        component._pattern.initialize.apply(component, args);

        this.components[lowercaseName] = component;

        /**
         * If entity id equals 0, it has not yet been added to the system, so we can
         * safely modify it.
         */
        if (this.id === 0) {
            this.bitset.set(register.getComponentID(lowercaseName));
        } else {
            this._modifications.push({
                fn: function () {
                    this.bitset.set(register.getComponentID(lowercaseName));
                }
            });

            this.engine.markModifiedEntity(this);
        }

        return this;
    },
    remove: function (name) {
        if (is.not.unemptyString(name)) {
            debug.warn('component name must be a non-empty string');
            return this;
        }

        var lowercaseName = name.toLowerCase();
        var componentId = register.getComponentID(lowercaseName);

        if (!this.bitset.get(componentId)) {
            debug.warn('this entity does not have such component "%s" - nothing to remove', name);
            return this;
        }

        if (this.id === 0) {
            this._removeComponent(lowercaseName, componentId);
        } else {
            this._modifications.push({
                fn: this._removeComponent,
                args: [lowercaseName, componentId]
            })

            this.engine.markModifiedEntity(this);
        }

        return this;
    },
    _removeComponent: function (lowercaseName, componentId) {
        this.engine._addComponentToPool(this.components[lowercaseName]);

        this.components[lowercaseName] = null;
        this.bitset.clear(componentId);
    },
    get: function (name) {
         if (is.not.unemptyString(name)) {
            debug.warn('component name must be a non-empty string');
            return this;
        }

        return this.components[name.toLowerCase()];
    },
    reset: function () {
        if (is.function(this.pattern.reset)) {
            this.pattern.reset.call(this, this.engine.game);
        }

        this._setDefaults();

        return this;
    },
    applyModifications: function () {
        var mod;

        while (mod = this._modifications.shift()) {
            mod.fn.apply(this, mod.args);
        }
    },
    clearModifications: function () {
        while (this._modifications.shift());
    },
    _setDefaults: function () {
        this.bitset.clear();
        this._inFinalState = false;
        this._remainingStateChanges = [];
        this._stateObject = {};
        this._currentStates = [];
        this._stateChanges = [];
    }
});

module.exports = Entity;
},{"./config":7,"./debug":9,"./event":12,"./register":19,"bitset.js":1,"check-types":2,"node.extend":4}],12:[function(require,module,exports){
'use strict';

var is = require('check-types');
var extend = require('node.extend');
var slice = Array.prototype.slice;

/**
 * EventEmitter class. This is very simple yet suficient event emitter implementation.
 *
 * @class EventEmitter
 * @constructor
 */
function EventEmitter () {
    /**
     * Object with registered event listeners. Keys are event names.
     * 
     * @private
     * @property {Object} _events
     */
    this._events = {};
}

extend(EventEmitter.prototype, {
    /**
     * Method used to register event listener.
     *
     * @example
     *     emitter.on('event', function () {
     *         console.log(this.foo); //bar
     *     }, {foo: 'bar'});
     *
     * @method on
     * @param  {String}     event   event name
     * @param  {Function}   fn      event listener
     * @param  {Object}     binding context used as `this` when calling listener
     * @param  {Boolean}    once    if set to `true`, listener will be called once, then will be unregistered
     */
    on: function (event, fn, binding, once) {
        if (is.not.string(event) || is.not.function(fn)) {
            return;
        }

        this._events[event] = this._events[event] || [];

        this._events[event].push({
            fn: fn,
            binding: binding,
            once: once
        });
    },
    once: function (event, fn, binding) {
        this.on(event, fn, binding, true);
    },
    emit: function (event) {
        if (!(event in this._events)) {
            return;
        }

        var args = slice.call(arguments, 1);

        var listener;
        var i = 0;
        var events = this._events[event];
        while (i < events.length) {
            listener = this._events[event][i];

            var returnedValue = listener.fn.apply(listener.binding, args);

            if (returnedValue === false || listener.once) {
                var index = i;
                while (index < events.length) {
                    events[index] = events[++index];
                }

                events.length--;
            } else {
                i++;
            }
        }
    },
    trigger: function () {
        this.emit.apply(this, arguments);
    },
    off: function (event, fn) {
        if (is.not.string(event) || !(event in this._events)) {
            return;
        }

        this._events[event] = this._events[event].filter(function (listener) {
            return is.function(fn) && listener.fn !== fn;
        });
    }
});

module.exports = EventEmitter;
},{"check-types":2,"node.extend":4}],13:[function(require,module,exports){
var is = require('check-types');

module.exports = {
    alloc: function (size) {
        if (is.not.number(size)) {
            throw new Error('Array size should be number.')

            return;
        }

        var arr = new Array(size);

        for (var i = 0; i < size; i++) {
            arr[i] = 0;
        }

        return arr;
    },
    extend: function (arr, extensionSize) {
        var oldLength = arr.length;

        arr.length = oldLength + extensionSize;

        for (var i = oldLength, newLength = arr.length; i < newLength; i++) {
            arr[i] = 0;
        }

        return arr;
    },
    removeAtIndex: function (arr, index) {
        var len = arr.length;

        if (len === 0) {
            return;
        }

        while (index < len) {
            arr[index] = arr[++index];
        }

        arr.length--;
    },
    removeAtIndexConst: function (arr, arrayLength, index) {
        if (arrayLength === 0) {
            return;
        }

        while (index < arrayLength - 1) {
            arr[index] = arr[++index];
        }

        arr[arrayLength - 1] = 0;
    },
    indexOf: function (arr, arrayLength, value) {
        for (var i = 0; i < arrayLength; i++) {
            if (arr[i] === value) {
                return i;
            }
        }

        return -1;
    },
    clear: function (arr, arrayLength) {
        for (var i = 0; i < arrayLength; i++) {
            arr[i] = 0;
        }
    },
    push: function (arr, arrayLength, value) {
        if (arrayLength === arr.length) {
            this.extend(arr, Math.round(arr.length * 1.5));
        }

        arr[arrayLength] = value;
    }
};

},{"check-types":2}],14:[function(require,module,exports){
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
},{"./debug":9,"./engine":10,"./event":12,"./plugin":15,"./state":20,"./ticker":21,"check-types":2,"inverse":3,"node.extend":4}],15:[function(require,module,exports){
'use strict';

var is = require('check-types');
var debug = require('./debug');
var extend = require('node.extend');
var EventEmitter = require('./event');

var RESERVED_NAMES = ['game', 'engine', 'ticker', 'plugin'];

/**
 * Plugin class. Class is used internaly. User should not instatiate this class.
 *
 * @class Plugin
 * @extends EventEmitter
 * @constructor
 */
function Plugin (game) {
    EventEmitter.call(this);

    this.game = game;
    this._actualPlugins = {};
    this._actualPluginNames = [];

    ['start', 'stop', 'resume', 'pause'].forEach(function (eventName) {
        this.game.on(eventName, function () {
            this._runPluginMethod(eventName, arguments);
        }, this)
    }, this);

    this.game.ticker.on('tick', function () {
        this._runPluginMethod('update', arguments);
    }, this)
}

extend(Plugin.prototype, EventEmitter.prototype);
extend(Plugin.prototype, {
    /**
     * This method should be used to add plugins to system.
     * Plugin name and plugin object (can be instance of a "class" or plain object) must be provided.
     * These names are reserved: `game`, `engine`, `ticker`, `plugin`.
     *
     * Plugin instance can have lifecycle methods that are called automatically. These methods are:
     * - __start__ - called when game starts
     * - __stop__ - called when game stops
     * - __update__ - called on every game loop tick, method gets `delta` argument
     * - __pause__ - called when game pauses
     * - __resune__ - called when game resumes
     * - __destroy__ - called when plugin is destroyed, great place for freeing plugin resources, if some exist
     * 
     * @example
     *     //somwhere in state lifecycyle method or other method with `game` in context...
     *     game.plugin.add('renderer', new Entropy.Plugin.Renderer(800, 600, 0xffffff));
     *
     *     //added plugin is now available as a property of `game` object
     *     game.renderer.addSprite('ball.png');
     *
     *     //ups, `plugin` is reserved system name
     *     game.plugin.add('plugin', new MyAwesomePlugin('hello world!')); //undefined returned and error in console, plugin not added
     *
     *     //plugin gets destroyed, its `destroy` method is called if present
     *     game.plugin.remove('renderer');
     *
     * @method add
     * @param  {String} name    plugin name
     * @param  {Object} obj     instance of plugin
     * @return {Object|undefined}   provided plugin instance or `undefined` if plugin name is forbidden system name and plugin cannot be registered
     */
    add: function (name, obj) {
        if (RESERVED_NAMES.indexOf(name) !== -1) {
            debug.error('This plugin name is reserved for internal use: %s', name);

            return;
        }

        this.game[name] = this._actualPlugins[name] = obj;

        this._updateActualPluginNames()

        this.emit('pluginAddition', obj);

        return obj;
    },
    /**
     * Removes plugin from game object. Plugin has to be {{#crossLink "Plugin/add:method"}}added{{/crossLink}} beforehand.
     * 
     * @example
     *     //plugin gets destroyed, its `destroy` method is called if present
     *     game.plugin.remove('renderer');
     *
     *     game.renderer === undefined; //true
     *
     * @method remove
     * @param  {String} name    plugin name
     * @return {Boolean}    `true` if removed succesfully, `false` otherwise 
     */
    remove: function (name) {
        if (!(name in this._actualPlugins)) {
            debug.error('Plugin `%s` is not initilized, cannoy be destroyed.', name)
            
            return false;
        }

        var plugin = this._actualPlugins[name];

        if (is.function(plugin.destroy)) {
            plugin.destroy();
        }

        delete this._actualPlugins[name];
        delete this.game[name];

        this._updateActualPluginNames();

        this.emit('pluginRemoval', name);

        return true;
    },
    _updateActualPluginNames: function () {
        this._actualPluginNames = Object.keys(this._actualPlugins);
    },
    _runPluginMethod: function (methodName, methodArguments) {
        var plugin;

        for (var i = 0; i < this._actualPluginNames.length; i++) {
            plugin = this._actualPlugins[this._actualPluginNames[i]];

            if (is.function(plugin[methodName])) {
                plugin[methodName].apply(plugin, methodArguments);
            }
        }
    }
});

/**
 * Fired, when plugin is succesfully added.
 *
 * @event pluginAddition
 */

/**
 * Fired, when plugin is succesfully removed.
 *
 * @event pluginRemoval
 */

module.exports = Plugin;
},{"./debug":9,"./event":12,"check-types":2,"node.extend":4}],16:[function(require,module,exports){
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
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

// @license http://opensource.org/licenses/MIT
// copyright Paul Irish 2015


// Date.now() is supported everywhere except IE8. For IE8 we use the Date.now polyfill
//   github.com/Financial-Times/polyfill-service/blob/master/polyfills/Date.now/polyfill.js
// as Safari 6 doesn't have support for NavigationTiming, we use a Date.now() timestamp for relative values

// if you want values similar to what you'd get with real perf.now, place this towards the head of the page
// but in reality, you're just getting the delta between now() calls, so it's not terribly important where it's placed


(function(){

  if ("performance" in window == false) {
      window.performance = {};
  }

  Date.now = (Date.now || function () {  // thanks IE8
      return new Date().getTime();
  });

  if ("now" in window.performance == false){

    var nowOffset = Date.now();

    if (performance.timing && performance.timing.navigationStart){
      nowOffset = performance.timing.navigationStart
    }

    window.performance.now = function now(){
      return Date.now() - nowOffset;
    }
  }

})();
},{}],17:[function(require,module,exports){
var extend = require('node.extend');

/**
 * Simple implemenation of stack.
 *
 * @class Pool
 * @param {Number} initialSize initial pool size
 */
function Pool(initialSize) {
    this._maxSize = initialSize;
    this._currentSize = 0;
    this._pool = new Array(initialSize);

    for (var i = 0; i < initialSize; i++) {
        this._pool[i] = 0;
    }
}

extend(Pool.prototype, {
    /**
     * Puts value in the pool. Named pool, because it is used to implement pooling of various object in engine.
     *
     * @method put
     * @param  {Any} thing value to put in pool
     */
    put: function (thing) {
        if (this._currentSize === this._maxSize) {
            this._maxSize = Math.round(this._currentSize * 1.5);
            this._pool.lenght = this._maxSize;

            for (var i = this._currentSize + 1; i < this._maxSize; i++) {
                this._pool[i] = 0;
            }
        }

        this._pool[this._currentSize++] = thing;
    },
    /**
     * Gets value from the pool. Returns last put value.
     *
     * @method get
     * @return {Any} value from the pool
     */
    get: function () {
        if (this._currentSize === 0) {
            return null;
        }

        return this._pool[--this._currentSize];
    },
    /**
     * Returns current size of the pool (not maximum size).
     *
     * @method size
     * @return {Number} pool size
     */
    size: function () {
        return this._currentSize;
    }
});

module.exports = Pool;
},{"node.extend":4}],18:[function(require,module,exports){
'use strict';

var is = require('check-types');
var debug = require('./debug');
var config = require('./config');
var register = require('./register');
var extend = require('node.extend');

var BitSet = require('bitset.js').BitSet;

/**
 * Used to perform matching of entities.
 * Only parameter is an array of component names to include or object with `include` and/or `exclude` properties,
 * witch are arrays of component names to respectively include and/or exclude. Object can also have `name` property,
 * that will match entities with given name. 
 *
 * @example
 *     //matches entities with 'Position' and 'Velocity' components
 *     var q1 = new Entropy.Query(["Position", "Velocity"]);
 *
 *     //matches entities with 'Position' and 'Velocity' components and without 'Sprite' component
 *     var q2 = new Entropy.Query({
 *         include: ["Position", "Velocity"],
 *         exclude: ["Sprite"]
 *     });
 *
 *     //matches entities with name 'Ball'
 *     var q3 = new Entropy.Query({
 *         name: "Ball"
 *     });
 *
 * @class Query
 * @constructor
 * @param {Object|Array} query query conditions
 */
function Query (query) {
    var include = [], exclude = [], name;
    var includeBS, excludeBS;

    if (is.array(query)) {
        include = query;
    } else if (is.object(query)) {
        if (is.unemptyString(query.name)) {
            name = query.name;
        }

        if (is.array(query.include)) {
           include = query.include;
        }

        if (is.array(query.exclude)) {
            exclude = query.exclude;
        }
    }

    if (include.length === 0 && exclude.length === 0 && name == null) {
        debug.warn('You want to create empty query. If your intention is to get all entities, use getAllEntities() instead.');
        return;
    }

    if (include.length > 0) {
        includeBS = new BitSet(config('max_component_count'));
        for (var i = 0; i < include.length; i++) {
            includeBS.set(register.getComponentID(include[i]));
        }
    }

    if (exclude) {
        excludeBS = new BitSet(config('max_component_count'));
        for (var e = 0; e < exclude.length; e++) {
            excludeBS.set(register.getComponentID(exclude[i]))
        }
    }

    this.matchName = name;
    this.includes = includeBS;
    this.excludes = excludeBS;
}

extend(Query.prototype, {
    satisfiedBy: function (entity) {
        var satisfies = true;
        var includes = this.includes;
        var excludes = this.excludes;
        var name = this.matchName;

        if (name != null) {
            satisfies = entity.pattern.name === name;
        }

        if (includes != null) {
            satisfies = satisfies && includes.clone().and(entity.bitset).equals(includes);
        }

        if (excludes != null) {
            satisfies = satisfies && excludes.and(entity.bitset).isEmpty();
        }

        return satisfies;
    }
});

module.exports = Query;
},{"./config":7,"./debug":9,"./register":19,"bitset.js":1,"check-types":2,"node.extend":4}],19:[function(require,module,exports){
'use strict';

var is = require('check-types');
var debug = require('./debug');
var config = require('./config');

var canModify = true;
var componentPatterns = {};
var systemPatterns = {};
var entityPatterns = {};
var nextComponentId = 0;

module.exports = {
    registerComponent: function (component) {
        if (!canModify) {
            debug.error('you can\'t define new component during system work')
            return false;
        }

        if (is.not.object(component)) {
            debug.error('component pattern must be an object');
            return false;
        }

        if (!('name' in component) || !('initialize' in component)) {
            debug.error('you must define both "name" and "initialize" of component pattern');
            return false;
        }

        if (component.name in componentPatterns) {
            debug.error('you can\'t define same component twice');
            return false;
        }

        component._bit = nextComponentId++;
        componentPatterns[component.name.toLowerCase()] = component;

        return true;
    },
    registerSystem: function (system) {
        if (!canModify) {
            debug.error('you can\'t define new system during system work');
            return false;
        }

        if (!is.object(system)) {
            debug.error('system pattern must be an object');
            return false;
        }

        if (!('name' in system) || !('update' in system)) {
            debug.error('you must define both "name" and "update" of system pattern');
            return false;
        }

        if (system.name in systemPatterns) {
            debug.error('you can\'t define same system twice');
            return false;
        }

        systemPatterns[system.name] = system;

        return true;
    },
    registerEntity: function (entity) {
        if (!canModify) {
            debug.error('you can\'t define new system during system work');
            return false;
        }

        if (is.not.object(entity)) {
            debug.error('entity pattern must be an object');
            return false;
        }

        if (!('name' in entity) || !('create' in entity)) {
            debug.error('you must define both "name" and "create" of entity pattern');
            return false;
        }

        if (entity.name in entityPatterns) {
            debug.error('you can\'t define same entity twice');
            return false;
        }

        entityPatterns[entity.name] = entity;

        return true;
    },
    listComponentsNames: function () {
        return Object.keys(componentPatterns);
    },
    listEntitiesNames: function () {
        return Object.keys(entityPatterns);
    },
    getComponentPattern: function (name) {
        return componentPatterns[name.toLowerCase()];
    },
    getComponentID: function (name) {
        return componentPatterns[name.toLowerCase()]._bit;
    },
    getSystemPattern: function (name) {
        return systemPatterns[name];
    },
    getEntityPattern: function (name) {
        return entityPatterns[name];
    },
    canModify: function () {
        return canModify;
    },
    setCannotModify: function () {
        canModify = false;
    }
}
},{"./config":7,"./debug":9,"check-types":2}],20:[function(require,module,exports){
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
},{"check-types":2}],21:[function(require,module,exports){
(function (global){
'use strict';

var raf = global.requestAnimationFrame;
var extend = require('node.extend');
var config = require('./config');
var Stats = require('../lib/stats');

var EventEmitter = require('./event');

/**
 * @class Ticker
 * @extends {EventEmitter}
 * @param {Game} game Game instance
 */
function Ticker (game, variant) {
    EventEmitter.call(this);

    this.game = game;

    this.TIME_FACTOR = config('time_factor');
    this.MAX_FRAME_TIME = config('max_frame_time');

    this._loopVariant = variant;
    this._paused = false;
    this._running = false;
    this._ticks = 0;
    this._currentFPS = 0;
    this._rafID = 0;
    this._debug = false;
}

/**
 * Fires when ticker starts ticking.
 *
 * @event start
 */

/**
 * Fires when ticker stops ticking.
 *
 * @event stop
 */

extend(Ticker.prototype, EventEmitter.prototype);
extend(Ticker.prototype, {
    getCurrentFPS: function () {
        return this._currentFPS;
    },
    getTicks: function () {
        return this._ticks;
    },
    setTimeFactor: function (factor) {
        this.TIME_FACTOR = factor;
    },
    /**
     * @method pause
     * @return {Boolean} `true` if paused succesfuly, `false` otherwise
     */
    pause: function () {
        if (!this.isRunning() || this.isPaused()) {
            return false;
        }

        this._paused = true;
        this.emit('pause');

        return true;
    },
    /**
     * @method resume
     * @return {Boolean} `true` if resumed succesfuly, `false` otherwise
     */
    resume: function () {
        if (!this.isRunning() || !this.isPaused()) {
            return false;
        }

        this._paused = false;
        this.emit('resume');

        return true;
    },
    /**
     *
     *
     * @method start
     * @return {Boolean} `true` if starded succesfuly, `false` otherwise
     */
    start: function () {
        var self = this;

        if (this.isPaused()) {
            return this.resume();
        }

        if (this.isRunning()) {
            return false;
        }

        var last = performance.now();
        var event = {};

        this._rafID = raf(tick);
        this._running = true;

        this.emit('start');

        function tick (time) {
            self._rafID = raf(tick);

            var now = performance.now();
            var delta = now - last; //miliseconds

            if (self._paused) {
                return;
            }

            self._ticks += 1;

            if (delta >= self.MAX_FRAME_TIME) {
                delta = self.MAX_FRAME_TIME;
            }

            event.delta = delta * self.TIME_FACTOR;
            event.ticks = self._ticks;

            if (self._debug) {
                self._stats.begin();
            }

            //self.game.engine.update(event);
            self.emit('tick', event);

            if (self._debug) {
                self._stats.end();
            }
        }
    },
    /**
     * @method stop
     * @return {Boolean} `true` if stopped succesfuly, `false` otherwise
     */
    stop: function () {
        if (this._rafID === 0) {
            return false;
        }

        global.cancelAnimationFrame(this._rafID);
        this._running = this._paused = false;
        this.emit('stop');

        return true;
    },
    /**
     * @method isPaused
     * @return {Boolean} `true` if paused, `false` otherwise
     */
    isPaused: function () {
        return this._paused;
    },
    /**
     * Running ticker is a ticker that constantly calls its timer function.
     * Paused ticker is also running.
     *
     * @method isRunning
     * @return {Boolean} `true` if running, `false` otherwise
     */
    isRunning: function () {
        return this._running;
    },
    /**
     * Turns __on__ or __off__ debugging features (FPS meter, frame time meter etc.).
     *
     * @method debug
     * @param  {Boolean} debug start or stop debugging
     */
    debug: function (debug) {
        if (this._stats == null) {
            this._stats = new Stats();
        }

        if (debug) {
            this._stats.domElement.style.position = 'absolute';
            this._stats.domElement.style.right = '0px';
            this._stats.domElement.style.top = '0px';

            document.body.appendChild(this._stats.domElement);

            this._debug = true;
        } else {
            document.body.removeChild(this._stats.domElement);
            this._debug = false;
        }

    }
});

module.exports = Ticker;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../lib/stats":23,"./config":7,"./event":12,"node.extend":4}],22:[function(require,module,exports){
/**
 * Main Entropy module and top namespace.
 * 
 * @module Entropy
 */
'use strict';

//Requiring polyfills for requestAnimationFrame and performance.now.
require('./core/polyfill');

var debug = require('./core/debug');
var config = require('./core/config');
var State = require('./core/state');
var register = require('./core/register');

//Welcome message.
console.log.apply(console, [
    '%c %c %c Entropy 0.1.0 - Entity System Framework for JavaScript %c %c ',
    'background: rgb(200, 200,200);',  
    'background: rgb(80, 80, 80);',
    'color: white; background: black;',
    'background: rgb(80, 80, 80);',
    'background: rgb(200, 200, 200);'
]);

/**
 * Main static framework class. Used as a top namespace.
 * 
 * @class Entropy
 * @static
 */
function Entropy () {
    debug.warning('This function should not be used as a constructor.');
    return;
}

/**
 * Registers new component pattern.
 * Only argument should be an object with obligatory `name` property and `initialize` method.
 * This method is used to assign some data to component object. `this` inside `initialize` function is a
 * reference to newly created component object.
 *
 * @example
 *     Entropy.Component({
 *         name: "Position",
 *         initialize: function (x, y) {
 *             this.x = x;
 *             this.y = y;
 *         },
 *         //not obligatory
 *         reset: function () {
 *             this.x = 0;
 *             this.y = 0;
 *         }
 *     });
 *
 * @method Component
 * @static
 * @param {Object} component component pattern
 */
Entropy.Component = function (component) {
    register.registerComponent(component);
};

/**
 * Registers new entity pattern.
 *
 * Pattern is an object with following properties:
 *  - __name__ (required) - name of an entity
 *  - __create__ (required) - method called when creating new entity. Here you should add initial components to an entity.
 *   `this` inside function references newly created entity object (instance of {{#crossLink "Entity"}}Entity{{/crossLink}} class).
 *   Function is called with first argument being `game` object and every others are parameters with witch {{#crossLink "Engine/create:method"}}create{{/crossLink}} method is called.
 *  - __remove__ (optional) - method called when entity is removed from the system. This is good place to clean after entity (ex. remove some resources from renderer).
 *   First and only argument is a `game` object.
 *
 * @example
 *     Entropy.Entity({
 *         name: "Ball",
 *         create: function (game, x, y, radius) {
 *             var sprite = new Sprite("Ball");
 *
 *             game.container.make("renderer").addSprite(sprite);
 *
 *             this.add("Position", x, y)
 *                 .add("Radius", radius)
 *                 .add("Velocity", 5, 5)
 *                 .add("Sprite", sprite);
 *         },
 *         //not oblgatory
 *         remove: function (game) {
 *             game.container.make("renderer").removeSprite(this.components.sprite.sprite);
 *         }
 *     });
 *
 * @method Entity
 * @static
 * @param {Object} entity entity pattern
 */
Entropy.Entity = function (entity) {
    register.registerEntity(entity);
};

/**
 * Registers new system pattern.
 *
 * @example
 *     Entropy.System({
 *         name: "MovementSystem",
 *         priority: 1, //not obligatory
 *         initialize: function () {
 *             this.query = new Entropy.Query(["Position", "Velocity"]);
 *         },
 *         update: function (delta) {
 *             var entities = this.engine.getEntities(this.query);
 *             var e;
 *
 *             var i = 0;
 *             while (e = entities[i]) {
 *                 var position = e.components.position;
 *                 var velocity = e.components.velocity;
 *
 *                 position.x += delta / 1000 * velocity.vx;
 *                 position.y += delta / 1000 * velocity.vy;
 *
 *                 i++;
 *             }
 *         },
 *         //not obligatory
 *         remove: function () {
 *
 *         }
 *     });
 *
 * @method System
 * @static
 * @param {Object} system system pattern object
 */
Entropy.System = function (system) {
    register.registerSystem(system);
};

/**
 * Assignes new property to main Entropy namespace identified by key (uppercased).
 * Once assigned, can't be assigned again.
 * Can be later accessed by: Entropy.KEY
 *
 * @example
 *     Entropy.Const('WIDTH', 800);
 *
 *     Entropy.WIDTH; //800
 *
 * @static
 * @method Const
 * @param {String}  key      constans key
 * @param {Any}     value    constans value
 */
Entropy.Const = require('./core/const');

/**
 * {{#crossLink "Game"}}Game{{/crossLink}} class reference.
 * 
 * @static
 * @method Game
 * @type {Game}
 */
Entropy.Game = require('./core/game');

/**
 * {{#crossLink "Config"}}Config{{/crossLink}} class reference.
 * 
 * @static
 * @method Config
 * @type {Config}
 */
Entropy.Config = config;

/**
 * {{#crossLink "Query"}}Query{{/crossLink}} class reference.
 * 
 * @static
 * @method Query
 * @type {Query}
 */
Entropy.Query = require('./core/query');

/**
 * Registers new state. This method simply calls State's {{#crossLink "State/Register:method"}}Register{{/crossLink}} static method.
 *
 * @example
 *     Entropy.State({
 *         //state object here
 *     });
 *
 * @static
 * @method State
 * @param {Object} state state object
 */
Entropy.State = function (state) {
    State.Register(state);
}

Entropy.Utils = {
    is: require('check-types'),
    extend: require('node.extend')
}

/**
 * {{#crossLink "EventEmitter"}}EventEmitter{{/crossLink}} class reference.
 * 
 * @static
 * @method EventEmitter
 * @type {EventEmitter}
 */
Entropy.EventEmitter = require('./core/event');

module.exports = Entropy;
},{"./core/config":7,"./core/const":8,"./core/debug":9,"./core/event":12,"./core/game":14,"./core/polyfill":16,"./core/query":18,"./core/register":19,"./core/state":20,"check-types":2,"node.extend":4}],23:[function(require,module,exports){
// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){var l=Date.now(),m=l,g=0,n=Infinity,o=0,h=0,p=Infinity,q=0,r=0,s=0,f=document.createElement("div");f.id="stats";f.addEventListener("mousedown",function(b){b.preventDefault();t(++s%2)},!1);f.style.cssText="width:80px;opacity:0.9;cursor:pointer";var a=document.createElement("div");a.id="fps";a.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#002";f.appendChild(a);var i=document.createElement("div");i.id="fpsText";i.style.cssText="color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
i.innerHTML="FPS";a.appendChild(i);var c=document.createElement("div");c.id="fpsGraph";c.style.cssText="position:relative;width:74px;height:30px;background-color:#0ff";for(a.appendChild(c);74>c.children.length;){var j=document.createElement("span");j.style.cssText="width:1px;height:30px;float:left;background-color:#113";c.appendChild(j)}var d=document.createElement("div");d.id="ms";d.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#020;display:none";f.appendChild(d);var k=document.createElement("div");
k.id="msText";k.style.cssText="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";k.innerHTML="MS";d.appendChild(k);var e=document.createElement("div");e.id="msGraph";e.style.cssText="position:relative;width:74px;height:30px;background-color:#0f0";for(d.appendChild(e);74>e.children.length;)j=document.createElement("span"),j.style.cssText="width:1px;height:30px;float:left;background-color:#131",e.appendChild(j);var t=function(b){s=b;switch(s){case 0:a.style.display=
"block";d.style.display="none";break;case 1:a.style.display="none",d.style.display="block"}};return{REVISION:11,domElement:f,setMode:t,begin:function(){l=Date.now()},end:function(){var b=Date.now();g=b-l;n=Math.min(n,g);o=Math.max(o,g);k.textContent=g+" MS ("+n+"-"+o+")";var a=Math.min(30,30-30*(g/200));e.appendChild(e.firstChild).style.height=a+"px";r++;b>m+1E3&&(h=Math.round(1E3*r/(b-m)),p=Math.min(p,h),q=Math.max(q,h),i.textContent=h+" FPS ("+p+"-"+q+")",a=Math.min(30,30-30*(h/100)),c.appendChild(c.firstChild).style.height=
a+"px",m=b,r=0);return b},update:function(){l=this.end()}}};"object"===typeof module&&(module.exports=Stats);

},{}]},{},[22])(22)
});