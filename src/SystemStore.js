import { compose } from 'stampit';
import pickBy from 'lodash/pickBy';
import { isFunction } from './helpers';
import System from './System';

const SystemStore = compose({
  init(opts) {
    this.game = opts.game;
    /**
    * [_initializers description]
    * @type {Object}
    */
    this._factories = {};
  },
  methods: {
    /**
     * [registerSystem description]
     * @param  {[type]} name   [description]
     * @param  {[type]} initFn [description]
     * @return {[type]}        [description]
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
     * [registerSystems description]
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    registerMany(descriptors) {
      descriptors.forEach(descriptor => this.register(descriptor));
    },
    /**
     * [createSystem description]
     * @param  {[type]} name    [description]
     * @param  {[type]} ...args [description]
     * @return {[type]}         [description]
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
