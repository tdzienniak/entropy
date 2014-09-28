!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Entropy=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @license BitSet.js v1.0.2 16/06/2014
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

if (typeof module !== 'undefined' && module['exports']) {
    module['exports']['BitSet'] = BitSet;
}

},{}],2:[function(require,module,exports){
var DoublyLinkedList, Node,
  __slice = [].slice;

Node = (function() {
  function Node(data) {
    this.prev = null;
    this.next = null;
    this.data = data != null ? data : null;
  }

  return Node;

})();

DoublyLinkedList = (function() {
  function DoublyLinkedList() {
    this.head = this.tail = null;
    this._current = this.head;
    this._pool = null;
  }

  DoublyLinkedList.prototype._getNewNode = function(data) {
    var node;
    if (this._pool != null) {
      node = this._pool;
      this._pool = node.next;
      node.next = node.prev = null;
      node.data = data;
      if (this._pool != null) {
        this._pool.prev = null;
      }
      return node;
    } else {
      return new Node(data);
    }
  };

  DoublyLinkedList.prototype.append = function(data) {
    var node;
    if (data == null) {
      return;
    }
    node = this._getNewNode(data);
    if (this.head == null) {
      this.tail = this.head = node;
      return this;
    }
    this.tail.next = node;
    node.prev = this.tail;
    this.tail = node;
    return this;
  };

  DoublyLinkedList.prototype.prepend = function(data) {
    var node;
    if (data == null) {
      return;
    }
    node = this._getNewNode(data);
    if (this.head == null) {
      this.tail = this.head = node;
      return this;
    }
    this.head.prev = node;
    node.next = this.head;
    this.head = node;
    return this;
  };

  DoublyLinkedList.prototype.join = function(list, prepend) {
    if (prepend == null) {
      prepend = false;
    }
    if (!list instanceof DoublyLinkedList) {
      console.warn('DoublyLinkedList.join argument must be type of DoublyLinkedList');
      return this;
    }
    if (list.head == null) {
      return this;
    }
    if (this.head == null) {
      this.head = list.head;
      this.tail = list.tail;
      return this;
    }
    if (prepend) {
      list.tail.next = this.head;
      this.head.prev = list.tail;
      this.head = list.head;
      list.tail = this.tail;
    } else {
      list.head.prev = this.tail;
      this.tail.next = list.head;
      this.tail = list.tail;
      list.head = this.head;
    }
    return this;
  };

  DoublyLinkedList.prototype.remove = function(thing, byData) {
    var node, nodeToRemove, _ref, _ref1, _ref2, _ref3;
    if (byData == null) {
      byData = false;
    }
    if (byData) {
      this.reset();
      while (node = this.next()) {
        if (thing === node.data) {
          nodeToRemove = node;
          break;
        }
      }
    } else {
      nodeToRemove = thing;
    }
    if (nodeToRemove != null) {
      if ((nodeToRemove.next == null) && (nodeToRemove.prev == null)) {
        this.head = this.tail = null;
      } else if (nodeToRemove === this.head) {
        if ((_ref = nodeToRemove.next) != null) {
          _ref.prev = null;
        }
        this.head = nodeToRemove.next;
      } else if (nodeToRemove === this.tail) {
        if ((_ref1 = nodeToRemove.prev) != null) {
          _ref1.next = null;
        }
        this.tail = nodeToRemove.prev;
      } else {
        if ((_ref2 = nodeToRemove.next) != null) {
          _ref2.prev = nodeToRemove.prev;
        }
        if ((_ref3 = nodeToRemove.prev) != null) {
          _ref3.next = nodeToRemove.next;
        }
      }
    }
    return this;
  };

  DoublyLinkedList.prototype.pop = function() {};

  DoublyLinkedList.prototype.shift = function() {};

  DoublyLinkedList.prototype.push = function(data) {
    return this.append(data);
  };

  DoublyLinkedList.prototype.unshift = function(data) {
    return this.prepend(data);
  };

  DoublyLinkedList.prototype.one = function() {
    var _ref;
    return (_ref = this.head) != null ? _ref.data : void 0;
  };

  DoublyLinkedList.prototype.begin = function() {
    this._current = this.head;
    return this;
  };

  DoublyLinkedList.prototype.end = function() {
    this._current = this.tail;
    return this;
  };

  DoublyLinkedList.prototype.next = function() {
    var temp, _ref;
    temp = this._current;
    this._current = (_ref = this._current) != null ? _ref.next : void 0;
    return temp;
  };

  DoublyLinkedList.prototype.prev = function() {
    var temp, _ref;
    temp = this._current;
    this._current = (_ref = this._current) != null ? _ref.prev : void 0;
    return temp;
  };

  DoublyLinkedList.prototype.current = function() {
    return this._current;
  };

  DoublyLinkedList.prototype.iterate = function() {
    var args, binding, fn, node, _ref;
    fn = arguments[0], binding = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    this.reset();
    while (node = this.next()) {
      fn.apply(binding, [node, node.data, (_ref = node.data) != null ? _ref.components : void 0].concat(args));
    }
    return this;
  };

  DoublyLinkedList.prototype.reset = function(end) {
    if (end == null) {
      end = false;
    }
    this._current = !end ? this.head : this.tail;
    return this;
  };

  DoublyLinkedList.prototype.clear = function() {
    if (this.tail != null) {
      this.tail.next = this._pool;
      this._pool = this.head;
    }
    this.head = this.tail = null;
    this._current = null;
    return this;
  };

  return DoublyLinkedList;

})();

module.exports = DoublyLinkedList;



},{}],3:[function(require,module,exports){
var Node, OrderedLinkedList,
  __slice = [].slice;

Node = (function() {
  function Node(data, priority) {
    this.next = null;
    this.priority = priority;
    this.data = data != null ? data : null;
  }

  return Node;

})();

OrderedLinkedList = (function() {
  function OrderedLinkedList() {
    this.head = this.tail = null;
    this._current = this.head;
  }

  OrderedLinkedList.prototype.insert = function(data, priority) {
    var i, node;
    node = new Node(data, priority);
    if (this.head == null) {
      if (node.priority == null) {
        node.priority = 0;
      }
      this.head = this.tail = node;
      return this;
    }
    if (node.priority == null) {
      node.priority = this.tail.priority;
    }
    if (this.head.next == null) {
      if (this.head.priority <= node.priority) {
        this.head.next = this.tail = node;
      } else {
        node.next = this.tail = this.head;
        this.head = node;
      }
      return this;
    }
    if (node.priority >= this.tail.priority) {
      this.tail = this.tail.next = node;
      return this;
    }
    if (node.priority < this.head.priority) {
      node.next = this.head;
      this.head = node;
      return this;
    }
    i = this.head;
    while (i.next != null) {
      if (i.next.priority > node.priority) {
        node.next = i.next;
        i.next = node;
        break;
      }
      i = i.next;
    }
    return this;
  };

  OrderedLinkedList.prototype.remove = function(thing, byData) {
    var node;
    if (byData == null) {
      byData = false;
    }
    if (this.head == null) {
      return this;
    }
    if (!byData && thing === this.head || byData && thing === this.head.data) {
      if (this.head === this.tail) {
        this.clear();
      } else {
        this.head = this.head.next;
      }
      return this;
    }
    this.reset();
    while (node = this.next()) {
      if (!byData && this === node.next || byData && thing === node.next.data) {
        if (node.next === this.tail) {
          node.next = null;
          this.tail = node;
        } else {
          node.next = node.next.next;
        }
        return this;
      }
    }
    return this;
  };

  OrderedLinkedList.prototype.begin = function() {
    this._current = this.head;
    return this;
  };

  OrderedLinkedList.prototype.end = function() {
    this._current = this.tail;
    return this;
  };

  OrderedLinkedList.prototype.next = function() {
    var temp, _ref;
    temp = this._current;
    this._current = (_ref = this._current) != null ? _ref.next : void 0;
    return temp;
  };

  OrderedLinkedList.prototype.current = function() {
    return this._current;
  };

  OrderedLinkedList.prototype.iterate = function() {
    var args, binding, fn, node;
    fn = arguments[0], binding = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    this.reset();
    while (node = this.next()) {
      fn.apply(binding, [node, node.data].concat(args));
    }
    return this;
  };

  OrderedLinkedList.prototype.reset = function(end) {
    if (end == null) {
      end = false;
    }
    this._current = !end ? this.head : this.tail;
    return this;
  };

  OrderedLinkedList.prototype.clear = function() {
    this.head = this.tail = null;
    this._current = null;
    return this;
  };

  return OrderedLinkedList;

})();

module.exports = OrderedLinkedList;



},{}],4:[function(require,module,exports){
var Pool;

Pool = (function() {
  function Pool() {
    this.size = 0;
    this.pool = {};
  }

  Pool.prototype.push = function(key, value) {
    if (!(key in this.pool)) {
      this.pool[key] = [];
    }
    this.size++;
    return this.pool[key].push(value);
  };

  Pool.prototype.pop = function(key) {
    if (this.has(key)) {
      this.size--;
      return this.pool[key].pop();
    } else {
      return void 0;
    }
  };

  Pool.prototype.has = function(key) {
    return key in this.pool && this.pool[key].length > 0;
  };

  Pool.prototype.size = function() {
    return this.size;
  };

  return Pool;

})();

module.exports = Pool;



},{}],5:[function(require,module,exports){
var DEFAULT_CONFIG, USER_CONFIG, type;

type = require('../utils/type');

DEFAULT_CONFIG = {
  debug: 3,
  max_components_count: 100,
  max_frame_time: 20,
  default_time_factor: 1,
  default_fps: 60
};

USER_CONFIG = {};

module.exports = function(key, value) {
  if (!type.of.string(key)) {
    return null;
  }
  if (value == null) {
    if (key in USER_CONFIG) {
      return USER_CONFIG[key];
    }
    if (key in DEFAULT_CONFIG) {
      return DEFAULT_CONFIG[key];
    }
    return null;
  } else {
    return USER_CONFIG[key] = value;
  }
};



},{"../utils/type":20}],6:[function(require,module,exports){
var BitSet, DoublyLinkedList, Engine, Entity, EventEmitter, OrderedLinkedList, Pool, config, debug, extend, register, type,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

type = require('../utils/type');

debug = require('../debug/debug');

config = require('../config/config');

extend = require('../utils/extend');

register = require('./register');

EventEmitter = require('./event');

Pool = require('../collection/pool');

OrderedLinkedList = require('../collection/orderedlinkedlist');

DoublyLinkedList = require('../collection/doublylinkedlist');

Entity = require('./entity');

BitSet = require('bitset.js').BitSet;

Engine = (function(_super) {
  __extends(Engine, _super);

  Engine.Component = register.registerComponent;

  Engine.System = register.registerSystem;

  Engine.Entity = register.registerEntity;

  function Engine(game) {
    var i, _i;
    this.game = game;
    Engine.__super__.constructor.call(this);
    this._greatestEntityId = 0;
    this._entityIdsToReuse = [];
    this._entities = [];
    this._systems = new OrderedLinkedList();
    this._singletonSystemsPresentInEngine = {};
    this._searchingBitSet = new BitSet(config('max_components_count'));
    this._excludingBitSet = new BitSet(config('max_components_count'));
    this._componetsPool = new Pool();
    this._entitiesPool = new Pool();
    this._families = {
      NONE: new DoublyLinkedList()
    };
    this._functionalFamiliesPool = [];
    this._usedFunctionalFamilies = [];
    for (i = _i = 0; _i <= 20; i = ++_i) {
      this._functionalFamiliesPool.push(new DoublyLinkedList());
    }
    this._entitiesToRemove = [];
    this._BLANK_FAMILY = new DoublyLinkedList();
    this._updating = false;
    this.on('engine:updateFinished', this._removeMarkedEntities, this);
    this.on('engine:updateFinished', this._transferFunctionalFamilies, this);
    this._entitiesCount = 0;
    register.setCannotModify();
  }

  Engine.prototype.canModify = function() {
    return register.canModify();
  };

  Engine.prototype.isUpdating = function() {
    return this._updating;
  };

  Engine.prototype.generateEntityId = function() {
    var id;
    id = this._entityIdsToReuse.pop();
    if (id == null) {
      id = this._greatestEntityId++;
    }
    return id;
  };

  Engine.prototype.getNewComponent = function(name) {
    var componentPattern;
    if (this._componetsPool.has(name)) {
      return this._componetsPool.pop(name);
    } else {
      componentPattern = register.getComponentPattern(name);
      if (componentPattern != null) {
        return {
          name: componentPattern.name,
          _pattern: componentPattern
        };
      } else {
        debug.warning('component "%" does not exist', name);
        return {};
      }
    }
  };

  Engine.prototype.addComponentToPool = function(name, component) {
    return this._componetsPool.push(name, component);
  };

  Engine.prototype.create = function() {
    var args, entity, name;
    name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    args.unshift(this.game);
    entity = this._getNewEntity(name);
    entity.getPattern().create.apply(entity, args);
    this._addEntityToFamilies(entity);
    this._addEntityToEngine(entity);
    return this;
  };

  Engine.prototype._getNewEntity = function(name) {
    var entity;
    if (this._entitiesPool.has(name)) {
      entity = this._entitiesPool.pop(name);
      entity.renovate();
    } else {
      entity = new Entity(name, this);
    }
    return entity;
  };

  Engine.prototype._addEntityToFamilies = function(entity) {
    var families, family, _base, _i, _len;
    families = entity.getPattern()._families;
    for (_i = 0, _len = families.length; _i < _len; _i++) {
      family = families[_i];
      if ((_base = this._families)[family] == null) {
        _base[family] = new DoublyLinkedList();
      }
      this._families[family].append(entity);
    }
    return this;
  };

  Engine.prototype._addEntityToEngine = function(entity) {
    this._entities[entity.getId()] = entity;
    this._entitiesCount++;
    return this;
  };

  Engine.prototype.remove = function() {
    var args, entity, id, pattern;
    entity = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    id = entity.getId();
    if (this._entities[id] == null) {
      return this;
    }
    args.unshift(this.game);
    pattern = entity.getPattern();
    pattern.remove && pattern.remove.apply(entity, args);
    this._removeEntityFromFamilies(entity);
    entity.removeAllComponents();
    this._entitiesPool.push(entity.name, entity);
    delete this._entities[id];
    this._entityIdsToReuse.push(id);
    this._entitiesCount--;
    return this;
  };

  Engine.prototype.removeAllEntities = function() {
    var entity, _i, _len, _ref;
    if (!this._updating) {
      _ref = this._entities;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        this.remove(entity);
      }
    } else {
      debug.warning('cannot remove entities during engine update');
    }
    return this;
  };

  Engine.prototype.markForRemoval = function(entity) {
    this._entitiesToRemove.push(entity);
    return this;
  };

  Engine.prototype._removeMarkedEntities = function() {
    var entity, _i, _len, _ref;
    _ref = this._entitiesToRemove;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entity = _ref[_i];
      this.remove(entity);
    }
    this._entitiesToRemove.length = 0;
    return this;
  };

  Engine.prototype._removeEntityFromFamilies = function(entity) {
    var families, family, _i, _len, _ref;
    families = entity.getPattern()._families;
    for (_i = 0, _len = families.length; _i < _len; _i++) {
      family = families[_i];
      if ((_ref = this._families[family]) != null) {
        _ref.remove(entity);
      }
    }
    return this;
  };

  Engine.prototype.getEntity = function(id) {
    var _ref;
    return (_ref = this._entities[id]) != null ? _ref : null;
  };

  Engine.prototype.getFamily = function(family) {
    var _ref;
    return ((_ref = this._families[family]) != null ? _ref : this._BLANK_FAMILY).reset();
  };

  Engine.prototype.getEntitiesByFamily = function(family) {
    return this.getFamily(family);
  };

  Engine.prototype.getEntitiesWith = function(components, legacy) {
    var component, entity, matchedEntities, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    if (legacy == null) {
      legacy = false;
    }
    if (legacy) {
      matchedEntities = [];
    } else {
      matchedEntities = this._getNewFunctionalFamily();
    }
    this._searchingBitSet.clear();
    this._excludingBitSet.clear();
    if (type.of.object(components)) {
      if (type.of.array(components.without)) {
        _ref = components.without;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          component = _ref[_i];
          this._excludingBitSet.set(register.getComponentPattern(component)._bit);
        }
      }
      components = (_ref1 = components["with"]) != null ? _ref1 : [];
    }
    for (_j = 0, _len1 = components.length; _j < _len1; _j++) {
      component = components[_j];
      this._searchingBitSet.set(register.getComponentPattern(component)._bit);
    }
    _ref2 = this._entities;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      entity = _ref2[_k];
      if (!type.of.undefined(entity) && this._searchingBitSet.subsetOf(entity._bitset) && this._excludingBitSet.and(entity._bitset).isEmpty()) {
        matchedEntities.push(entity);
      }
    }
    return matchedEntities;
  };

  Engine.prototype.getEntitiesByName = function(name) {};

  Engine.prototype._getNewFunctionalFamily = function() {
    var newFamily;
    newFamily = this._functionalFamiliesPool.pop();
    if (newFamily == null) {
      newFamily = new DoublyLinkedList();
      this._usedFunctionalFamilies.push(newFamily);
    }
    return newFamily;
  };

  Engine.prototype._transferFunctionalFamilies = function() {
    var used;
    while (used = this._usedFunctionalFamilies.pop()) {
      this._functionalFamiliesPool.push(used.clear());
    }
    return this;
  };

  Engine.prototype.addSystem = function() {
    var args, name, pattern, priority, system;
    name = arguments[0], priority = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if (name in this._singletonSystemsPresentInEngine) {
      debug.warning('system % is defined as singleton and is already present in engine');
      return this;
    }
    pattern = register.getSystemPattern(name);
    system = {
      game: this.game,
      engine: this,
      priority: priority
    };
    extend(system, pattern);
    system.initialize && system.initialize.apply(system, args);
    this._systems.insert(system, priority);
    if (system.singleton) {
      this._singletonSystemsPresentInEngine[name] = true;
    }
    return this;
  };

  Engine.prototype.addSystems = function() {
    var arg, args, _i, _len;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      arg = args[_i];
      this.addSystem.apply(this, arg);
    }
    return this;
  };

  Engine.prototype.removeSystem = function() {
    var args, system;
    system = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!this._updating) {
      system.remove && system.remove.apply(system, args);
      this._systems.remove(system, true);
    }
    return this;
  };

  Engine.prototype.removeAllSystems = function() {
    var args, node, system;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this._systems.reset();
    while (node = this._systems.next()) {
      system = node.data;
      system.remove && system.remove.apply(system, args);
    }
    this._systems.clear();
    return this;
  };

  Engine.prototype.isSystemActive = function(name) {};

  Engine.prototype.update = function(event) {
    var delta, node, system;
    delta = event.delta;
    this.emit('engine:beforeUpdate', event);
    this._updating = true;
    this._systems.reset();
    while (node = this._systems.next()) {
      system = node.data;
      system.update(delta, event);
    }
    this._updating = false;
    this.emit('engine:afterUpdate', event);
    return this.emit('engine:updateFinished');
  };

  Engine.prototype.clear = function(immediately) {
    if (immediately) {
      this.removeAllSystems();
      this.removeAllEntities();
    } else {
      this.once('engine:updateFinished', (function(_this) {
        return function(e) {
          _this.removeAllSystems();
          return _this.removeAllEntities();
        };
      })(this));
    }
    return this;
  };

  return Engine;

})(EventEmitter);

