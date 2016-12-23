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
  init({ game }) {
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
     * Registers entity. Entity has to be registered before it can be created.
     *
     * @example
     * game.entity.register({
     *   type: 'Ball',
     *   onCreate(x, y, texture) {
     *     const sprite = Sprite(texture);
     *
     *     this.addComponent('Position', x, y);
     *     this.addComponent('Sprite', sprite);
     *
     *     // add sprite to stage for renderer (when using PIXI this has to be done)
     *     this.game.stage.addChild(sprite);
     *   },
     *   onRemove() {
     *     this.game.stage.removeChild(this.components.sprite.sprite);
     *   },
     * });
     *
     * const c = game.entity.create('Ball', 1, 2, 'ball.png');
     *
     * @public
     * @memberof EntityStore#
     * @method register
     * @param {Object}    descriptor            object describing entity
     * @param {String}    descriptor.type       type of entity
     * @param {Function}  descriptor.onCreate   method called when entity is created (may be recycled from pool)
     * @param {Function}  descriptor.onReuse    method called when entity is reused from pool (called before `onCreate`)
     * @param {Function}  descriptor.onRemove   method called when entity is removed (usually it returns to a pool)
     */
    register(descriptor) {
      this._factories[descriptor.type] = compose(Entity, {
        methods: pickBy(descriptor, value => isFunction(value)),
      });

      this._pools[descriptor.type] = Pool({
        _new: (...args) => {
          const entity = this._factories[descriptor.type]({
            game: this.game,
            type: descriptor.type,
          });

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
     * Registeres many entities.
     *
     * @public
     * @memberof EntityStore#
     * @method registerMany
     * @param  {Array} descriptiors array of entity's descriptors (see {@link EntityStore#register})
     */
    registerMany(descriptors) {
      descriptors.forEach(descriptor => this.register(descriptor));
    },
    /**
     * Creates new entity instance or acquires one from pool.
     *
     * @public
     * @memberof EntityStore#
     * @method create
     * @param  {String} type    type of entity to create
     * @param  {...Any} ...args arguments passed to `onCreate` method
     * @return {Entity}         new (or reused) entity ready to be added to engine
     */
    create(type, ...args) {
      return this._pools[type].allocate(...args);
    },
    /**
     * Frees entity. Entity is added to the pool. Marks entity as recyceled.
     *
     * _This method is called internally by the engine, user should not call it._
     *
     * @public
     * @memberof EntityStore#
     * @method free
     * @param  {Entity} entity entity
     */
    free(entity) {
      entity.markAsRecycled();

      this._pools[entity.type].free(entity);
    },
  },
});

export default EntityStore;
