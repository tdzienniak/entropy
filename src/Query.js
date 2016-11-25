import { isArray, isString, isNonEmptyString, isObject } from './helpers';
import stampit from 'stampit';
import FastBitset from 'fastbitset';
import FastArray from 'fast-array';

/**
 * Used to perform matching of entities.
 * Only parameter is an array of component names to include or object with `include` and/or `exclude` properties,
 * witch are arrays of component names to respectively include and/or exclude. Object can also have `name` property,
 * that will match entities with given name.
 *
 * @example
 *     //matches entities with 'Position' and 'Velocity' components
 *     var q1 = game.createQuery(["Position", "Velocity"]);
 *
 *     //matches entities with 'Position' and 'Velocity' components and without 'Sprite' component
 *     var q2 = new Entropy.Query({
 *         include: ["Position", "Velocity"],
 *         exclude: ["Sprite"]
 *     });
 *
 *     //matches entities with name 'Ball'
 *     var q3 = new Entropy.Query({
 *         name: "Ball"
 *     });
 *
 * @class Query
 * @constructor
 * @param {Object|Array} query query conditions
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

    this._includes = includeBitset;
    this._excludes = excludeBitset;
  },
  methods: {
    /**
     * [initialize description]
     * @param  {[type]} allEntities [description]
     * @return {[type]}             [description]
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
     * [satisfiedBy description]
     * @param  {[type]} entity [description]
     * @return {[type]}        [description]
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
     * [shouldUpdate description]
     * @return {[type]} [description]
     */
    shouldUpdate() {
      return this._shouldUpdate;
    },
    /**
     * [addToIndex description]
     * @param {[type]} entityId [description]
     */
    addToIndex(entityId) {
      this._shouldUpdate = true;
      this._entitiesIndex.push(entityId);
    },
    /**
     * [removeFromIndex description]
     * @param  {[type]} entityId [description]
     * @return {[type]}          [description]
     */
    removeFromIndex(entityId) {
      const indexOfEntity = this._entitiesIndex.indexOf(entityId);

      if (indexOfEntity !== -1) {
        this._shouldUpdate = true;
        this._entitiesIndex.unsetAtIndex(indexOfEntity);
      }
    },
    /**
     * [getEntities description]
     * @return {[type]} [description]
     */
    getEntities() {
      return this._matchedEntities;
    },
    /**
     * [update description]
     * @param  {[type]} allEntities [description]
     * @return {[type]}             [description]
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