module.exports = Engine;



},{"../collection/doublylinkedlist":2,"../collection/orderedlinkedlist":3,"../collection/pool":4,"../config/config":5,"../debug/debug":14,"../utils/extend":18,"../utils/type":20,"./entity":7,"./event":8,"./register":11,"bitset.js":1}],7:[function(require,module,exports){
var BitSet, Entity, EventEmitter, config, debug, register, type,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

config = require('../config/config');

type = require('../utils/type');

debug = require('../debug/debug');

EventEmitter = require('./event');

config = require('../config/config');

register = require('./register');

BitSet = require('bitset.js').BitSet;

Entity = (function(_super) {
  __extends(Entity, _super);

  function Entity(name, engine) {
    this.engine = engine;
    Entity.__super__.constructor.call(this);
    this._id = this.engine.generateEntityId();
    this._bitset = new BitSet(config('max_components_count'));
    this._pattern = register.getEntityPattern(name);
    this._setDefaults();
    this.name = name;
    this.components = {};
    this.engine.on('engine:updateFinished', this._applyStateChanges, this);
  }

  Entity.prototype.getId = function() {
    return this._id;
  };

  Entity.prototype.getPattern = function() {
    return this._pattern;
  };

  Entity.prototype.add = function() {
    var args, component, lowercaseName, name, _ref;
    name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!type.of.string(name)) {
      debug.warning('component name should be string');
      return this;
    }
    lowercaseName = name.toLowerCase();
    component = (_ref = this.components[lowercaseName]) != null ? _ref : this.engine.getNewComponent(lowercaseName);
    component._pattern.initialize.apply(component, args);
    this.components[lowercaseName] = component;
    this._bitset.set(component._pattern._bit);
    return this;
  };

  Entity.prototype.remove = function(name, hardDelete) {
    var bit, component, lowercaseName;
    if (hardDelete == null) {
      hardDelete = false;
    }
    if (!type.of.string(name)) {
      debug.warning('component name should be string');
      return this;
    }
    lowercaseName = name.toLowerCase();
    component = this.components[lowercaseName];
    if (component != null) {
      bit = component._pattern._bit;
      if (this._bitset.get(bit) === 0 && !hardDelete) {
        return this;
      }
      if (hardDelete) {
        this.engine.addComponentToPool(lowercaseName, component);
        delete this.components[lowercaseName];
      }
      this._bitset.clear(bit);
    }
    return this;
  };

  Entity.prototype.removeAllComponents = function(hardDelete) {
    var componentName;
    if (hardDelete == null) {
      hardDelete = false;
    }
    if (!hardDelete) {
      this._bitset.clear();
      return this;
    } else {
      for (componentName in this.components) {
        this.remove(componentName, true);
      }
      return this;
    }
  };

  Entity.prototype.has = function(name) {
    var _ref;
    if (type.of.string(name)) {
      return this.bitset.get((_ref = this.components[name.toLowerCase()]) != null ? _ref._pattern._bit : void 0) === 1;
    } else {
      return false;
    }
  };

  Entity.prototype.renovate = function() {
    this._id = this.engine.generateEntityId();
    this._setDefaults();
    return this;
  };

  Entity.prototype._setDefaults = function() {
    this._inFinalState = false;
    this._remainingStateChanges = [];
    this._stateObject = {};
    return this._currentStates = [];
  };

  Entity.prototype.enter = function(stateName) {};

  Entity.prototype.exit = function(stateName) {};

  Entity.prototype["in"] = function() {
    var states;
    states = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  };

  Entity.prototype._getStatePattern = function(stateName) {};

  Entity.prototype._exitAllStates = function() {};

  Entity.prototype._applyStateChanges = function() {};

  return Entity;

})(EventEmitter);

module.exports = Entity;



},{"../config/config":5,"../debug/debug":14,"../utils/type":20,"./event":8,"./register":11,"bitset.js":1}],8:[function(require,module,exports){
var EventEmitter, type,
  __slice = [].slice;

type = require('../utils/type');

EventEmitter = (function() {
  function EventEmitter() {
    this.events = {};
  }

  EventEmitter.prototype.on = function(event, fn, binding, once) {
    var _base;
    if (!type.of.string(event || !type.of["function"](fn))) {
      return void 0;
    }
    if ((_base = this.events)[event] == null) {
      _base[event] = [];
    }
    this.events[event].push({
      fn: fn,
      binding: binding != null ? binding : null,
      once: once != null ? once : false
    });
    return void 0;
  };

  EventEmitter.prototype.once = function(event, fn, binding) {
    return this.on(event, fn, binding);
  };

  EventEmitter.prototype.emit = function() {
    var args, event;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!(event in this.events)) {
      return void 0;
    }
    this.events[event] = this.events[event].filter(function(listener) {
      return (!listener.fn.apply(listener.binding, args)) || (!listener.once);
    });
    return void 0;
  };

  EventEmitter.prototype.trigger = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.emit.apply(this, args);
  };

  EventEmitter.prototype.off = function(event, fn) {
    if (!type.of.string(event || !event in this.events)) {
      return void 0;
    }
    this.events[event] = this.events[event].filter(function(listener) {
      return (fn != null) && listener.fn !== fn;
    });
    return void 0;
  };

  return EventEmitter;

})();

