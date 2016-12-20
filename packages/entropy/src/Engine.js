import { compose } from 'stampit';
import isStamp from 'stampit/isStamp';
import FastArray from 'fast-array';

import EventEmitter from './EventEmitter';
import Pool from './Pool';
import { isNonEmptyString } from './helpers';

/**
 * This module manages the state of entities, components and systems. The heart of Entropy.
 *
 * @class Engine
 * @extends EventEmitter
 */
const Engine = compose({
  init(opts) {
    // entity ids start from 1, 0 means uninitailized or disabled entity
    let greatestEntityID = 1;

    /**
     * When entity is removed, it's ID can be reused by new entities. This pool stores old IDs ready to reuse.
     *
     * @private
     * @name _entitiesIdsPool
     * @memberof Engine#
     * @type Pool
     */
    this._entitiesIdsPool = Pool({
      _new() {
        return greatestEntityID++;
      },
    });

    /**
     * Systems that are processed every tick.
     *
     * @private
     * @name _systems
     * @memberof Engine#
     * @type FastArray
     */
    this._systems = FastArray({
      initialSize: 10,
    });

    /**
     * Array with entities. Array index corresponds to ID of an entity.
     * First element is empty (equals 0), because entity IDs start from 1.
     * Entity with `id` property equal 0 is _officially_ not present
     * in the system (it can be for example present in the pool or waiting
     * for addition to system).
     *
     * @private
     * @name _entities
     * @memberof Engine#
     * @type FastArray
     */
    this._entities = FastArray();

    /**
     * List of modified entities.
     *
     * When entity is modified it is added to this list. After each frame modifications are applied to every entity on the list.
     *
     * @private
     * @name _modifiedEntities
     * @memberof Engine#
     * @type FastArray
     */
    this._modifiedEntities = FastArray();

    /**
     * Queue of entities ready to be added on next tick.
     *
     * @private
     * @name _entitiesToAdd
     * @memberof Engine#
     * @type FastArray
     */
    this._entitiesToAdd = FastArray();

    /**
     * Queue of entities ready to be removed on next tick.
     *
     * @private
     * @name _entitiesToRemove
     * @memberof Engine#
     * @type FastArray
     */
    this._entitiesToRemove = FastArray();

    /**
     * Queue of systems ready to be added on next tick.
     *
     * @private
     * @name _systemsToAdd
     * @memberof Engine#
     * @type FastArray
     */
    this._systemsToAdd = FastArray({
      initialSize: 10,
    });

    /**
     * Queue of systems ready to be removed on next tick.
     *
     * @private
     * @name _systemsToRemove
     * @memberof Engine#
     * @type FastArray
     */
    this._systemsToRemove = FastArray({
      initialSize: 10,
    });

    /**
     * Array of queries. Every query that was used is stored here and updated when engine state changes.
     *
     * @private
     * @name _queries
     * @memberof Engine#
     * @type {Array}
     */
    this._queries = [];

    /**
     * Current number of entities active.
     *
     * @private
     * @name _entitiesCount
     * @memberof Engine#
     * @type {Number}
     */
    this._entitiesCount = 0;

    /**
     * Indicates whether clearing is scheduled.
     *
     * @private
     * @name _isClearingScheduled
     * @memberof Engine#
     * @type {Boolean}
     */
    this._isClearingScheduled = false;

    /**
     * Indicates whether clearing was performed.
     *
     * @private
     * @name _wasClearingPerformed
     * @memberof Engine#
     * @type {Boolean}
     */
    this._wasClearingPerformed = false;

    this.game = opts.game;
  },
  methods: {
    /**
     * Adds entity to adding queue.
     * If entity is new (not recycled), adds event listener for modifications.
     *
     * @memberof Engine#
     * @param {Entity} entity entity to add
     */
    addEntity(entity) {
      if (!entity.isRecycled()) {
        entity.on('queueModification', () => {
          this._markModifiedEntity(entity);
        });
      }

      if (this.game.isRunning()) {
        this._entitiesToAdd.push(entity);
      } else {
        this._addEntity(entity);
      }
    },
    /**
     * Adds entity to removing queue.
     *
     * @memberof Engine#
     * @param {Entity} entity entity to remove
     */
    removeEntity(entity) {
      if (this.game.isRunning()) {
        this._entitiesToRemove.push(entity);
      } else {
        this._removeEntity();
      }
    },
    /**
     * Adds system to adding queue.
     *
     * @memberof Engine#
     * @param {System} system to add
     */
    addSystem(system) {
      this._systemsToAdd.push(system);
    },
    /**
     * Adds system to removing queue.
     *
     * @memberof Engine#
     * @param {String|System} systemOrType system instance or system type to remove
     */
    removeSystem(systemOrType) {
      let system;

      if (isStamp(systemOrType)) {
        system = systemOrType;
      } else if (isNonEmptyString(systemOrType)) {
        system = this._systems.find(s => s.type === systemOrType);
      }

      if (system) {
        this._systemsToRemove.push(system);
      }
    },
    /**
     * Gets entities matching query criterions.
     *
     * @memberof Engine#
     * @param {Query} query query
     * @return {Object} object with `entities` and `length` properties
     */
    getEntities(query) {
      if (this._queries.indexOf(query) === -1) {
        this._initializeQuery(query);
      }

      return query.getEntities();
    },
    /**
     * Updates the engine:
     * - updates systems (calls `onUpdate` method of every active system)
     * - performs clearing, if scheduled
     * - applies engine modifications (adding/removing entities/systems, updating queries)
     *
     * @memberof Engine#
     * @fires Engine#clear
     * @param {...Any} args arguments passed to systems `onUpdate` methods
     */
    update(...args) {
      this._updateSystems(...args);

      if (this._isClearingScheduled) {
        this._performScheduledClearing();
      }

      this._removeEntities();
      this._addEntities();
      this._modifyEntities();
      this._removeSystems();
      this._addSystems();
      this._updateQueries();

      if (this._wasClearingPerformed) {
        /**
         * Engine was cleared.
         *
         * @event Engine#clear
         */
        this.emit('clear');

        this._wasClearingPerformed = false;
        this._isClearingScheduled = false;
      }
    },
    /**
     * Schedules clearing. Clearing is done on next frame.
     *
     * @memberof Engine#
     */
    clear() {
      this._isClearingScheduled = true;
    },
    _markModifiedEntity(entity) {
      if (entity.id !== 0 && this._modifiedEntities.indexOf(entity) === -1) {
        if (this.game.isRunning()) {
          this._modifiedEntities.push(entity);
        } else {
          this._modifyEntity(entity);
        }
      }
    },
    _updateSystems(...args) {
      for (let i = 0; i < this._systems.length; i += 1) {
        const system = this._systems.arr[i];

        if (!system._disabled) {
          system.onUpdate(...args);
        }
      }
    },
    _removeEntities() {
      while (this._entitiesToRemove.length) {
        this._removeEntity(this._entitiesToRemove.pop());
      }
    },
    _removeEntity(entity) {
      if (entity.id === 0) {
        return;
      }

      for (let i = 0; i < this._queries.length; i += 1) {
        const query = this._queries[i];

        if (query.satisfiedBy(entity)) {
          query.removeFromIndex(entity.id);
        }
      }

      entity.onRemove(entity);

      // remove entity from global index
      this._entities.unsetAtIndex(entity.id);

      // send unused entity ID to pool for later reuse
      this._entitiesIdsPool.free(entity.id);

      entity.removeAllComponents();

      // id = 0 indicates inactive entity
      entity.id = 0;

      this.game.entity.free(entity);

      this._entitiesCount -= 1;

      this.emit('entityRemove', entity);
    },
    _addEntities() {
      while (this._entitiesToAdd.length) {
        this._addEntity(this._entitiesToAdd.pop());
      }
    },
    _addEntity(entity) {
      const newEntityId = this._entitiesIdsPool.allocate();

      entity.id = newEntityId;

      this._entities.insertAtIndex(newEntityId, entity);

      for (let i = 0; i < this._queries.length; i += 1) {
        const query = this._queries[i];

        if (query.satisfiedBy(entity)) {
          query.addToIndex(newEntityId);
        }
      }

      this._entitiesCount += 1;

      this.emit('entityAdd', entity);
    },
    _modifyEntity(entity) {
      for (let i = 0; i < this._queries.length; i += 1) {
        const query = this._queries[i];

        const satisfiedBeforeModification = query.satisfiedBy(entity);

        entity.applyModifications();

        const satisfiesAfterModification = query.satisfiedBy(entity);

        if (!satisfiedBeforeModification && satisfiesAfterModification) {
          query.addToIndex(entity.id);
        } else if (satisfiedBeforeModification && !satisfiesAfterModification) {
          query.removeFromIndex(entity.id);
        }
      }
    },
    _modifyEntities() {
      while (this._modifiedEntities.length) {
        this._modifyEntity(this._modifiedEntities.pop());
      }
    },
    _addSystem(system) {
      let insertionIndex = 0;
      for (;insertionIndex < this._systems.length; insertionIndex += 1) {
        if (this._systems.arr[insertionIndex].priority > system.priority) {
          break;
        }
      }

      this._systems.insertBefore(insertionIndex, system);
    },
    _addSystems() {
      while (this._systemsToAdd.length) {
        this._addSystem(this._systemsToAdd.shift());
      }
    },
    _removeSystem(system) {
      const indexOfSystem = this._systems.indexOf(system);

      if (indexOfSystem !== -1) {
        system.onRemove();

        this._systems.removeAtIndex(indexOfSystem);
      }
    },
    _removeSystems() {
      while (this._systemsToRemove.length) {
        this._removeSystem(this._systemsToRemove.shift());
      }
    },
    _updateQueries() {
      for (let i = 0; i < this._queries.length; i += 1) {
        this._queries[i].update(this._entities);
      }
    },
    _performScheduledClearing() {
      this._wasClearingPerformed = true;
    },
    _initializeQuery(query) {
      query.initialize(this._entities);

      this._queries.push(query);
    },
  },
}, EventEmitter);

export default Engine;
