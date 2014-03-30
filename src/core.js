var app;

var VERSION = "0.1";

var _events = {};

var Entropy = {
    getVersion: function () {
        return "v" + VERSION;
    },
    addEventListener: function (event, fn, once) {
        if ( ! _events.hasOwnProperty(event)) {
            _events[event] = {
                listeners: []
            };
        }

        _events[event].listeners.push({
            fn: fn,
            once: once
        });
    },
    trigger: function (event, event_object, binding) {
        if ( ! _events.hasOwnProperty(event)) {
             return;  
        }

        var i = 0;
        var listener;

        while (i < _events[event].listeners.length) {
            listener = _events[event].listeners[i];

            listener.fn.call(binding, event_object);

            if (listener.once) {
                _events[event].listeners.splice(i, 1);
            } else {
                i += 1;
            }
        }
    }
    
};

Entropy.Utils = {
        isString: function (value) {
            return typeof value === "string" || value instanceof String;
        },
        isUndefined: function (value) {
            return typeof value === "undefined";
        },

        extend: function (destination) {
            var sources = this.slice.call(arguments, 1);

            sources.forEach(function (source) {
                for (var property in source) {
                    if (source.hasOwnProperty(property)) {
                        destination[property] = source[property];
                    }
                }
            });
        },

        slice: Array.prototype.slice
    };

/* -- pseudo-global helper functions -- */
/*  I call them pseudo global, cause they are visible only in the scope of Entropy modules,
    not in the global scope. */

function isString(value) {
    return typeof value === "string" || value instanceof String;
}

function isUndefined(value) {
    return typeof value === "undefined";
}

var slice = Array.prototype.slice;

global["Entropy"] = app = Entropy;