'use strict';

var extend = require('node.extend');
var config = require('./config');
var array = require('./fastarray');
var is = require('check-types');
var debug = require('./debug');
var register = require('./register');
var slice = Array.prototype.slice;

var EventEmitter = require('./event');
var Pool = require('./pool');
var Entity = require('./entity');

/**
 * Engine class. Class is used internaly. User should not instatiate this class.
 *
 * @class Engine
 * @extends EventEmitter
 * @constructor
 */
function Engine (game) {
    EventEmitter.call(this);

    /**
     * Instance of {{#crossLink "Game"}}Game{{/crossLink}} class.
     *
     * @property game
     * @type {Game}
     */
    this.game = game;

    /**
     * Indicates the greatest entity ID present in the system.
     * Used to generate new IDs.
     *
     * @property _greatestEntityID
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
     * First element is empty (equals 0), because entity IDs start from 1.
     * Entity with `id` property equal 0 is _officially_ not present in the system (it can be for example present in the pool or waiting for addition to system).
     *
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

    /**
     * Indicates whether clearing is scheduled.
     * 
     * @property _isClearingScheduled
     * @private
     * @type {Boolean}
     */
    this._isClearingScheduled = false;

    /**
     * Indicates whether clearing was performed.
     *
     * @property _wasClearingPerformed
     * @private
     * @type {Boolean}
     */
    this._wasClearingPerformed = false;
}

