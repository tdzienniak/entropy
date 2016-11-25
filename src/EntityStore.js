import { compose } from 'stampit';
import pickBy from 'lodash/pickBy';
import { isFunction } from './helpers';

import Entity from './Entity';
import Pool from './Pool';

/**
 * Centralized place for registering, creating and reusing entities.
 *
 * __For internal use only!__
 *
 * @class EntityStore
 * @param {Object}          opts
 * @param {Entropy}         opts.game
 * @param {ComponentStore}  opts.componentStore
 */
const EntityStore = compose({
  init({ game, componentStore }) {
    /**
     * Object with different pool for each entity type.
     * Entity type is a key and {@link Pool} instance is a value.
     *
     * @private
     * @memberOf EntityStore#
     * @name _pools
     * @type Object
     */
    this._pools = {};

    /**
     * Object with factories for entity types.
     *
     * @private
     * @memberOf EntityStore#
     * @name _factories
     * @type Object
     */
    this._factories = {};

    /**
     * Game instance injected to constructor.
     *
     * @public
     * @memberOf EntityStore#
     * @name game
     * @type Entropy
     */
    this.game = game;
  },
  methods: {
    /**
     * [registerEntity description]
     * @param  {[type]} name   [description]
     * @param  {[type]} initFn [description]
     * @return {[type]}        [description]
     */
    register(descriptor) {
      this._factories[descriptor.type] = compose(Entity, {
        methods: pickBy(descriptor, value => isFunction(value)),
      });

      this._pools[descriptor.type] = Pool({
        _new: (...args) => {
          const entity = this._factories[descriptor.type]({
            type: descriptor.type,
          });

          entity.initialize();
          entity.onCreate(...args);

          return entity;
        },
        _reuse: (entity, ...args) => {
          entity.onReuse();
          entity.onCreate(...args);

          return entity;
        },
      });
    },
    /**
     * [registerEntities description]
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    registerMany(descriptors) {
      descriptors.forEach(descriptor => this.register(descriptor));
    },
    /**
     * [createEntity description]
     * @param  {[type]} name    [description]
     * @param  {[type]} ...args [description]
     * @return {[type]}         [description]
     */
    create(type, ...args) {
      return this._pools[type].allocate(...args);
    },
    free(entity) {
      entity.markAsUsed();

      this._pools[entity.type].free(entity);
    },
  }
});

export default EntityStore;
