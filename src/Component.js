import { compose } from 'stampit';
import { toLowerFirstCase, isObject } from './helpers';

/**
 * Describes basic component properties.
 *
 * __For internal use only!__
 *
 * @class Component
 * @param {Object} opts
 * @param {String} opts.type
 * @param {Number} opts.id
 */
const Component = compose({
  init(opts) {
    /**
     * Type of component.
     *
     * @private
     * @memberof Component#
     * @name _type
     * @type {String}
     */
    this._type = opts.type;

    /**
     * ID of component. Each component type has it's own ID, which is used to identify its bit in entity's bitset.
     *
     * @private
     * @memberof Component#
     * @name _id
     * @type {Number}
     */
    this._id = opts.id;

    /**
     * Lowercase component type, which is used to identify component's instance when added to entity.
     * For type 'Position' propName is `position`. For type 'LifeTime' propName is `lifeTime`.
     *
     * @private
     * @memberof Component#
     * @name _propName
     * @type {String}
     */
    this._propName = toLowerFirstCase(opts.type);
  },
  methods: {
    /**
     * Run when component is created. Can be overriedden on component registration.
     * Default implementation coppies properties from first argument, if it's an object.
     *
     * @example
     * game.component.register({
     *   type: 'Position',
     * }) // component registered without `onCreate` method
     *
     * const c = game.component.create('Position', { x: 1, y: 2 }); // default `onCreate` is used
     *
     * c.x // 1
     * c.y // 2
     *
     * @memberof Component#
     * @param {Object} [opts] object with proprties to assign to component instance
     */
    onCreate(opts) {
      if (isObject(opts)) {
        Object.assign(this, opts);
      }
    },
    /**
     * Returns component type.
     *
     * @memberof Component#
     * @returns component type
     */
    getType() {
      return this._type;
    },
  },
});

export default Component;
