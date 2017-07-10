var Entropy =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 51);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * The 'src' argument plays the command role.
 * The returned values is always of the same type as the 'src'.
 * @param dst
 * @param src
 * @returns {*}
 */
function mergeOne(dst, src) {
  if (src === undefined) {
    return dst;
  }

  // According to specification arrays must be concatenated.
  // Also, the '.concat' creates a new array instance. Overrides the 'dst'.
  if (isArray(src)) {
    return (isArray(dst) ? dst : []).concat(src);
  }

  // Now deal with non plain 'src' object. 'src' overrides 'dst'
  // Note that functions are also assigned! We do not deep merge functions.
  if (!isPlainObject(src)) {
    return src;
  }

  // See if 'dst' is allowed to be mutated. If not - it's overridden with a new plain object.
  var returnValue = isObject(dst) ? dst : {};

  var keys = Object.keys(src);
  for (var i = 0; i < keys.length; i += 1) {
    var key = keys[i];

    var srcValue = src[key];
    // Do not merge properties with the 'undefined' value.
    if (srcValue !== undefined) {
      var dstValue = returnValue[key];
      // Recursive calls to mergeOne() must allow only plain objects or arrays in dst
      var newDst = isPlainObject(dstValue) || isArray(srcValue) ? dstValue : {};

      // deep merge each property. Recursion!
      returnValue[key] = mergeOne(newDst, srcValue);
    }
  }

  return returnValue;
}

var merge = function merge(dst) {
  var srcs = [],
      len = arguments.length - 1;
  while (len-- > 0) {
    srcs[len] = arguments[len + 1];
  }return srcs.reduce(mergeOne, dst);
};

function isFunction(obj) {
  return typeof obj === 'function';
}

function isObject(obj) {
  var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  return !!obj && (type === 'object' || type === 'function');
}

var assign = Object.assign;
var isArray = Array.isArray;

function isPlainObject(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && Object.getPrototypeOf(value) === Object.prototype;
}

var concat = Array.prototype.concat;
function extractFunctions() {
  var fns = concat.apply([], arguments).filter(isFunction);
  return fns.length === 0 ? undefined : fns;
}

function concatAssignFunctions(dstObject, srcArray, propName) {
  if (!isArray(srcArray)) {
    return;
  }

  var length = srcArray.length;
  var dstArray = dstObject[propName] || [];
  dstObject[propName] = dstArray;
  for (var i = 0; i < length; i += 1) {
    var fn = srcArray[i];
    if (isFunction(fn) && dstArray.indexOf(fn) < 0) {
      dstArray.push(fn);
    }
  }
}

function combineProperties(dstObject, srcObject, propName, action) {
  if (!isObject(srcObject[propName])) {
    return;
  }
  if (!isObject(dstObject[propName])) {
    dstObject[propName] = {};
  }
  action(dstObject[propName], srcObject[propName]);
}

function deepMergeAssign(dstObject, srcObject, propName) {
  combineProperties(dstObject, srcObject, propName, merge);
}
function mergeAssign(dstObject, srcObject, propName) {
  combineProperties(dstObject, srcObject, propName, assign);
}

/**
 * Converts stampit extended descriptor to a standard one.
 * @param [methods]
 * @param [properties]
 * @param [props]
 * @param [refs]
 * @param [initializers]
 * @param [init]
 * @param [deepProperties]
 * @param [deepProps]
 * @param [propertyDescriptors]
 * @param [staticProperties]
 * @param [statics]
 * @param [staticDeepProperties]
 * @param [deepStatics]
 * @param [staticPropertyDescriptors]
 * @param [configuration]
 * @param [conf]
 * @param [deepConfiguration]
 * @param [deepConf]
 * @param [composers]
 * @returns {Descriptor}
 */
var standardiseDescriptor = function standardiseDescriptor(ref) {
  if (ref === void 0) ref = {};
  var methods = ref.methods;
  var properties = ref.properties;
  var props = ref.props;
  var refs = ref.refs;
  var initializers = ref.initializers;
  var init = ref.init;
  var composers = ref.composers;
  var deepProperties = ref.deepProperties;
  var deepProps = ref.deepProps;
  var propertyDescriptors = ref.propertyDescriptors;
  var staticProperties = ref.staticProperties;
  var statics = ref.statics;
  var staticDeepProperties = ref.staticDeepProperties;
  var deepStatics = ref.deepStatics;
  var staticPropertyDescriptors = ref.staticPropertyDescriptors;
  var configuration = ref.configuration;
  var conf = ref.conf;
  var deepConfiguration = ref.deepConfiguration;
  var deepConf = ref.deepConf;

  var p = isObject(props) || isObject(refs) || isObject(properties) ? assign({}, props, refs, properties) : undefined;

  var dp = isObject(deepProps) ? merge({}, deepProps) : undefined;
  dp = isObject(deepProperties) ? merge(dp, deepProperties) : dp;

  var sp = isObject(statics) || isObject(staticProperties) ? assign({}, statics, staticProperties) : undefined;

  var dsp = isObject(deepStatics) ? merge({}, deepStatics) : undefined;
  dsp = isObject(staticDeepProperties) ? merge(dsp, staticDeepProperties) : dsp;

  var c = isObject(conf) || isObject(configuration) ? assign({}, conf, configuration) : undefined;

  var dc = isObject(deepConf) ? merge({}, deepConf) : undefined;
  dc = isObject(deepConfiguration) ? merge(dc, deepConfiguration) : dc;

  var ii = extractFunctions(init, initializers);

  var composerFunctions = extractFunctions(composers);
  if (composerFunctions) {
    dc = dc || {};
    concatAssignFunctions(dc, composerFunctions, 'composers');
  }

  var descriptor = {};
  if (methods) {
    descriptor.methods = methods;
  }
  if (p) {
    descriptor.properties = p;
  }
  if (ii) {
    descriptor.initializers = ii;
  }
  if (dp) {
    descriptor.deepProperties = dp;
  }
  if (sp) {
    descriptor.staticProperties = sp;
  }
  if (methods) {
    descriptor.methods = methods;
  }
  if (dsp) {
    descriptor.staticDeepProperties = dsp;
  }
  if (propertyDescriptors) {
    descriptor.propertyDescriptors = propertyDescriptors;
  }
  if (staticPropertyDescriptors) {
    descriptor.staticPropertyDescriptors = staticPropertyDescriptors;
  }
  if (c) {
    descriptor.configuration = c;
  }
  if (dc) {
    descriptor.deepConfiguration = dc;
  }

  return descriptor;
};

/**
 * Creates new factory instance.
 * @param {Descriptor} descriptor The information about the object the factory will be creating.
 * @returns {Function} The new factory function.
 */
function createFactory(descriptor) {
  return function Stamp(options) {
    var args = [],
        len = arguments.length - 1;
    while (len-- > 0) {
      args[len] = arguments[len + 1];
    } // Next line was optimized for most JS VMs. Please, be careful here!
    var obj = Object.create(descriptor.methods || null);

    merge(obj, descriptor.deepProperties);
    assign(obj, descriptor.properties);
    Object.defineProperties(obj, descriptor.propertyDescriptors || {});

    if (!descriptor.initializers || descriptor.initializers.length === 0) {
      return obj;
    }

    if (options === undefined) {
      options = {};
    }
    var inits = descriptor.initializers;
    var length = inits.length;
    for (var i = 0; i < length; i += 1) {
      var initializer = inits[i];
      if (isFunction(initializer)) {
        var returnedValue = initializer.call(obj, options, { instance: obj, stamp: Stamp, args: [options].concat(args) });
        obj = returnedValue === undefined ? obj : returnedValue;
      }
    }

    return obj;
  };
}

/**
 * Returns a new stamp given a descriptor and a compose function implementation.
 * @param {Descriptor} [descriptor={}] The information about the object the stamp will be creating.
 * @param {Compose} composeFunction The "compose" function implementation.
 * @returns {Stamp}
 */
function createStamp(descriptor, composeFunction) {
  var Stamp = createFactory(descriptor);

  merge(Stamp, descriptor.staticDeepProperties);
  assign(Stamp, descriptor.staticProperties);
  Object.defineProperties(Stamp, descriptor.staticPropertyDescriptors || {});

  var composeImplementation = isFunction(Stamp.compose) ? Stamp.compose : composeFunction;
  Stamp.compose = function _compose() {
    var args = [],
        len = arguments.length;
    while (len--) {
      args[len] = arguments[len];
    }return composeImplementation.apply(this, args);
  };
  assign(Stamp.compose, descriptor);

  return Stamp;
}

/**
 * Mutates the dstDescriptor by merging the srcComposable data into it.
 * @param {Descriptor} dstDescriptor The descriptor object to merge into.
 * @param {Composable} [srcComposable] The composable
 * (either descriptor or stamp) to merge data form.
 * @returns {Descriptor} Returns the dstDescriptor argument.
 */
function mergeComposable(dstDescriptor, srcComposable) {
  var srcDescriptor = srcComposable && srcComposable.compose || srcComposable;
  if (!isObject(srcDescriptor)) {
    return dstDescriptor;
  }

  mergeAssign(dstDescriptor, srcDescriptor, 'methods');
  mergeAssign(dstDescriptor, srcDescriptor, 'properties');
  deepMergeAssign(dstDescriptor, srcDescriptor, 'deepProperties');
  mergeAssign(dstDescriptor, srcDescriptor, 'propertyDescriptors');
  mergeAssign(dstDescriptor, srcDescriptor, 'staticProperties');
  deepMergeAssign(dstDescriptor, srcDescriptor, 'staticDeepProperties');
  mergeAssign(dstDescriptor, srcDescriptor, 'staticPropertyDescriptors');
  mergeAssign(dstDescriptor, srcDescriptor, 'configuration');
  deepMergeAssign(dstDescriptor, srcDescriptor, 'deepConfiguration');
  concatAssignFunctions(dstDescriptor, srcDescriptor.initializers, 'initializers');

  return dstDescriptor;
}

/**
 * Given the list of composables (stamp descriptors and stamps) returns
 * a new stamp (composable factory function).
 * @typedef {Function} Compose
 * @param {...(Composable)} [composables] The list of composables.
 * @returns {Stamp} A new stamp (aka composable factory function)
 */
function compose() {
  var composables = [],
      len = arguments.length;
  while (len--) {
    composables[len] = arguments[len];
  }var descriptor = [this].concat(composables).filter(isObject).reduce(mergeComposable, {});
  return createStamp(descriptor, compose);
}

/**
 * The Stamp Descriptor
 * @typedef {Function|Object} Descriptor
 * @returns {Stamp} A new stamp based on this Stamp
 * @property {Object} [methods] Methods or other data used as object instances' prototype
 * @property {Array<Function>} [initializers] List of initializers called for each object instance
 * @property {Object} [properties] Shallow assigned properties of object instances
 * @property {Object} [deepProperties] Deeply merged properties of object instances
 * @property {Object} [staticProperties] Shallow assigned properties of Stamps
 * @property {Object} [staticDeepProperties] Deeply merged properties of Stamps
 * @property {Object} [configuration] Shallow assigned properties of Stamp arbitrary metadata
 * @property {Object} [deepConfiguration] Deeply merged properties of Stamp arbitrary metadata
 * @property {Object} [propertyDescriptors] ES5 Property Descriptors applied to object instances
 * @property {Object} [staticPropertyDescriptors] ES5 Property Descriptors applied to Stamps
 */

/**
 * The Stamp factory function
 * @typedef {Function} Stamp
 * @returns {*} Instantiated object
 * @property {Descriptor} compose - The Stamp descriptor and composition function
 */

/**
 * A composable object - stamp or descriptor
 * @typedef {Stamp|Descriptor} Composable
 */

/**
 * Returns true if argument is a stamp.
 * @param {*} obj
 * @returns {Boolean}
 */
function isStamp(obj) {
  return isFunction(obj) && isFunction(obj.compose);
}

function createUtilityFunction(propName, action) {
  return function composeUtil() {
    var i = arguments.length,
        argsArray = Array(i);
    while (i--) {
      argsArray[i] = arguments[i];
    }return (this && this.compose || stampit).call(this, (obj = {}, obj[propName] = action.apply(void 0, [{}].concat(argsArray)), obj));
    var obj;
  };
}

var methods = createUtilityFunction('methods', assign);

var properties = createUtilityFunction('properties', assign);
function initializers() {
  var args = [],
      len = arguments.length;
  while (len--) {
    args[len] = arguments[len];
  }return (this && this.compose || stampit).call(this, {
    initializers: extractFunctions.apply(void 0, args)
  });
}
function composers() {
  var args = [],
      len = arguments.length;
  while (len--) {
    args[len] = arguments[len];
  }return (this && this.compose || stampit).call(this, {
    composers: extractFunctions.apply(void 0, args)
  });
}

var deepProperties = createUtilityFunction('deepProperties', merge);
var staticProperties = createUtilityFunction('staticProperties', assign);
var staticDeepProperties = createUtilityFunction('staticDeepProperties', merge);
var configuration = createUtilityFunction('configuration', assign);
var deepConfiguration = createUtilityFunction('deepConfiguration', merge);
var propertyDescriptors = createUtilityFunction('propertyDescriptors', assign);

var staticPropertyDescriptors = createUtilityFunction('staticPropertyDescriptors', assign);

var allUtilities = {
  methods: methods,

  properties: properties,
  refs: properties,
  props: properties,

  initializers: initializers,
  init: initializers,

  composers: composers,

  deepProperties: deepProperties,
  deepProps: deepProperties,

  staticProperties: staticProperties,
  statics: staticProperties,

  staticDeepProperties: staticDeepProperties,
  deepStatics: staticDeepProperties,

  configuration: configuration,
  conf: configuration,

  deepConfiguration: deepConfiguration,
  deepConf: deepConfiguration,

  propertyDescriptors: propertyDescriptors,

  staticPropertyDescriptors: staticPropertyDescriptors
};

/**
 * Infected stamp. Used as a storage of the infection metadata
 * @type {Function}
 * @return {Stamp}
 */
var baseStampit = compose({ staticProperties: allUtilities }, {
  staticProperties: {
    create: function create() {
      var args = [],
          len = arguments.length;
      while (len--) {
        args[len] = arguments[len];
      }return this.apply(void 0, args);
    },
    compose: stampit // infecting
  }
});

/**
 * Infected compose
 * @param {...(Composable)} [args] The list of composables.
 * @return {Stamp}
 */
function stampit() {
  var args = [],
      len = arguments.length;
  while (len--) {
    args[len] = arguments[len];
  }var composables = args.filter(isObject).map(function (arg) {
    return isStamp(arg) ? arg : standardiseDescriptor(arg);
  });

  // Calling the standard pure compose function here.
  var stamp = compose.apply(this || baseStampit, composables);

  var composerFunctions = stamp.compose.deepConfiguration && stamp.compose.deepConfiguration.composers;
  if (isArray(composerFunctions) && composerFunctions.length > 0) {
    var uniqueComposers = [];
    for (var i = 0; i < composerFunctions.length; i += 1) {
      var composer = composerFunctions[i];
      if (isFunction(composer) && uniqueComposers.indexOf(composer) < 0) {
        uniqueComposers.push(composer);
      }
    }
    stamp.compose.deepConfiguration.composers = uniqueComposers;

    if (isStamp(this)) {
      composables.unshift(this);
    }
    for (var i$1 = 0; i$1 < uniqueComposers.length; i$1 += 1) {
      var composer$1 = uniqueComposers[i$1];
      var returnedValue = composer$1({ stamp: stamp, composables: composables });
      stamp = isStamp(returnedValue) ? returnedValue : stamp;
    }
  }

  return stamp;
}

