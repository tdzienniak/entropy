import { isArray, isString, isNonEmptyString, isObject } from './helpers';
import stampit from 'stampit';
import FastBitset from 'fastbitset';
import FastArray from 'fast-array';

/**
 * Used to perform matching of entities.
 *
 * @example
 * //matches entities with 'Position' and 'Velocity' components
 * const q1 = Query({
 *   criterions: ["Position", "Velocity"],
 * });
 *
 * //matches entities with 'Position' and 'Velocity' components and without 'Sprite' component
 * const q2 = Query({
 *   criterions: {
 *     include: ["Position", "Velocity"],
 *     exclude: ["Sprite"],
 *   },
 * });
 *
 * //matches entities of type 'Ball'
 * const q3 = Query({
 *   criterions: {
 *     entityType: "Ball",
 *   },
 * });
 *
 * @class Query
 * @param {Object}       opts
 * @param {Object|Array} opts.criterions query criterions
 */
const Query = stampit({
  deepProps: {
    _shouldUpdate: false,
  },
  init(opts) {
    let include = [];
    let exclude = [];
    let includeBitset;
    let excludeBitset;

    if (isArray(opts.criterions)) {
      include = opts.criterions;
    } else if (isObject(opts.criterions)) {
      if (isNonEmptyString(opts.criterions.entityType)) {
        this._matchType = opts.criterions.entityType;
      }

      if (isArray(opts.criterions.include)) {
        include = opts.criterions.include;
      }

      if (isArray(opts.criterions.exclude)) {
        exclude = opts.criterions.exclude;
      }
    }

    if (include.length > 0) {
      includeBitset = new FastBitset();
      for (let i = 0; i < include.length; i += 1) {
        includeBitset.add(opts.componentsIdsMap[include[i]]);
      }
    }

    if (exclude) {
      excludeBitset = new FastBitset();
      for (let e = 0; e < exclude.length; e += 1) {
        excludeBitset.add(opts.componentsIdsMap[exclude[e]]);
      }
    }

    this._entitiesIndex = FastArray();
    this._matchedEntities = FastArray();

    this._result = {
      entities: this._matchedEntities.arr,
      length: 0,
    };

    this._includes = includeBitset;
    this._excludes = excludeBitset;
  },
  methods: {
    /**
     * Initializes query. Builds initial entities index.
     *
     * @public
     * @memberof Query#
     * @method initialize
     * @param {FastArray} allEntities fast array of all entities present in the engine
     */
    initialize(allEntities) {
      for (let i = 0; i < allEntities.length; i += 1) {
        const entity = allEntities.arr[i];

        if (entity !== 0 && this.satisfiedBy(entity)) {
          this.addToIndex(entity.id);
        }
      }

      this.update(allEntities);
    },
    /**
     * Checks if entity satisfies query criterions.
     *
     * @public
     * @memberof Query#
     * @method satisfiedBy
     * @param {Entity} entity entity to check
     */
    satisfiedBy(entity) {
      let satisfies = true;

      if (isString(this._matchType)) {
        satisfies = entity.type === this._matchType;
      }

      if (satisfies && this._includes) {
        satisfies = this._includes.intersection_size(entity.bitset) === this._includes.size();
      }

      if (satisfies && this._excludes) {
        satisfies = this._excludes.intersection_size(entity.bitset) === 0;
      }

      return satisfies;
    },
    /**
     * Checks if query should update.
     *
     * Query should update when entities matching its criterions are added or removed from engine.
     * It should also update when entity that was matching criterions has changed and doesn't match it anymore.
     *
     * @public
     * @memberof Query#
     * @method shouldUpdate
     */
    shouldUpdate() {
      return this._shouldUpdate;
    },
    /**
     * Adds entity ID to query index.
     *
     * @public
     * @memberof Query#
     * @method addToIndex
     * @param {Number} entityId
     */
    addToIndex(entityId) {
      this._shouldUpdate = true;
      this._entitiesIndex.push(entityId);
    },
    /**
     * Removes entity ID from query index.
     *
     * @public
     * @memberof Query#
     * @method removeFromIndex
     * @param {Number} entityId
     */
    removeFromIndex(entityId) {
      const indexOfEntity = this._entitiesIndex.indexOf(entityId);

      if (indexOfEntity !== -1) {
        this._shouldUpdate = true;
        this._entitiesIndex.unsetAtIndex(indexOfEntity);
      }
    },
    /**
     * Returns entities matched by query.
     *
     * Returns object with following properties:
     * - `length` - number of matched entities
     * - `entities` - array with matched entities. __This array length is usually not the same as matched entities number!__
     *
     * @public
     * @memberof Query#
     * @method getEntities
     * @returns {Object}
     */
    getEntities() {
      this._result.length = this._matchedEntities.length;
      return this._result;
    },
    /**
     * Updates internal matched entities with index.
     *
     * @public
     * @memberof Query#
     * @method update
     * @param {FastArray} allEntities fast array of all entities present in the engine
     */
    update(allEntities) {
      if (!this._shouldUpdate) {
        return;
      }

      this._entitiesIndex.compact();
      this._matchedEntities.clear();

      for (let i = 0; i < this._entitiesIndex.length; i += 1) {
        const entityId = this._entitiesIndex.arr[i];

        this._matchedEntities.push(allEntities.arr[entityId]);
      }

      this._shouldUpdate = false;
    },
  },
});

export default Query;
