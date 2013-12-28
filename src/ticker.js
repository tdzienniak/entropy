(function (app) {
    var FPS = 60,
        MAX_FRAME_TIME = 1000 / FPS * 2,
        PAUSED = false,
        USE_RAF = true,
        ticks = 0,
        callbacks = [],
        raf = requestAnimationFrame,
        last_time_value = 0,
        is_running = false,
        currentFPS = FPS;

    var event = {};

    function Ticker (game) {
        this.game = game;
    }

    function tick (time) {
        if (PAUSED) {
            is_running = false;
            return;
        }

        if ( ! USE_RAF) {
            var time = time || new Date().getTime();
        }

        var delta = time - last_time_value;

        if (delta >= MAX_FRAME_TIME) {
            delta = 1000 / FPS;
        }

        last_time_value = time;

        /*if (ticks % FPS === 0) {
            currentFPS = Math.round(1000 / delta);
        }*/

        event.delta = delta;
        event.ticks = ticks;
        event.paused = PAUSED;

        for (var i = 0, len = callbacks.length; i < len; i++) {
            callbacks[i][1].call(callbacks[i][0], delta, event);
        }

        ticks++;

        if (USE_RAF) {
            raf(tick);
        }
    }

    Ticker.prototype = {
        useRAF: function (bool) {
            USE_RAF = bool;
        },
        currentFPS: function () {
            return Math.round(currentFPS);
        },
        setFPS: function (fps) {
            FPS = fps || FPS;
        },
        getFPS: function () {
            return FPS;
        },
        getTicks: function () {
            return ticks;
        },
        pause: function () {
            PAUSED = true;

            if (!USE_RAF) {
                window.clearInterval(ticker);
            }
        },
        resume: function () {
            if (PAUSED && !is_running) {
                is_running = true;
                PAUSED = false;

                if (!USE_RAF) {
                    ticker(tick, FPS);
                } else {
                    tick();
                }
            }
        },
        addListener: function (that, callback) {
            callbacks.push([that, callback]);
        },
        start: function () {
            if (USE_RAF) {
                ticker = (function () {
                    return  window.requestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            function (callback, fps) {
                                window.setTimeout(callback, 1000 / fps);
                            };
                })();
            } else {
                ticker = function (callback, fps) {
                    return window.setInterval(callback, 1000 / fps);
                };
            }

            is_running = true;
            
            raf(tick);
            //ticker(tick);
        }
    };

    app["Ticker"] = Ticker;
})(app);