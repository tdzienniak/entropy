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
     *
     * @private
     * @memberof Component#
     * @name _propName
     * @type {String}
     */
    this._propName = toLowerFirstCase(opts.type);
  },
  methods: {
    onCreate(...args) {
      if (args.length === 1 && isObject(args[0])) {
        Object.assign(this, args[0]);
      }
    },
    getType() {
      return this._type;
    }
  }
});

export default Component;
