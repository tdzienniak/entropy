'use strict';

var extend = require('node.extend');
var config = require('../config');
var array = require('./fastarray');
var is = require('check-types');
var debug = require('../debug');
var register = require('./register');
var slice = Array.prototype.slice;

var Query = require('./query');
var EventEmitter = require('./event');
var Pool = require('./pool');
var Entity = require('./entity');

/**
 * @class Engine
 * @extends EventEmitter
 * @constructor
 */
function Engine (game) {
    EventEmitter.call(this);
    
    /**
     * [game description]
     * @type {[type]}
     */
    this.game = game;

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

    /**
     * Systems that are processed every tick.
     *
     * @property _systems
     * @private
     * @type Array
     */
    this._systems = [];

    /**
     * Array with entities. Array index corresponds to ID of an entity.
     * @property _entities
     * @private
     * @type Array
     */
    this._entities = array.alloc(10000);

    this._modifiedEntities = array.alloc(10000);
    this._modifiedEntitiesLength = 0;

    this._entitiesToAdd = new Pool(1000);
    this._entitiesToRemove = new Pool(1000);
    this._systemsToAdd = new Pool(1000);
    this._systemsToRemove = new Pool(1000);

    this._entitiesPool = {};
    this._componentsPool = {};
    
    this._queries = [];

    this._entitiesCount = 0;

    register.setCannotModify();

    /**
     * Initialize components and entities pools.
     */
    register.listComponentsNames().forEach(function (name) {
        this._componentsPool[name] = new Pool(config('initial_components_pool_size'));
    }, this);

    register.listEntitiesNames().forEach(function (name) {
        this._entitiesPool[name] = new Pool(config('initial_entities_pool_size'));
    }, this);
}

/**
 * @method Component
 * @static
 */
Engine.Component = function (component) {
    register.registerComponent(component);
}

/**
 * @method Entity
 * @static
 */
Engine.Entity = function (entity) {
    register.registerEntity(entity);
}

/**
 * @method System
 * @static
 */
