import * as stampit from 'stampit';
import { isObject } from './helpers';

import EventEmitter from './EventEmitter';
import Engine from './Engine';
import Ticker from './Ticker';
import Query from './Query';

import EntityStore from './EntityStore';
import ComponentStore from './ComponentStore';
import SystemStore from './SystemStore';

const PLUGINS = [];

/**
 * Main framework factory method. This is the only factory, that needs to be called by user.
 *
 * @class Entropy
 * @borrows ComponentStore#register as Entropy#registerComponent
 * @borrows ComponentStore#registerMany as Entropy#registerComponents
 * @borrows ComponentStore#create as Entropy#createComponent
 * @borrows EntityStore#register as Entropy#registerEntity
 * @borrows EntityStore#registerMany as Entropy#registerEntitys
 * @borrows EntityStore#create as Entropy#createEntity
 * @borrows SystemStore#register as Entropy#registerSystem
 * @borrows SystemStore#registerMany as Entropy#registerSystems
 * @borrows SystemStore#create as Entropy#createSystem
 * @extends EventEmitter
 * @param {Object} config
 * @param {Boolean} config.pauseOnVisibilityChange
 *
 * @example
 * const game = Entropy() // creating game with default configuration
 * game.addEntity('Ball', {
 *   x: 0,
 *   y: 0,
 * })
 */
