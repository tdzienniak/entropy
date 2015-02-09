/**
 * Main Entropy module and top namespace.
 * 
 * @module Entropy
 */
'use strict';

require('./utils/polyfill');

var debug = require('./debug');
var config = require('./config');

var Const = require('./utils/const');

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

Entropy.Easing = require('./utils/easing');



module.exports = Entropy;



var entity;
for (var i = 0; )