var exportedCompose = stampit.bind(); // bind to 'undefined'
stampit.compose = exportedCompose;

// Setting up the shortcut functions
var stampit$1 = assign(stampit, allUtilities);

exports.methods = methods;
exports.properties = properties;
exports.refs = properties;
exports.props = properties;
exports.initializers = initializers;
exports.init = initializers;
exports.composers = composers;
exports.deepProperties = deepProperties;
exports.deepProps = deepProperties;
exports.staticProperties = staticProperties;
exports.statics = staticProperties;
exports.staticDeepProperties = staticDeepProperties;
exports.deepStatics = staticDeepProperties;
exports.configuration = configuration;
exports.conf = configuration;
exports.deepConfiguration = deepConfiguration;
exports.deepConf = deepConfiguration;
exports.propertyDescriptors = propertyDescriptors;
exports.staticPropertyDescriptors = staticPropertyDescriptors;
exports.compose = exportedCompose;
exports['default'] = stampit$1;
module.exports = exports['default'];
//# sourceMappingURL=stampit.full.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var toString = Object.prototype.toString;

var toLowerFirstCase = exports.toLowerFirstCase = function toLowerFirstCase(str) {
  return str[0].toLowerCase() + str.slice(1);
};
var isFunction = exports.isFunction = function isFunction(thing) {
  return toString.call(thing) === '[object Function]';
};
var isString = exports.isString = function isString(thing) {
  return toString.call(thing) === '[object String]';
};
var isArray = exports.isArray = function isArray(thing) {
  return Array.isArray(thing);
};
var isObject = exports.isObject = function isObject(thing) {
  return toString.call(thing) === '[object Object]';
};
var isNonEmptyString = exports.isNonEmptyString = function isNonEmptyString(thing) {
  return isString(thing) && thing !== '';
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var freeGlobal = __webpack_require__(32);

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseIsNative = __webpack_require__(70),
    getValue = __webpack_require__(75);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpers = __webpack_require__(1);

var _stampit = __webpack_require__(0);

var _stampit2 = _interopRequireDefault(_stampit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Very simple event emitter implementation.
 *
 * @example
 * const ee = EventEmitter()
 *
 * ee.on('myEvent', (e) => {
 *   console.log(e.foo);
 * })
 *
 * ee.emit('myEvent', {
 *    foo: 'bar',
 * }) // prints `bar` in the console
 *
 * @class EventEmitter
 */
var EventEmitter = (0, _stampit2.default)({
  init: function init() {
    /**
     * Object with registered event listeners. Keys are event names.
     *
     * @private
     * @memberof EventEmitter#
     * @name _events
     * @type Object
     */
    this._events = {};
    this._responding = true;
  },

  methods: {
    /**
     * Method used to register event listener.
     *
     * @memberof EventEmitter#
     * @param  {String}     event         event name
     * @param  {Function}   fn            event listener
     * @param  {Boolean}    [once=false]  if set to `true`, listener will be called once, then it will be unregistered
     */
    on: function on(event, fn, once) {
      this._events[event] = this._events[event] || [];

      this._events[event].push({
        fn: fn,
        once: once
      });
    },

    /**
     * Same as {@link EventEmitter#on}, bu with implicit `once` parameter set to `true`.
     *
     * @memberof EventEmitter#
     * @param  {String}     event event name
     * @param  {Function}   fn    event listener
     */
    once: function once(event, fn) {
      this.on(event, fn, true);
    },

    /**
     * Emits event.
     * All listeners attached to this event name earlier will be called with arguments passed after event name.
     *
     * @memberof EventEmitter#
     * @param {String} event  event name
     * @param {...Any} [arg] multiple arguments, that will be passed to listeners
     */
    emit: function emit(event) {
      if (!this._responding || !(event in this._events)) {
        return;
      }

      var listeners = this._events[event];

      var i = 0;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      while (i < listeners.length) {
        var listener = this._events[event][i];

        var returnedValue = listener.fn.apply(listener, args);

        if (returnedValue === false || listener.once) {
          var index = i;

          while (index < listeners.length) {
            listeners[index] = listeners[++index];
          }

          listeners.length -= 1;
        } else {
          i += 1;
        }
      }
    },

    /**
     * Removes listener for event.
     *
     * @example
     * const myHandler = (e) => {}
     * ee.on('myEvent', myHandler) // handler attached
     * ee.off('myEvent', myHandler) // handler detached
     *
     * @memberof EventEmitter#
     * @param {String}    event event name
     * @param {Function}  fn    listener function attached earlier
     */
    off: function off(event, fn) {
      this._events[event] = this._events[event].filter(function (listener) {
        return (0, _helpers.isFunction)(fn) && listener.fn !== fn;
      });
    },

    /**
     * Disables event emitter so it won't repond to any emitted events.
     *
     * @memberof EventEmitter#
     */
    stopResponding: function stopResponding() {
      this._responding = false;
    },

    /**
     * Reenables disabled event emitter.
     *
     * @memberof EventEmitter#
     */
    startResponding: function startResponding() {
      this._responding = true;
    }
  }
});

exports.default = EventEmitter;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Symbol = __webpack_require__(13),
    getRawTag = __webpack_require__(71),
    objectToString = __webpack_require__(72);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
    if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}

module.exports = baseGetTag;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

module.exports = isObjectLike;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isSymbol = __webpack_require__(26);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}

module.exports = toKey;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var INSERT_AFTER = 1;
var INSERT_BEFORE = 2;

var alloc = function alloc(size, fillValue) {
  var arr = new Array(size);

  for (var i = 0; i < size; i++) {
    arr[i] = fillValue;
  }

  return arr;
};

var fastArrayPrototype = {
  extend: function extend() {
    var extensionSize = arguments.length <= 0 || arguments[0] === undefined ? Math.max(Math.ceil(this.maxLength * this.extensionFactor), 1) : arguments[0];

    var oldLength = this.maxLength;

    this.arr.length = oldLength + extensionSize;

    for (var i = oldLength, newLength = this.maxLength = this.arr.length; i < newLength; i++) {
      this.arr[i] = this.fillValue;
    }

    return this;
  },
  insertAtIndex: function insertAtIndex(index, value) {
    if (index > this.maxLength - 1) {
      this.extend(index - this.maxLength + 1);
    }

    this.arr[index] = value;

    if (index >= this.length) {
      this.length = index + 1;
    }
  },
  removeAtIndex: function removeAtIndex(index) {
    if (index < 0 || index >= this.length) {
      throw new Error('index is out of array bounds');
    }

    var removedValue = this.arr[index];

    var i = index;
    while (i < this.length) {
      this.arr[i] = this.arr[++i];
    }

    this.length--;

    return removedValue;
  },
  unsetAtIndex: function unsetAtIndex(index) {
    if (index < 0 || index >= this.length) {
      throw new Error('index is out of array bounds');
    }

    var unsetValue = this.arr[index];

    this.arr[index] = this.fillValue;

    this.sparse = true;

    return unsetValue;
  },
  find: function find(fn) {
    for (var i = 0; i < this.length; i++) {
      if (fn(this.arr[i])) {
        return this.arr[i];
      }
    }

    return void 0;
  },
  findAndRemove: function findAndRemove(value) {
    var index = this.indexOf(value);

    if (index !== -1) {
      this.removeAtIndex(index);
    }

    return index;
  },
  findAndUnset: function findAndUnset(value) {
    var index = this.indexOf(value);

    if (index !== -1) {
      this.unsetAtIndex(index);
    }

    return index;
  },
  indexOf: function indexOf(value) {
    for (var i = 0; i < this.length; i++) {
      if (this.arr[i] === value) {
        return i;
      }
    }

    return -1;
  },
  clear: function clear() {
    for (var i = 0; i < this.length; i++) {
      this.arr[i] = this.fillValue;
    }

    this.length = 0;

    return this;
  },
  push: function push(value) {
    if (value === this.fillValue) {
      throw new Error('cannot push value equal to `fillValue`');
    }

    if (this.length === this.maxLength) {
      this.extend(Math.round(this.maxLength * this.extensionFactor));
    }

    this.arr[this.length++] = value;

    return this;
  },
  shift: function shift() {
    return this.removeAtIndex(0);
  },
  pop: function pop() {
    if (this.length === 0) {
      return undefined;
    }

    var popped = this.arr[--this.length];

    this.arr[this.length] = this.fillValue;

    return popped;
  },
  insertAfter: function insertAfter(index, value) {
    this._insertAfterOrBefore(index, value, INSERT_AFTER);
  },
  insertBefore: function insertBefore(index, value) {
    this._insertAfterOrBefore(index, value, INSERT_BEFORE);
  },
  _insertAfterOrBefore: function _insertAfterOrBefore(index, value, insertAfterOrBefore) {
    if (this.length === this.maxLength) {
      this.extend();
    }

    var insertionIndex = void 0;

    if (insertAfterOrBefore === INSERT_AFTER) {
      insertionIndex = index + 1;
    } else {
      insertionIndex = index;
    }

    for (var i = this.length; i > insertionIndex; i--) {
      this.arr[i] = this.arr[i - 1];
    }

    this.arr[insertionIndex] = value;
    this.length++;
  },
  compact: function compact() {
    if (this.sparse) {
      var gapLength = 0;

      for (var i = 0; i < this.length; i++) {
        if (this.arr[i] === this.fillValue) {
          gapLength++;
        } else if (gapLength > 0) {
          this.arr[i - gapLength] = this.arr[i];

          this.arr[i] = this.fillValue;
        }
      }

      this.length -= gapLength;
      this.sparse = false;
    }

    return this;
  }
};

var FastArray = exports.FastArray = function FastArray() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$fillValue = _ref.fillValue;
  var fillValue = _ref$fillValue === undefined ? 0 : _ref$fillValue;
  var _ref$initialSize = _ref.initialSize;
  var initialSize = _ref$initialSize === undefined ? 1000 : _ref$initialSize;
  var _ref$refillRemoved = _ref.refillRemoved;
  var refillRemoved = _ref$refillRemoved === undefined ? true : _ref$refillRemoved;
  var _ref$extensionFactor = _ref.extensionFactor;
  var extensionFactor = _ref$extensionFactor === undefined ? 0.5 : _ref$extensionFactor;

  var fa = Object.create(fastArrayPrototype);

  fa.fillValue = fillValue;
  fa.initialSize = initialSize;
  fa.refillRemoved = refillRemoved;
  fa.extensionFactor = extensionFactor;
  fa.sparse = false;
  fa.arr = alloc(initialSize, fillValue);
  fa.length = 0;
  fa.maxLength = initialSize;

  return fa;
};

exports.default = FastArray;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var listCacheClear = __webpack_require__(60),
    listCacheDelete = __webpack_require__(61),
    listCacheGet = __webpack_require__(62),
    listCacheHas = __webpack_require__(63),
    listCacheSet = __webpack_require__(64);

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var eq = __webpack_require__(19);

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var root = __webpack_require__(2);

/** Built-in value references. */
var _Symbol = root.Symbol;

module.exports = _Symbol;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getNative = __webpack_require__(4);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isKeyable = __webpack_require__(84);

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

module.exports = getMapData;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArray = __webpack_require__(3),
    isKey = __webpack_require__(25),
    stringToPath = __webpack_require__(117),
    toString = __webpack_require__(120);

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stampit = __webpack_require__(0);

var _stampit2 = _interopRequireDefault(_stampit);

var _fastArray = __webpack_require__(10);

var _fastArray2 = _interopRequireDefault(_fastArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Pool = (0, _stampit2.default)({
  init: function init(options) {
    this._pool = (0, _fastArray2.default)();

    this._new = options._new;
    this._reuse = options._reuse;
  },

  methods: {
    free: function free(obj) {
      if (this._free) {
        this._free(obj);
      }

      this._pool.push(obj);
    },
    allocate: function allocate() {
      var obj = void 0;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (this._pool.length) {
        if (this._reuse) {
          obj = this._reuse.apply(this, [this._pool.pop()].concat(args));
        } else {
          obj = this._pool.pop();
        }
      } else {
        obj = this._new.apply(this, args);
      }

      return obj;
    }
  }
});

exports.default = Pool;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var arrayMap = __webpack_require__(29),
    baseIteratee = __webpack_require__(57),
    basePickBy = __webpack_require__(129),
    getAllKeysIn = __webpack_require__(134);

/**
 * Creates an object composed of the `object` properties `predicate` returns
 * truthy for. The predicate is invoked with two arguments: (value, key).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The source object.
 * @param {Function} [predicate=_.identity] The function invoked per property.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pickBy(object, _.isNumber);
 * // => { 'a': 1, 'c': 3 }
 */
function pickBy(object, predicate) {
  if (object == null) {
    return {};
  }
  var props = arrayMap(getAllKeysIn(object), function (prop) {
    return [prop];
  });
  predicate = baseIteratee(predicate);
  return basePickBy(object, props, function (value, path) {
    return predicate(value, path[0]);
  });
}

module.exports = pickBy;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || value !== value && other !== other;
}

module.exports = eq;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getNative = __webpack_require__(4),
    root = __webpack_require__(2);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mapCacheClear = __webpack_require__(76),
    mapCacheDelete = __webpack_require__(83),
    mapCacheGet = __webpack_require__(85),
    mapCacheHas = __webpack_require__(86),
    mapCacheSet = __webpack_require__(87);

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var castPath = __webpack_require__(16),
    toKey = __webpack_require__(9);

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return index && index == length ? object : undefined;
}

module.exports = baseGet;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isArray = __webpack_require__(3),
    isSymbol = __webpack_require__(26);

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}

module.exports = isKey;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var baseGetTag = __webpack_require__(6),
    isObjectLike = __webpack_require__(8);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
}

