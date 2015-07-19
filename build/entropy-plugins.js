(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":2}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
var is = Entropy.Utils.is;

/**
 * Animation class.
 * 
 * @class Entropy.Animation
 * @param {Array}   frames [description]
 * @param {Number}  fps    [description]
 */
Animation = function (frames, fps, loop) {
    Entropy.EventEmitter.call(this);

    this._frames = frames;
    this._fps = fps || 30;
    this._loop = loop;

    this._state = Animation.INITIAL;
    this._frameTime = 1000 / fps;
    this._reversed = false;
    this._currentFrame = frames[0];
    this._currentFrameIndex = 0;
    this._currentFrameTime = 0;

    this._sprite = new PIXI.Sprite(frames[0].texture);

    this._sprite.anchor.x = 0.5;
    this._sprite.anchor.y = 0.5;
}

Entropy.Utils.extend(Animation.prototype, Entropy.EventEmitter.prototype);
Entropy.Utils.extend(Animation.prototype, {
    play: function () {
        if (this._state === Animation.PLAYING) {
            return;
        }

        this._state = Animation.PLAYING;

        this.emit('start')
    },
    stop: function () {
        if (this._state === Animation.PLAYING || this._state === Animation.PAUSED) {
            this._state = Animation.STOPPED;

            this._resetAnimation();

            this.emit('stop');
        }
    },
    pause: function () {
        if (this._state === Animation.PLAYING) {
            this._state = Animation.PAUSED;

            this.emit('pause');
        }
    },
    resume: function () {
        if (this._state === Animation.PAUSED) {
            this._state = Animation.PLAYING;

            this.emit('resume');
        }
    },
    reverse: function () {
        this._reversed = !this._reversed;
    },
    addFrame: function (frame) {
        this._frames.push();
    },
    nextFrame: function () {
        var nextFrameIndex;
        var nextFrame;

        if (this._reversed) {
            nextFrameIndex = this._currentFrameIndex - 1;
        } else {
            nextFrameIndex = this._currentFrameIndex + 1;
        }

        if (this._loop) {
            if (nextFrameIndex === -1) {
                nextFrameIndex = this._frames.length - 1;
            } else if (nextFrameIndex === this._frames.length) {
                nextFrameIndex = 0;
            }
        } else if (nextFrameIndex === -1 || nextFrameIndex === this._frames.length) {
            this._state = Animation.ENDED;

            this.emit('end')

            return;
        }

        nextFrame = this._frames[nextFrameIndex];

        if (nextFrame == null) {
            return;
        }

        this._currentFrame = nextFrame;
        this._currentFrameIndex = nextFrameIndex;

        this._updateSpriteTexture();
    },
    gotoFrame: function (frameIdentifier) {
        var frame;
        var frameIndex;

        if (is.number(frameIdentifier)) {
            frame = this._frames[frameIdentifier];
            frameIndex = frameIdentifier;
        } else if (is.unemptyString(frameIdentifier)) {
            for (var i = 0; i < this._frames.length; i++) {
                if (this._frames[i].name === frameIdentifier) {
                    frame = this._frames[i];
                    frameIndex = i;

                    break;
                }
            }
        } else {
            return;
        }

        if (frame == null) {
            return;
        }

        this._currentFrame = frame;
        this._currentFrameIndex = frameIndex;
        this._currentFrameTime = 0;

        this._updateSpriteTexture();
    },
    update: function (delta) {
        if (this._state !== Entropy.Animation.PLAYING) {
            return;
        }

        if (this._currentFrameTime >= this._frameTime) {
            this.emit('frameChange');

            this._currentFrame = this.nextFrame();

            this._currentFrameTime = 0;
        }

        this._currentFrameTime += delta;
    },
    getAnimationSprite: function () {
        return this._sprite;
    },
    _updateSpriteTexture: function () {
        this._sprite.texture = this._currentFrame.texture;
    },
    _resetAnimation: function () {
        this._currentFrame = this._frames[0];
        this._currentFrameIndex = 0;
        this._currentFrameTime = 0;

        this._updateSpriteTexture();
    }
})

Animation.PLAYING   = 0;
Animation.PAUSED    = 1;
Animation.STOPPED   = 2;
Animation.PLAYING   = 3;
Animation.INITIAL   = 4;
Animation.ENDED     = 5;

Entropy.Animation = Animation;
},{}],4:[function(require,module,exports){

},{}],5:[function(require,module,exports){
Entropy.Frame = function (texture, name) {
    this.texture = texture;
    this.name = name;
};

Entropy.Utils.extend(Entropy.Frame.prototype, {

});
},{}],6:[function(require,module,exports){
require('./Frame');
require('./Animation');
require('./AnimationManager');
},{"./Animation":3,"./AnimationManager":4,"./Frame":5}],7:[function(require,module,exports){
require('./animation');
require('./input');
require('./loader');
},{"./animation":6,"./input":8,"./loader":12}],8:[function(require,module,exports){
'use strict';

var KEYS = {
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

var KEY_NAMES = Object.keys(KEYS);


/**
 * Input class.
 *
 * @class Plugin.Input
 * @extends EventEmitter
 * @constructor
 */
function Input () {
    var self = this;

    this._pressedKeys = [];
    this._pressedKeysTime = [];
    this._oncePressedKeys = [];
    this._mousePosition = {
        x: 0,
        y: 0
    };

    this._handleKeyDown = function (e) {
        var keyCode = e.keyCode;

        self._pressedKeys[keyCode] = true;

        if (!self._pressedKeysTime[keyCode]) {
            self._pressedKeysTime[keyCode] = performance.now();
        }

        return;
    };

    this._handleKeyUp = function (e) {
        var keyCode = e.keyCode;

        self._pressedKeys[keyCode] = false;

        if (self._pressedKeysTime[keyCode] != null && self._oncePressedKeys[keyCode] == null) {
            self._pressedKeysTime[keyCode] = performance.now() - self._pressedKeysTime[keyCode];
            self._oncePressedKeys[keyCode] = true;
        }

        return;
    };

    if (window !== undefined) {
        window.addEventListener("keydown", this._handleKeyDown);
        window.addEventListener("keyup", this._handleKeyUp);
    }
}

Entropy.Utils.extend(Input.prototype, {
    isPressed: function (keyName) {
        return this._pressedKeys[KEYS[keyName]];
    },
    getPressedKeys: function () {
        var keys = {}, keyName;

        for (var i = 0; i < KEY_NAMES.length; i++) {
            keyName = KEY_NAMES[i];

            keys[keyName] = this._pressedKeys[KEYS[keyName]];
        }

        return keys;
    },
    getKeysPressedLessThan: function (time) {
        var keys = {}, keyName, keyCode;

        for (var i = 0; i < KEY_NAMES.length; i++) {
            keyName = KEY_NAMES[i];
            keyCode = KEYS[keyName];

            if (this._pressedKeysTime[keyCode] < time && this._oncePressedKeys[keyCode]) {
                keys[keyName] = true;
            }
        }

        return keys;
    },
    getKeysPressedMoreThan: function (time) {
        var keys = {}, keyName, keyCode;

        for (var i = 0; i < KEY_NAMES.length; i++) {
            keyName = KEY_NAMES[i];
            keyCode = KEYS[keyName];

            if (this._pressedKeysTime[keyCode] > time && this._oncePressedKeys[keyCode]) {
                keys[keyName] = true;
            }
        }

        return keys;
    },
    setMouseStagePosition: function (position) {
        this._mousePosition = position;
    },
    getMouseStagePosition: function () {
        return this._mousePosition;
    },
    clearKeyTimes: function () {
        this._pressedKeysTime = [];
        this._oncePressedKeys = [];
    },
    update: function (delta) {
        this.clearKeyTimes();
    },
    destroy: function () {
        if (window !== undefined) {
            window.removeEventListener("keydown", this._handleKeyDown);
            window.removeEventListener("keyup", this._handleKeyUp);
        }
    }
});

module.exports = Input;
},{}],9:[function(require,module,exports){
var path = require('path');

var extMimeMap = {
    ogg: 'audio/ogg',
    mp3: 'audio/mpeg3',
    wav: 'audio/wav'
}

function HowlerSoundLoader (loadItem) {
    this.AbstractLoader_constructor(loadItem, true, "howlersound");
}

HowlerSoundLoader.getPreloadHandlers = function () {
    return {
        types: ["howlersound"],
        callback: HowlerSoundLoader.preloadHandler
    }
}

HowlerSoundLoader.preloadHandler = function (loadItem) {
    var loader = new HowlerSoundLoader(loadItem);

    return loader;
}

var s = HowlerSoundLoader;

s.PROGRESS = 0.25;

s.canLoadItem = function (item) {
    return item.type === "howlersound";
};

var p = createjs.extend(HowlerSoundLoader, createjs.AbstractLoader);

p._createRequest = function() {
    var queue = this._manifestQueue = new createjs.LoadQueue();

   // queue.on("complete", this._handleManifestComplete, this, true);
    //queue.on("progress", this._handleManifestProgress, this);
    //queue.on("error", this._handleManifestError, this, true);

    this._item.data.forEach(function (sound, index) {
        queue.loadFile({
            src: sound,
            type: createjs.AbstractLoader.BINARY
        })
    })

    this._request = queue;
};

p.handleEvent = function (event) {
    switch (event.type) {
        case "complete":
            var sounds = this._manifestQueue.getItems(true)
            
            sounds = sounds.map(function (sound) {
                return 'data:' + extMimeMap[sound.item.ext] + ';base64,' + base64ArrayBuffer(sound.result);
            })

            var howl = new Howl({
                src: sounds,
                id: this._item.id
            })

            this._result = howl;
            this._sendComplete();
            
            return;
        case "progress":
            event.loaded *= s.PROGRESS;
            this.progress = event.loaded / event.total;
            if (isNaN(this.progress) || this.progress == Infinity) { this.progress = 0; }
            this._sendProgress(event);

            return;
    }

    this.AbstractLoader_handleEvent(event);
};

//This function comes from: https://gist.github.com/jonleighton/958841
function base64ArrayBuffer(arrayBuffer) {
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
 
  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder
 
  var a, b, c, d
  var chunk
 
  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
 
    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1
 
    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }
 
  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]
 
    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2
 
    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1
 
    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]
 
    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4
 
    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1
 
    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }
  
  return base64
}


