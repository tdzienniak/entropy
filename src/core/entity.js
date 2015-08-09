'use strict';

var is = require('check-types');
var debug = require('./debug');
var extend = require('node.extend');
var config = require('./config');
var register = require('./register');
var slice = Array.prototype.slice;

var EventEmitter = require('./EventEmitter');
var BitSet = require('bitset.js').BitSet;

/**
 * Entity class. Class is used internaly. User should not instatiate this class.
 *
 * @class Entity
 * @constructor
 * @param {Object} pattern entity pattern
 * @param {Engine} engine  Engine instance
 */
function Entity(pattern, poolManager) {
    EventEmitter.call(this);

    this._pattern = pattern;
    this._poolManager = poolManager;

    this._bitset = new BitSet(config('max_components_count'));
    this._modifications = [];

    this.id = 0;
    this.name = name;
    this.components = {};

    this._setDefaults();
}

extend(Entity.prototype, EventEmitter.prototype);
extend(Entity.prototype, {
    /**
     * Adds new component to entity. Component is either created from scratch or reused from pool. In latter case, component's pattern `reset` method is called (if present).
     * Component patterns `initialize` method is called with additional arguments passed to `add` method.
     * If entity is already added to the system (has id greater than 0) addition doesn't happen imediately, but is postponed to nearest update cycle.
     *
     * @example
     *     //`this` is a reference to Entity instance
     *     //code like this can be seen in entity's pattern `create` method
     *     this.add("Position", 1, 1);
     *
     * @method add
     * @param {String} ...name name of component to add. Addidtional parameters are applied to component patterns `initialize` method.
     * @return {Entity} Entity instance
     */
    add: function (name) {
        if (is.not.unemptyString(name)) {
            debug.warn('component name must be a non-empty string');

            return this;
        }

        var lowercaseName = name.toLowerCase();
        var component = this._acquireComponent(lowercaseName);

        if (component == null) {
            debug.warn('there is no component pattern with name %s', name);

            return this;
        }

        var args = slice.call(arguments, 1);
        component._pattern.initialize.apply(component, args);

        /**
         * If entity id equals 0, it has not yet been added to the system, so we can
         * safely modify it.
         */
        if (this.id === 0) {
            this._addComponent(lowercaseName, component);
        } else {
            this._modifications.push({
                fn: function () {
                    this._addComponent(lowercaseName, component);
                }
            });

            this.emit('queuedModification', this);
        }

        return this;
    },
    _addComponent: function (lowercaseName, componentToAdd) {
        this.components[lowercaseName] = componentToAdd;

        if (RESTRICTED_COMPONENt_NAMES.indexOf(lowercaseName) === -1) {
            this[lowercaseName] = componentToAdd;
        } else {
            debug.warn('component name `%s` is restricted for internal use, component will be added only to `components` property', lowercaseName);
        }

        this._bitset.set(componentToAdd._id);

        this.emit('componentAdded', this, componentToAdd)
    },
    remove: function (name) {
        if (is.not.unemptyString(name)) {
            debug.warn('component name must be a non-empty string');
            return this;
        }

        var lowercaseName = name.toLowerCase();
        var componentId = register.getComponentID(lowercaseName);

        if (!this._bitset.get(componentId)) {
            debug.warn('this entity does not have such component "%s" - nothing to remove', name);
            
            return this;
        }

        if (this.id === 0) {
            this._removeComponent(lowercaseName, componentId);
        } else {
            this._modifications.push({
                fn: function () {
                    this._removeComponent(lowercaseName, componentId);
                }
            })

            this.emit('queuedModification', this);
        }

        return this;
    },
    _removeComponent: function (lowercaseName, componentId) {
        var componentToRemove = this.components[lowercaseName];

        this._poolManager.putComponent(lowercaseName, componentToRemove);

        this.components[lowercaseName] = null;
        this[lowercaseName] = null;

        this._bitset.clear(componentId);

        this.emit('componentRemoved', this, componentToRemove);
    },
    _acquireComponent: function (name) {
        var componentPattern = register.getComponentPattern(name);
        var componentId = register.getComponentID(name);

        if (is.not.object(componentPattern)) {
            return null;
        }

        var component = this._poolManager.getComponent(name):

        if (component == null) {
            component = {
                _id: componentId,
                _pattern: componentPattern
            };
        } else if (is.function(component._pattern.reset)) {
            component._pattern.reset.call(component);
        }

        return component;
    },
    getPattern: function () {
        return this._pattern;
    },
    get: function (componentName) {
         if (is.not.unemptyString(componentName)) {
            debug.warn('component name must be a non-empty string');
            
            return this;
        }

        return this.components[componentName.toLowerCase()];
    },
    has: function (componentName) {

    },
    reset: function () {
        if (is.function(this.pattern.reset)) {
            this.pattern.reset.call(this, this.engine.game);
        }

        this._setDefaults();

        return this;
    },
    applyModifications: function () {
        var modification;

        while (modification = this._modifications.shift()) {
            modification.fn.apply(this, modification.args);
        }
    },
    clearModifications: function () {
        while (this._modifications.shift());
    },
    _setDefaults: function () {
        this._bitset.clear();
        this._inFinalState = false;
        this._remainingStateChanges = [];
        this._stateObject = {};
        this._currentStates = [];
        this._stateChanges = [];
    }
});

module.exports = Entity;