module.exports = isSymbol;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * FastBitSet.js : a fast bit set implementation in JavaScript.
 * (c) the authors
 * Licensed under the Apache License, Version 2.0.
 *
 * Speed-optimized BitSet implementation for modern browsers and JavaScript engines.
 *
 * A BitSet is an ideal data structure to implement a Set when values being stored are
 * reasonably small integers. It can be orders of magnitude faster than a generic set implementation.
 * The FastBitSet implementation optimizes for speed, leveraging commonly available features
 * like typed arrays.
 *
 * Simple usage :
 *  // var FastBitSet = require("fastbitset");// if you use node
 *  var b = new FastBitSet();// initially empty
 *  b.add(1);// add the value "1"
 *  b.has(1); // check that the value is present! (will return true)
 *  b.add(2);
 *  console.log(""+b);// should display {1,2}
 *  b.add(10);
 *  b.array(); // would return [1,2,10]
 *
 *  var c = new FastBitSet([1,2,3,10]); // create bitset initialized with values 1,2,3,10
 *  c.difference(b); // from c, remove elements that are in b
 *  var su = c.union_size(b);// compute the size of the union (bitsets are unchanged)
 * c.union(b); // c will contain all elements that are in c and b
 * var s1 = c.intersection_size(b);// compute the size of the intersection (bitsets are unchanged)
 * c.intersection(b); // c will only contain elements that are in both c and b
 * c = b.clone(); // create a (deep) copy of b and assign it to c.
 * c.equals(b); // check whether c and b are equal
 *
 *   See README.md file for a more complete description.
 *
 * You can install the library under node with the command line
 *   npm install fastbitset
 */


function isIterable(obj) {
  if (obj == null) {
    return false;
  }
  return obj[Symbol.iterator] !== undefined;
}

