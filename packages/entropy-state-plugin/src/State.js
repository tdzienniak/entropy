import { stampit } from 'entropy.js';

const State = stampit.compose({
  init(opts) {
    this.name = opts.name;
    this.manager = opts.manager;
    this.game = opts.game;
  },
  methods: {
    onInit() {},
    onEnter() {},
    onExit() {},
    onTransitionFrom() {},
  },
});

export default State;
