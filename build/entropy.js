!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Entropy=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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
  }

  DoublyLinkedList.prototype.append = function(data) {
    var node;
    if (data == null) {
      return;
    }
    node = new Node(data);
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
    node = new Node(data);
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
    this.reset();
    while (node = this.next()) {
      if (byData && thing === node.data || !byData && thing === node) {
        nodeToRemove = node;
        break;
      }
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
    var args, binding, fn, node;
    fn = arguments[0], binding = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    this.reset();
    while (node = this.next()) {
      fn.apply(binding, [node, node.data].concat(args));
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
    this.head = this.tail = null;
    return this;
  };

  return DoublyLinkedList;

})();

module.exports = DoublyLinkedList;



},{}],2:[function(_dereq_,module,exports){
var Node, OrderedLinkedList;

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

  return OrderedLinkedList;

})();

module.exports = OrderedLinkedList;



},{}],3:[function(_dereq_,module,exports){
var Engine, debug, type;

type = _dereq_('../utils/type');

debug = _dereq_('../debug/debug');

Engine = (function() {
  Engine.Component = function(obj) {
    if (type.of(obj !== 'object')) {
      debug.error('Component pattern must be an object');
      return;
    }
    if (!'name' in obj || !'initialize' in obj) {
      debug.error('You must define both "name" and "initialize" of component pattern');
    }
  };

  function Engine() {
    this.componetsPool = [];
  }

  return Engine;

})();

module.exports = Engine;



},{"../debug/debug":4,"../utils/type":7}],4:[function(_dereq_,module,exports){
module.exports = {
  error: function(message) {
    return console.log(message);
  }
};



},{}],5:[function(_dereq_,module,exports){
var Engine, Entropy, LinkedList, OrderedLinkedList;

Engine = _dereq_('./core/engine');

LinkedList = _dereq_('./collection/doublylinkedlist');

OrderedLinkedList = _dereq_('./collection/orderedlinkedlist');


/**
 * Welcome message.
 */

console.log.apply(console, ["%c %c %c Entropy 0.1 - Entity System Framework for JavaScript %c %c ", "background: rgb(200, 200,200);", "background: rgb(80, 80, 80);", "color: white; background: black;", "background: rgb(80, 80, 80);", "background: rgb(200, 200, 200);"]);


/**
 *
 */

Entropy = (function() {
  Entropy.Const = _dereq_('./utils/const');

  Entropy.Engine = Engine;

  Entropy.LinkedList = LinkedList;

  Entropy.OrderedLinkedList = OrderedLinkedList;


  /**
   * [constructor description]
   * 
   * @return {[type]} [description]
   */

  function Entropy() {
    return 5;
  }

  return Entropy;

})();

module.exports = Entropy;



},{"./collection/doublylinkedlist":1,"./collection/orderedlinkedlist":2,"./core/engine":3,"./utils/const":6}],6:[function(_dereq_,module,exports){
var debug, type;

type = _dereq_('./type');

debug = _dereq_('../debug/debug');

module.exports = function(name, value) {
  if ((name == null) || type(name) !== 'string') {
    debug.error('constans name should be non-empty string');
    return;
  }
  name = name.toUpperCase();
  if (name in this) {
    return debug.error('cannot define same constans twice: %s', name);
  } else {
    Object.defineProperty(this, name, {
      value: value
    });
    return value;
  }
};



},{"../debug/debug":4,"./type":7}],7:[function(_dereq_,module,exports){
module.exports = function(obj) {
  var classToType;
  if (obj === void 0 || obj === null) {
    return String(obj);
  }
  classToType = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regexp',
    '[object Object]': 'object'
  };
  return classToType[Object.prototype.toString.call(obj)];
};



},{}]},{},[5])
(5)
});