// you can provide an iterable
function FastBitSet(iterable) {
  this.words = [];
  if (isIterable(iterable)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = iterable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        this.add(key);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
}

// Add the value (Set the bit at index to true)
FastBitSet.prototype.add = function (index) {
  this.resize(index);
  this.words[index >>> 5] |= 1 << index;
};

// If the value was not in the set, add it, otherwise remove it (flip bit at index)
FastBitSet.prototype.flip = function (index) {
  this.resize(index);
  this.words[index >>> 5] ^= 1 << index;
};

// Remove all values, reset memory usage
FastBitSet.prototype.clear = function () {
  this.words = [];
};

// Set the bit at index to false
FastBitSet.prototype.remove = function (index) {
  this.resize(index);
  this.words[index >>> 5] &= ~(1 << index);
};

// Return true if no bit is set
FastBitSet.prototype.isEmpty = function (index) {
  var c = this.words.length;
  for (var i = 0; i < c; i++) {
    if (this.words[i] !== 0) return false;
  }
  return true;
};

// Is the value contained in the set? Is the bit at index true or false? Returns a boolean
FastBitSet.prototype.has = function (index) {
  return (this.words[index >>> 5] & 1 << index) !== 0;
};

// Reduce the memory usage to a minimum
FastBitSet.prototype.trim = function (index) {
  var nl = this.words.length;
  while (nl > 0) {
    if (this.words[nl - 1] === 0) nl--;
  }
  this.words = this.words.slice(0, nl);
};

// Resize the bitset so that we can write a value at index
FastBitSet.prototype.resize = function (index) {
  var count = index + 32 >>> 5; // just what is needed
  for (var i = this.words.length; i < count; i++) {
    this.words[i] = 0;
  }
};

// fast function to compute the Hamming weight of a 32-bit unsigned integer
FastBitSet.prototype.hammingWeight = function (v) {
  v -= v >>> 1 & 0x55555555; // works with signed or unsigned shifts
  v = (v & 0x33333333) + (v >>> 2 & 0x33333333);
  return (v + (v >>> 4) & 0xF0F0F0F) * 0x1010101 >>> 24;
};

// fast function to compute the Hamming weight of four 32-bit unsigned integers
FastBitSet.prototype.hammingWeight4 = function (v1, v2, v3, v4) {
  v1 -= v1 >>> 1 & 0x55555555; // works with signed or unsigned shifts
  v2 -= v2 >>> 1 & 0x55555555; // works with signed or unsigned shifts
  v3 -= v3 >>> 1 & 0x55555555; // works with signed or unsigned shifts
  v4 -= v4 >>> 1 & 0x55555555; // works with signed or unsigned shifts

  v1 = (v1 & 0x33333333) + (v1 >>> 2 & 0x33333333);
  v2 = (v2 & 0x33333333) + (v2 >>> 2 & 0x33333333);
  v3 = (v3 & 0x33333333) + (v3 >>> 2 & 0x33333333);
  v4 = (v4 & 0x33333333) + (v4 >>> 2 & 0x33333333);

  v1 = v1 + (v1 >>> 4) & 0xF0F0F0F;
  v2 = v2 + (v2 >>> 4) & 0xF0F0F0F;
  v3 = v3 + (v3 >>> 4) & 0xF0F0F0F;
  v4 = v4 + (v4 >>> 4) & 0xF0F0F0F;
  return (v1 + v2 + v3 + v4) * 0x1010101 >>> 24;
};

// How many values stored in the set? How many set bits?
FastBitSet.prototype.size = function () {
  var answer = 0;
  var c = this.words.length;
  var w = this.words;
  var i = 0;
  for (; i < c; i++) {
    answer += this.hammingWeight(w[i]);
  }
  return answer;
};

// Return an array with the set bit locations (values)
FastBitSet.prototype.array = function () {
  var answer = new Array(this.size());
  var pos = 0 | 0;
  var c = this.words.length;
  for (var k = 0; k < c; ++k) {
    var w = this.words[k];
    while (w != 0) {
      var t = w & -w;
      answer[pos++] = (k << 5) + this.hammingWeight(t - 1 | 0);
      w ^= t;
    }
  }
  return answer;
};

// Return an array with the set bit locations (values)
FastBitSet.prototype.forEach = function (fnc) {
  var c = this.words.length;
  for (var k = 0; k < c; ++k) {
    var w = this.words[k];
    while (w != 0) {
      var t = w & -w;
      fnc((k << 5) + this.hammingWeight(t - 1 | 0));
      w ^= t;
    }
  }
};

// Creates a copy of this bitmap
FastBitSet.prototype.clone = function () {
  var clone = Object.create(FastBitSet.prototype);
  clone.words = this.words.slice();
  return clone;
};

// Check if this bitset intersects with another one,
// no bitmap is modified
FastBitSet.prototype.intersects = function (otherbitmap) {
  var newcount = Math.min(this.words.length, otherbitmap.words.length);
  for (var k = 0 | 0; k < newcount; ++k) {
    if ((this.words[k] & otherbitmap.words[k]) !== 0) return true;
  }
  return false;
};

// Computes the intersection between this bitset and another one,
// the current bitmap is modified  (and returned by the function)
FastBitSet.prototype.intersection = function (otherbitmap) {
  var newcount = Math.min(this.words.length, otherbitmap.words.length);
  var k = 0 | 0;
  for (; k + 7 < newcount; k += 8) {
    this.words[k] &= otherbitmap.words[k];
    this.words[k + 1] &= otherbitmap.words[k + 1];
    this.words[k + 2] &= otherbitmap.words[k + 2];
    this.words[k + 3] &= otherbitmap.words[k + 3];
    this.words[k + 4] &= otherbitmap.words[k + 4];
    this.words[k + 5] &= otherbitmap.words[k + 5];
    this.words[k + 6] &= otherbitmap.words[k + 6];
    this.words[k + 7] &= otherbitmap.words[k + 7];
  }
  for (; k < newcount; ++k) {
    this.words[k] &= otherbitmap.words[k];
  }
  var c = this.words.length;
  for (var k = newcount; k < c; ++k) {
    this.words[k] = 0;
  }
  return this;
};

// Computes the size of the intersection between this bitset and another one
FastBitSet.prototype.intersection_size = function (otherbitmap) {
  var newcount = Math.min(this.words.length, otherbitmap.words.length);
  var answer = 0 | 0;
  for (var k = 0 | 0; k < newcount; ++k) {
    answer += this.hammingWeight(this.words[k] & otherbitmap.words[k]);
  }

  return answer;
};

// Computes the intersection between this bitset and another one,
// a new bitmap is generated
FastBitSet.prototype.new_intersection = function (otherbitmap) {
  var answer = Object.create(FastBitSet.prototype);
  var count = Math.min(this.words.length, otherbitmap.words.length);
  answer.words = new Array(count);
  var c = count;
  var k = 0 | 0;
  for (; k + 7 < c; k += 8) {
    answer.words[k] = this.words[k] & otherbitmap.words[k];
    answer.words[k + 1] = this.words[k + 1] & otherbitmap.words[k + 1];
    answer.words[k + 2] = this.words[k + 2] & otherbitmap.words[k + 2];
    answer.words[k + 3] = this.words[k + 3] & otherbitmap.words[k + 3];
    answer.words[k + 4] = this.words[k + 4] & otherbitmap.words[k + 4];
    answer.words[k + 5] = this.words[k + 5] & otherbitmap.words[k + 5];
    answer.words[k + 6] = this.words[k + 6] & otherbitmap.words[k + 6];
    answer.words[k + 7] = this.words[k + 7] & otherbitmap.words[k + 7];
  }
  for (; k < c; ++k) {
    answer.words[k] = this.words[k] & otherbitmap.words[k];
  }
  return answer;
};

// Computes the intersection between this bitset and another one,
// the current bitmap is modified
FastBitSet.prototype.equals = function (otherbitmap) {
  var mcount = Math.min(this.words.length, otherbitmap.words.length);
  for (var k = 0 | 0; k < mcount; ++k) {
    if (this.words[k] != otherbitmap.words[k]) return false;
  }
  if (this.words.length < otherbitmap.words.length) {
    var c = otherbitmap.words.length;
    for (var k = this.words.length; k < c; ++k) {
      if (otherbitmap.words[k] != 0) return false;
    }
  } else if (otherbitmap.words.length < this.words.length) {
    var c = this.words.length;
    for (var k = otherbitmap.words.length; k < c; ++k) {
      if (this.words[k] != 0) return false;
    }
  }
  return true;
};

// Computes the difference between this bitset and another one,
// the current bitset is modified (and returned by the function)
FastBitSet.prototype.difference = function (otherbitmap) {
  var newcount = Math.min(this.words.length, otherbitmap.words.length);
  var k = 0 | 0;
  for (; k + 7 < newcount; k += 8) {
    this.words[k] &= ~otherbitmap.words[k];
    this.words[k + 1] &= ~otherbitmap.words[k + 1];
    this.words[k + 2] &= ~otherbitmap.words[k + 2];
    this.words[k + 3] &= ~otherbitmap.words[k + 3];
    this.words[k + 4] &= ~otherbitmap.words[k + 4];
    this.words[k + 5] &= ~otherbitmap.words[k + 5];
    this.words[k + 6] &= ~otherbitmap.words[k + 6];
    this.words[k + 7] &= ~otherbitmap.words[k + 7];
  }
  for (; k < newcount; ++k) {
    this.words[k] &= ~otherbitmap.words[k];
  }
  return this;
};

// Computes the size of the difference between this bitset and another one
FastBitSet.prototype.difference_size = function (otherbitmap) {
  var newcount = Math.min(this.words.length, otherbitmap.words.length);
  var answer = 0 | 0;
  var k = 0 | 0;
  for (; k < newcount; ++k) {
    answer += this.hammingWeight(this.words[k] & ~otherbitmap.words[k]);
  }
  var c = this.words.length;
  for (; k < c; ++k) {
    answer += this.hammingWeight(this.words[k]);
  }
  return answer;
};

// Returns a string representation
FastBitSet.prototype.toString = function () {
  return '{' + this.array().join(',') + '}';
};

// Computes the union between this bitset and another one,
// the current bitset is modified  (and returned by the function)
FastBitSet.prototype.union = function (otherbitmap) {
  var mcount = Math.min(this.words.length, otherbitmap.words.length);
  var k = 0 | 0;
  for (; k + 7 < mcount; k += 8) {
    this.words[k] |= otherbitmap.words[k];
    this.words[k + 1] |= otherbitmap.words[k + 1];
    this.words[k + 2] |= otherbitmap.words[k + 2];
    this.words[k + 3] |= otherbitmap.words[k + 3];
    this.words[k + 4] |= otherbitmap.words[k + 4];
    this.words[k + 5] |= otherbitmap.words[k + 5];
    this.words[k + 6] |= otherbitmap.words[k + 6];
    this.words[k + 7] |= otherbitmap.words[k + 7];
  }
  for (; k < mcount; ++k) {
    this.words[k] |= otherbitmap.words[k];
  }
  if (this.words.length < otherbitmap.words.length) {
    this.resize((otherbitmap.words.length << 5) - 1);
    var c = otherbitmap.words.length;
    for (var k = mcount; k < c; ++k) {
      this.words[k] = otherbitmap.words[k];
    }
  }
  return this;
};

FastBitSet.prototype.new_union = function (otherbitmap) {
  var answer = Object.create(FastBitSet.prototype);
  var count = Math.max(this.words.length, otherbitmap.words.length);
  answer.words = new Array(count);
  var mcount = Math.min(this.words.length, otherbitmap.words.length);
  var k = 0;
  for (; k + 7 < mcount; k += 8) {
    answer.words[k] = this.words[k] | otherbitmap.words[k];
    answer.words[k + 1] = this.words[k + 1] | otherbitmap.words[k + 1];
    answer.words[k + 2] = this.words[k + 2] | otherbitmap.words[k + 2];
    answer.words[k + 3] = this.words[k + 3] | otherbitmap.words[k + 3];
    answer.words[k + 4] = this.words[k + 4] | otherbitmap.words[k + 4];
    answer.words[k + 5] = this.words[k + 5] | otherbitmap.words[k + 5];
    answer.words[k + 6] = this.words[k + 6] | otherbitmap.words[k + 6];
    answer.words[k + 7] = this.words[k + 7] | otherbitmap.words[k + 7];
  }
  for (; k < mcount; ++k) {
    answer.words[k] = this.words[k] | otherbitmap.words[k];
  }
  var c = this.words.length;
  for (var k = mcount; k < c; ++k) {
    answer.words[k] = this.words[k];
  }
  var c2 = otherbitmap.words.length;
  for (var k = mcount; k < c2; ++k) {
    answer.words[k] = otherbitmap.words[k];
  }
  return answer;
};

// Computes the difference between this bitset and another one,
// a new bitmap is generated
FastBitSet.prototype.new_difference = function (otherbitmap) {
  return this.clone().difference(otherbitmap); // should be fast enough
};

// Computes the size union between this bitset and another one
FastBitSet.prototype.union_size = function (otherbitmap) {
  var mcount = Math.min(this.words.length, otherbitmap.words.length);
  var answer = 0 | 0;
  for (var k = 0 | 0; k < mcount; ++k) {
    answer += this.hammingWeight(this.words[k] | otherbitmap.words[k]);
  }
  if (this.words.length < otherbitmap.words.length) {
    var c = otherbitmap.words.length;
    for (var k = this.words.length; k < c; ++k) {
      answer += this.hammingWeight(otherbitmap.words[k] | 0);
    }
  } else {
    var c = this.words.length;
    for (var k = otherbitmap.words.length; k < c; ++k) {
      answer += this.hammingWeight(this.words[k] | 0);
    }
  }
  return answer;
};

///////////////

module.exports = FastBitSet;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ListCache = __webpack_require__(11),
    stackClear = __webpack_require__(65),
    stackDelete = __webpack_require__(66),
    stackGet = __webpack_require__(67),
    stackHas = __webpack_require__(68),
    stackSet = __webpack_require__(69);

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseGetTag = __webpack_require__(6),
    isObject = __webpack_require__(7);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
    if (!isObject(value)) {
        return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseIsEqualDeep = __webpack_require__(88),
    isObjectLike = __webpack_require__(8);

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var SetCache = __webpack_require__(89),
    arraySome = __webpack_require__(92),
    cacheHas = __webpack_require__(93);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function (othValue, othIndex) {
        if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var arrayPush = __webpack_require__(37),
    isArray = __webpack_require__(3);

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var arrayFilter = __webpack_require__(100),
    stubArray = __webpack_require__(39);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function (object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function (symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var arrayLikeKeys = __webpack_require__(41),
    baseKeys = __webpack_require__(107),
    isArrayLike = __webpack_require__(48);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseTimes = __webpack_require__(101),
    isArguments = __webpack_require__(42),
    isArray = __webpack_require__(3),
    isBuffer = __webpack_require__(43),
    isIndex = __webpack_require__(22),
    isTypedArray = __webpack_require__(45);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (
    // Safari 9 has enumerable `arguments.length` in strict mode.
    key == 'length' ||
    // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == 'offset' || key == 'parent') ||
    // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') ||
    // Skip index properties.
    isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseIsArguments = __webpack_require__(102),
    isObjectLike = __webpack_require__(8);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function () {
    return arguments;
}()) ? baseIsArguments : function (value) {
    return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var root = __webpack_require__(2),
    stubFalse = __webpack_require__(103);

/** Detect free variable `exports`. */
var freeExports = ( false ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && ( false ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(44)(module)))

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseIsTypedArray = __webpack_require__(104),
    baseUnary = __webpack_require__(105),
    nodeUtil = __webpack_require__(106);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;

  return value === proto;
}

module.exports = isPrototype;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isFunction = __webpack_require__(31),
    isLength = __webpack_require__(23);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isObject = __webpack_require__(7);

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function (object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue && (srcValue !== undefined || key in Object(object));
  };
}

module.exports = matchesStrictComparable;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _stampit = __webpack_require__(0);

var stampit = _interopRequireWildcard(_stampit);

var _helpers = __webpack_require__(1);

var _EventEmitter = __webpack_require__(5);

var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

var _Engine = __webpack_require__(52);

var _Engine2 = _interopRequireDefault(_Engine);

var _Ticker = __webpack_require__(54);

var _Ticker2 = _interopRequireDefault(_Ticker);

var _Query = __webpack_require__(55);

var _Query2 = _interopRequireDefault(_Query);

var _EntityStore = __webpack_require__(56);

var _EntityStore2 = _interopRequireDefault(_EntityStore);

var _ComponentStore = __webpack_require__(141);

var _ComponentStore2 = _interopRequireDefault(_ComponentStore);

var _SystemStore = __webpack_require__(143);

var _SystemStore2 = _interopRequireDefault(_SystemStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var PLUGINS = [];

/**
 * Main framework factory method. This is the only factory, that needs to be called by user.
 *
 * @class Entropy
 * @borrows ComponentStore#register as Entropy#registerComponent
 * @borrows ComponentStore#registerMany as Entropy#registerComponents
 * @borrows ComponentStore#create as Entropy#createComponent
 * @borrows EntityStore#register as Entropy#registerEntity
 * @borrows EntityStore#registerMany as Entropy#registerEntitys
 * @borrows EntityStore#create as Entropy#createEntity
 * @borrows SystemStore#register as Entropy#registerSystem
 * @borrows SystemStore#registerMany as Entropy#registerSystems
 * @borrows SystemStore#create as Entropy#createSystem
 * @extends EventEmitter
 * @param {Object} config
 * @param {Boolean} config.pauseOnVisibilityChange
 *
 * @example
 * const game = Entropy() // creating game with default configuration
 * game.addEntity('Ball', {
 *   x: 0,
 *   y: 0,
 * })
 */
var Entropy = stampit.compose(_EventEmitter2.default, {
  statics: {
    stampit: stampit,
    registerPlugin: function registerPlugin(factoryFunction) {
      PLUGINS.push(factoryFunction);
    }
  },
  init: function init() {
    var _this = this;

    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    // welcome message
    var styles = '\n      background: white;\n      display: block;\n      color: black;\n      box-shadow: 1px 1px 3px black;\n      padding: 5px;\n      text-align: center;\n      font-weight: bold;';

    console.log('%cEntropy 1.0.0-alpha.1 - Entity System Framework for JavaScript', styles);

    /**
     * Stores components for later reuse.
     *
     * @memberof Entropy#
     * @name component
     * @type ComponentStore
     */
    this.component = (0, _ComponentStore2.default)();

    /**
     * Stores entities for later reuse.
     *
     * @memberof Entropy#
     * @name entity
     * @type EntityStore
     */
    this.entity = (0, _EntityStore2.default)({
      game: this
    });

    /**
     *
     * Stores entities for later reuse.
     *
     * @private
     * @memberOf Entropy#
     * @name system
     * @type SystemStore
     */
    this.system = (0, _SystemStore2.default)({
      game: this
    });

    /**
     * Instance of {@link Engine}.
     *
     * @memberof Entropy#
     * @name engine
     * @type {Engine}
     */
    this.engine = (0, _Engine2.default)({
      game: this
    });

    /**
     * Instance of Ticker class.
     *
     * @memberof Entropy#
     * @name ticker
     * @type {Ticker}
     */
    this.ticker = (0, _Ticker2.default)({
      game: this
    });

    // initialize plugins
    PLUGINS.forEach(function (factoryFunction) {
      _this[factoryFunction.propName] = factoryFunction({
        game: _this,
        config: config[factoryFunction.propName]
      });
    });

    // update engine when ticker updates
    this.ticker.on('update', function () {
      var _engine;

      return (_engine = _this.engine).update.apply(_engine, arguments);
    });

    // browser only code
    if (typeof window !== 'undefined') {
      // Set the name of the hidden property and the change event for visibility
      var hidden = void 0;
      var visibilityChange = void 0;

      if (typeof document.hidden !== 'undefined') {
        // Opera 12.10 and Firefox 18 and later support
        hidden = 'hidden';
        visibilityChange = 'visibilitychange';
      } else if (typeof document.msHidden !== 'undefined') {
        hidden = 'msHidden';
        visibilityChange = 'msvisibilitychange';
      } else if (typeof document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden';
        visibilityChange = 'webkitvisibilitychange';
      }

      document.addEventListener(visibilityChange, function (e) {
        _this.emit('visibilityChange', {
          originalEvent: e,
          hidden: document.hidden
        });
      }, false);

      if (config.pauseOnHide) {
        this.on('visibilityChange', function (e) {
          if (e[hidden]) {
            _this.pause();
          } else {
            _this.resume();
          }
        });
      }
    }
  },

  methods: {
    /**
     * Starts the game. See Ticker's {@link Ticker#start} method for more details.
     *
     * @memberof Entropy#
     * @return {Boolean} succesfuly started or not
     */
    start: function start() {
      this.ticker.start();
      this.emit('start');
    },

    /**
     * Pauses the game.
     *
     * @memberof Entropy#
     */
    pause: function pause() {
      this.ticker.pause();
    },

    /**
     * Resumes paused game.
     *
     * @memberof Entropy#
     */
    resume: function resume() {
      this.ticker.resume();
    },

    /**
     * Stops the game. See Ticker's {@ink Ticker@stop} method for more details.
     *
     * @memberof Entropy#
     * @param {Boolean} clearEngine if `true`, engine will be cleared before ticker stop
     * @return {Entropy} game instance for chaining
     */
    stop: function stop(clearEngine) {
      var _this2 = this;

      if (clearEngine) {
        this.engine.once('clear', function () {
          return _this2._stopAndEmit();
        });

        // schedule engine clearing
        this.engine.clear();
      } else {
        this._stopAndEmit();
      }
    },
    registerEntity: function registerEntity() {
      var _entity;

      (_entity = this.entity).register.apply(_entity, arguments);

      return this;
    },
    registerEntities: function registerEntities() {
      var _entity2;

      (_entity2 = this.entity).registerMany.apply(_entity2, arguments);

      return this;
    },
    createEntity: function createEntity() {
      var _entity3;

      return (_entity3 = this.entity).create.apply(_entity3, arguments);
    },

    /**
     * Adds (or schedules adding) entity to engine. If first argument is entity type (string), then entity instance is created and then added.
     *
     * @public
     * @memberof Entropy#
     * @method addEntity
     * @param {Entity|String} typeOrEntity entity instance or entity type to create
     * @param {...Any}        args         arguments passed to `onCreate` method of entity descriptor, when first argument is entity type
     */
    addEntity: function addEntity(typeOrEntity) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var entity = (0, _helpers.isObject)(typeOrEntity) ? typeOrEntity : this.createEntity.apply(this, [typeOrEntity].concat(args));

      this.engine.addEntity(entity);

      return this;
    },

    /**
     * Removes (or schedules removing) entity from engine.
     *
     * @public
     * @memberof Entropy#
     * @method removeEntity
     * @param {Entity} entity entity instance
     */
    removeEntity: function removeEntity(entity) {
      this.engine.removeEntity(entity);
    },
    registerComponent: function registerComponent() {
      var _component;

      (_component = this.component).register.apply(_component, arguments);

      return this;
    },
    registerComponents: function registerComponents() {
      var _component2;

      (_component2 = this.component).registerMany.apply(_component2, arguments);

      return this;
    },
    createComponent: function createComponent() {
      var _component3;

      return (_component3 = this.component).create.apply(_component3, arguments);
    },
    registerSystem: function registerSystem() {
      var _system;

      (_system = this.system).register.apply(_system, arguments);

      return this;
    },
    registerSystems: function registerSystems() {
      var _system2;

      (_system2 = this.system).registerMany.apply(_system2, arguments);

      return this;
    },
    createSystem: function createSystem() {
      var _system3;

      return (_system3 = this.system).create.apply(_system3, arguments);
    },

    /**
     * Adds system to engine. If first argument is system type (string), then system instance is created and then added.
     *
     * @public
     * @memberof Entropy#
     * @method addSystem
     * @param {System|String} typeOrSystem system instance or system type to create
     * @param {...Any}        args         arguments passed to `onCreate` method of system descriptor, when first argument is system type
     */
    addSystem: function addSystem(typeOrSystem) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var system = (0, _helpers.isObject)(typeOrSystem) ? typeOrSystem : this.createSystem.apply(this, [typeOrSystem].concat(args));

      this.engine.addSystem(system);
    },

    /**
     * Removes (or schedules removing) system from engine.
     *
     * @public
     * @memberof Entropy#
     * @method removeSystem
     * @param {System|String} typeOrSystem system instance or system type
     */
    removeSystem: function removeSystem(typeOrSystem) {
      this.engine.removeSystem(typeOrSystem);
    },

    /**
     * Creates new query from criterions. See {@link Query} for details about available criterions.
     *
     * @public
     * @memberof Entropy#
     * @method createQuery
     * @param {Object|Array} criterions criterions
     * @returns {Query} query instance
     */
    createQuery: function createQuery(criterions) {
      var query = (0, _Query2.default)({
        componentsIdsMap: this.component._componentsIdsMap,
        criterions: criterions
      });

      return query;
    },

    /**
     * Returns entities that matches provided query.
     *
     * @public
     * @memberof Entropy#
     * @method getEntities
     * @param {Query} query query
     * @return {Object} object with `length` and `entities` properties
     */
    getEntities: function getEntities(query) {
      return this.engine.getEntities(query);
    },

    /**
     * Checks if ticker is running.
     *
     * @public
     * @memberof Entropy#
     * @method isRunning
     * @returns {Boolean}
     */
    isRunning: function isRunning() {
      return this.ticker.isRunning();
    },
    _stopAndEmit: function _stopAndEmit() {
      var stop = this.ticker.stop();

      if (stop) {
        this.emit('stop');
      }
    }
  }
});

module.exports = Entropy;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stampit = __webpack_require__(0);

var _isStamp = __webpack_require__(53);

var _isStamp2 = _interopRequireDefault(_isStamp);

var _fastArray = __webpack_require__(10);

var _fastArray2 = _interopRequireDefault(_fastArray);

var _EventEmitter = __webpack_require__(5);

var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

var _Pool = __webpack_require__(17);

var _Pool2 = _interopRequireDefault(_Pool);

var _helpers = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This module manages the state of entities, components and systems. The heart of Entropy.
 *
 * @class Engine
 * @extends EventEmitter
 */
var Engine = (0, _stampit.compose)({
  init: function init(opts) {
    // entity ids start from 1, 0 means uninitailized or disabled entity
    var greatestEntityID = 1;

    /**
     * When entity is removed, it's ID can be reused by new entities. This pool stores old IDs ready to reuse.
     *
     * @private
     * @name _entitiesIdsPool
     * @memberof Engine#
     * @type Pool
     */
    this._entitiesIdsPool = (0, _Pool2.default)({
      _new: function _new() {
        return greatestEntityID++;
      }
    });

    /**
     * Systems that are processed every tick.
     *
     * @private
     * @name _systems
     * @memberof Engine#
     * @type FastArray
     */
    this._systems = (0, _fastArray2.default)({
      initialSize: 10
    });

    /**
     * Array with entities. Array index corresponds to ID of an entity.
     * First element is empty (equals 0), because entity IDs start from 1.
     * Entity with `id` property equal 0 is _officially_ not present
     * in the system (it can be for example present in the pool or waiting
     * for addition to system).
     *
     * @private
     * @name _entities
     * @memberof Engine#
     * @type FastArray
     */
    this._entities = (0, _fastArray2.default)();

    /**
     * List of modified entities.
     *
     * When entity is modified it is added to this list. After each frame modifications are applied to every entity on the list.
     *
     * @private
     * @name _modifiedEntities
     * @memberof Engine#
     * @type FastArray
     */
    this._modifiedEntities = (0, _fastArray2.default)();

    /**
     * Queue of entities ready to be added on next tick.
     *
     * @private
     * @name _entitiesToAdd
     * @memberof Engine#
     * @type FastArray
     */
    this._entitiesToAdd = (0, _fastArray2.default)();

    /**
     * Queue of entities ready to be removed on next tick.
     *
     * @private
     * @name _entitiesToRemove
     * @memberof Engine#
     * @type FastArray
     */
    this._entitiesToRemove = (0, _fastArray2.default)();

    /**
     * Queue of systems ready to be added on next tick.
     *
     * @private
     * @name _systemsToAdd
     * @memberof Engine#
     * @type FastArray
     */
    this._systemsToAdd = (0, _fastArray2.default)({
      initialSize: 10
    });

    /**
     * Queue of systems ready to be removed on next tick.
     *
     * @private
     * @name _systemsToRemove
     * @memberof Engine#
     * @type FastArray
     */
    this._systemsToRemove = (0, _fastArray2.default)({
      initialSize: 10
    });

    /**
     * Array of queries. Every query that was used is stored here and updated when engine state changes.
     *
     * @private
     * @name _queries
     * @memberof Engine#
     * @type {Array}
     */
    this._queries = [];

    /**
     * Current number of entities active.
     *
     * @private
     * @name _entitiesCount
     * @memberof Engine#
     * @type {Number}
     */
    this._entitiesCount = 0;

    /**
     * Indicates whether clearing is scheduled.
     *
     * @private
     * @name _isClearingScheduled
     * @memberof Engine#
     * @type {Boolean}
     */
    this._isClearingScheduled = false;

    /**
     * Indicates whether clearing was performed.
     *
     * @private
     * @name _wasClearingPerformed
     * @memberof Engine#
     * @type {Boolean}
     */
    this._wasClearingPerformed = false;

    this.game = opts.game;
  },

  methods: {
    /**
     * Adds entity to adding queue.
     * If entity is new (not recycled), adds event listener for modifications.
     *
     * @memberof Engine#
     * @param {Entity} entity entity to add
     */
    addEntity: function addEntity(entity) {
      var _this = this;

      if (!entity.isRecycled()) {
        entity.on('queueModification', function () {
          _this._markModifiedEntity(entity);
        });
      }

      if (this.game.isRunning()) {
        this._entitiesToAdd.push(entity);
      } else {
        this._addEntity(entity);
      }
    },

    /**
     * Adds entity to removing queue.
     *
     * @memberof Engine#
     * @param {Entity} entity entity to remove
     */
    removeEntity: function removeEntity(entity) {
      if (this.game.isRunning()) {
        this._entitiesToRemove.push(entity);
      } else {
        this._removeEntity();
      }
    },

    /**
     * Adds system to adding queue.
     *
     * @memberof Engine#
     * @param {System} system to add
     */
    addSystem: function addSystem(system) {
      this._systemsToAdd.push(system);
    },

    /**
     * Adds system to removing queue.
     *
     * @memberof Engine#
     * @param {String|System} systemOrType system instance or system type to remove
     */
    removeSystem: function removeSystem(systemOrType) {
      var system = void 0;

      if ((0, _isStamp2.default)(systemOrType)) {
        system = systemOrType;
      } else if ((0, _helpers.isNonEmptyString)(systemOrType)) {
        system = this._systems.find(function (s) {
          return s.type === systemOrType;
        });
      }

      if (system) {
        this._systemsToRemove.push(system);
      }
    },

    /**
     * Gets entities matching query criterions.
     *
     * @memberof Engine#
     * @param {Query} query query
     * @return {Object} object with `entities` and `length` properties
     */
    getEntities: function getEntities(query) {
      if (this._queries.indexOf(query) === -1) {
        this._initializeQuery(query);
      }

      return query.getEntities();
    },

    /**
     * Updates the engine:
     * - updates systems (calls `onUpdate` method of every active system)
     * - performs clearing, if scheduled
     * - applies engine modifications (adding/removing entities/systems, updating queries)
     *
     * @memberof Engine#
     * @fires Engine#clear
     * @param {...Any} args arguments passed to systems `onUpdate` methods
     */
    update: function update() {
      this._updateSystems.apply(this, arguments);

      if (this._isClearingScheduled) {
        this._performScheduledClearing();
      }

      this._removeEntities();
      this._addEntities();
      this._modifyEntities();
      this._removeSystems();
      this._addSystems();
      this._updateQueries();

      if (this._wasClearingPerformed) {
        /**
         * Engine was cleared.
         *
         * @event Engine#clear
         */
        this.emit('clear');

        this._wasClearingPerformed = false;
        this._isClearingScheduled = false;
      }
    },

    /**
     * Schedules clearing. Clearing is done on next frame.
     *
     * @memberof Engine#
     */
    clear: function clear() {
      this._isClearingScheduled = true;
    },
    _markModifiedEntity: function _markModifiedEntity(entity) {
      if (entity.id !== 0 && this._modifiedEntities.indexOf(entity) === -1) {
        if (this.game.isRunning()) {
          this._modifiedEntities.push(entity);
        } else {
          this._modifyEntity(entity);
        }
      }
    },
    _updateSystems: function _updateSystems() {
      for (var i = 0; i < this._systems.length; i += 1) {
        var system = this._systems.arr[i];

        if (!system._disabled) {
          system.onUpdate.apply(system, arguments);
        }
      }
    },
    _removeEntities: function _removeEntities() {
      while (this._entitiesToRemove.length) {
        this._removeEntity(this._entitiesToRemove.pop());
      }
    },
    _removeEntity: function _removeEntity(entity) {
      if (entity.id === 0) {
        return;
      }

      for (var i = 0; i < this._queries.length; i += 1) {
        var query = this._queries[i];

        if (query.satisfiedBy(entity)) {
          query.removeFromIndex(entity.id);
        }
      }

      entity.onRemove(entity);

      // remove entity from global index
      this._entities.unsetAtIndex(entity.id);

      // send unused entity ID to pool for later reuse
      this._entitiesIdsPool.free(entity.id);

      entity.removeAllComponents();

      // id = 0 indicates inactive entity
      entity.id = 0;

      this.game.entity.free(entity);

      this._entitiesCount -= 1;

      this.emit('entityRemove', entity);
    },
    _addEntities: function _addEntities() {
      while (this._entitiesToAdd.length) {
        this._addEntity(this._entitiesToAdd.pop());
      }
    },
    _addEntity: function _addEntity(entity) {
      var newEntityId = this._entitiesIdsPool.allocate();

      entity.id = newEntityId;

      this._entities.insertAtIndex(newEntityId, entity);

      for (var i = 0; i < this._queries.length; i += 1) {
        var query = this._queries[i];

        if (query.satisfiedBy(entity)) {
          query.addToIndex(newEntityId);
        }
      }

      this._entitiesCount += 1;

      this.emit('entityAdd', entity);
    },
    _modifyEntity: function _modifyEntity(entity) {
      for (var i = 0; i < this._queries.length; i += 1) {
        var query = this._queries[i];

        var satisfiedBeforeModification = query.satisfiedBy(entity);

        entity.applyModifications();

        var satisfiesAfterModification = query.satisfiedBy(entity);

        if (!satisfiedBeforeModification && satisfiesAfterModification) {
          query.addToIndex(entity.id);
        } else if (satisfiedBeforeModification && !satisfiesAfterModification) {
          query.removeFromIndex(entity.id);
        }
      }
    },
    _modifyEntities: function _modifyEntities() {
      while (this._modifiedEntities.length) {
        this._modifyEntity(this._modifiedEntities.pop());
      }
    },
    _addSystem: function _addSystem(system) {
      var insertionIndex = 0;
      for (; insertionIndex < this._systems.length; insertionIndex += 1) {
        if (this._systems.arr[insertionIndex].priority > system.priority) {
          break;
        }
      }

      this._systems.insertBefore(insertionIndex, system);
    },
    _addSystems: function _addSystems() {
      while (this._systemsToAdd.length) {
        this._addSystem(this._systemsToAdd.shift());
      }
    },
    _removeSystem: function _removeSystem(system) {
      var indexOfSystem = this._systems.indexOf(system);

      if (indexOfSystem !== -1) {
        system.onRemove();

        this._systems.removeAtIndex(indexOfSystem);
      }
    },
    _removeSystems: function _removeSystems() {
      while (this._systemsToRemove.length) {
        this._removeSystem(this._systemsToRemove.shift());
      }
    },
    _updateQueries: function _updateQueries() {
      for (var i = 0; i < this._queries.length; i += 1) {
        this._queries[i].update(this._entities);
      }
    },
    _performScheduledClearing: function _performScheduledClearing() {
      this._wasClearingPerformed = true;
    },
    _initializeQuery: function _initializeQuery(query) {
      query.initialize(this._entities);

      this._queries.push(query);
    }
  }
}, _EventEmitter2.default);

exports.default = Engine;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function isFunction(obj) {
  return typeof obj === 'function';
}

/**
 * Returns true if argument is a stamp.
 * @param {*} obj
 * @returns {Boolean}
 */
function isStamp(obj) {
  return isFunction(obj) && isFunction(obj.compose);
}

exports['default'] = isStamp;
module.exports = exports['default'];
//# sourceMappingURL=isStamp.js.map

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _stampit = __webpack_require__(0);

var _EventEmitter = __webpack_require__(5);

var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* The MIT License
*
* Copyright (C) 2016 Isaac Sukin
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of
* this software and associated documentation files (the "Software"), to deal in
* the Software without restriction, including without limitation the rights to
* use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
* of the Software, and to permit persons to whom the Software is furnished to do
* so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* This module is a modified code from
*/

(function initPolyfils() {
  var windowOrGlobal = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? window : global;

  /**
   * performance.now polyfill
   *
   * @license http://opensource.org/licenses/MIT
   * Copyright (C) 2015 Paul Irish
   *
   * Date.now() is supported everywhere except IE8. For IE8 we use the Date.now polyfill:
   * github.com/Financial-Times/polyfill-service/blob/master/polyfills/Date.now/polyfill.js
   *
   * As Safari 6 doesn't have support for NavigationTiming,
   * we use a Date.now() timestamp for relative values.
   */
  if (!('performance' in windowOrGlobal)) {
    windowOrGlobal.performance = {};
  }

  Date.now = Date.now || function getNow() {
    // thanks IE8
    return new Date().getTime();
  };

  if (!('now' in windowOrGlobal.performance)) {
    var nowOffset = Date.now();

    if (performance.timing && performance.timing.navigationStart) {
      nowOffset = performance.timing.navigationStart;
    }

    windowOrGlobal.performance.now = function now() {
      return Date.now() - nowOffset;
    };
  }

  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
  // MIT license
  {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];

    for (var x = 0; x < vendors.length && !windowOrGlobal.requestAnimationFrame; ++x) {
      windowOrGlobal.requestAnimationFrame = windowOrGlobal[vendors[x] + 'RequestAnimationFrame'];
      windowOrGlobal.cancelAnimationFrame = windowOrGlobal[vendors[x] + 'CancelAnimationFrame'] || windowOrGlobal[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!windowOrGlobal.requestAnimationFrame) {
      windowOrGlobal.requestAnimationFrame = function requestAnimationFrame(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = windowOrGlobal.setTimeout(function () {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }

    if (!windowOrGlobal.cancelAnimationFrame) {
      windowOrGlobal.cancelAnimationFrame = function cancelAnimationFrame(id) {
        clearTimeout(id);
      };
    }
  }
})();

/**
 * @class Ticker
 */
var Ticker = (0, _stampit.compose)({
  init: function init() {
    var _this = this;

    // The amount of time (in milliseconds) to simulate each time update()
    // runs. See `MainLoop.setSimulationTimestep()` for details.
    this.simulationTimestep = 1000 / 60;

    // The cumulative amount of in-app time that hasn't been simulated yet.
    // See the comments inside animate() for details.
    this.frameDelta = 0;

    // The timestamp in milliseconds of the last time the main loop was run.
    // Used to compute the time elapsed between frames.
    this.lastFrameTimeMs = 0;

    // An exponential moving average of the frames per secondthis..
    this.fps = 60;

    // The timestamp (in milliseconds) of the last time the `fps` moving
    // average was updated.
    this.lastFpsUpdate = 0;

    // The number of frames delivered in the current second.
    this.framesThisSecond = 0;

    // The number of times update() is called in a given frame. This is only
    // relevant inside of animate(), but a reference is held externally so that
    // this variable is not marked for garbage collection every time the main
    // loop runs.
    this.numUpdateSteps = 0;

    // The minimum amount of time in milliseconds that must pass since the last
    // frame was executed before another frame can be executed. The
    // multiplicative inverse caps the FPS (the default of zero means there is
    // no cap).
    this.minFrameDelay = 0;

    // Whether the main loop is running.
    this.running = false;

    this.paused = false;

    // `true` if `MainLoop.start()` has been called and the most recent time it
    // was called has not been followed by a call to `MainLoop.stop()`. This is
    // different than `running` because there is a delay of a few milliseconds
    // after `MainLoop.start()` is called before the application is considered
    // "running." This delay is due to waiting for the next frame.
    this.started = false;

    // Whether the simulation has fallen too far behind real time.
    // Specifically, `panic` will be set to `true` if too many updates occur in
    // one frame. This is only relevant inside of animate(), but a reference is
    // held externally so that this variable is not marked for garbage
    // collection every time the main loop runs.
    this.panic = false;

    // The ID of the currently executing frame. Used to cancel frames when
    // stopping the loop.
    this.rafHandle;

    /**
     * The main loop that runs updates and rendering.
     *
     * @param {DOMHighResTimeStamp} timestamp
     *   The current timestamp. In practice this is supplied by
     *   requestAnimationFrame at the time that it starts to fire callbacks. This
     *   should only be used for comparison to other timestamps because the epoch
     *   (i.e. the "zero" time) depends on the engine running this code. In engines
     *   that support `DOMHighResTimeStamp` (all modern browsers except iOS Safari
     *   8) the epoch is the time the page started loading, specifically
     *   `performance.timing.navigationStart`. Everywhere else, including node.js,
     *   the epoch is the Unix epoch (1970-01-01T00:00:00Z).
     *
     * @ignore
     */
    this.animate = function (timestamp) {
      // Run the loop again the next time the browser is ready to render.
      // We set rafHandle immediately so that the next frame can be canceled
      // during the current frame.
      _this.rafHandle = requestAnimationFrame(_this.animate);

      // Throttle the frame rate (if minFrameDelay is set to a non-zero value by
      // `MainLoop.setMaxAllowedFPS()`).
      if (timestamp < _this.lastFrameTimeMs + _this.minFrameDelay) {
        return;
      }

      // frameDelta is the cumulative amount of in-app time that hasn't been
      // simulated yet. Add the time since the last frame. We need to track total
      // not-yet-simulated time (as opposed to just the time elapsed since the
      // last frame) because not all actually elapsed time is guaranteed to be
      // simulated each frame. See the comments below for details.
      _this.frameDelta += timestamp - _this.lastFrameTimeMs;
      _this.lastFrameTimeMs = timestamp;

      // Run any updates that are not dependent on time in the simulation. See
      // `MainLoop.setBegin()` for additional details on how to use this.
      _this.emit('begin', timestamp, _this.frameDelta);

      // Update the estimate of the frame rate, `fps`. Every second, the number
      // of frames that occurred in that second are included in an exponential
      // moving average of all frames per second, with an alpha of 0.25. This
      // means that more recent seconds affect the estimated frame rate more than
      // older seconds.
      if (timestamp > _this.lastFpsUpdate + 1000) {
        // Compute the new exponential moving average with an alpha of 0.25.
        // Using constants inline is okay here.
        _this.fps = 0.25 * _this.framesThisSecond + 0.75 * _this.fps;

        _this.lastFpsUpdate = timestamp;
        _this.framesThisSecond = 0;
      }

      _this.framesThisSecond++;

      /*
      * A naive way to move an object along its X-axis might be to write a main
      * loop containing the statement `obj.x += 10;` which would move the object
      * 10 units per frame. This approach suffers from the issue that it is
      * dependent on the frame rate. In other words, if your application is
      * running slowly (that is, fewer frames per second), your object will also
      * appear to move slowly, whereas if your application is running quickly
      * (that is, more frames per second), your object will appear to move
      * quickly. This is undesirable, especially in multiplayer/multi-user
      * applications.
      *
      * One solution is to multiply the speed by the amount of time that has
      * passed between rendering frames. For example, if you want your object to
      * move 600 units per second, you might write `obj.x += 600 * delta`, where
      * `delta` is the time passed since the last frame. (For convenience, let's
      * move this statement to an update() function that takes `delta` as a
      * parameter.) This way, your object will move a constant distance over
      * time. However, at low frame rates and high speeds, your object will move
      * large distances every frame, which can cause it to do strange things
      * such as move through walls. Additionally, we would like our program to
      * be deterministic. That is, every time we run the application with the
      * same input, we would like exactly the same output. If the time between
      * frames (the `delta`) varies, our output will diverge the longer the
      * program runs due to accumulated rounding errors, even at normal frame
      * rates.
      *
      * A better solution is to separate the amount of time simulated in each
      * update() from the amount of time between frames. Our update() function
      * doesn't need to change; we just need to change the delta we pass to it
      * so that each update() simulates a fixed amount of time (that is, `delta`
      * should have the same value each time update() is called). The update()
      * function can be run multiple times per frame if needed to simulate the
      * total amount of time passed since the last frame. (If the time that has
      * passed since the last frame is less than the fixed simulation time, we
      * just won't run an update() until the the next frame. If there is
      * unsimulated time left over that is less than our timestep, we'll just
      * leave it to be simulated during the next frame.) This approach avoids
      * inconsistent rounding errors and ensures that there are no giant leaps
      * through walls between frames.
      *
      * That is what is done below. It introduces a new problem, but it is a
      * manageable one: if the amount of time spent simulating is consistently
      * longer than the amount of time between frames, the application could
      * freeze and crash in a spiral of death. This won't happen as long as the
      * fixed simulation time is set to a value that is high enough that
      * update() calls usually take less time than the amount of time they're
      * simulating. If it does start to happen anyway, see `MainLoop.setEnd()`
      * for a discussion of ways to stop it.
      *
      * Additionally, see `MainLoop.setUpdate()` for a discussion of performance
      * considerations.
      *
      * Further reading for those interested:
      *
      * - http://gameprogrammingpatterns.com/game-loop.html
      * - http://gafferongames.com/game-physics/fix-your-timestep/
      * - https://gamealchemist.wordpress.com/2013/03/16/thoughts-on-the-javascript-game-loop/
      * - https://developer.mozilla.org/en-US/docs/Games/Anatomy
      */
      var numUpdateSteps = 0;
      while (_this.frameDelta >= _this.simulationTimestep) {
        _this.emit('update', _this.simulationTimestep);
        _this.frameDelta -= _this.simulationTimestep;

        /*
        * Sanity check: bail if we run the loop too many times.
        *
        * One way this could happen is if update() takes longer to run than
        * the time it simulates, thereby causing a spiral of death. For ways
        * to avoid this, see `MainLoop.setEnd()`. Another way this could
        * happen is if the browser throttles serving frames, which typically
        * occurs when the tab is in the background or the device battery is
        * low. An event outside of the main loop such as audio processing or
        * synchronous resource reads could also cause the application to hang
        * temporarily and accumulate not-yet-simulated time as a result.
        *
        * 240 is chosen because, for any sane value of simulationTimestep, 240
        * updates will simulate at least one second, and it will simulate four
        * seconds with the default value of simulationTimestep. (Safari
        * notifies users that the script is taking too long to run if it takes
        * more than five seconds.)
        *
        * If there are more updates to run in a frame than this, the
        * application will appear to slow down to the user until it catches
        * back up. In networked applications this will usually cause the user
        * to get out of sync with their peers, but if the updates are taking
        * this long already, they're probably already out of sync.
        */
        if (++numUpdateSteps >= 240) {
          _this.panic = true;

          break;
        }
      }

      /*
      * Render the screen. We do this regardless of whether update() has run
      * during this frame because it is possible to interpolate between updates
      * to make the frame rate appear faster than updates are actually
      * happening. See `MainLoop.setDraw()` for an explanation of how to do
      * that.
      *
      * We draw after updating because we want the screen to reflect a state of
      * the application that is as up-to-date as possible. (`MainLoop.start()`
      * draws the very first frame in the application's initial state, before
      * any updates have occurred.) Some sources speculate that rendering
      * earlier in the requestAnimationFrame callback can get the screen painted
      * faster; this is mostly not true, and even when it is, it's usually just
      * a trade-off between rendering the current frame sooner and rendering the
      * next frame later.
      *
      * See `MainLoop.setDraw()` for details about draw() itself.
      */
      _this.emit('draw', _this.frameDelta / _this.simulationTimestep);

      // Run any updates that are not dependent on time in the simulation. See
      // `MainLoop.setEnd()` for additional details on how to use this.
      _this.emit('end', _this.fps, _this.panic);

      _this.panic = false;
    };
  },

  methods: {
    /**
     * Gets how many milliseconds should be simulated by every run of update().
     *
     * See `MainLoop.setSimulationTimestep()` for details on this value.
     *
     * @memberof Ticker#
     * @return {Number}
     *   The number of milliseconds that should be simulated by every run of
     *   {@link #setUpdate update}().
     */
    getSimulationTimestep: function getSimulationTimestep() {
      return this.simulationTimestep;
    },

    /**
     * Sets how many milliseconds should be simulated by every run of update().
     *
     * The perceived frames per second (FPS) is effectively capped at the
     * multiplicative inverse of the simulation timestep. That is, if the
     * timestep is 1000 / 60 (which is the default), then the maximum perceived
     * FPS is effectively 60. Decreasing the timestep increases the maximum
     * perceived FPS at the cost of running {@link #setUpdate update}() more
     * times per frame at lower frame rates. Since running update() more times
     * takes more time to process, this can actually slow down the frame rate.
     * Additionally, if the amount of time it takes to run update() exceeds or
     * very nearly exceeds the timestep, the application will freeze and crash
     * in a spiral of death (unless it is rescued; see `MainLoop.setEnd()` for
     * an explanation of what can be done if a spiral of death is occurring).
     *
     * The exception to this is that interpolating between updates for each
     * render can increase the perceived frame rate and reduce visual
     * stuttering. See `MainLoop.setDraw()` for an explanation of how to do
     * this.
     *
     * If you are considering decreasing the simulation timestep in order to
     * raise the maximum perceived FPS, keep in mind that most monitors can't
     * display more than 60 FPS. Whether humans can tell the difference among
     * high frame rates depends on the application, but for reference, film is
     * usually displayed at 24 FPS, other videos at 30 FPS, most games are
     * acceptable above 30 FPS, and virtual reality might require 75 FPS to
     * feel natural. Some gaming monitors go up to 144 FPS. Setting the
     * timestep below 1000 / 144 is discouraged and below 1000 / 240 is
     * strongly discouraged. The default of 1000 / 60 is good in most cases.
     *
     * The simulation timestep should typically only be changed at
     * deterministic times (e.g. before the main loop starts for the first
     * time, and not in response to user input or slow frame rates) to avoid
     * introducing non-deterministic behavior. The update timestep should be
     * the same for all players/users in multiplayer/multi-user applications.
     *
     * See also `MainLoop.getSimulationTimestep()`.
     *
     * @memberof Ticker#
     * @param {Number} timestep
     *   The number of milliseconds that should be simulated by every run of
     *   {@link #setUpdate update}().
     */
    setSimulationTimestep: function setSimulationTimestep(timestep) {
      this.simulationTimestep = timestep;

      return this;
    },

    /**
     * Returns the exponential moving average of the frames per second.
     *
     * @memberof Ticker#
     * @return {Number}
     *   The exponential moving average of the frames per second.
     */
    getFPS: function getFPS() {
      return this.fps;
    },

    /**
     * Gets the maximum frame rate.
     *
     * Other factors also limit the FPS; see `MainLoop.setSimulationTimestep`
     * for details.
     *
     * See also `MainLoop.setMaxAllowedFPS()`.
     *
     * @memberof Ticker#
     * @return {Number}
     *   The maximum number of frames per second allowed.
     */
    getMaxAllowedFPS: function getMaxAllowedFPS() {
      return 1000 / this.minFrameDelay;
    },


    /**
     * Sets a maximum frame rate.
     *
     * See also `MainLoop.getMaxAllowedFPS()`.
     *
     * @memberof Ticker#
     * @param {Number} [fps=Infinity]
     *   The maximum number of frames per second to execute. If Infinity or not
     *   passed, there will be no FPS cap (although other factors do limit the
     *   FPS; see `MainLoop.setSimulationTimestep` for details). If zero, this
     *   will stop the loop, and when the loop is next started, it will return
     *   to the previous maximum frame rate. Passing negative values will stall
     *   the loop until this function is called again with a positive value.
     *
     * @chainable
     */
    setMaxAllowedFPS: function setMaxAllowedFPS(fps) {
      if (typeof fps === 'undefined') {
        this.fps = Infinity;
      }

      if (fps === 0) {
        this.stop();
      } else {
        // Dividing by Infinity returns zero.
        this.minFrameDelay = 1000 / fps;
      }

      return this;
    },


    /**
     * Reset the amount of time that has not yet been simulated to zero.
     *
     * This introduces non-deterministic behavior if called after the
     * application has started running (unless it is being reset, in which case
     * it doesn't matter). However, this can be useful in cases where the
     * amount of time that has not yet been simulated has grown very large
     * (for example, when the application's tab gets put in the background and
     * the browser throttles the timers as a result). In applications with
     * lockstep the player would get dropped, but in other networked
     * applications it may be necessary to snap or ease the player/user to the
     * authoritative state and discard pending updates in the process. In
     * non-networked applications it may also be acceptable to simply resume
     * the application where it last left off and ignore the accumulated
     * unsimulated time.
     *
     * @memberof Ticker#
     * @return {Number}
     *   The cumulative amount of elapsed time in milliseconds that has not yet
     *   been simulated, but is being discarded as a result of calling this
     *   function.
     */
    resetFrameDelta: function resetFrameDelta() {
      var oldFrameDelta = this.frameDelta;
      this.frameDelta = 0;
      return oldFrameDelta;
    },

    /**
     * Starts the main loop.
     *
     * Note that the application is not considered "running" immediately after
     * this function returns; rather, it is considered "running" after the
     * application draws its first frame. The distinction is that event
     * handlers should remain paused until the application is running, even
     * after `MainLoop.start()` is called. Check `MainLoop.isRunning()` for the
     * current status. To act after the application starts, register a callback
     * with requestAnimationFrame() after calling this function and execute the
     * action in that callback. It is safe to call `MainLoop.start()` multiple
     * times even before the application starts running and without calling
     * `MainLoop.stop()` in between, although there is no reason to do this;
     * the main loop will only start if it is not already started.
     *
     * See also `MainLoop.stop()`.
     *
     * @memberof Ticker#
     */
    start: function start() {
      var _this2 = this;

      if (!this.started) {
        // Since the application doesn't start running immediately, track
        // whether this function was called and use that to keep it from
        // starting the main loop multiple times.
        this.started = true;

        // In the main loop, draw() is called after update(), so if we
        // entered the main loop immediately, we would never render the
        // initial state before any updates occur. Instead, we run one
        // frame where all we do is draw, and then start the main loop with
        // the next frame.
        this.rafHandle = requestAnimationFrame(function (timestamp) {
          // Render the initial state before any updates occur.
          _this2.emit('draw', 1);

          // The application isn't considered "running" until the
          // application starts drawing.
          _this2.running = true;

          // Reset variables that are used for tracking time so that we
          // don't simulate time passed while the application was paused.
          _this2.lastFrameTimeMs = timestamp;
          _this2.lastFpsUpdate = timestamp;
          _this2.framesThisSecond = 0;

          // Start the main loop.
          _this2.rafHandle = requestAnimationFrame(_this2.animate);
        });
      }

      return this;
    },


    /**
     * Stops the main loop.
     *
     * Event handling and other background tasks should also be paused when the
     * main loop is paused.
     *
     * Note that pausing in multiplayer/multi-user applications will cause the
     * player's/user's client to become out of sync. In this case the
     * simulation should exit, or the player/user needs to be snapped to their
     * updated position when the main loop is started again.
     *
     * See also `MainLoop.start()` and `MainLoop.isRunning()`.
     *
     * @memberof Ticker#
     */
    stop: function stop() {
      this.running = false;
      this.started = false;
      cancelAnimationFrame(this.rafHandle);

      return this;
    },
    pause: function pause() {
      if (this.isRunning() && !this.paused) {
        this.paused = true;
        this.stop();
      }

      return this;
    },
    resume: function resume() {
      if (this.paused) {
        this.paused = false;
        this.start();
      }

      return this;
    },

    /**
     * Returns whether the main loop is currently running.
     *
     * See also `MainLoop.start()` and `MainLoop.stop()`.
     *
     * @memberof Ticker#
     * @return {Boolean}
     *   Whether the main loop is currently running.
     */
    isRunning: function isRunning() {
      return this.running;
    }
  }
}, _EventEmitter2.default);

exports.default = Ticker;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpers = __webpack_require__(1);

var _stampit = __webpack_require__(0);

var _stampit2 = _interopRequireDefault(_stampit);

var _fastbitset = __webpack_require__(28);

var _fastbitset2 = _interopRequireDefault(_fastbitset);

var _fastArray = __webpack_require__(10);

var _fastArray2 = _interopRequireDefault(_fastArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Used to perform matching of entities.
 *
 * @example
 * //matches entities with 'Position' and 'Velocity' components
 * const q1 = Query({
 *   criterions: ["Position", "Velocity"],
 * });
 *
 * //matches entities with 'Position' and 'Velocity' components and without 'Sprite' component
 * const q2 = Query({
 *   criterions: {
 *     include: ["Position", "Velocity"],
 *     exclude: ["Sprite"],
 *   },
 * });
 *
 * //matches entities of type 'Ball'
 * const q3 = Query({
 *   criterions: {
 *     entityType: "Ball",
 *   },
 * });
 *
 * @class Query
 * @param {Object}       opts
 * @param {Object|Array} opts.criterions query criterions
 */
var Query = (0, _stampit2.default)({
  deepProps: {
    _shouldUpdate: false
  },
  init: function init(opts) {
    var include = [];
    var exclude = [];
    var includeBitset = void 0;
    var excludeBitset = void 0;

    if ((0, _helpers.isArray)(opts.criterions)) {
      include = opts.criterions;
    } else if ((0, _helpers.isObject)(opts.criterions)) {
      if ((0, _helpers.isNonEmptyString)(opts.criterions.entityType)) {
        this._matchType = opts.criterions.entityType;
      }

      if ((0, _helpers.isArray)(opts.criterions.include)) {
        include = opts.criterions.include;
      }

      if ((0, _helpers.isArray)(opts.criterions.exclude)) {
        exclude = opts.criterions.exclude;
      }
    }

    if (include.length > 0) {
      includeBitset = new _fastbitset2.default();
      for (var i = 0; i < include.length; i += 1) {
        includeBitset.add(opts.componentsIdsMap[include[i]]);
      }
    }

    if (exclude) {
      excludeBitset = new _fastbitset2.default();
      for (var e = 0; e < exclude.length; e += 1) {
        excludeBitset.add(opts.componentsIdsMap[exclude[e]]);
      }
    }

    this._entitiesIndex = (0, _fastArray2.default)();
    this._matchedEntities = (0, _fastArray2.default)();

    this._result = {
      entities: this._matchedEntities.arr,
      length: 0
    };

    this._includes = includeBitset;
    this._excludes = excludeBitset;
  },

  methods: {
    /**
     * Initializes query. Builds initial entities index.
     *
     * @public
     * @memberof Query#
     * @method initialize
     * @param {FastArray} allEntities fast array of all entities present in the engine
     */
    initialize: function initialize(allEntities) {
      for (var i = 0; i < allEntities.length; i += 1) {
        var entity = allEntities.arr[i];

        if (entity !== 0 && this.satisfiedBy(entity)) {
          this.addToIndex(entity.id);
        }
      }

      this.update(allEntities);
    },

    /**
     * Checks if entity satisfies query criterions.
     *
     * @public
     * @memberof Query#
     * @method satisfiedBy
     * @param {Entity} entity entity to check
     */
    satisfiedBy: function satisfiedBy(entity) {
      var satisfies = true;

      if ((0, _helpers.isString)(this._matchType)) {
        satisfies = entity.type === this._matchType;
      }

      if (satisfies && this._includes) {
        satisfies = this._includes.intersection_size(entity.bitset) === this._includes.size();
      }

      if (satisfies && this._excludes) {
        satisfies = this._excludes.intersection_size(entity.bitset) === 0;
      }

      return satisfies;
    },

    /**
     * Checks if query should update.
     *
     * Query should update when entities matching its criterions are added or removed from engine.
     * It should also update when entity that was matching criterions has changed and doesn't match it anymore.
     *
     * @public
     * @memberof Query#
     * @method shouldUpdate
     */
    shouldUpdate: function shouldUpdate() {
      return this._shouldUpdate;
    },

    /**
     * Adds entity ID to query index.
     *
     * @public
     * @memberof Query#
     * @method addToIndex
     * @param {Number} entityId
     */
    addToIndex: function addToIndex(entityId) {
      this._shouldUpdate = true;
      this._entitiesIndex.push(entityId);
    },

    /**
     * Removes entity ID from query index.
     *
     * @public
     * @memberof Query#
     * @method removeFromIndex
     * @param {Number} entityId
     */
    removeFromIndex: function removeFromIndex(entityId) {
      var indexOfEntity = this._entitiesIndex.indexOf(entityId);

      if (indexOfEntity !== -1) {
        this._shouldUpdate = true;
        this._entitiesIndex.unsetAtIndex(indexOfEntity);
      }
    },

    /**
     * Returns entities matched by query.
     *
     * Returns object with following properties:
     * - `length` - number of matched entities
     * - `entities` - array with matched entities. __This array length is usually not the same as matched entities number!__
     *
     * @public
     * @memberof Query#
     * @method getEntities
     * @returns {Object}
     */
    getEntities: function getEntities() {
      this._result.length = this._matchedEntities.length;
      return this._result;
    },

    /**
     * Updates internal matched entities with index.
     *
     * @public
     * @memberof Query#
     * @method update
     * @param {FastArray} allEntities fast array of all entities present in the engine
     */
    update: function update(allEntities) {
      if (!this._shouldUpdate) {
        return;
      }

      this._entitiesIndex.compact();
      this._matchedEntities.clear();

      for (var i = 0; i < this._entitiesIndex.length; i += 1) {
        var entityId = this._entitiesIndex.arr[i];

        this._matchedEntities.push(allEntities.arr[entityId]);
      }

      this._shouldUpdate = false;
    }
  }
});

exports.default = Query;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stampit = __webpack_require__(0);

var _pickBy = __webpack_require__(18);

var _pickBy2 = _interopRequireDefault(_pickBy);

var _helpers = __webpack_require__(1);

var _Entity = __webpack_require__(140);

var _Entity2 = _interopRequireDefault(_Entity);

var _Pool = __webpack_require__(17);

var _Pool2 = _interopRequireDefault(_Pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Centralized place for registering, creating and reusing entities.
 *
 * __For internal use only!__
 *
 * @class EntityStore
 * @param {Object}          opts
 * @param {Entropy}         opts.game
 * @param {ComponentStore}  opts.componentStore
 */
var EntityStore = (0, _stampit.compose)({
  init: function init(_ref) {
    var game = _ref.game;

    /**
     * Object with different pool for each entity type.
     * Entity type is a key and {@link Pool} instance is a value.
     *
     * @private
     * @memberOf EntityStore#
     * @name _pools
     * @type Object
     */
    this._pools = {};

    /**
     * Object with factories for entity types.
     *
     * @private
     * @memberOf EntityStore#
     * @name _factories
     * @type Object
     */
    this._factories = {};

    /**
     * Game instance injected to constructor.
     *
     * @public
     * @memberOf EntityStore#
     * @name game
     * @type Entropy
     */
    this.game = game;
  },

  methods: {
    /**
     * Registers entity. Entity has to be registered before it can be created.
     *
     * @example
     * game.entity.register({
     *   type: 'Ball',
     *   onCreate(x, y, texture) {
     *     const sprite = Sprite(texture);
     *
     *     this.addComponent('Position', x, y);
     *     this.addComponent('Sprite', sprite);
     *
     *     // add sprite to stage for renderer (when using PIXI this has to be done)
     *     this.game.stage.addChild(sprite);
     *   },
     *   onRemove() {
     *     this.game.stage.removeChild(this.components.sprite.sprite);
     *   },
     * });
     *
     * const c = game.entity.create('Ball', 1, 2, 'ball.png');
     *
     * @public
     * @memberof EntityStore#
     * @method register
     * @param {Object}    descriptor            object describing entity
     * @param {String}    descriptor.type       type of entity
     * @param {Function}  descriptor.onCreate   method called when entity is created (may be recycled from pool)
     * @param {Function}  descriptor.onReuse    method called when entity is reused from pool (called before `onCreate`)
     * @param {Function}  descriptor.onRemove   method called when entity is removed (usually it returns to a pool)
     */
    register: function register(descriptor) {
      var _this = this;

      this._factories[descriptor.type] = (0, _stampit.compose)(_Entity2.default, {
        methods: (0, _pickBy2.default)(descriptor, function (value) {
          return (0, _helpers.isFunction)(value);
        })
      });

      this._pools[descriptor.type] = (0, _Pool2.default)({
        _new: function _new() {
          var entity = _this._factories[descriptor.type]({
            game: _this.game,
            type: descriptor.type
          });

          entity.onCreate.apply(entity, arguments);

          return entity;
        },
        _reuse: function _reuse(entity) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          entity.onReuse();
          entity.onCreate.apply(entity, args);

          return entity;
        }
      });
    },

    /**
     * Registeres many entities.
     *
     * @public
     * @memberof EntityStore#
     * @method registerMany
     * @param  {Array} descriptiors array of entity's descriptors (see {@link EntityStore#register})
     */
    registerMany: function registerMany(descriptors) {
      var _this2 = this;

      descriptors.forEach(function (descriptor) {
        return _this2.register(descriptor);
      });
    },

    /**
     * Creates new entity instance or acquires one from pool.
     *
     * @public
     * @memberof EntityStore#
     * @method create
     * @param  {String} type    type of entity to create
     * @param  {...Any} ...args arguments passed to `onCreate` method
     * @return {Entity}         new (or reused) entity ready to be added to engine
     */
    create: function create(type) {
      var _pools$type;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return (_pools$type = this._pools[type]).allocate.apply(_pools$type, args);
    },

    /**
     * Frees entity. Entity is added to the pool. Marks entity as recyceled.
     *
     * _This method is called internally by the engine, user should not call it._
     *
     * @public
     * @memberof EntityStore#
     * @method free
     * @param  {Entity} entity entity
     */
    free: function free(entity) {
      entity.markAsRecycled();

      this._pools[entity.type].free(entity);
    }
  }
});

exports.default = EntityStore;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var baseMatches = __webpack_require__(58),
    baseMatchesProperty = __webpack_require__(115),
    identity = __webpack_require__(125),
    isArray = __webpack_require__(3),
    property = __webpack_require__(126);

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
    return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseIsMatch = __webpack_require__(59),
    getMatchData = __webpack_require__(114),
    matchesStrictComparable = __webpack_require__(50);

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function (object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Stack = __webpack_require__(30),
    baseIsEqual = __webpack_require__(34);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack();
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result)) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assocIndexOf = __webpack_require__(12);

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assocIndexOf = __webpack_require__(12);

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assocIndexOf = __webpack_require__(12);

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assocIndexOf = __webpack_require__(12);

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ListCache = __webpack_require__(11);

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache();
  this.size = 0;
}

module.exports = stackClear;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ListCache = __webpack_require__(11),
    Map = __webpack_require__(20),
    MapCache = __webpack_require__(21);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isFunction = __webpack_require__(31),
    isMasked = __webpack_require__(73),
    isObject = __webpack_require__(7),
    toSource = __webpack_require__(33);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Symbol = __webpack_require__(13);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var coreJsData = __webpack_require__(74);

/** Used to detect methods masquerading as native. */
var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

module.exports = isMasked;

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var root = __webpack_require__(2);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Hash = __webpack_require__(77),
    ListCache = __webpack_require__(11),
    Map = __webpack_require__(20);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash(),
    'map': new (Map || ListCache)(),
    'string': new Hash()
  };
}

module.exports = mapCacheClear;

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hashClear = __webpack_require__(78),
    hashDelete = __webpack_require__(79),
    hashGet = __webpack_require__(80),
    hashHas = __webpack_require__(81),
    hashSet = __webpack_require__(82);

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var nativeCreate = __webpack_require__(14);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var nativeCreate = __webpack_require__(14);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var nativeCreate = __webpack_require__(14);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var nativeCreate = __webpack_require__(14);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getMapData = __webpack_require__(15);

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}

module.exports = isKeyable;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getMapData = __webpack_require__(15);

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getMapData = __webpack_require__(15);

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getMapData = __webpack_require__(15);

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Stack = __webpack_require__(30),
    equalArrays = __webpack_require__(35),
    equalByTag = __webpack_require__(94),
    equalObjects = __webpack_require__(98),
    getTag = __webpack_require__(109),
    isArray = __webpack_require__(3),
    isBuffer = __webpack_require__(43),
    isTypedArray = __webpack_require__(45);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack());
    return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack());
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var MapCache = __webpack_require__(21),
    setCacheAdd = __webpack_require__(90),
    setCacheHas = __webpack_require__(91);

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
    var index = -1,
        length = values == null ? 0 : values.length;

    this.__data__ = new MapCache();
    while (++index < length) {
        this.add(values[index]);
    }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Symbol = __webpack_require__(13),
    Uint8Array = __webpack_require__(95),
    eq = __webpack_require__(19),
    equalArrays = __webpack_require__(35),
    mapToArray = __webpack_require__(96),
    setToArray = __webpack_require__(97);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == other + '';

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var root = __webpack_require__(2);

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getAllKeys = __webpack_require__(99);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseGetAllKeys = __webpack_require__(36),
    getSymbols = __webpack_require__(38),
    keys = __webpack_require__(40);

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseGetTag = __webpack_require__(6),
    isObjectLike = __webpack_require__(8);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseGetTag = __webpack_require__(6),
    isLength = __webpack_require__(23),
    isObjectLike = __webpack_require__(8);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}

