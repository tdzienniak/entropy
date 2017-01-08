var EntropyAnimationPlugin =
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

	var _AnimatedSprite = __webpack_require__(2);

	var _AnimatedSprite2 = _interopRequireDefault(_AnimatedSprite);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Animation = _entropy.stampit.compose({
	  statics: {
	    propName: 'animation'
	  },
	  init: function init() {},

	  methods: {
	    create: function create(frames) {
	      return new _AnimatedSprite2.default(frames);
	    }
	  }
	});

	module.exports = Animation;

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

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var PIXI = __webpack_require__(3);

	/**
	 * Code in this class is based on PIXI AnimatedSprite class: https://github.com/pixijs/pixi.js/blob/dev/src/extras/AnimatedSprite.js
	 */

	var AnimatedSprite = function (_PIXI$Sprite) {
	  _inherits(AnimatedSprite, _PIXI$Sprite);

	  /**
	   * @param {PIXI.Texture[]|FrameObject[]} textures - an array of {@link PIXI.Texture} or frame
	   *  objects that make up the animation
	   */
	  function AnimatedSprite(textures) {
	    _classCallCheck(this, AnimatedSprite);

	    /**
	     * @private
	     */
	    var _this = _possibleConstructorReturn(this, (AnimatedSprite.__proto__ || Object.getPrototypeOf(AnimatedSprite)).call(this, textures[0] instanceof PIXI.Texture ? textures[0] : textures[0].texture));

	    _this._textures = null;

	    /**
	     * @private
	     */
	    _this._durations = null;

	    _this.textures = textures;

	    /**
	     * The speed that the AnimatedSprite will play at. Higher is faster, lower is slower
	     *
	     * @member {number}
	     * @default 1
	     */
	    _this.animationSpeed = 1;

	    /**
	     * Whether or not the animate sprite repeats after playing.
	     *
	     * @member {boolean}
	     * @default true
	     */
	    _this.loop = true;

	    _this.standardFrameDuration = 1000;

	    /**
	     * Function to call when a AnimatedSprite finishes playing
	     *
	     * @member {Function}
	     */
	    _this.onComplete = null;

	    /**
	     * Function to call when a AnimatedSprite changes which texture is being rendered
	     *
	     * @member {Function}
	     */
	    _this.onFrameChange = null;

	    /**
	     * Elapsed time since animation has been started, used internally to display current texture
	     *
	     * @member {number}
	     * @private
	     */
	    _this._currentTime = 0;

	    _this._currentFrameTime = 0;

	    _this.currentFrame = 0;

	    /**
	     * Indicates if the AnimatedSprite is currently playing
	     *
	     * @member {boolean}
	     * @readonly
	     */
	    _this.playing = false;
	    return _this;
	  }

	  /**
	   * Stops the AnimatedSprite
	   *
	   */


	  _createClass(AnimatedSprite, [{
	    key: 'stop',
	    value: function stop() {
	      if (!this.playing) {
	        return;
	      }

	      this.playing = false;
	    }

	    /**
	     * Plays the AnimatedSprite
	     *
	     */

	  }, {
	    key: 'play',
	    value: function play() {
	      if (this.playing) {
	        return;
	      }

	      this.playing = true;
	    }

	    /**
	     * Stops the AnimatedSprite and goes to a specific frame
	     *
	     * @param {number} frameNumber - frame index to stop at
	     */

	  }, {
	    key: 'gotoAndStop',
	    value: function gotoAndStop(frameNumber) {
	      this.stop();

	      var previousFrame = this.currentFrame;

	      this._currentTime = frameNumber;

	      if (previousFrame !== this.currentFrame) {
	        this.updateTexture();
	      }
	    }

	    /**
	     * Goes to a specific frame and begins playing the AnimatedSprite
	     *
	     * @param {number} frameNumber - frame index to start at
	     */

	  }, {
	    key: 'gotoAndPlay',
	    value: function gotoAndPlay(frameNumber) {
	      var previousFrame = this.currentFrame;

	      this._currentTime = frameNumber;

	      if (previousFrame !== this.currentFrame) {
	        this.updateTexture();
	      }

	      this.play();
	    }

	    /**
	     * Updates the object transform for rendering.
	     *
	     * @private
	     * @param {number} deltaTime - Time since last tick.
	     */

	  }, {
	    key: 'update',
	    value: function update(deltaTime) {
	      if (!this.playing) {
	        return;
	      }

	      var elapsed = this.animationSpeed * deltaTime;

	      var currentFrameDuration = void 0;

	      if (this._durations !== null) {
	        currentFrameDuration = this._durations[this.currentFrame];
	      } else {
	        currentFrameDuration = this.standardFrameDuration;
	      }

	      this._currentFrameTime += elapsed;

	      // następna klatka
	      if (this._currentFrameTime > currentFrameDuration) {
	        var nextFrame = this.currentFrame + 1;

	        // koniec animacji
	        if (!this.loop && nextFrame === this._textures.length) {
	          this.gotoAndStop(nextFrame - 1);

	          if (this.onComplete) {
	            this.onComplete();
	          }

	          return;
	        }

	        // jeśli pętla to następna klatka jest pierwszą
	        if (this.loop && nextFrame === this._textures.length) {
	          nextFrame = 0;
	        }

	        this.currentFrame = nextFrame;
	        this._currentFrameTime -= currentFrameDuration;
	        this.updateTexture();
	      }
	    }

	    /**
	     * Updates the displayed texture to match the current frame index
	     *
	     * @private
	     */

	  }, {
	    key: 'updateTexture',
	    value: function updateTexture() {
	      this._texture = this._textures[this.currentFrame];
	      this._textureID = -1;

	      if (this.onFrameChange) {
	        this.onFrameChange(this.currentFrame);
	      }
	    }

	    /**
	     * Stops the AnimatedSprite and destroys it
	     *
	     */

	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      this.stop();
	      _get(AnimatedSprite.prototype.__proto__ || Object.getPrototypeOf(AnimatedSprite.prototype), 'destroy', this).call(this);
	    }

	    /**
	     * totalFrames is the total number of frames in the AnimatedSprite. This is the same as number of textures
	     * assigned to the AnimatedSprite.
	     *
	     * @readonly
	     * @member {number}
	     * @default 0
	     */

	  }, {
	    key: 'totalFrames',
	    get: function get() {
	      return this._textures.length;
	    }

	    /**
	     * The array of textures used for this AnimatedSprite
	     *
	     * @member {PIXI.Texture[]}
	     */

	  }, {
	    key: 'textures',
	    get: function get() {
	      return this._textures;
	    },
	    set: function set(value) {
	      if (value[0] instanceof PIXI.Texture) {
	        this._textures = value;
	        this._durations = null;
	      } else {
	        this._textures = [];
	        this._durations = [];

	        for (var i = 0; i < value.length; i++) {
	          this._textures.push(value[i].texture);
	          this._durations.push(value[i].time);
	        }
	      }
	    }
	  }]);

	  return AnimatedSprite;
	}(PIXI.Sprite);

	exports.default = AnimatedSprite;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = PIXI;

/***/ }
/******/ ]);