extend(Engine.prototype, EventEmitter.prototype);
extend(Engine.prototype, {
    /**
     * Creates new entity using pattern identified by `name` parameter.
     * Every additional parameter will be applied to patterns `create` method.
     * Patterns `create` method is called imediatelly after calling this method.
     *
     * @example
     *     game.engine.create("Ball", 5, 5, 5); //x, y, radius
     *
     * @method create
     * @param  {String} ...name first argument is a name of entity (entity pattern). Every additional argument will be applied to patterns `create` method.
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

        if (this._entitiesPool[name] == null) {
            this._entitiesPool[name] = new Pool(config('initial_entities_pool_size'));
        }

        var entity = this._entitiesPool[name].get();
        entity = entity || new Entity(name, entityPattern, this);

        entityPattern.create.apply(entity, args);

        this._entitiesToAdd.put(entity);

        return this;
    },
    /**
     * Removes entity from engine.
     * Entity removal does not happen imediatelly, but after current update cycle.
     *
     * @example
     *     //somwhere in the system 'update' method
     *     if (entity.components.hp.quantity <= 0) { //entity is dead, remove
     *         game.engine.remove(entity);
     *     }
     *
     * @method remove
     * @param  {Entity} entity Entity instance
     * @return {Engine}        Engine instance
     */
    remove: function (entity) {
        if (is.not.object(entity)) {
            debug.error('entity to remove has to be an object.')

            return this;
        }

        this._entitiesToRemove.put(entity);

        return this;
    },
    getAllEntities: function () {

    },
    /**
     * Returns array of entities satisfying given {{#crossLink "Query"}}query{{/crossLink}} conditions.
     * Returned arrays length does not correspond with matched entities quantity.
     * To loop over entities start from 0 index, and then check if element is different than 0.
     * This method guaranties, that entities will be arranged as subsequent array slice, starting from 0 index and ending on element equal to 0.
     * The array is in this form for performance reasons.
     *
     * @example
     *     //in systems 'initialize' method...
     *     this.query = new Entropy.Engine.Query(["Position", "Velocity"]);
     *
     *     //in systems 'update' method
     *     var movingEntities = this.engine.getEntities(this.query);
     *
     *     //here do something with entities in loop
     *     ...
     *
     * @method getEntities
     * @param  {Query}  query query object
     * @return {Array}  array of matched entities
     */
    getEntities: function (query) {
        if (this._queries.indexOf(query) === -1) {
            this._initializeQuery(query);
        }

        return query.entities;
    },
    getOne: function (query) {
        return this.getEntities(query)[0];
    },
    /**
     * Creates new system object and adds it to the engine. System patterns `initialize` method is called (if present).
     * It can be called in two ways - with first argument being either:
     * - system name - then system has priority as defined by patterns `priority` property or 0.
     * - array with two elements - system name and its desired priority. In this case patterns `priority` property is simply skiped.
     *
     * @example
     *     game.engine.addSystem("Renderer", rendererObject);
     *
     *     //or
     *
     *     game.engine.addSystem(["Renderer", 1], rendererObject);
     *
     * @method addSystem
     * @param {String|Array} ...name name of a system or array with two elements - name of a system and desired priority (see example). Additional arguments are applied to patterns `initialize` method.
     * @return {Engine} engine instance
     */
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
            debug.warn('There is no system %s.', systemName);
            return this;
        }

        if (pattern.singleton) {
            var foundOne = false;
            
            for (var i = 0, len = this._systems.length; i < len; i++) {
                if (this._systems[i].name === pattern.name) {
                    foundOne = true;
            
                    break;
                }
            }

            this._systemsToAdd.each(function (systemToAdd) {
                if (systemToAdd.name === pattern.name) {
                    foundOne = true;
                }
            })

            if (foundOne) {
                debug.info('System you want to add is a singleton and there is one already present in the engine. Returning...');
                return this;    
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
        newSystem.engine = this;
        newSystem.game = this.game;

        if (is.function(newSystem.initialize)) {
            newSystem.initialize.apply(newSystem, args);
        }


        this._systemsToAdd.put(newSystem);

        return this;
    },
    removeSystem: function (system) {
        var systemObject;
        
        if (is.object(system)) {
            systemObject = system;
        } else if (is.unemptyString(system)) {
            for (var i = 0; i < this._systems.length; i++) {
                if (this._systems[i].name === system) {
                    systemObject = this._systems[i];

                    break;
                }
            }

            if (systemObject == null) {
                debug.log('there is no such system: %s', system);

                return this;
            }
        } else {
            debug.warn('System to remove has to be an object or a string (system name).');
            
            return this;
        }

        this._systemsToRemove.put(systemObject);

        return this;
    },
    enableSystem: function (system) {
        this._toggleSystem(system, false);
    },
    disableSystem: function (system) {
        this._toggleSystem(system, true);
    },
    hasSystem: function (system, checkWaitingQueue) {

    },
    _toggleSystem: function (system, onOff) {
        if (system == null) {
            return;
        }

        if (is.object(system)) {
            system._disabled = onOff;
        } else if (is.unemptyString(system)) {
            var systemObject;
            for (var i = 0; i < this._systems.length; i++) {
                systemObject = this._systems[i];
                if (systemObject.name === system) {
                    systemObject._disabled = onOff;
                    
                    return;
                }
            }
        }
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
    /**
     * Schedules clearing. Clearing is usually not done immediately, because removing entities and systems during game loop is dangerous and
     * can result in some strange system behaviors. Thus, clearing is performed at the end of the game loop, after all systems have updated.
     * The event `cleared` is fired when clearing is done, so it is good idea to, for example, stop the game in this listener.
     * 
     * @method clear
     */
    clear: function () {
        this._isClearingScheduled = true;
    },
    _performScheduledClearing: function () {
        var entity, entityToAdd, systemToAdd;
        
        /**
         * Mark for removal all present entities.
         */
        for (var i = 1; i <= this._greatestEntityID; i++) {
            entity = this._entities[i];

            if (entity == null || entity.id === 0) {
                continue;
            }

            this._entitiesToRemove.put(entity);
        }

        /**
         * Cancel addition of any entities. 
         */
        while (entityToAdd = this._entitiesToAdd.get()) {
            if (is.function(entityToAdd.pattern.remove)) {
                entityToAdd.pattern.remove.call(entityToAdd, this.game);
            }

            //Go back to pool, you stupid entity!
            this._entitiesPool[entityToAdd.pattern.name].put(entityToAdd);
        }

        /**
         * Cancel addition of any systems.
         */
        while (systemToAdd = this._systemsToAdd.get()) {
            if (is.function(systemToAdd.remove)) {
                systemToAdd.remove();
            }
        }
        
        /**
         * Mark for removal any present systems.
         */
        for (var i = 0, len = this._systems.length; i < len; i++) {
            this._systemsToRemove.put(this._systems[i]);
        }
    },
    update: function (event) {
        var delta = event.delta;
        var system;

        for (var i = 0, len = this._systems.length; i < len; i++) {
            system = this._systems[i];

            if (system._disabled) {
                continue;
            }

            system.update(delta);
        }

        if (this._isClearingScheduled) {
            this._performScheduledClearing();

            this._wasClearingPerformed = true;
        }

        this._removeEntities();
        this._addEntities();
        this._modifyEntities();
        this._removeSystems();
        this._addSystems();
        this._fetchQueries();

        if (this._wasClearingPerformed) {
            this.emit('cleared');

            this._wasClearingPerformed = false;
            this._isClearingScheduled = false;
        }
    },
    _removeEntities: function () {
        var entityToRemove, i, len,
            index,
            indexOfEntity,
            name,
            query,
            queries = this._queries,
            systemEntities = this._entities;

        while (entityToRemove = this._entitiesToRemove.get()) {
            if (entityToRemove.id === 0) {
                continue;
            }

            for (i = 0, len = queries.length; i < len; i++) {
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

            this.emit('entityRemoved', entityToRemove);
        }
    },
    _addEntities: function () {
        var id, i, len,
            entityToAdd,
            query,
            queries = this._queries,
            systemEntities = this._entities;

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

            this.emit('entityAdded', entityToAdd);
        }
    },
    _modifyEntities: function () {
         var i = 0, j, index, indexLength, len,
            query,
            queries = this._queries,
            modifiedEntity,
            systemEntities = this._entities,
            modifiedEntities = this._modifiedEntities;

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
    },
    _removeSystems: function () {
        var systemToRemove;
        while (systemToRemove = this._systemsToRemove.get()) {
             var indexOfSystem = this._systems.indexOf(systemToRemove);

            if (indexOfSystem === -1) {
                //debug.warn('Nothing to remove.');
                continue;
            }

            if (is.function(systemToRemove.remove)) {
                systemToRemove.remove();
            }

            array.removeAtIndex(this._systems, indexOfSystem);

            this.emit('systemRemoved', systemToRemove);
        }
    },
    _addSystems: function () {
        var systemToAdd, len;
        while (systemToAdd = this._systemsToAdd.get()) {
            var insertionIndex = 0;
            var priority = systemToAdd.priority;
            for (len = this._systems.length; insertionIndex < len; insertionIndex++) {
                if (this._systems[insertionIndex].priority > priority) {
                    break;
                }
            }

            this._systems.splice(insertionIndex, 0, systemToAdd);

            this.emit('systemAdded', systemToAdd);
        }
    },
    _fetchQueries: function () {
        var i, id, index, len,
            query,
            systemEntities = this._entities,
            queries = this._queries;

        for (i = 0, len = this._queries.length; i < len; i++) {
            query = queries[i];
            if (!query.touched) {
                continue;
            }

            index = query.index;
            var entities = query.entities;
            var entitiesLength = 0;
            var j = 0;
            while (id = index[j]) {
                array.push(entities, entitiesLength++, systemEntities[id]);
                j += 1;
            }

            array.push(entities, entitiesLength, 0);
            query.entitiesLength = entitiesLength;
            query.touched = false;
        }
    },
    _getNewComponent: function (name) {
        var component;
        var componentPattern = register.getComponentPattern(name);
        var poolJustCreated = false;

        if (is.not.object(componentPattern)) {
            return null;
        }

        if (this._componentsPool[name] == null) {
            this._componentsPool[name] = new Pool(config('initial_components_pool_size'));

            poolJustCreated = true;
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
        if (this._componentsPool[name] == null) {
            this._componentsPool[name] = new Pool(config('initial_components_pool_size'));
        }
        
        this._componentsPool[component._pattern.name].put(component);
    },
    /**
     * Returns ID for an entity. Reuses old IDs or creates new.
     *
     * @private
     * @method _generateEntityID
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
     * @private
     * @method  _initializeQuery
     * @param {Object} query query object
     */
    _initializeQuery: function (query) {
        //TODO: add check for existing query

        var entities = array.alloc(1000);
        var entitiesLength = 0;
        var index = array.alloc(1000);
        var indexLength = 0;

        var entity;
        for (var i = 1, greatestID = this._greatestEntityID; i <= greatestID; i++) {
            entity = this._entities[i];
            if (entity === 0) {
                continue;
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

/**
 * Entity added.
 *
 * @event entityAdded
 */

/**
 * Entity removed.
 *
 * @event entityRemoved
 */

/**
 * System added.
 * 
 * @event systemAdded
 */

/**
 * System removed.
 * 
 * @event systemRemoved
 */

/**
 * Fired at the and of game loop, when the scheduled clearing was performed.
 * 
 * @event cleared
 */

module.exports = Engine;