const Entropy = stampit.compose(EventEmitter, {
  statics: {
    stampit,
    registerPlugin(factoryFunction) {
      PLUGINS.push(factoryFunction);
    },
  },
  init(config = {}) {
    // welcome message
    const styles = `
      background: white;
      display: block;
      color: black;
      box-shadow: 1px 1px 3px black;
      padding: 5px;
      text-align: center;
      font-weight: bold;`;

    console.log('%cEntropy 1.0.0-alpha.1 - Entity System Framework for JavaScript', styles);

    /**
     * Stores components for later reuse.
     *
     * @memberof Entropy#
     * @name component
     * @type ComponentStore
     */
    this.component = ComponentStore();

    /**
     * Stores entities for later reuse.
     *
     * @memberof Entropy#
     * @name entity
     * @type EntityStore
     */
    this.entity = EntityStore({
      game: this,
    });

    /**
     *
     * Stores entities for later reuse.
     *
     * @private
     * @memberOf Entropy#
     * @name system
     * @type SystemStore
     */
    this.system = SystemStore({
      game: this,
    });

    /**
     * Instance of {@link Engine}.
     *
     * @memberof Entropy#
     * @name engine
     * @type {Engine}
     */
    this.engine = Engine({
      game: this,
    });

    /**
     * Instance of Ticker class.
     *
     * @memberof Entropy#
     * @name ticker
     * @type {Ticker}
     */
    this.ticker = Ticker({
      game: this,
    });

    // initialize plugins
    PLUGINS.forEach((factoryFunction) => {
      this[factoryFunction.propName] = factoryFunction({
        game: this,
        config: config[factoryFunction.propName],
      });
    });

    // update engine when ticker updates
    this.ticker.on('update', (...args) => this.engine.update(...args));

    // browser only code
    if (typeof window !== 'undefined') {
      // Set the name of the hidden property and the change event for visibility
      let hidden;
      let visibilityChange;

      if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
        hidden = 'hidden';
        visibilityChange = 'visibilitychange';
      } else if (typeof document.msHidden !== 'undefined') {
        hidden = 'msHidden';
        visibilityChange = 'msvisibilitychange';
      } else if (typeof document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden';
        visibilityChange = 'webkitvisibilitychange';
      }

      document.addEventListener(visibilityChange, (e) => {
        this.emit('visibilityChange', {
          originalEvent: e,
          hidden: document.hidden,
        });
      }, false);

      if (config.pauseOnHide) {
        this.on('visibilityChange', (e) => {
          if (e[hidden]) {
            this.pause();
          } else {
            this.resume();
          }
        });
      }
    }
  },
  methods: {
    /**
     * Starts the game. See Ticker's {@link Ticker#start} method for more details.
     *
     * @memberof Entropy#
     * @return {Boolean} succesfuly started or not
     */
    start() {
      this.ticker.start();
      this.emit('start');
    },
    /**
     * Pauses the game.
     *
     * @memberof Entropy#
     */
    pause() {
      this.ticker.pause();
    },
    /**
     * Resumes paused game.
     *
     * @memberof Entropy#
     */
    resume() {
      this.ticker.resume();
    },
    /**
     * Stops the game. See Ticker's {@ink Ticker@stop} method for more details.
     *
     * @memberof Entropy#
     * @param {Boolean} clearEngine if `true`, engine will be cleared before ticker stop
     * @return {Entropy} game instance for chaining
     */
    stop(clearEngine) {
      if (clearEngine) {
        this.engine.once('clear', () => this._stopAndEmit());

        // schedule engine clearing
        this.engine.clear();
      } else {
        this._stopAndEmit();
      }
    },
    registerEntity(...args) {
      this.entity.register(...args);

      return this;
    },
    registerEntities(...args) {
      this.entity.registerMany(...args);

      return this;
    },
    createEntity(...args) {
      return this.entity.create(...args);
    },
    /**
     * Adds (or schedules adding) entity to engine. If first argument is entity type (string), then entity instance is created and then added.
     *
     * @public
     * @memberof Entropy#
     * @method addEntity
     * @param {Entity|String} typeOrEntity entity instance or entity type to create
     * @param {...Any}        args         arguments passed to `onCreate` method of entity descriptor, when first argument is entity type
     */
    addEntity(typeOrEntity, ...args) {
      const entity = isObject(typeOrEntity) ?
        typeOrEntity : this.createEntity(typeOrEntity, ...args);

      this.engine.addEntity(entity);

      return this;
    },
    /**
     * Removes (or schedules removing) entity from engine.
     *
     * @public
     * @memberof Entropy#
     * @method removeEntity
     * @param {Entity} entity entity instance
     */
    removeEntity(entity) {
      this.engine.removeEntity(entity);
    },
    registerComponent(...args) {
      this.component.register(...args);

      return this;
    },
    registerComponents(...args) {
      this.component.registerMany(...args);

      return this;
    },
    createComponent(...args) {
      return this.component.create(...args);
    },
    registerSystem(...args) {
      this.system.register(...args);

      return this;
    },
    registerSystems(...args) {
      this.system.registerMany(...args);

      return this;
    },
    createSystem(...args) {
      return this.system.create(...args);
    },
    /**
     * Adds system to engine. If first argument is system type (string), then system instance is created and then added.
     *
     * @public
     * @memberof Entropy#
     * @method addSystem
     * @param {System|String} typeOrSystem system instance or system type to create
     * @param {...Any}        args         arguments passed to `onCreate` method of system descriptor, when first argument is system type
     */
    addSystem(typeOrSystem, ...args) {
      const system = isObject(typeOrSystem) ?
        typeOrSystem : this.createSystem(typeOrSystem, ...args);

      this.engine.addSystem(system);
    },
    /**
     * Removes (or schedules removing) system from engine.
     *
     * @public
     * @memberof Entropy#
     * @method removeSystem
     * @param {System|String} typeOrSystem system instance or system type
     */
    removeSystem(typeOrSystem) {
      this.engine.removeSystem(typeOrSystem);
    },
    /**
     * Creates new query from criterions. See {@link Query} for details about available criterions.
     *
     * @public
     * @memberof Entropy#
     * @method createQuery
     * @param {Object|Array} criterions criterions
     * @returns {Query} query instance
     */
    createQuery(criterions) {
      const query = Query({
        componentsIdsMap: this.component._componentsIdsMap,
        criterions,
      });

      return query;
    },
    /**
     * Returns entities that matches provided query.
     *
     * @public
     * @memberof Entropy#
     * @method getEntities
     * @param {Query} query query
     * @return {Object} object with `length` and `entities` properties
     */
    getEntities(query) {
      return this.engine.getEntities(query);
    },
    /**
     * Checks if ticker is running.
     *
     * @public
     * @memberof Entropy#
     * @method isRunning
     * @returns {Boolean}
     */
    isRunning() {
      return this.ticker.isRunning();
    },
    _stopAndEmit() {
      const stop = this.ticker.stop();

      if (stop) {
        this.emit('stop');
      }
    },
  },
});

module.exports = Entropy;
