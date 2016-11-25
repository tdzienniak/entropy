import { isFunction } from './helpers';
import stampit from 'stampit';

/**
 * Very simple event emitter implementation.
 *
 * @example
 * const ee = EventEmitter()
 *
 * ee.on('myEvent', (e) => {
 *   console.log(e.foo);
 * })
 *
 * ee.emit('myEvent', {
 *    foo: 'bar',
 * }) // prints `bar` in the console
 *
 * @class EventEmitter
 */
const EventEmitter = stampit({
  init() {
    /**
    * Object with registered event listeners. Keys are event names.
    *
    * @private
    * @property {Object} _events
    */
    this._events = {};
    this._responding = true;
  },
  methods: {
    /**
     * Method used to register event listener.
     *
     * @memberof EventEmitter#
     * @param  {String}     event         event name
     * @param  {Function}   fn            event listener
     * @param  {Boolean}    [once=false]  if set to `true`, listener will be called once, then it will be unregistered
     */
    on(event, fn, once) {
      this._events[event] = this._events[event] || [];

      this._events[event].push({
        fn,
        once,
      });
    },
    /**
     * Same as {@link EventEmitter#on}, bu with implicit `once` parameter set to `true`.
     *
     * @memberof EventEmitter#
     * @param  {String}     event event name
     * @param  {Function}   fn    event listener
     */
    once(event, fn) {
      this.on(event, fn, true);
    },
    /**
     * Emits event.
     * All listeners attached to this event name earlier will be called with arguments passed after event name.
     *
     * @memberof EventEmitter#
     * @param {String} event  event name
     * @param {...Any} [arg] multiple arguments, that will be passed to listeners
     */
    emit(event, ...args) {
      if (!this._responding || !(event in this._events)) {
        return;
      }

      const listeners = this._events[event];

      let i = 0;
      while (i < listeners.length) {
        const listener = this._events[event][i];

        const returnedValue = listener.fn(...args);

        if (returnedValue === false || listener.once) {
          let index = i;

          while (index < listeners.length) {
            listeners[index] = listeners[++index];
          }

          listeners.length -= 1;
        } else {
          i += 1;
        }
      }
    },
    /**
     * Removes listener for event.
     *
     * @example
     * const myHandler = (e) => {}
     * ee.on('myEvent', myHandler) // handler attached
     * ee.off('myEvent', myHandler) // handler detached
     *
     * @memberof EventEmitter#
     * @param {String}    event event name
     * @param {Function}  fn    listener function attached earlier
     */
    off(event, fn) {
      this._events[event] = this._events[event]
        .filter(listener => isFunction(fn) && listener.fn !== fn);
    },
    /**
     * Disables event emitter so it won't repond to any emitted events.
     *
     * @memberof EventEmitter#
     */
    stopResponding() {
      this._responding = false;
    },
    /**
     * Reenables disabled event emitter.
     *
     * @memberof EventEmitter#
     */
    startResponding() {
      this._responding = true;
    },
  }
});

export default EventEmitter;
