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