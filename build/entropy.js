!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Entropy=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    this._current = null;
    return this;
  };

  return DoublyLinkedList;

})();

module.exports = DoublyLinkedList;



},{}],2:[function(require,module,exports){
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



},{}],3:[function(require,module,exports){
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



},{"../utils/type":13}],4:[function(require,module,exports){
// Generated by CoffeeScript 1.7.1
var Engine, EventEmitter, debug, type,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

type = require('../utils/type');

debug = require('../debug/debug');

EventEmitter = require('./event');

Engine = (function(_super) {
  __extends(Engine, _super);

  Engine.Component = function(obj) {
    if (!type.of.object(obj)) {
      debug.error('component pattern must be an object');
      return;
    }
    if (!'name' in obj || !'initialize' in obj) {
      debug.error('you must define both "name" and "initialize" of component pattern');
    }
  };

  function Engine() {
    this.componetsPool = [];
  }

  return Engine;

})(EventEmitter);

module.exports = Engine;

},{"../debug/debug":9,"../utils/type":13,"./event":5}],5:[function(require,module,exports){
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



},{"../utils/type":13}],6:[function(require,module,exports){
var ARGS, BINDING, EventEmitter, FN, Game, State, Ticker, type,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

type = require('../utils/type');

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
    this.ticker = new Ticker(this);
    this.state = State.State(this);
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

  return Game;

})(EventEmitter);

module.exports = Game;



},{"../utils/type":13,"./event":5,"./state":7,"./ticker":8}],7:[function(require,module,exports){
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



},{"../debug/debug":9,"../utils/type":13}],8:[function(require,module,exports){
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
    this._rafId = raf(this._tick.bind(this));
    if (this._paused) {
      return void 0;
    }
    delta = time - this._lastTime;
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
},{"../config/config":3,"./event":5}],9:[function(require,module,exports){
var config,
  __slice = [].slice;

config = require('../config/config');

module.exports = {
  log: function() {
    var message;
    message = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (config('debug') === 3) {
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



},{"../config/config":3}],10:[function(require,module,exports){
var Const, Engine, Entropy, Game, LinkedList, OrderedLinkedList, Ticker, debug;

require('./utils/polyfill');

debug = require('./debug/debug');

Const = require('./utils/const');

Engine = require('./core/engine');

LinkedList = require('./collection/doublylinkedlist');

OrderedLinkedList = require('./collection/orderedlinkedlist');

Ticker = require('./core/ticker');

Game = require('./core/game');


/**
 * Welcome message.
 */

console.log.apply(console, ["%c %c %c Entropy 0.2.0 - Entity System Framework for JavaScript %c %c ", "background: rgb(200, 200,200);", "background: rgb(80, 80, 80);", "color: white; background: black;", "background: rgb(80, 80, 80);", "background: rgb(200, 200, 200);"]);


/**
 *
 */

Entropy = (function() {
  Entropy.Const = function(key, value) {
    return Const.call(this, key, value);
  };

  Entropy.Game = Game;

  Entropy.Engine = Engine;

  Entropy.Ticker = Ticker;

  Entropy.LinkedList = LinkedList;

  Entropy.OrderedLinkedList = OrderedLinkedList;

  function Entropy() {
    debug.warning('this function should not be used as a constructor');
    return;
  }

  return Entropy;

})();

module.exports = Entropy;



},{"./collection/doublylinkedlist":1,"./collection/orderedlinkedlist":2,"./core/engine":4,"./core/game":6,"./core/ticker":8,"./debug/debug":9,"./utils/const":11,"./utils/polyfill":12}],11:[function(require,module,exports){
var debug, type;

type = require('./type');

debug = require('../debug/debug');

module.exports = function(key, value) {
  if ((key == null) || type(key) !== 'string') {
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



},{"../debug/debug":9,"./type":13}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
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



},{}]},{},[10])(10)
});