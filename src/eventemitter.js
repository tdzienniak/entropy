(function (Entropy) {
    "use strict";

    var Utils = Entropy.Utils;

    function EventEmitter () {
        this._events = {};
    }

    Utils.extend(EventEmitter.prototype, {
        on: function (event, fn, binding, once) {
            once = once || false;

            if (typeof binding !== "object") {
                binding = null;
            }

            if (!(event in this._events)) {
                this._events[event] = {
                    listeners: []
                };
            }

            this._events[event].listeners.push({
                fn: fn,
                binding: binding,
                once: once
            });
        },
        once: function (event, fn, binding) {
            this.on(event, fn, binding, true);
        },
        emit: function (event, eventObject) {
            if (!(event in this._events)) {
                return;  
            }

            var i = 0;
            var listener;

            while (i < this._events[event].listeners.length) {
                listener = this._events[event].listeners[i];

                listener.fn.call(listener.binding, eventObject);

                if (listener.once) {
                    this._events[event].listeners.splice(i, 1);
                } else {
                    i += 1;
                }
            }
        },
        off: function (event, fn) {
            if (!(event in this._events)) {
                return;
            }

            for (var i = 0; i < this._events[event].listeners.length; i += 1) {
                if (this._events[event].listeners[i].fn === fn) {
                    this._events[event].listeners.splice(i, 1);
                    return;
                }
            }
        },
        allOff: function () {
            this._events = {};
        }
    });

    Entropy.EventEmitter = EventEmitter;

})(root);