module.exports = baseUnary;

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var freeGlobal = __webpack_require__(32);

/** Detect free variable `exports`. */
var freeExports = ( false ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && ( false ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = function () {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}();

module.exports = nodeUtil;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(44)(module)))

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isPrototype = __webpack_require__(46),
    nativeKeys = __webpack_require__(108);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var overArg = __webpack_require__(47);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DataView = __webpack_require__(110),
    Map = __webpack_require__(20),
    Promise = __webpack_require__(111),
    Set = __webpack_require__(112),
    WeakMap = __webpack_require__(113),
    baseGetTag = __webpack_require__(6),
    toSource = __webpack_require__(33);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
    getTag = function getTag(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
            switch (ctorString) {
                case dataViewCtorString:
                    return dataViewTag;
                case mapCtorString:
                    return mapTag;
                case promiseCtorString:
                    return promiseTag;
                case setCtorString:
                    return setTag;
                case weakMapCtorString:
                    return weakMapTag;
            }
        }
        return result;
    };
}

module.exports = getTag;

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getNative = __webpack_require__(4),
    root = __webpack_require__(2);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getNative = __webpack_require__(4),
    root = __webpack_require__(2);

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getNative = __webpack_require__(4),
    root = __webpack_require__(2);

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getNative = __webpack_require__(4),
    root = __webpack_require__(2);

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isStrictComparable = __webpack_require__(49),
    keys = __webpack_require__(40);

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
    var result = keys(object),
        length = result.length;

    while (length--) {
        var key = result[length],
            value = object[key];

        result[length] = [key, value, isStrictComparable(value)];
    }
    return result;
}