module.exports = EventEmitter;



},{"../utils/type":20}],9:[function(require,module,exports){
var ARGS, BINDING, Engine, EventEmitter, FN, Game, Input, State, Ticker, type,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

type = require('../utils/type');

Engine = require('./engine');

Input = require('./input');

Ticker = require('./ticker');

State = require('./state');

EventEmitter = require('./event');

FN = 0;

BINDING = 1;

ARGS = 2;

Game = (function(_super) {
  __extends(Game, _super);

  Game.State = State.register;

  function Game(initialState) {
    Game.__super__.constructor.call(this);
    this.input = new Input(this);
    this.engine = new Engine(this);
    this.ticker = new Ticker(this);
    this.state = State.State(this);
    this.ticker.on("ticker:tick", this.engine.update, this.engine);
    this.engine.on("engine:updateFinished", this.input.clearKeyTimes, this.input);
    if (type.of.string(initialState)) {
      this.state.change(initialState);
    }
    return this;
  }

  Game.prototype.start = function() {
    return this.emit('game:start', this.ticker.start());
  };

  Game.prototype.pause = function() {
    return this.emit('game:pause', this.ticker.pause());
  };

  Game.prototype.resume = function() {
    return this.emit('game:resume', this.ticker.resume());
  };

  Game.prototype.stop = function(clear) {
    if (clear) {
      this.engine.once('engine:clear', (function(_this) {
        return function() {
          return _this.emit('game:stop', _this.ticker.stop());
        };
      })(this));
      return this.engine.clear();
    } else {
      return this.emit('game:stop', this.ticker.stop());
    }
  };

  Game.prototype.setRenderer = function(renderer) {
    this.renderer = renderer;
  };

  Game.prototype.setStage = function(stage) {
    this.stage = stage;
  };

  Game.prototype.changeState = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.state).change.apply(_ref, args);
  };

  return Game;

})(EventEmitter);

