import { compose } from 'stampit';
import pickBy from 'lodash/pickBy';
import { isFunction } from './helpers';

import Pool from './Pool';
import Component from './Component';

/**
 * Module that gathers in one place various operations on components: registering, creating
 *
 * @class ComponentStore
 */
const ComponentStore = compose({
  init() {
    /**
     * Stores the gratest component's ID so far. Every component type when registered gets it's own unique ID.
     *
     * @private
     * @memberof Component#
     * @name _greatestComponentId
     * @type {Number}
     */
    this._greatestComponentId = 0;

    /**
     * Stores map of registered types to IDs.
     *
     * @example
     * {
     *   Position: 0,
     *   Velocity: 1,
     *   ...
     * }
     *
     * @private
     * @memberof Component#
     * @name _componentsIdsMap
     * @type {Object}
     */
    this._componentsIdsMap = {};

    /**
     * Object with instances of Pool, one for each component type. Type is a key.
     *
     * @private
     * @memberof Component#
     * @name _pools
     * @type {Object}
     */
    this._pools = {};

    /**
     * Object with components factories. Factories are created when component is registerd. Type is a key.
     *
     * @private
     * @memberof Component#
     * @name _factories
     * @type {Object}
     */
    this._factories = {};
  },
  methods: {
    /**
     * Registers component.
     *
     * @example
     * game.component.register({
     *   type: 'Position',
     *   onCreate(x, y) {
     *     this.x = x;
     *     this.y = y;
     *   },
     * });
     *
     * const c = game.component.create('Position', 1, 2);
     * c.x; // 1
     * c.y; // 2
     *
     * @public
     * @memberof ComponentStore#
     * @method register
     * @param {Object}    descriptor            object describing component
     * @param {String}    descriptor.type       type of components
     * @param {Function}  descriptor.onCreate   method called when component is created
     */
    register(descriptor) {
      this._factories[descriptor.type] = compose(Component, {
        methods: pickBy(descriptor, value => isFunction(value)),
      });

      // generating `id` for class of components
      this._componentsIdsMap[descriptor.type] = this._greatestComponentId;
      this._greatestComponentId += 1;

      this._pools[descriptor.type] = Pool({
        _new: (...args) => {
          const component = this._factories[descriptor.type]({
            type: descriptor.type,
            id: this._componentsIdsMap[descriptor.type],
          });

          component.onCreate(...args);

          return component;
        },
        _reuse: (component, ...args) => {
          component.onCreate(...args);

          return component;
        },
      });
    },
    /**
     * Registeres many components.
     *
     * @public
     * @memberof ComponentStore#
     * @method registerMany
     * @param  {Array} descriptiors array of component's descriptors (see {@link ComponentStore#register})
     */
    registerMany(descriptors) {
      descriptors.forEach(descriptor => this.register(descriptor));
    },
    /**
     * Creates new component instance or acquires one from pool.
     *
     * @public
     * @memberof ComponentStore#
     * @method create
     * @param  {String} type    type of component to create
     * @param  {...Any} ...args arguments passed to `onCreate` method
     * @return {Component}      new (or reused) component ready to add to entity
     */
    create(type, ...args) {
      return this._pools[type].allocate(...args);
    },
    /**
     * Frees component. Component is added to the pool.
     * This method is called internally by the engine, user should not call it.
     *
     * @public
     * @memberof ComponentStore#
     * @method free
     * @param  {Component} component component
     */
    free(component) {
      this._pools[component.getType()].free(component);
    },
  },
});

export default ComponentStore;
