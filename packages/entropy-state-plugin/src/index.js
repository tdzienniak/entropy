import { stampit } from 'entropy.js';
import State from './State';

const StateManager = stampit.compose({
  statics: {
    propName: 'state',
  },
  deepProperties: {
    _pendingTransitions: [],
    _states: {},
    _shifting: false,
    _currentTransition: null,
  },
  init(opts) {
    this.game = opts.game;

    this._currentState = State({
      name: '__default',
      manager: this,
      game: opts.game,
    });
  },
  methods: {
    /**
     * Registers new state.
     *
     * State methods may be synchronous or asynchronous (when they return Promise). 
     *
     * @example
     * stateManager.define({
     *   name: "Initial",
     *   onInit() {
     *     console.log('State initialized.');
     *   },
     *   onEnter() {
     *     console.log('State entered.');
     *
     *     return delay(); // delay is function that returns Promise
     *   },
     *   onExit: function () {
     *     console.log('State exited.');
     *   },
     *   onTransitionFrom(currentState) {
     *     currentState; // I am current state now
     *     this; // I will become current state
     *   },
     * });
     *
     * @param {Object} state state object (see example)
     */
    define(stateDescriptor) {
      const methods = {};

      Object
        .keys(stateDescriptor)
        .filter(key => typeof stateDescriptor[key] === 'function')
        .forEach((key) => {
          methods[key] = stateDescriptor[key];
        });

      this._states[stateDescriptor.name] = stampit.compose(State, {
        methods,
      })({
        name: stateDescriptor.name,
        manager: this,
        game: this.game,
      });

      return this;
    },
    change(stateName, ...args) {
      const nextState = this._states[stateName];

      if (this._currentTransition) {
        this._pendingTransitions.push(() => {
          return this._changeState(nextState, ...args);
        })
      } else {
        this._currentTransition = this._changeState(nextState, ...args);
      }

      return this._currentTransition;
    },
    _changeState(nextState, ...args) {
      return Promise.resolve()
        .then(() => this._currentState.onExit())
        .then(() => {
          if (!nextState._initialized) {
            return nextState.onInit()
          }
        })
        .then(() => {
          nextState._initialized = true;
        })
        .then(() => nextState.onTransitionFrom(this._currentState, ...args))
        .then(() => nextState.onEnter())
        .then(() => {
          this._currentState = nextState;

          const pendingTransition = this._pendingTransitions.shift();

          if (pendingTransition) {
            this._currentTransition = pendingTransition();
          } else {
            this._currentTransition = null;
          }
        });
    },
    /**
     * Checks whether state machine is in state identified by name.
     *
     * @method isIn
     * @param  {String}  stateName state's name
     * @return {Boolean}
     */
    isIn(stateName) {
      return stateName === this._currentState.name;
    },
  },
});

module.exports = StateManager;
