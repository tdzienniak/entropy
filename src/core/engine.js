/**
 * Engine module
 *
 * @module Engine
 */
'use strict';
var extend = require('node.extend');
var config = require('../config');
var array = require('./fastarray');
var is = require('check-types');
var debug = require('../debug');

var Query = require('./query');
var EventEmitter = require('./event');
var Pool = require('./pool');

/**
 * @class Engine
 * @extends EventEmitter
 * @constructor
 */
function Engine () {
    EventEmitter.call(this);

    /**
     * Indicates the greatest entity ID present in the system.
     * Used to generate new IDs.
     * 
     * @property _gratestEntityID
     * @private
     * @type Number
     */
    this._greatestEntityID = 0;

    /**
     * Pool of currently not used entity IDs. Will be reused.
     * 
     * @property _idsToReuse
     * @private
     * @type Pool
     */
    this._idsToReuse = new Pool(config('ids_to_reuse_pool_size'));

    this._systems = [];
    this._entities = [];

    this._entitiesToAdd = new Pool(100);
    this._entitiesToRemove = new Pool(100);
    this._systemsToAdd = new Pool(100);
    this._systemsToRemove = new Pool();

    this._queries = [];

}

/**
 * @method Component
 * @static
 */
Engine.Component = function (component) {

}

/**
 * @method Entity
 * @static
 */
Engine.Entity = function (entity) {

}

/**
 * @method System
 * @static
 */
Engine.System = function (system) {

}

/**
 * Used to perform matching of entities.
 * Only parameter is an array of component names to include or object with `include` and/or `exclude` properties,
 * witch are arrays of component names to respectively include and/or exclude.
 * 
 * @method Query
 * @static
 * @param {Array|Object} criterions query matching criterions
 * @return {Object} query object
 */
Engine.Query = Query;

extend(Engine.prototype, EventEmitter.prototype);
extend(Engine.prototype, {
    /**
     * Creates new entity using pattern identified by 'name' parameter.
     * Every additional parameter will be applied to patterns 'create' method.
     *
     * @method create
     * @param  {String} name    name of entity pattern
     * @return {Engine}         engine instance
     */
    create: function (name) {

    },
    remove: function (entity) {

    },
    getAllEntities: function () {

    },
    /**
     * Returns array of entities satisfying given query conditions.
     * 
     * @param  {Query}  query query object
     * @return {Array}  array of matched entities
     */
    getEntities: function (query) {

    },
    addSystem: function (name) {
        var systemName, priority;

        if (is.array(name)) {
            if (name.length !== 2) {
                debug.warn('To add system with priority you must provide an array with two elements - [systemName, priority] - as a first parameter.');
                return this;
            }

            systemName = name[0];
            priority = name[1];
        } else if (is.unemptyString(name)) {
            systemName = name;
        } else {
            debug.warn('First argument for addSystem method must be either system name or array with system name and desired priority.');
            return this;
        }

        var pattern = reqister.getSystemPattern(systemName);

        if (is.not.object(pattern)) {
            debug.warn('There is no system %s.', name);
            return this;
        }

        if (pattern.singleton) {
            for (var i = 0, len = this._systems.length; i < len; i++) {
                if (this._systems[i].name === pattern.name) {
                    debug.info('System you want to add is a singleton and there is one already present in the engine. Returning...');
                    return this;
                }
            }
        }

        var args = Array.prototype.slice.call(arguments, 1);

        if (priority == null) {
            if (is.number(pattern.priority)) {
                priority = pattern.priority;
            } else {
                priority = 0;
            }
        }

        var newSystem = extend(true, {}, pattern);
        newSystem.priority = priority;

        if (is.function(newSystem.initialize)) {
            newSystem.initialize.apply(newSystem, args);
        }

        this._systemsToAdd.put(newSystem);

        return this;
    },
    enableSystem: function () {

    },
    disableSystem: function (system) {

    },
    _removeSystem: function (system) {
        if (is.not.object(system)) {
            debug.warn('System to remove has to be an object.');
            return this;
        }

        this._systemsToRemove.put(system);

        return this;
    },
    update: function (delta) {
        var i, len, system;
        var query, queries = this._queries;

        for (i = 0, len = this._systems.length; i < len; i++) {
            system = this._systems[i];
            
            if (system._disabled) {
                continue;
            }

            system.update(delta);
        }

        /**
         * Removing systems.
         */
        var systemToRemove;
        while (systmeToRemove = this._systemsToRemove.get()) {
             var indexOfSystem = this._systems.indexOf(systemToRemove);

            if (indexOfSystem === -1) {
                debug.warn('Nothing to remove.');
                continue;
            }

            if (is.function(systemToRemove.remove)) {
                systemToRemove.remove();
            }

            array.removeAtIndex(this._systems, indexOfSystem);
        }

        /**
         * Adding systems.
         */
        var systemToAdd;
        while (systemToAdd = this._systemsToAdd.get()) {
            var insertionIndex = 0;
            var priority = systemToAdd.priority;
            for (len = this._systems.length; insertionIndex < len; insertionIndex++) {
                if (this._systems[insertionIndex].priority > priority) {
                    break;
                }
            }

            this._systems.splice(insertionIndex, 0, systemToAdd);            
        }

        /**
         * Fetching query indexes.
         */
        for (i = 0, len = this._queries.length; i < len; i++) {
            query = queries[i];
            if (!query.touched) {
                continue;
            }

            
            


        }



    },
    /**
     * Returns ID for an entity. Reuses old IDs or creates new.
     * 
     * @private
     * @return {Number} new ID
     */
    _generateEntityID: function () {
        var id = this._idsToReuse.get();

        if (id == null) {
            id = ++this._greatestEntityID;
        }

        return id;
    },
    /**
     * Initializes new query. Performs initial entity search.
     * 
     * @param  {Object} query query object
     */
    _initializeQuery: function (query) {
        //TODO: add check for existing query

        var entities = array.alloc(1000);
        var entitiesLength = 0;
        var index = array.alloc(1000);
        var indexLength = 0;

        var entity;
        for (var i = 0, greatestID = this._greatestEntityID; i < greatestID; i++) {
            entity = entities[i];
            if (entity === 0) {
                return;
            }

            if (query.satisfiedBy(entity)) {
                array.push(index, indexLength++, entity.id);
                array.push(entities, entitiesLength++, entity);
            }
        }

        extend(query, {
            entities: entities,
            entitiesLength: entitiesLength,
            index: index,
            indexLength: indexLength,
            touched: false
        });

        this._queries.push(query);
    }
});

module.exports = Engine;