module.exports = createjs.promote(HowlerSoundLoader, "AbstractLoader");
},{"path":1}],10:[function(require,module,exports){
var PixiTextureAtlasLoader = require('./PixiTextureAtlasLoader');
var HowlerSoundLoader = require('./HowlerSoundLoader');

function Loader () {
    var loader = new createjs.LoadQueue();

    loader.installPlugin(PixiTextureAtlasLoader);
    loader.installPlugin(HowlerSoundLoader);

    this._loader = loader;
}

Entropy.Utils.extend(Loader.prototype, {
    getLoader: function () {
        return this._loader;
    },
    loadFile: function () {
        this._loader.loadFile.apply(this._loader, arguments);

        return this;
    },
    loadTextureAtlas: function (textureAtlasUrl, loadNow) {
        this._loader.loadFile({
            src: textureAtlasUrl,
            type: Entropy.Loader.TEXTUREATLAS
        }, loadNow)

        return this;
    },
    loadSound: function (soundItem, loadNow) {
        this._loader.loadFile({
            id: soundItem.id,
            src: 'this property is not used, but has to be unempty string',
            data: soundItem.src,
            type: Entropy.Loader.SOUND
        }, loadNow)

        return this;
    },
    load: function () {
        this._loader.load();
    },
    on: function () {
        this._loader.on.apply(this._loader, arguments);
    },
    off: function () {
        this._loader.off.apply(this._loader, arguments);
    }
});


Loader.TEXTUREATLAS = "pixitextureatlas";
Loader.SOUND = "howlersound";

Entropy.Loader = Loader;
},{"./HowlerSoundLoader":9,"./PixiTextureAtlasLoader":11}],11:[function(require,module,exports){
var path = require('path');

function PixiTextureAtlasLoader (item) {
    this.AbstractLoader_constructor(item, true, "pixitextureatlas");
}

PixiTextureAtlasLoader.getPreloadHandlers = function () {
    return {
        types: ["pixitextureatlas"],
        callback: PixiTextureAtlasLoader.preloadHandler
    }
}

PixiTextureAtlasLoader.preloadHandler = function (loadItem) {
    var loader = new PixiTextureAtlasLoader(loadItem);

    return loader;
}

var s = PixiTextureAtlasLoader;

s.PROGRESS = 0.25;

s.canLoadItem = function (item) {
    return PIXI != null && createjs != null && item.type === "pixitextureatlas";
};

var p = createjs.extend(PixiTextureAtlasLoader, createjs.AbstractLoader);

p._createRequest = function() {
    this._request = new createjs.JSONLoader(this._item);
};

p.handleEvent = function (event) {
    switch (event.type) {
        case "complete":
            this._rawResult = event.target.getResult(true);
            this._result = event.target.getResult();
            this._sendProgress(s.PROGRESS);
            this._loadManifest(this._result);
            
            return;
        case "progress":
            event.loaded *= s.PROGRESS;
            this.progress = event.loaded / event.total;
            if (isNaN(this.progress) || this.progress == Infinity) { this.progress = 0; }
            this._sendProgress(event);

            return;
    }

    this.AbstractLoader_handleEvent(event);
};


p._loadManifest = function (json) {
    if (json && json.frames) {
        var queue = this._manifestQueue = new createjs.LoadQueue();

        queue.on("complete", this._handleManifestComplete, this, true);
        queue.on("progress", this._handleManifestProgress, this);
        queue.on("error", this._handleManifestError, this, true);

        queue.loadFile({
            id: json.meta.image,
            src: path.join(path.dirname(this._item.src), json.meta.image),
            data: json
        })
    }
};


p._handleManifestComplete = function (event) {
    var loadedItems = this._manifestQueue.getItems(true);

    if (!loadedItems.length) {
        var newEvent = new createjs.Event("fileerror");
        newEvent.item = event.data;
        this.dispatchEvent(newEvent);

        return;
    }

    var item = loadedItems[0];
    var textures = {};
    var frames = item.item.data.frames;
    var resolution = PIXI.utils.getResolutionOfUrl(this._item.src);
    var mainTexture = new PIXI.Texture(new PIXI.BaseTexture(item.result));

    PIXI.utils.TextureCache[item.item.id] = mainTexture;

    /**
     * This code comes from PIXIs default loader:
     * https://github.com/GoodBoyDigital/pixi.js/blob/master/src/loaders/spritesheetParser.js
     */
    for (var i in frames) {
        var rect = frames[i].frame;

        if (rect) {
            var size = null;
            var trim = null;

            if (frames[i].rotated) {
                size = new PIXI.Rectangle(rect.x, rect.y, rect.h, rect.w);
            } else {
                size = new PIXI.Rectangle(rect.x, rect.y, rect.w, rect.h);
            }

            //  Check to see if the sprite is trimmed
            if (frames[i].trimmed) {
                trim = new PIXI.Rectangle(
                    frames[i].spriteSourceSize.x / resolution,
                    frames[i].spriteSourceSize.y / resolution,
                    frames[i].sourceSize.w / resolution,
                    frames[i].sourceSize.h / resolution
                );
            }

            // flip the width and height!
            if (frames[i].rotated) {
                var temp = size.width;
                size.width = size.height;
                size.height = temp;
            }

            size.x /= resolution;
            size.y /= resolution;
            size.width /= resolution;
            size.height /= resolution;

            PIXI.utils.TextureCache[i] = new PIXI.Texture(mainTexture.baseTexture, size, size.clone(), trim, frames[i].rotated);
        }
    }

    this._sendComplete();
};

p._handleManifestProgress = function (event) {
    this.progress = event.progress * (1 - s.PROGRESS) + s.PROGRESS;
    this._sendProgress(this.progress);
};

p._handleManifestError = function (event) {
    var newEvent = new createjs.Event("fileerror");
    newEvent.item = event.data;
    this.dispatchEvent(newEvent);
};

module.exports = createjs.promote(PixiTextureAtlasLoader, "AbstractLoader");
},{"path":1}],12:[function(require,module,exports){
require('./Loader');
},{"./Loader":10}]},{},[7]);
