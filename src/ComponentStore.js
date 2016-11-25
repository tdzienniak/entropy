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
    * [_greatestComponentId description]
    * @type {Number}
    */
    this._greatestComponentId = 0;

    /**
    * [_componentsIdsMap description]
    * @type {Object}
    */
    this._componentsIdsMap = {};

    /**
    * [_pools description]
    * @type {Object}
    */
    this._pools = {};

    /**
    * [_initializers description]
    * @type {Object}
    */
    this._factories = {};
  },
  methods: {
    /**
     * Registers component.
     *
     * @public
     * @memberof ComponentStore#
     * @method register
     * @param  {String} type   [description]
     * @param  {Function} initFn [description]
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
     * [registerComponents description]
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    registerMany(descriptors) {
      descriptors.forEach(descriptor => this.register(descriptor));
    },
    /**
     * [createComponent description]
     * @param  {[type]} name    [description]
     * @param  {[type]} ...args [description]
     * @return {[type]}         [description]
     */
    create(type, ...args) {
      return this._pools[type].allocate(...args);
    },
    /**
     * [freeComponent description]
     * @param  {[type]} component [description]
     * @return {[type]}           [description]
     */
    free(component) {
      this._pools[component.getType()].free(component);
    },
  },
});

export default ComponentStore;
