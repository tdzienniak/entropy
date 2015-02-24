'use strict';

var is = require('check-types');
var debug = require('./debug');

module.exports = function (key, value) {
    if (is.not.unemptyString(key)) {
        debug.warn('constans key should be non-empty string');
        return;
    }

    key = key.toUpperCase();

    if (key in this) {
        debug.warn('cannot define same constans twice: %s'. key);
        return;
    }

    Object.defineProperty(this, key, {
        value: value
    });

    return value;
};