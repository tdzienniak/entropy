/**
 * Main Entropy module and top namespace.
 * 
 * @module Entropy
 */
'use strict';

//Requiring polyfills for requestAnimationFrame and performance.now.
require('./core/polyfill');

var debug = require('./core/debug');
var config = require('./core/config');

var Const = require('./core/const');
var Game = require('./core/game');
var Engine = require('./core/engine');

//Welcome message.
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
 * @example
 *     Entropy.Const('WIDTH', 800);
 *
 *     Entropy.WIDTH; //800
 *
 * @static
 * @method Const
 * @param {String}  key      constans key
 * @param {Any}     value    constans value
 */
Entropy.Const = function (key, value) {
    return Const.call(this, key, value);
};

/**
 * {{#crossLink "Game"}}Game{{/crossLink}} class reference.
 * 
 * @static
 * @method Game
 * @type {Game}
 */
Entropy.Game = Game;

/**
 * {{#crossLink "Engine"}}Engine{{/crossLink}} class reference.
 * 
 * @static
 * @method Engine
 * @type {Engine}
 */
Entropy.Engine = Engine;

Entropy.Config = config;

Entropy.Utils = {
    is: require('check-types'),
    extend: require('node.extend')
}

module.exports = Entropy;