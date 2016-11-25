import stampit from 'stampit';

import { isFunction, isString } from './helpers';

const State = stampit({
  deepProperties: {
    _states: {},
    _queue: [],
    _shifting: false,
    _currentState: {
      name: 'dummy',
      transitions: {},
      constArgs: [],
    }
  },
  init() {
    this._states = {};
    this._queue = [];
    this._shifting = false;
    this._currentState = {
      name: '__dummy',
      transitions: {},
      constArgs: [],
    };
  },
  methods: {
    /**
     * Registers new state. Registered states are shared between State instances.
     * State methods are asynchronous. Their last argument is always a callback function, that must be called
     * when the function finishes. This is handy when you want implement smooth transitions
     * between states using animations (for example, jQuery animations), that are very often asynchronous.
     *
     * @example
     *     let machinka = Taste();
     *
     *     mackinka.feed({
     *         name: "initialize",
     *         initialize: function (done) {
     *             console.log('State initialized.');
     *
     *             return done();
     *         },
     *         enter: function (done) {
     *             console.log('State entered.');
     *
     *             return done();
     *         },
     *         exit: function (done) {
     *             console.log('State exited.');
     *
     *             return done();
     *         },
     *         transitions: {
     *             menu: function (game, nextState, done) {
     *                 console.log('Transitioning from `initialize` to `menu`.');
     *
     *                 return done();
     *             }
     *         }
     *     });
     *
     *     mackinka.change('initialize');
     * @method feed
     * @chainable
     * @param {Object} state state object (see example)
     * @return {Taste} Taste instance
     */
    define(state) {
      this._states[state.name] = Object.assign({}, state, {
        _initialized: false,
        manager: this,
        transitions: state.transitions || {},
        constArgs: state.constArgs || [],
      });

      return this;
    },
    /**
     * Changes state to one identified by `name` parameter.
     * Changing state process looks roughly like this:
     *  1. calling current state's `exit` method (if present)
     *  2. calling next state's `initialize` method (if present and state wasn't initialized)
     *  3. calling transition function (if present)
     *  4. calling next state's `enter` method (if present)
     *
     * Transition functions are called when transitionig from one state to another. They are called after current state
     * `exit` method and before next state's `enter` method. If the next state is not initailizes, its `initialize` method is
     * called after `exit` and before transition method. Transition arguments are (in order):
     *  - next state object
     *  - [here come constant state arguments]
     *  - [here come arguments given after `stateName`]
     *  - done callback
     *
     * @method change
     * @chainable
     * @param {String}  stateName   state to change into
     * @param {Any}     ...args     addidtional parameters will be applied to transition method
     * @return {Taste}              Taste instance
     */
    change(stateName, ...args) {
      if (!isString(stateName) || !(stateName in this._states)) {
        return this;
      }

      const nextState = this._states[stateName];
      const doneCallback = () => this._shift();

      this._queue.push({
        fn: () => this._exitState(this._currentState, doneCallback),
      });

      if (!nextState._initialized) {
        this._queue.push({
          fn: () => this._initializeState(nextState, doneCallback),
        });

        this._queue.push({
          fn: () => this._setInitialized(nextState, doneCallback),
        });
      }

      this._queue.push({
        fn: () => this._doTransition(this._currentState, stateName, nextState, ...args, doneCallback),
      });

      this._queue.push({
        fn: () => this._enterState(nextState, doneCallback),
      });

      this._queue.push({
        fn: () => this._setCurrentState(nextState, doneCallback),
      });

      if (!this._shifting) {
        this._shift();
      }

      return this;
    },
    /**
     * Returns name of the current state.
     *
     * @method current
     * @return {String} name of the current state
     */
    current() {
      return this._currentState.name;
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
    _shift() {
      const queueHead = this._queue.shift();

      if (queueHead == null) {
        this._shifting = false;

        return;
      }

      this._shifting = true;

      return queueHead.fn();
    },
    _setCurrentState(state, done) {
      this._currentState = state;

      return done();
    },
    _setInitialized(state, done) {
      state._initialized = true;

      return done();
    },
    _initializeState(state, done) {
      if (isFunction(state.initialize)) {
        return state.initialize(...state.constArgs, done);
      }

      return done();
    },
    _enterState(state, done) {
      if (isFunction(state.enter)) {
        return state.enter(...state.constArgs, done);
      }

      return done();
    },
    _exitState(state, done) {
      if (isFunction(state.exit)) {
        return state.exit(...state.constArgs, done);
      }

      return done();
    },
    _doTransition(currentState, nextStateName, nextState, ...args) {
      if (nextStateName in currentState.transitions && isFunction(currentState.transitions[nextStateName])) {
        return currentState.transitions[nextStateName](nextState, ...nextState.constArgs, ...args);
      }

      const done = args.pop();

      return done();
    },
  },
});

export default State;
