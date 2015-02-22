'use strict';

var is = require('check-types');
var extend = require('node.extend');
var slice = Array.prototype.slice;

function EventEmitter () {
    this.events = {};
}

extend(EventEmitter.prototype, {
    on: function (event, fn, binding, once) {
        if (is.not.string(event) || is.not.function(fn)) {
            return;
        }

        this.events[event] = this.events[event] || [];

        this.events[event].push({
            fn: fn,
            binding: binding,
            once: once
        });
    },
    once: function (event, fn, binding) {
        this.on(event, fn, binding, true);
    },
    emit: function (event) {
        if (!(event in this.events)) {
            return;
        }

        var args = slice.call(arguments, 1);

        var listener;
        var i = 0;
        var events = this.events[event];
        while (i < events.length) {
            listener = this.events[event][i];

            var returnedValue = listener.fn.apply(listener.binding, args);

            if (returnedValue === false || listener.once) {
                var index = i;
                while (index < events.length) {
                    events[index] = events[++index];
                }

                events.length--;
            } else {
                i++;
            }
        }
    },
    trigger: function () {
        this.emit.apply(this, arguments);
    },
    off: function (event, fn) {
        if (is.not.string(event) || !(event in this.events)) {
            return;
        }

        this.events[event] = this.events[event].filter(function (listener) {
            return is.function(fn) && listener.fn !== fn;
        });
    }
});

module.exports = EventEmitter;