Engine.System = function (system) {
    register.registerSystem(system);
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
        if (is.not.unemptyString(name)) {
            debug.warn('entity name must be a string');
            return this;
        }

        var entityPattern = register.getEntityPattern(name);

        if (is.not.object(entityPattern)) {
            debug.warn('entity pattern for %s does not exist', name);
            return this;
        }

        var args = slice.call(arguments, 1);
        args.unshift(this.game);

        var entity = this._entitiesPool[name].get();
        entity = entity || new Entity(name, entityPattern, this);

        entityPattern.create.apply(entity, args);
        
        this._entitiesToAdd.put(entity);

        return this;
    },
    remove: function (entity) {
        if (entity == null) {
            return this;
        }

        this._entitiesToRemove.put(entity);

        return this;
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
        if (this._queries.indexOf(query) === -1) {
            this._initializeQuery(query);
        }

        return query.entities;
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

        var pattern = register.getSystemPattern(systemName);

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

        newSystem.engine = this;
        newSystem.game = this.game;

        this._systemsToAdd.put(newSystem);

        return this;
    },
    removeSystem: function (system) {
        if (system == null) {
            debug.warn('System to remove has to be an object.');
            return this;
        }

        this._systemsToRemove.put(system);
    },
    enableSystem: function (system) {
        if (system == null) {
            return;
        }

        system._disabled = false;
    },
    disableSystem: function (system) {
        if (system == null) {
            return;
        }

        system._disabled = true;
    },
    markModifiedEntity: function (entity) {
        if (entity.id === 0) {
            return;
        }

        if (array.indexOf(this._modifiedEntities, this._modifiedEntitiesLength, entity.id) !== -1) {
            return;
        }

        array.push(this._modifiedEntities, this._modifiedEntitiesLength++, entity.id);
    },
    clear: function () {
        


    },
    update: function (event) {
        var delta = event.delta;
        var i, j, len, system, id, name, index, indexOfEntity, indexLength;
        var query, queries = this._queries;
        var systemEntities = this._entities;
        var modifiedEntities = this._modifiedEntities;

        for (i = 0, len = this._systems.length; i < len; i++) {
            system = this._systems[i];
            
            if (system._disabled) {
                continue;
            }

            system.update(delta);
        }

        /**
         * Removing entities.
         */
        var entityToRemove;
        while (entityToRemove = this._entitiesToRemove.get()) {
            for (i = 0, len = this._queries.length; i < len; i++) {
                query = queries[i];

                if (!query.satisfiedBy(entityToRemove)) {
                    continue;
                }

                index = query.index;
                indexOfEntity = array.indexOf(index, query.indexLength, entityToRemove.id);

                if (indexOfEntity !== -1) {
                    query.touched = true;
                    array.removeAtIndexConst(index, query.indexLength--, indexOfEntity);
                }
            }

            if (is.function(entityToRemove.pattern.remove)) {
                entityToRemove.pattern.remove.call(entityToRemove, this.game);
            }

            systemEntities[entityToRemove.id] = 0;
            entityToRemove.id = 0;

            name = entityToRemove.name;

            this._entitiesPool[name].put(entityToRemove);
            this._entitiesCount -= 1;
        }

        /**
         * Adding entities.
         */
        var entityToAdd;
        while (entityToAdd = this._entitiesToAdd.get()) {

            id = this._generateEntityID();

            if (id > systemEntities.length) {
                array.extend(systemEntities, Math.round(1.25 * systemEntities.length));
            }

            entityToAdd.id = id;
            systemEntities[id] = entityToAdd;
            
            for (i = 0, len = this._queries.length; i < len; i++) {
                query = queries[i];

                if (!query.satisfiedBy(entityToAdd)) {
                    continue;
                }

                query.touched = true;
                array.push(query.index, query.indexLength++, id);
            }

            this._entitiesCount += 1;
        }

        /**
         * Modifying entities.
         */
        i = 0;
        var modifiedEntity;
        while (modifiedEntity = systemEntities[modifiedEntities[i]]) {

            modifiedEntity.applyModifications();

            for (j = 0, len = this._queries.length; j < len; j++) {
                query = queries[j];

                index = query.index;
                indexLength = query.indexLength;

                var satisfied = query.satisfiedBy(modifiedEntity);
                var indexOfEntity =  array.indexOf(index, indexLength, modifiedEntity.id);

                if (satisfied && indexOfEntity === -1) {
                    query.touched = true;
                    array.push(index, query.indexLength++, modifiedEntity.id);
                } else if (!satisfied && indexOfEntity !== -1) {
                    query.touched = true;
                    array.removeAtIndexConst(index, query.indexLength--, indexOfEntity);
                }
            }

            i++;
        }
        array.clear(this._modifiedEntities, this._modifiedEntitiesLength);
        this._modifiedEntitiesLength = 0;

        /**
         * Removing systems.
         */
        var systemToRemove;
        while (systemToRemove = this._systemsToRemove.get()) {
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

            var index = query.index;
            var entities = query.entities;
            var entitiesLength = 0;
            i = 0;
            while (id = index[i]) {
                array.push(entities, entitiesLength++, systemEntities[id]);
                i += 1;
            }

            array.push(entities, entitiesLength, 0);
            query.entitiesLength = entitiesLength;
            query.touched = false;
        }
    },
    _getNewComponent: function (name) {
        var component;
        var componentPattern = register.getComponentPattern(name);

        if (is.not.object(componentPattern)) {
            return null;
        }

        component = this._componentsPool[name].get();

        if (component == null) {
            component = {
                _pattern: componentPattern
            };
        } else if (is.function(component._pattern.reset)) {
            component._pattern.reset.call(component);
        }
        
        return component;
    },
    _addComponentToPool: function (component) {
        this._componentsPool[component._pattern.name].put(component);
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