module.exports = getMatchData;

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseIsEqual = __webpack_require__(34),
    get = __webpack_require__(116),
    hasIn = __webpack_require__(122),
    isKey = __webpack_require__(25),
    isStrictComparable = __webpack_require__(49),
    matchesStrictComparable = __webpack_require__(50),
    toKey = __webpack_require__(9);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function (object) {
    var objValue = get(object, path);
    return objValue === undefined && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseGet = __webpack_require__(24);

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var memoizeCapped = __webpack_require__(118);

/** Used to match property names within property paths. */
var reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function (string) {
  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function (match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
  });
  return result;
});

module.exports = stringToPath;

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var memoize = __webpack_require__(119);

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function (key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var MapCache = __webpack_require__(21);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function memoized() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseToString = __webpack_require__(121);

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Symbol = __webpack_require__(13),
    arrayMap = __webpack_require__(29),
    isArray = __webpack_require__(3),
    isSymbol = __webpack_require__(26);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}

module.exports = baseToString;

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseHasIn = __webpack_require__(123),
    hasPath = __webpack_require__(124);

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var castPath = __webpack_require__(16),
    isArguments = __webpack_require__(42),
    isArray = __webpack_require__(3),
    isIndex = __webpack_require__(22),
    isLength = __webpack_require__(23),
    toKey = __webpack_require__(9);

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
}

