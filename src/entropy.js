/**
 * Main Entropy module and top namespace.
 * 
 * @module Entropy
 */
'use strict';

/**
 * Requiring polyfills for requestAnimationFrame and performance.now.
 */
require('./core/polyfill');

var debug = require('./debug');
var config = require('./config');

var Const = require('./core/const');
var Game = require('./core/game');
var Engine = require('./core/engine');

/**
 * Welcome message.
 */
console.log.apply(console, [
    '%c %c %c Entropy 0.2.0 - Entity System Framework for JavaScript %c %c ',
    'background: rgb(200, 200,200);',  
    'background: rgb(80, 80, 80);',
    'color: white; background: black;',
    'background: rgb(80, 80, 80);',
    'background: rgb(200, 200, 200);'
]);

/**
 * Main static framework. Used as top namespace.
 * 
 * @class Entropy
 * @static
 */
function Entropy () {
    debug.warning('This function should not be used as a constructor.');
    return;
}

/**
 * Assignes new property to main Entropy namespace identified by key (uppercased).
 * Once assigned, can't be assigned again.
 * Can be later accessed by: Entropy.KEY
 *
 * @static
 * @method Const
 * @param {String}  key      constans key
 * @param {Any}     value    constans value
 */
Entropy.Const = function (key, value) {
    return Const.call(this, key, value);
};

Entropy.Game = Game;
Entropy.Engine = Engine;

module.exports = Entropy;