// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 
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

//perf.now polyfill by Paul Irish
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
      nowOffset = performance.timing.navigationStart
    }
 
 
    window.performance.now = function now(){
      return Date.now() - nowOffset;
    }
 
  }
 
})();

(function (app) {
    var FPS = 60,
        MAX_FRAME_TIME = 1000 / FPS * 2,
        _paused = false,
        _ticks = 0,
        callbacks = [],
        raf = window.requestAnimationFrame,
        last_time_value = 0,
        is_running = false,
        currentFPS = FPS,
        _raf_id = 0;

    var event = {};

    function Ticker (game) {
        this.game = game;
    }

    function tick () {
        raf(tick);

        /*if (_paused) {
            is_running = false;
            return;
        }*/

        var time = time || performance.now();

        var delta = time - last_time_value;

        if (delta >= MAX_FRAME_TIME) {
            delta = 1000 / FPS;
        }

        last_time_value = time;

        /*if (_ticks % FPS === 0) {
            currentFPS = 1000 / delta;
        }*/

        event.delta = delta;
        event.ticks = _ticks;
        event.paused = _paused;

        for (var i = 0, len = callbacks.length; i < len; i++) {
            callbacks[i][1].call(callbacks[i][0], delta, event);
        }

        _ticks++;
    }

    Ticker.prototype = {
        /*currentFPS: function () {
            return Math.round(currentFPS);
        },*/
        setFPS: function (fps) {
            FPS = fps || FPS;
        },
        getFPS: function () {
            return FPS;
        },
        getTicks: function () {
            return _ticks;
        },
        pause: function () {
            _paused = true;

            cancelAnimationFrame(_raf_id);
        },
        resume: function () {
            if (_paused && !is_running) {
                is_running = true;
                _paused = false;

                this.start();
            }
        },
        addListener: function (that, callback) {
            callbacks.push([that, callback]);
        },
        start: function () {
            _raf_id = raf(tick);
        }
    };

    app["Ticker"] = Ticker;
})(app);