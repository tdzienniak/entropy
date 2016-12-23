import stampit from 'stampit';
import { isObject, toLowerFirstCase } from './helpers';

import FastBitset from 'fastbitset';
import FastArray from 'fast-array';
import EventEmitter from './EventEmitter';

/**
 * Entity factory.
 *
 * @class Entity
 */
const Entity = stampit({
  init(opts) {
    this._modifications = FastArray();
    this._used = false;

    this.game = opts.game;
    this.type = opts.type;
    this.id = 0;
    this.bitset = new FastBitset();
    this.components = this.cs = {};
  },
  methods: {
    /**
     * Called when entity is created. Could be overriden (see {@link EntityStore#register}).
     *
     * @memberof Entity#
     */
    onCreate() {},
    /**
     * Called when entity is removed. Could be overriden (see {@link EntityStore#register}).
     *
     * @memberof Entity#
     */
    onRemove() {},
    /**
     * Called when entity is reused from pool. Could be overriden (see {@link EntityStore#register}).
     *
     * @memberof Entity#
     */
    onReuse() {},
    onComponentRemove() {},
    /**
     * Adds new component to entity.
     *
     * If first argument is component type, component is either created from scratch or reused from pool. In latter case, component's pattern `onReuse` method is called (if present).
     * Component patterns `onCreate` method is called with additional arguments passed to `add` method.
     * If entity is already added to the system (has id greater than 0) addition doesn't happen immediately, but is postponed to nearest update cycle.
     *
     * @example
     * // `this` is a reference to Entity instance
     * // code like this can be seen in entity's `onCreate` method
     * this.add('Position', 1, 1);
     *
     * // or
     *
     * this.add(game.createComponent('Position', 1, 1));
     *
     * @memberof Entity#
     * @param {String|Component} componentTypeOrComponent component instance or component type
     * @param {...Any} args arguments passed to `onCreate` method of component
     * @return {Entity} Entity instance
     */
    addComponent(componentTypeOrComponent, ...args) {
      const componentToAdd = isObject(componentTypeOrComponent) ?
        componentTypeOrComponent : this.game.component.create(componentTypeOrComponent, ...args);

      // if entity id equals 0, it has not yet been added to the system, so we can safely modify it
      if (this.id === 0) {
        this._addComponent(componentToAdd);
      } else {
        this._modifications.push({
          fn: () => {
            this._addComponent(componentToAdd);
          },
        });

        this.emit('queuedModification', this);
      }

      // return `this` for easy chaining of `add` calls
      return this;
    },
    _addComponent(componentToAdd) {
      this.components[componentToAdd._propName] = componentToAdd;

      this.bitset.add(componentToAdd._id);

      this.emit('componentAdd', this, componentToAdd);
    },
    /**
     * Removes component.
     *
     * @memberof Entity#
     */
    removeComponent(componentType) {
      const componentPropName = toLowerFirstCase(componentType);
      const componentToRemove = this.components[componentPropName];

      if (this.id === 0) {
        this._removeComponent(componentToRemove);
      } else {
        this._modifications.push({
          fn: () => {
            this._removeComponent(componentToRemove);
          },
        });

        this.emit('queueModification', this);
      }

      return this;
    },
    removeAllComponents() {
      Object.keys(this.components).forEach(propName =>
        this.removeComponent(propName)
      );
    },
    _removeComponent(componentToRemove) {
      this.game.component.free(componentToRemove);
      this.components[componentToRemove._propName] = null;
      this.bitset.remove(componentToRemove._id);
      this.onComponentRemove(componentToRemove);
    },
    applyModifications() {
      while (this._modifications.length) {
        const modification = this._modifications.shift();

        modification.fn();
      }
    },
    clearModifications() {
      this._modifications.clear();
    },
    is(type) {
      return this.type === type;
    },
    markAsRecycled() {
      this._used = true;
    },
    isRecycled() {
      return this._used;
    },
  },
})
.compose(EventEmitter);

export default Entity;