module.exports = Game;



},{"../utils/type":20,"./engine":6,"./event":8,"./input":10,"./state":12,"./ticker":13}],10:[function(require,module,exports){
(function (global){
var Input, _keys;

_keys = {
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

Input = (function() {
  function Input() {
    this._pressedKeys = [];
    this._pressedKeysTime = [];
    this._oncePressedKeys = [];
    this._mousePosition = {
      x: 0,
      y: 0
    };
    global.addEventListener("keydown", (function(_this) {
      return function(e) {
        var keyCode;
        keyCode = e.keyCode;
        _this._pressedKeys[keyCode] = true;
        if (!_this._pressedKeysTime[keyCode]) {
          _this._pressedKeysTime[keyCode] = performance.now();
        }
      };
    })(this));
    global.addEventListener("keyup", (function(_this) {
      return function(e) {
        var keyCode;
        keyCode = e.keyCode;
        _this._pressedKeys[keyCode] = false;
        if ((_this._pressedKeysTime[keyCode] != null) && (_this._oncePressedKeys[keyCode] == null)) {
          _this._pressedKeysTime[keyCode] = performance.now() - _this._pressedKeysTime[keyCode];
          _this._oncePressedKeys[keyCode] = true;
        }
      };
    })(this));
  }

  Input.prototype.isPressed = function(keyName) {
    return this._pressedKeys[_keys[keyName]];
  };

  Input.prototype.getPressedKeys = function() {
    var keyName, keys, _i, _len, _ref;
    keys = {};
    _ref = Object.keys(_keys);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      keyName = _ref[_i];
      keys[keyName] = this._pressedKeys[_keys[keyName]];
    }
    return keys;
  };

  Input.prototype.getKeysPressedLessThan = function(time) {
    var keyCode, keyName, keys, _i, _len, _ref;
    keys = {};
    _ref = Object.keys(_keys);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      keyName = _ref[_i];
      keyCode = _keys[keyName];
      if (this._pressedKeysTime[keyCode] < time && this._oncePressedKeys[keyCode]) {
        keys[keyName] = true;
      }
    }
    return keys;
  };

  Input.prototype.getKeysPressedMoreThan = function(time) {
    var keyCode, keyName, keys, _i, _len, _ref;
    keys = {};
    _ref = Object.keys(_keys);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      keyName = _ref[_i];
      keyCode = _keys[keyName];
      if (this._pressedKeysTime[keyCode] > time && this._oncePressedKeys[keyCode]) {
        keys[keyName] = true;
      }
    }
    return keys;
  };

  Input.prototype.setMouseStagePosition = function(position) {
    return this._mousePosition = position;
  };

  Input.prototype.getMouseStagePosition = function() {
    return this._mousePosition;
  };

  Input.prototype.clearKeyTimes = function() {
    this._pressedKeysTime = [];
    return this._oncePressedKeys = [];
  };

  return Input;

})();

module.exports = Input;



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],11:[function(require,module,exports){
var canModify, componentPatterns, config, debug, entityPatterns, nextComponentId, systemPatterns, type;

type = require('../utils/type');

debug = require('../debug/debug');

config = require('../config/config');

canModify = true;

componentPatterns = {};

systemPatterns = {};

entityPatterns = {};

nextComponentId = 0;

module.exports = {
  registerComponent: function(component) {
    if (!canModify) {
      debug.error('you can\'t define new component during system work');
      return;
    }
    if (!type.of.object(component)) {
      debug.error('component pattern must be an object');
      return;
    }
    if (!('name' in component) || !('initialize' in component)) {
      debug.error('you must define both "name" and "initialize" of component pattern');
      return;
    }
    if (component.name in componentPatterns) {
      debug.error('you can\'t define same component twice');
      return;
    }
    component._bit = nextComponentId++;
    return componentPatterns[component.name.toLowerCase()] = component;
  },
  registerSystem: function(system) {
    if (!canModify) {
      debug.error('you can\'t define new system during system work');
      return;
    }
    if (!type.of.object(system)) {
      debug.error('system pattern must be an object');
      return;
    }
    if (!('name' in system) || !('update' in system)) {
      debug.error('you must define both "name" and "update" of system pattern');
      return;
    }
    if (system.name in systemPatterns) {
      debug.error('you can\'t define same system twice');
      return;
    }
    return systemPatterns[system.name] = system;
  },
  registerEntity: function(entity) {
    if (!canModify) {
      debug.error('you can\'t define new system during system work');
      return;
    }
    if (!type.of.object(entity)) {
      debug.error('entity pattern must be an object');
      return;
    }
    if (!('name' in entity) || !('create' in entity)) {
      debug.error('you must define both "name" and "create" of entity pattern');
      return;
    }
    if (entity.name in entityPatterns) {
      debug.error('you can\'t define same entity twice');
      return;
    }
    if ((entity.family == null) || entity.family === '') {
      entity.family = 'NONE';
    }
    entity._families = entity.family.split('|');
    return entityPatterns[entity.name] = entity;
  },
  getComponentPattern: function(name) {
    return componentPatterns[name.toLowerCase()];
  },
  getSystemPattern: function(name) {
    return systemPatterns[name];
  },
  getEntityPattern: function(name) {
    return entityPatterns[name];
  },
  canModify: function() {
    return canModify;
  },
  setCannotModify: function() {
    return canModify = false;
  }
};



},{"../config/config":5,"../debug/debug":14,"../utils/type":20}],12:[function(require,module,exports){
var debug, states, type,
  __slice = [].slice;

type = require('../utils/type');

debug = require('../debug/debug');

states = {};

exports.State = function(game) {
  var currentState, doTransition, enterState, exitState, initializeState, next, queue, setCurrentState, setInitialized, shift, shifting;
  queue = [];
  currentState = {
    transitions: {}
  };
  shifting = false;
  shift = function() {
    var args, binding, fn, queueHead;
    queueHead = queue.shift();
    if (queueHead == null) {
      shifting = false;
      return;
    } else {
      shifting = true;
    }
    fn = queueHead.fn;
    binding = queueHead.binding || null;
    args = queueHead.args || [];
    args.push(next);
    return fn.apply(binding, args);
  };
  next = function() {
    return shift();
  };
  setCurrentState = function(state, done) {
    currentState = state;
    return done();
  };
  setInitialized = function(state, done) {
    state._initialized = true;
    return done();
  };
  initializeState = function(state, done) {
    if (type.of["function"](state.initialize)) {
      return state.initialize.apply(state, [game, done]);
    } else {
      return done();
    }
  };
  enterState = function(state, done) {
    if (type.of["function"](state.onEnter)) {
      return state.onEnter.apply(state, [game, done]);
    } else {
      return done();
    }
  };
  exitState = function(done) {
    if (type.of["function"](currentState.onExit)) {
      return currentState.onExit.apply(currentState, [game, done]);
    } else {
      return done();
    }
  };
  doTransition = function() {
    var args, done, nextState, to, transitionFnName;
    to = arguments[0], nextState = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if (to in currentState.transitions) {
      transitionFnName = currentState.transitions[to];
      return currentState[transitionFnName].apply(currentState, [game, nextState].concat(args));
    } else {
      done = args.pop();
      return done();
    }
  };
  return {
    change: function() {
      var args, name, nextState;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!type.of.string(name) || !(name in states)) {
        debug.error('state "' + name + '" does not exist - change will not occur');
        return;
      }
      nextState = states[name];
      queue.push({
        fn: exitState
      });
      if (!nextState._initialized) {
        queue.push({
          fn: initializeState,
          args: [nextState]
        });
        queue.push({
          fn: setInitialized,
          args: [nextState]
        });
      }
      queue.push({
        fn: doTransition,
        args: [name, nextState].concat(args)
      });
      queue.push({
        fn: enterState,
        args: [nextState]
      });
      queue.push({
        fn: setCurrentState,
        args: [nextState]
      });
      if (!shifting) {
        return shift();
      }
    },
    current: function() {
      return currentState.name;
    },
    isIn: function(state) {
      return state === currentState.name;
    }
  };
};

exports.register = function(state) {
  if (!type.of.object(state)) {
    debug.error('registered state must be an object');
    return this;
  }
  if (!('transitions' in state)) {
    state.transitions = {};
  }
  state._initialized = false;
  states[state.name] = state;
  return this;
};



},{"../debug/debug":14,"../utils/type":20}],13:[function(require,module,exports){
(function (global){
var EventEmitter, Ticker, config, raf,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config/config');

raf = global.requestAnimationFrame;

EventEmitter = require('./event');

Ticker = (function(_super) {
  __extends(Ticker, _super);

  function Ticker() {
    Ticker.__super__.constructor.call(this);
    this.FPS = config('default_fps');
    this.MAX_FRAME_TIME = config('max_frame_time');
    this.TIME_FACTOR = config('default_time_factor');
    this._paused = false;
    this._running = false;
    this._ticks = 0;
    this._lastTime = 0;
    this._currentFPS = this.FPS;
    this._rafId = -1;
  }

  Ticker.prototype.setFPS = function(fps) {
    return this.FPS = fps || this.FPS;
  };

  Ticker.prototype.getCurrentFPS = function() {
    return Math.round(this._currentFPS);
  };

  Ticker.prototype.setTimeFactor = function(factor) {
    return this.TIME_FACTOR = factor || this.TIME_FACTOR;
  };

  Ticker.prototype.getTicks = function() {
    return this._ticks;
  };


  /**
   * Pauses ticker.
   * 
   * @return {Boolean} true if paused succesfuly
   */

  Ticker.prototype.pause = function() {
    if (!this._running) {
      return false;
    }
    this._paused = true;
    return true;
  };


  /**
   * Resumes ticker.
   * 
   * @return {Boolean} true if resumed succesfuly
   */

  Ticker.prototype.resume = function() {
    if (!this._running) {
      return false;
    }
    this._paused = false;
    return true;
  };

  Ticker.prototype.start = function() {
    if (this._paused) {
      this.resume();
    }
    if (this._running) {
      return false;
    }
    this._rafId = raf(this._tick.bind(this));
    this.emit('ticker:start');
    this._running = true;
    return true;
  };

  Ticker.prototype.stop = function() {
    if (this._rafId !== -1) {
      global.cancelAnimationFrame(this._rafId);
      this._running = this._paused = false;
      this.emit('ticker:stop');
      return true;
    } else {
      return false;
    }
  };

  Ticker.prototype.toggle = function() {
    if (!this._running) {
      return false;
    }
    this._paused = !this._paused;
    return true;
  };

  Ticker.prototype.isPaused = function() {
    return this._paused;
  };

  Ticker.prototype.isRunning = function() {
    return this._running && !this._paused;
  };

  Ticker.prototype._tick = function(time) {
    var delta, event;
    if (time == null) {
      time = performance.now();
    }
    delta = time - this._lastTime;
    this._lastTime = time;
    this._rafId = raf(this._tick.bind(this));
    if (this._paused) {
      return;
    }
    if (delta >= this.MAX_FRAME_TIME) {
      delta = 1000 / this.FPS;
    }
    if (this._ticks % this.FPS === 0) {
      this._currentFPS = 1000 / delta;
    }
    event = {
      delta: delta * this.TIME_FACTOR,
      tick: this._ticks,
      time: time,
      paused: this._paused
    };
    this.emit('ticker:tick', event);
    return this._ticks += 1;
  };

  return Ticker;

})(EventEmitter);

module.exports = Ticker;



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../config/config":5,"./event":8}],14:[function(require,module,exports){
var config,
  __slice = [].slice;

config = require('../config/config');

module.exports = {
  log: function() {
    var message;
    message = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (config('debug') >= 3) {
      return console.log.apply(console, message);
    }
  },
  warning: function() {
    var message;
    message = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (config('debug') >= 2) {
      return console.warn.apply(console, message);
    }
  },
  error: function() {
    var message;
    message = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (config('debug') >= 1) {
      return console.error.apply(console, message);
    }
  }
};



},{"../config/config":5}],15:[function(require,module,exports){
var Const, Engine, Entropy, LinkedList, OrderedLinkedList, config, debug;

require('./utils/polyfill');

debug = require('./debug/debug');

config = require('./config/config');

Const = require('./utils/const');

Engine = require('./core/engine');

LinkedList = require('./collection/doublylinkedlist');

OrderedLinkedList = require('./collection/orderedlinkedlist');


/**
 * Welcome message.
 */

console.log.apply(console, ["%c %c %c Entropy 0.2.0 - Entity System Framework for JavaScript %c %c ", "background: rgb(200, 200,200);", "background: rgb(80, 80, 80);", "color: white; background: black;", "background: rgb(80, 80, 80);", "background: rgb(200, 200, 200);"]);


/**
 *
 */

Entropy = (function() {
  Entropy.Easing = require('./utils/easing');

  Entropy.Const = function(key, value) {
    return Const.call(this, key, value);
  };

  Entropy.Config = config;

  Entropy.Game = require('./core/game');

  Entropy.Engine = Engine;

  Entropy.Ticker = require('./core/ticker');

  Entropy.LinkedList = LinkedList;

  Entropy.OrderedLinkedList = OrderedLinkedList;

  function Entropy() {
    debug.warning('this function should not be used as a constructor');
    return;
  }

  return Entropy;

})();

module.exports = Entropy;



},{"./collection/doublylinkedlist":2,"./collection/orderedlinkedlist":3,"./config/config":5,"./core/engine":6,"./core/game":9,"./core/ticker":13,"./debug/debug":14,"./utils/const":16,"./utils/easing":17,"./utils/polyfill":19}],16:[function(require,module,exports){
var debug, type;

type = require('./type');

debug = require('../debug/debug');

module.exports = function(key, value) {
  if ((key == null) || !type.of.string(key)) {
    debug.error('constans key should be non-empty string');
    return;
  }
  key = key.toUpperCase();
  if (key in this) {
    return debug.error('cannot define same constans twice: %s', key);
  } else {
    Object.defineProperty(this, key, {
      value: value
    });
    return value;
  }
};



},{"../debug/debug":14,"./type":20}],17:[function(require,module,exports){
module.exports = {
  Linear: {
    In: function(t, b, c, d) {
      return c * t / d + b;
    }
  },
  Quadratic: {
    In: function(t, b, c, d) {
      t /= d;
      return c * t * t + b;
    },
    Out: function(t, b, c, d) {
      t /= d;
      return -c * t * (t - 2) + b;
    },
    InOut: function(t, b, c, d) {
      t /= d / 2;
      if (t < 1) {
        return c / 2 * t * t + b;
      }
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }
  },
  Cubic: {
    In: function(t, b, c, d) {
      t /= d;
      return c * t * t * t + b;
    },
    Out: function(t, b, c, d) {
      t /= d;
      t--;
      return c * (t * t * t + 1) + b;
    },
    InOut: function(t, b, c, d) {
      t /= d / 2;
      if (t < 1) {
        return c / 2 * t * t * t + b;
      }
      t -= 2;
      return c / 2 * (t * t * t + 2) + b;
    }
  },
  Quartic: {
    In: function(t, b, c, d) {
      t /= d;
      return c * t * t * t * t + b;
    },
    Out: function(t, b, c, d) {
      t /= d;
      t--;
      return -c * (t * t * t * t - 1) + b;
    },
    InOut: function(t, b, c, d) {
      t /= d / 2;
      if (t < 1) {
        return c / 2 * t * t * t * t + b;
      }
      t -= 2;
      return -c / 2 * (t * t * t * t - 2) + b;
    }
  },
  Quintic: {
    In: function(t, b, c, d) {
      t /= d;
      return c * t * t * t * t * t + b;
    },
    Out: function(t, b, c, d) {
      t /= d;
      t--;
      return c * (t * t * t * t * t + 1) + b;
    },
    InOut: function(t, b, c, d) {
      t /= d / 2;
      if (t < 1) {
        return c / 2 * t * t * t * t * t + b;
      }
      t -= 2;
      return c / 2 * (t * t * t * t * t + 2) + b;
    }
  },
  Sine: {
    In: function(t, b, c, d) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    Out: function(t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    InOut: function(t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    }
  },
  Exponential: {
    In: function(t, b, c, d) {
      return c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    Out: function(t, b, c, d) {
      return c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    InOut: function(t, b, c, d) {
      t /= d / 2;
      if (t < 1) {
        return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      }
      t--;
      return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
    }
  },
  Circular: {
    In: function(t, b, c, d) {
      t /= d;
      return -c * (Math.sqrt(1 - t * t) - 1) + b;
    },
    Out: function(t, b, c, d) {
      t /= d;
      t--;
      return c * Math.sqrt(1 - t * t) + b;
    },
    InOut: function(t, b, c, d) {
      t /= d / 2;
      if (t < 1) {
        return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      }
      t -= 2;
      return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
    }
  }
};



},{}],18:[function(require,module,exports){
var __slice = [].slice,
  __hasProp = {}.hasOwnProperty;

module.exports = function() {
  var destination, key, source, sources, value, _i, _len;
  destination = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  for (_i = 0, _len = sources.length; _i < _len; _i++) {
    source = sources[_i];
    for (key in source) {
      if (!__hasProp.call(source, key)) continue;
      value = source[key];
      destination[key] = value;
    }
  }
  return void 0;
};



},{}],19:[function(require,module,exports){
(function (global){
(function() {
  var lastTime, vendor, vendors, _i, _len;
  lastTime = 0;
  vendors = ['ms', 'moz', 'webkit', 'o'];
  if (!global.requestAnimationFrame) {
    for (_i = 0, _len = vendors.length; _i < _len; _i++) {
      vendor = vendors[_i];
      global.requestAnimationFrame = global[vendor + 'RequestAnimationFrame'];
      global.cancelAnimationFrame = global[vendor + 'CancelAnimationFrame'] || global[vendor + 'CancelRequestAnimationFrame'];
    }
  }
  if (!global.requestAnimationFrame) {
    global.requestAnimationFrame = function(callback, element) {
      var currTime, id, timeToCall;
      currTime = new Date().getTime();
      timeToCall = Math.max(0, 16 - (currTime - lastTime));
      id = global.setTimeout((function() {
        return callback(currTime + timeToCall);
      }), timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!global.cancelAnimationFrame) {
    global.cancelAnimationFrame = function(id) {
      return clearTimeout(id);
    };
  }
  return void 0;
})();

(function() {
  var nowOffset, _ref;
  if (global.performance == null) {
    global.performance = {};
  }
  if (global.performance.now == null) {
    nowOffset = Date.now();
    if (((_ref = global.performance.timing) != null ? _ref.navigationStart : void 0) != null) {
      nowOffset = performance.timing.navigationStart;
    }
    global.performance.now = function() {
      return Date.now() - nowOffset;
    };
  }
  return void 0;
})();



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],20:[function(require,module,exports){
var toString;

toString = Object.prototype.toString;

module.exports = {
  of: {
    undefined: function(thing) {
      return toString.call(thing) === '[object Undefined]';
    },
    "null": function(thing) {
      return toString.call(thing) === '[object Null]';
    },
    string: function(thing) {
      return toString.call(thing) === '[object String]';
    },
    number: function(thing) {
      return toString.call(thing) === '[object Number]';
    },
    boolean: function(thing) {
      return toString.call(thing) === '[object Boolean]';
    },
    "function": function(thing) {
      return toString.call(thing) === '[object Function]';
    },
    array: function(thing) {
      return toString.call(thing) === '[object Array]';
    },
    date: function(thing) {
      return toString.call(thing) === '[object Date]';
    },
    regexp: function(thing) {
      return toString.call(thing) === '[object RegExp]';
    },
    object: function(thing) {
      return toString.call(thing) === '[object Object]';
    }
  }
};



},{}]},{},[15])(15)
});