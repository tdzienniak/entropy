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
var State = require('./core/state');
var register = require('./core/register');

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
 * Main static framework class. Used as a top namespace.
 * 
 * @class Entropy
 * @static
 */
function Entropy () {
    debug.warning('This function should not be used as a constructor.');
    return;
}

/**
 * Registers new component pattern.
 * Only argument should be an object with obligatory `name` property and `initialize` method.
 * This method is used to assign some data to component object. `this` inside `initialize` function is a
 * reference to newly created component object.
 *
 * @example
 *     Entropy.Component({
 *         name: "Position",
 *         initialize: function (x, y) {
 *             this.x = x;
 *             this.y = y;
 *         },
 *         //not obligatory
 *         reset: function () {
 *             this.x = 0;
 *             this.y = 0;
 *         }
 *     });
 *
 * @method Component
 * @static
 * @param {Object} component component pattern
 */
Entropy.Component = function (component) {
    register.registerComponent(component);
};

/**
 * Registers new entity pattern.
 *
 * Pattern is an object with following properties:
 *  - __name__ (required) - name of an entity
 *  - __create__ (required) - method called when creating new entity. Here you should add initial components to an entity.
 *   `this` inside function references newly created entity object (instance of {{#crossLink "Entity"}}Entity{{/crossLink}} class).
 *   Function is called with first argument being `game` object and every others are parameters with witch {{#crossLink "Engine/create:method"}}create{{/crossLink}} method is called.
 *  - __remove__ (optional) - method called when entity is removed from the system. This is good place to clean after entity (ex. remove some resources from renderer).
 *   First and only argument is a `game` object.
 *
 * @example
 *     Entropy.Entity({
 *         name: "Ball",
 *         create: function (game, x, y, radius) {
 *             var sprite = new Sprite("Ball");
 *
 *             game.container.make("renderer").addSprite(sprite);
 *
 *             this.add("Position", x, y)
 *                 .add("Radius", radius)
 *                 .add("Velocity", 5, 5)
 *                 .add("Sprite", sprite);
 *         },
 *         //not oblgatory
 *         remove: function (game) {
 *             game.container.make("renderer").removeSprite(this.components.sprite.sprite);
 *         }
 *     });
 *
 * @method Entity
 * @static
 * @param {Object} entity entity pattern
 */
Entropy.Entity = function (entity) {
    register.registerEntity(entity);
};

/**
 * Registers new system pattern.
 *
 * @example
 *     Entropy.System({
 *         name: "MovementSystem",
 *         priority: 1, //not obligatory
 *         initialize: function () {
 *             this.query = new Entropy.Query(["Position", "Velocity"]);
 *         },
 *         update: function (delta) {
 *             var entities = this.engine.getEntities(this.query);
 *             var e;
 *
 *             var i = 0;
 *             while (e = entities[i]) {
 *                 var position = e.components.position;
 *                 var velocity = e.components.velocity;
 *
 *                 position.x += delta / 1000 * velocity.vx;
 *                 position.y += delta / 1000 * velocity.vy;
 *
 *                 i++;
 *             }
 *         },
 *         //not obligatory
 *         remove: function () {
 *
 *         }
 *     });
 *
 * @method System
 * @static
 * @param {Object} system system pattern object
 */
Entropy.System = function (system) {
    register.registerSystem(system);
};

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
Entropy.Const = require('./core/const');

/**
 * {{#crossLink "Game"}}Game{{/crossLink}} class reference.
 * 
 * @static
 * @method Game
 * @type {Game}
 */
Entropy.Game = require('./core/game');

/**
 * {{#crossLink "Engine"}}Engine{{/crossLink}} class reference.
 * 
 * @static
 * @method Engine
 * @type {Engine}
 */
Entropy.Engine = require('./core/engine');

/**
 * {{#crossLink "Config"}}Config{{/crossLink}} class reference.
 * 
 * @static
 * @method Config
 * @type {Config}
 */
Entropy.Config = config;

/**
 * {{#crossLink "Query"}}Query{{/crossLink}} class reference.
 * 
 * @static
 * @method Query
 * @type {Query}
 */
Entropy.Query = require('./core/query');

/**
 * Registers new state. This method simply calls State's {{#crossLink "State/Register:method"}}Register{{/crossLink}} static method.
 *
 * @example
 *     Entropy.State({
 *         //state object here
 *     });
 *
 * @static
 * @method State
 * @param {Object} state state object
 */
Entropy.State = function (state) {
    State.Register(state);
}

Entropy.Utils = {
    is: require('check-types'),
    extend: require('node.extend')
}

/**
 * {{#crossLink "EventEmitter"}}EventEmitter{{/crossLink}} class reference.
 * 
 * @static
 * @method EventEmitter
 * @type {EventEmitter}
 */
Entropy.EventEmitter = require('./core/event');

module.exports = Entropy;