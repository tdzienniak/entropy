import { compose } from 'stampit';
import pickBy from 'lodash/pickBy';
import { isFunction } from './helpers';
import System from './System';

/**
 * Centralized place for registering and creating systems.
 *
 * __For internal use only!__
 *
 * @class SystemStore
 * @param {Object}          opts
 * @param {Entropy}         opts.game game instance
 */
const SystemStore = compose({
  init(opts) {
    /**
     * Game instance injected to constructor.
     *
     * @public
     * @memberOf SystemStore#
     * @name game
     * @type Entropy
     */
    this.game = opts.game;

    /**
     * Object with factories for system types.
     *
     * @private
     * @memberOf SystemStore#
     * @name _factories
     * @type Object
     */
    this._factories = {};
  },
  methods: {
    /**
     * Registers system.
     *
     * @public
     * @memberof SystemStore#
     * @method register
     * @param {Object}    descriptor            object describing system
     * @param {String}    descriptor.type       type of system
     * @param {Function}  descriptor.onCreate   method called when system is created
     * @param {Function}  descriptor.onRemove   method called when system is removed
     * @param {Function}  descriptor.onUpdate   method called when system is updated
     */
    register(descriptor) {
      this._factories[descriptor.type] = compose(System, {
        properties: {
          type: descriptor.type,
        },
        methods: pickBy(descriptor, value => isFunction(value)),
      });
    },
    /**
     * Registeres many systems.
     *
     * @public
     * @memberof SystemStore#
     * @method registerMany
     * @param  {Array} descriptiors array of system's descriptors (see {@link SystemStore#register})
     */
    registerMany(descriptors) {
      descriptors.forEach(descriptor => this.register(descriptor));
    },
    /**
     * Creates new entity instance or acquires one from pool.
     *
     * @public
     * @memberof SystemStore#
     * @method create
     * @param  {String} type    type of system to create
     * @param  {...Any} args arguments passed to `onCreate` method
     * @return {System}         new system ready to be added to engine
     */
    create(type, ...args) {
      const system = this._factories[type]({
        game: this.game,
      });
      system.onCreate(...args);
      return system;
    },
  },
});

export default SystemStore;
