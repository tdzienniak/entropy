var EntropyStatePlugin =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _entropy = __webpack_require__(1);

	var _State = __webpack_require__(2);

	var _State2 = _interopRequireDefault(_State);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var StateManager = _entropy.stampit.compose({
	  statics: {
	    propName: 'state'
	  },
	  deepProperties: {
	    _pendingTransitions: [],
	    _states: {},
	    _shifting: false,
	    _currentTransition: null
	  },
	  init: function init(opts) {
	    this.game = opts.game;

	    this._currentState = (0, _State2.default)({
	      name: '__default',
	      manager: this,
	      game: opts.game
	    });
	  },

	  methods: {
	    /**
	     * Registers new state.
	     *
	     * State methods may be synchronous or asynchronous (when they return Promise). 
	     *
	     * @example
	     * stateManager.define({
	     *   name: "Initial",
	     *   onInit() {
	     *     console.log('State initialized.');
	     *   },
	     *   onEnter() {
	     *     console.log('State entered.');
	     *
	     *     return delay(); // delay is function that returns Promise
	     *   },
	     *   onExit: function () {
	     *     console.log('State exited.');
	     *   },
	     *   onTransitionFrom(currentState) {
	     *     currentState; // I am current state now
	     *     this; // I will become current state
	     *   },
	     * });
	     *
	     * @param {Object} state state object (see example)
	     */
	    define: function define(stateDescriptor) {
	      var methods = {};

	      Object.keys(stateDescriptor).filter(function (key) {
	        return typeof stateDescriptor[key] === 'function';
	      }).forEach(function (key) {
	        methods[key] = stateDescriptor[key];
	      });

	      this._states[stateDescriptor.name] = _entropy.stampit.compose(_State2.default, {
	        methods: methods
	      })({
	        name: stateDescriptor.name,
	        manager: this,
	        game: this.game
	      });

	      return this;
	    },
	    change: function change(stateName) {
	      var _this = this;

	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      var nextState = this._states[stateName];

	      if (this._currentTransition) {
	        this._pendingTransitions.push(function () {
	          return _this._changeState.apply(_this, [nextState].concat(args));
	        });
	      } else {
	        this._currentTransition = this._changeState.apply(this, [nextState].concat(args));
	      }

	      return this._currentTransition;
	    },
	    _changeState: function _changeState(nextState) {
	      var _this2 = this;

	      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        args[_key2 - 1] = arguments[_key2];
	      }

	      return Promise.resolve().then(function () {
	        return _this2._currentState.onExit();
	      }).then(function () {
	        if (!nextState._initialized) {
	          return nextState.onInit();
	        }
	      }).then(function () {
	        nextState._initialized = true;
	      }).then(function () {
	        return nextState.onTransitionFrom.apply(nextState, [_this2._currentState].concat(args));
	      }).then(function () {
	        return nextState.onEnter();
	      }).then(function () {
	        _this2._currentState = nextState;

	        var pendingTransition = _this2._pendingTransitions.shift();

	        if (pendingTransition) {
	          _this2._currentTransition = pendingTransition();
	        } else {
	          _this2._currentTransition = null;
	        }
	      });
	    },

	    /**
	     * Checks whether state machine is in state identified by name.
	     *
	     * @method isIn
	     * @param  {String}  stateName state's name
	     * @return {Boolean}
	     */
	    isIn: function isIn(stateName) {
	      return stateName === this._currentState.name;
	    }
	  }
	});

	module.exports = StateManager;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = Entropy;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _entropy = __webpack_require__(1);

	var State = _entropy.stampit.compose({
	  init: function init(opts) {
	    this.name = opts.name;
	    this.manager = opts.manager;
	    this.game = opts.game;
	  },

	  methods: {
	    onInit: function onInit() {},
	    onEnter: function onEnter() {},
	    onExit: function onExit() {},
	    onTransitionFrom: function onTransitionFrom() {}
	  }
	});

	exports.default = State;

/***/ }
/******/ ]);