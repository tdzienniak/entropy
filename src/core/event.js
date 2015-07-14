'use strict';

var is = require('check-types');
var extend = require('node.extend');
var slice = Array.prototype.slice;

/**
 * EventEmitter class. This is very simple yet suficient event emitter implementation.
 *
 * @class EventEmitter
 * @constructor
 */
function EventEmitter () {
    /**
     * Object with registered event listeners. Keys are event names.
     * 
     * @private
     * @property {Object} _events
     */
    this._events = {};
}

extend(EventEmitter.prototype, {
    /**
     * Method used to register event listener.
     *
     * @example
     *     emitter.on('event', function () {
     *         console.log(this.foo); //bar
     *     }, {foo: 'bar'});
     *
     * @method on
     * @param  {String}     event   event name
     * @param  {Function}   fn      event listener
     * @param  {Object}     binding context used as `this` when calling listener
     * @param  {Boolean}    once    if set to `true`, listener will be called once, then will be unregistered
     */
    on: function (event, fn, binding, once) {
        if (is.not.string(event) || is.not.function(fn)) {
            return;
        }

        this._events[event] = this._events[event] || [];

        this._events[event].push({
            fn: fn,
            binding: binding,
            once: once
        });
    },
    once: function (event, fn, binding) {
        this.on(event, fn, binding, true);
    },
    emit: function (event) {
        if (!(event in this._events)) {
            return;
        }

        var args = slice.call(arguments, 1);

        var listener;
        var i = 0;
        var events = this._events[event];
        while (i < events.length) {
            listener = this._events[event][i];

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
        if (is.not.string(event) || !(event in this._events)) {
            return;
        }

        this._events[event] = this._events[event].filter(function (listener) {
            return is.function(fn) && listener.fn !== fn;
        });
    }
});

module.exports = EventEmitter;