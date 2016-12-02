import { compose } from 'stampit';
import isStamp from 'stampit/isStamp';
import FastArray from 'fast-array';

import EventEmitter from './EventEmitter';
import Pool from './Pool';
import Query from './Query';
import { isNonEmptyString } from './helpers';

const Engine = compose({
  init(opts) {
  // entity ids start from 1, 0 means uninitailized or disabled entity
  let greatestEntityID = 1;

  /**
   * [Pool description]
   * @param {[type]} {    _new( [description]
   */
  this._entitiesIdsPool = Pool({
    _new() {
      return greatestEntityID++;
    },
  });

  /**
   * Systems that are processed every tick.
   *
   * @property _systems
   * @private
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
   * @property _entities
   * @private
   * @type Array
   */
  this._entities = FastArray();

  /**
   * [FastArray description]
   *
   * @property _modifiedEntities
   * @private
   * @type {FastArray}
   */
  this._modifiedEntities = FastArray();

  /**
   * [FastArray description]
   *
   * @property _entitiesToAdd
   * @private
   * @type {FastArray}
   */
  this._entitiesToAdd = FastArray();

  /**
   * [FastArray description]
   * @private
   */
  this._entitiesToRemove = FastArray();

  /**
   * [FastArray description]
   * @param {[type]} {                 initialSize: 10 [description]
   * @param {[type]} } [description]
   */
  this._systemsToAdd = FastArray({
    initialSize: 10,
  });

  /**
   * [FastArray description]
   * @private
   * @type {FastArray}
   */
  this._systemsToRemove = FastArray({
    initialSize: 10,
  });

  /**
   * [_queries description]
   * @private
   * @type {Array}
   */
  this._queries = [];

  /**
   * [_entitiesCount description]
   * @private
   * @type {Number}
   */
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

  this.game = opts.game;
  },
  methods: {
  /**
   * [addEntity description]
   * @param {[type]} nameOrEntity [description]
   * @param {[type]} ...args      [description]
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
   * [removeEntity description]
   * @param  {[type]} entity [description]
   * @return {[type]}        [description]
   */
  removeEntity(entity) {
      if (this.game.isRunning()) {
    this._entitiesToRemove.push(entity);
      } else {
        this._removeEntity();
      }
  },
  /**
   * [addSystem description]
   * @param {[type]} nameOrSystem [description]
   * @param {[type]} ...args      [description]
   */
  addSystem(system) {
    this._systemsToAdd.push(system);
  },
  /**
   * [removeSystem description]
   * @param  {[type]} systemOrName [description]
   * @return {[type]}              [description]
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
   * [getEntities description]
   * @param  {[type]} query [description]
   * @return {[type]}       [description]
   */
  getEntities(query) {
    if (this._queries.indexOf(query) === -1) {
      this._initializeQuery(query);
    }

    return query.getEntities();
  },
  /**
   * [getAllEntities description]
   * @return {[type]} [description]
   */
  getAllEntities() {
    return this._entities;
  },
  /**
   * [update description]
   * @param  {[type]} ...args [description]
   * @return {[type]}         [description]
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
      this.emit('clear');

      this._wasClearingPerformed = false;
      this._isClearingScheduled = false;
    }
  },
  /**
   * [clear description]
   * @return {[type]} [description]
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