module.exports = hasPath;

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseProperty = __webpack_require__(127),
    basePropertyDeep = __webpack_require__(128),
    isKey = __webpack_require__(25),
    toKey = __webpack_require__(9);

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function (object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseGet = __webpack_require__(24);

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function (object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseGet = __webpack_require__(24),
    baseSet = __webpack_require__(130),
    castPath = __webpack_require__(16);

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, paths, predicate) {
    var index = -1,
        length = paths.length,
        result = {};

    while (++index < length) {
        var path = paths[index],
            value = baseGet(object, path);

        if (predicate(value, path)) {
            baseSet(result, castPath(path, object), value);
        }
    }
    return result;
}

module.exports = basePickBy;

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assignValue = __webpack_require__(131),
    castPath = __webpack_require__(16),
    isIndex = __webpack_require__(22),
    isObject = __webpack_require__(7),
    toKey = __webpack_require__(9);

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

module.exports = baseSet;

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseAssignValue = __webpack_require__(132),
    eq = __webpack_require__(19);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defineProperty = __webpack_require__(133);

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getNative = __webpack_require__(4);

var defineProperty = function () {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}();

module.exports = defineProperty;

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var baseGetAllKeys = __webpack_require__(36),
    getSymbolsIn = __webpack_require__(135),
    keysIn = __webpack_require__(137);

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var arrayPush = __webpack_require__(37),
    getPrototype = __webpack_require__(136),
    getSymbols = __webpack_require__(38),
    stubArray = __webpack_require__(39);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function (object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var overArg = __webpack_require__(47);

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var arrayLikeKeys = __webpack_require__(41),
    baseKeysIn = __webpack_require__(138),
    isArrayLike = __webpack_require__(48);

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isObject = __webpack_require__(7),
    isPrototype = __webpack_require__(46),
    nativeKeysIn = __webpack_require__(139);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stampit = __webpack_require__(0);

var _stampit2 = _interopRequireDefault(_stampit);

var _helpers = __webpack_require__(1);

var _fastbitset = __webpack_require__(28);

var _fastbitset2 = _interopRequireDefault(_fastbitset);

var _fastArray = __webpack_require__(10);

var _fastArray2 = _interopRequireDefault(_fastArray);

var _EventEmitter = __webpack_require__(5);

var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Entity factory.
 *
 * @class Entity
 */
var Entity = (0, _stampit2.default)({
  init: function init(opts) {
    this._modifications = (0, _fastArray2.default)();
    this._used = false;

    this.game = opts.game;
    this.type = opts.type;
    this.id = 0;
    this.bitset = new _fastbitset2.default();
    this.components = this.cs = {};
  },

  methods: {
    /**
     * Called when entity is created. Could be overriden (see {@link EntityStore#register}).
     *
     * @memberof Entity#
     */
    onCreate: function onCreate() {},

    /**
     * Called when entity is removed. Could be overriden (see {@link EntityStore#register}).
     *
     * @memberof Entity#
     */
    onRemove: function onRemove() {},

    /**
     * Called when entity is reused from pool. Could be overriden (see {@link EntityStore#register}).
     *
     * @memberof Entity#
     */
    onReuse: function onReuse() {},
    onComponentRemove: function onComponentRemove() {},

    /**
     * Adds new component to entity.
     *
     * If first argument is component type, component is either created from scratch or reused from pool. In latter case, component's pattern `onReuse` method is called (if present).
     * Component patterns `onCreate` method is called with additional arguments passed to `add` method.
     * If entity is already added to the system (has id greater than 0) addition doesn't happen immediately, but is postponed to nearest update cycle.
     *
     * @example
     * // `this` is a reference to Entity instance
     * // code like this can be seen in entity's `onCreate` method
     * this.add('Position', 1, 1);
     *
     * // or
     *
     * this.add(game.createComponent('Position', 1, 1));
     *
     * @memberof Entity#
     * @param {String|Component} componentTypeOrComponent component instance or component type
     * @param {...Any} args arguments passed to `onCreate` method of component
     * @return {Entity} Entity instance
     */
    addComponent: function addComponent(componentTypeOrComponent) {
      var _game$component,
          _this = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var componentToAdd = (0, _helpers.isObject)(componentTypeOrComponent) ? componentTypeOrComponent : (_game$component = this.game.component).create.apply(_game$component, [componentTypeOrComponent].concat(args));

      // if entity id equals 0, it has not yet been added to the system, so we can safely modify it
      if (this.id === 0) {
        this._addComponent(componentToAdd);
      } else {
        this._modifications.push({
          fn: function fn() {
            _this._addComponent(componentToAdd);
          }
        });

        this.emit('queuedModification', this);
      }

      // return `this` for easy chaining of `add` calls
      return this;
    },
    _addComponent: function _addComponent(componentToAdd) {
      this.components[componentToAdd._propName] = componentToAdd;

      this.bitset.add(componentToAdd._id);

      this.emit('componentAdd', this, componentToAdd);
    },

    /**
     * Removes component.
     *
     * @memberof Entity#
     */
    removeComponent: function removeComponent(componentType) {
      var _this2 = this;

      var componentPropName = (0, _helpers.toLowerFirstCase)(componentType);
      var componentToRemove = this.components[componentPropName];

      if (this.id === 0) {
        this._removeComponent(componentToRemove);
      } else {
        this._modifications.push({
          fn: function fn() {
            _this2._removeComponent(componentToRemove);
          }
        });

        this.emit('queueModification', this);
      }

      return this;
    },
    removeAllComponents: function removeAllComponents() {
      var _this3 = this;

      Object.keys(this.components).forEach(function (propName) {
        return _this3.removeComponent(propName);
      });
    },
    _removeComponent: function _removeComponent(componentToRemove) {
      this.game.component.free(componentToRemove);
      this.components[componentToRemove._propName] = null;
      this.bitset.remove(componentToRemove._id);
      this.onComponentRemove(componentToRemove);
    },
    applyModifications: function applyModifications() {
      while (this._modifications.length) {
        var modification = this._modifications.shift();

        modification.fn();
      }
    },
    clearModifications: function clearModifications() {
      this._modifications.clear();
    },
    is: function is(type) {
      return this.type === type;
    },
    markAsRecycled: function markAsRecycled() {
      this._used = true;
    },
    isRecycled: function isRecycled() {
      return this._used;
    }
  }
}).compose(_EventEmitter2.default);

exports.default = Entity;

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stampit = __webpack_require__(0);

var _pickBy = __webpack_require__(18);

var _pickBy2 = _interopRequireDefault(_pickBy);

var _helpers = __webpack_require__(1);

var _Pool = __webpack_require__(17);

var _Pool2 = _interopRequireDefault(_Pool);

var _Component = __webpack_require__(142);

var _Component2 = _interopRequireDefault(_Component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Module that gathers in one place various operations on components: registering, creating
 *
 * @class ComponentStore
 */
var ComponentStore = (0, _stampit.compose)({
  init: function init() {
    /**
     * Stores the gratest component's ID so far. Every component type when registered gets it's own unique ID.
     *
     * @private
     * @memberof Component#
     * @name _greatestComponentId
     * @type {Number}
     */
    this._greatestComponentId = 0;

    /**
     * Stores map of registered types to IDs.
     *
     * @example
     * {
     *   Position: 0,
     *   Velocity: 1,
     *   ...
     * }
     *
     * @private
     * @memberof Component#
     * @name _componentsIdsMap
     * @type {Object}
     */
    this._componentsIdsMap = {};

    /**
     * Object with instances of Pool, one for each component type. Type is a key.
     *
     * @private
     * @memberof Component#
     * @name _pools
     * @type {Object}
     */
    this._pools = {};

    /**
     * Object with components factories. Factories are created when component is registerd. Type is a key.
     *
     * @private
     * @memberof Component#
     * @name _factories
     * @type {Object}
     */
    this._factories = {};
  },

  methods: {
    /**
     * Registers component.
     *
     * @example
     * game.component.register({
     *   type: 'Position',
     *   onCreate(x, y) {
     *     this.x = x;
     *     this.y = y;
     *   },
     * });
     *
     * const c = game.component.create('Position', 1, 2);
     * c.x; // 1
     * c.y; // 2
     *
     * @public
     * @memberof ComponentStore#
     * @method register
     * @param {Object}    descriptor            object describing component
     * @param {String}    descriptor.type       type of components
     * @param {Function}  descriptor.onCreate   method called when component is created
     */
    register: function register(descriptor) {
      var _this = this;

      this._factories[descriptor.type] = (0, _stampit.compose)(_Component2.default, {
        methods: (0, _pickBy2.default)(descriptor, function (value) {
          return (0, _helpers.isFunction)(value);
        })
      });

      // generating `id` for class of components
      this._componentsIdsMap[descriptor.type] = this._greatestComponentId;
      this._greatestComponentId += 1;

      this._pools[descriptor.type] = (0, _Pool2.default)({
        _new: function _new() {
          var component = _this._factories[descriptor.type]({
            type: descriptor.type,
            id: _this._componentsIdsMap[descriptor.type]
          });

          component.onCreate.apply(component, arguments);

          return component;
        },
        _reuse: function _reuse(component) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          component.onCreate.apply(component, args);

          return component;
        }
      });
    },

    /**
     * Registeres many components.
     *
     * @public
     * @memberof ComponentStore#
     * @method registerMany
     * @param  {Array} descriptiors array of component's descriptors (see {@link ComponentStore#register})
     */
    registerMany: function registerMany(descriptors) {
      var _this2 = this;

      descriptors.forEach(function (descriptor) {
        return _this2.register(descriptor);
      });
    },

    /**
     * Creates new component instance or acquires one from pool.
     *
     * @public
     * @memberof ComponentStore#
     * @method create
     * @param  {String} type    type of component to create
     * @param  {...Any} ...args arguments passed to `onCreate` method
     * @return {Component}      new (or reused) component ready to add to entity
     */
    create: function create(type) {
      var _pools$type;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return (_pools$type = this._pools[type]).allocate.apply(_pools$type, args);
    },

    /**
     * Frees component. Component is added to the pool.
     * This method is called internally by the engine, user should not call it.
     *
     * @public
     * @memberof ComponentStore#
     * @method free
     * @param  {Component} component component
     */
    free: function free(component) {
      this._pools[component.getType()].free(component);
    }
  }
});

exports.default = ComponentStore;

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stampit = __webpack_require__(0);

var _helpers = __webpack_require__(1);

/**
 * Describes basic component properties.
 *
 * __For internal use only!__
 *
 * @class Component
 * @param {Object} opts
 * @param {String} opts.type
 * @param {Number} opts.id
 */
var Component = (0, _stampit.compose)({
  init: function init(opts) {
    /**
     * Type of component.
     *
     * @private
     * @memberof Component#
     * @name _type
     * @type {String}
     */
    this._type = opts.type;

    /**
     * ID of component. Each component type has it's own ID, which is used to identify its bit in entity's bitset.
     *
     * @private
     * @memberof Component#
     * @name _id
     * @type {Number}
     */
    this._id = opts.id;

    /**
     * Lowercase component type, which is used to identify component's instance when added to entity.
     * For type 'Position' propName is `position`. For type 'LifeTime' propName is `lifeTime`.
     *
     * @private
     * @memberof Component#
     * @name _propName
     * @type {String}
     */
    this._propName = (0, _helpers.toLowerFirstCase)(opts.type);
  },

  methods: {
    /**
     * Run when component is created. Can be overriedden on component registration.
     * Default implementation coppies properties from first argument, if it's an object.
     *
     * @example
     * game.component.register({
     *   type: 'Position',
     * }) // component registered without `onCreate` method
     *
     * const c = game.component.create('Position', { x: 1, y: 2 }); // default `onCreate` is used
     *
     * c.x // 1
     * c.y // 2
     *
     * @memberof Component#
     * @param {Object} [opts] object with proprties to assign to component instance
     */
    onCreate: function onCreate(opts) {
      if ((0, _helpers.isObject)(opts)) {
        Object.assign(this, opts);
      }
    },

    /**
     * Returns component type.
     *
     * @memberof Component#
     * @returns component type
     */
    getType: function getType() {
      return this._type;
    }
  }
});

exports.default = Component;

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stampit = __webpack_require__(0);

var _pickBy = __webpack_require__(18);

var _pickBy2 = _interopRequireDefault(_pickBy);

var _helpers = __webpack_require__(1);

var _System = __webpack_require__(144);

var _System2 = _interopRequireDefault(_System);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Centralized place for registering and creating systems.
 *
 * __For internal use only!__
 *
 * @class SystemStore
 * @param {Object}          opts
 * @param {Entropy}         opts.game game instance
 */
var SystemStore = (0, _stampit.compose)({
  init: function init(opts) {
    /**
     * Game instance injected to constructor.
     *
     * @public
     * @memberOf SystemStore#
     * @name game
     * @type Entropy
     */
    this.game = opts.game;

    /**
     * Object with factories for system types.
     *
     * @private
     * @memberOf SystemStore#
     * @name _factories
     * @type Object
     */
    this._factories = {};
  },

  methods: {
    /**
     * Registers system.
     *
     * @public
     * @memberof SystemStore#
     * @method register
     * @param {Object}    descriptor            object describing system
     * @param {String}    descriptor.type       type of system
     * @param {Function}  descriptor.onCreate   method called when system is created
     * @param {Function}  descriptor.onRemove   method called when system is removed
     * @param {Function}  descriptor.onUpdate   method called when system is updated
     */
    register: function register(descriptor) {
      this._factories[descriptor.type] = (0, _stampit.compose)(_System2.default, {
        properties: {
          type: descriptor.type
        },
        methods: (0, _pickBy2.default)(descriptor, function (value) {
          return (0, _helpers.isFunction)(value);
        })
      });
    },

    /**
     * Registeres many systems.
     *
     * @public
     * @memberof SystemStore#
     * @method registerMany
     * @param  {Array} descriptiors array of system's descriptors (see {@link SystemStore#register})
     */
    registerMany: function registerMany(descriptors) {
      var _this = this;

      descriptors.forEach(function (descriptor) {
        return _this.register(descriptor);
      });
    },

    /**
     * Creates new entity instance or acquires one from pool.
     *
     * @public
     * @memberof SystemStore#
     * @method create
     * @param  {String} type    type of system to create
     * @param  {...Any} args arguments passed to `onCreate` method
     * @return {System}         new system ready to be added to engine
     */
    create: function create(type) {
      var system = this._factories[type]({
        game: this.game
      });

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      system.onCreate.apply(system, args);
      return system;
    }
  }
});

exports.default = SystemStore;

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stampit = __webpack_require__(0);

var _EventEmitter = __webpack_require__(5);

var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var System = (0, _stampit.compose)({
  properties: {
    priority: 0,
    enabled: true,
    singleton: false
  },
  init: function init(opts) {
    this.game = opts.game;
  },

  methods: {
    onCreate: function onCreate() {},
    onUpdate: function onUpdate(delta) {},
    onEnable: function onEnable() {},
    onDisable: function onDisable() {},
    onRemove: function onRemove() {},
    enable: function enable() {
      if (!this.isEnabled()) {
        this.enabled = true;
        this.emit('enable');

        // stop responding to events
        this.stopResponding();
      }

      return this;
    },
    disable: function disable() {
      if (this.isEnabled()) {
        this.enabled = false;

        // start responding to events
        this.startResponding();
        this.emit('disable');
      }

      return this;
    },
    isEnabled: function isEnabled() {
      return this.enabled;
    }
  }
}, _EventEmitter2.default);

exports.default = System;

/***/ })
/******/ ]);