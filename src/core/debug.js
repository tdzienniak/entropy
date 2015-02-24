'use strict';

var config = require('./config');

module.exports = {
    log: function () {
        if (config('debug') >= 3) {
            console.log.apply(console, arguments);
        }
    },
    warn: function () {
        if (config('debug') >= 2) {
            console.warn.apply(console, arguments);
        }
    },
    error: function () {
        if (config('debug') >= 1) {
            console.error.apply(console, arguments);
        }
    }
};