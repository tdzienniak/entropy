'use strict';

var is = require('check-types');
var debug = require('./debug');
var extend = require('node.extend');
var EventEmitter = require('./event');

var RESERVED_NAMES = ['game', 'engine', 'ticker', 'plugin'];

/**
 * Plugin class. Class is used internaly. User should not instatiate this class.
 *
 * @class Plugin
 * @extends EventEmitter
 * @constructor
 */
function Plugin (game) {
    EventEmitter.call(this);

    this.game = game;
    this._actualPlugins = {};
    this._actualPluginNames = [];

    ['start', 'stop', 'resume', 'pause'].forEach(function (eventName) {
        this.game.on(eventName, function () {
            this._runPluginMethod(eventName, arguments);
        }, this)
    }, this);

    this.game.ticker.on('tick', function () {
        this._runPluginMethod('update', arguments);
    }, this)
}

extend(Plugin.prototype, EventEmitter.prototype);
extend(Plugin.prototype, {
    /**
     * This method should be used to add plugins to system.
     * Plugin name and plugin object (can be instance of a "class" or plain object) must be provided.
     * These names are reserved: `game`, `engine`, `ticker`, `plugin`.
     *
     * Plugin instance can have lifecycle methods that are called automatically. These methods are:
     * - __start__ - called when game starts
     * - __stop__ - called when game stops
     * - __update__ - called on every game loop tick, method gets `delta` argument
     * - __pause__ - called when game pauses
     * - __resune__ - called when game resumes
     * - __destroy__ - called when plugin is destroyed, great place for freeing plugin resources, if some exist
     * 
     * @example
     *     //somwhere in state lifecycyle method or other method with `game` in context...
     *     game.plugin.add('renderer', new Entropy.Plugin.Renderer(800, 600, 0xffffff));
     *
     *     //added plugin is now available as a property of `game` object
     *     game.renderer.addSprite('ball.png');
     *
     *     //ups, `plugin` is reserved system name
     *     game.plugin.add('plugin', new MyAwesomePlugin('hello world!')); //undefined returned and error in console, plugin not added
     *
     *     //plugin gets destroyed, its `destroy` method is called if present
     *     game.plugin.remove('renderer');
     *
     * @method add
     * @param  {String} name    plugin name
     * @param  {Object} obj     instance of plugin
     * @return {Object|undefined}   provided plugin instance or `undefined` if plugin name is forbidden system name and plugin cannot be registered
     */
    add: function (name, obj) {
        if (RESERVED_NAMES.indexOf(name) !== -1) {
            debug.error('This plugin name is reserved for internal use: %s', name);

            return;
        }

        this.game[name] = this._actualPlugins[name] = obj;

        this._updateActualPluginNames()

        this.emit('pluginAddition', obj);

        return obj;
    },
    /**
     * Removes plugin from game object. Plugin has to be {{#crossLink "Plugin/add:method"}}added{{/crossLink}} beforehand.
     * 
     * @example
     *     //plugin gets destroyed, its `destroy` method is called if present
     *     game.plugin.remove('renderer');
     *
     *     game.renderer === undefined; //true
     *
     * @method remove
     * @param  {String} name    plugin name
     * @return {Boolean}    `true` if removed succesfully, `false` otherwise 
     */
    remove: function (name) {
        if (!(name in this._actualPlugins)) {
            debug.error('Plugin `%s` is not initilized, cannoy be destroyed.', name)
            
            return false;
        }

        var plugin = this._actualPlugins[name];

        if (is.function(plugin.destroy)) {
            plugin.destroy();
        }

        delete this._actualPlugins[name];
        delete this.game[name];

        this._updateActualPluginNames();

        this.emit('pluginRemoval', name);

        return true;
    },
    _updateActualPluginNames: function () {
        this._actualPluginNames = Object.keys(this._actualPlugins);
    },
    _runPluginMethod: function (methodName, methodArguments) {
        var plugin;

        for (var i = 0; i < this._actualPluginNames.length; i++) {
            plugin = this._actualPlugins[this._actualPluginNames[i]];

            if (is.function(plugin[methodName])) {
                plugin[methodName].apply(plugin, methodArguments);
            }
        }
    }
});

/**
 * Fired, when plugin is succesfully added.
 *
 * @event pluginAddition
 */

/**
 * Fired, when plugin is succesfully removed.
 *
 * @event pluginRemoval
 */

module.exports = Plugin;