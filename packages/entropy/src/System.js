import { compose } from 'stampit';
import EventEmitter from './EventEmitter';

const System = compose({
  properties: {
    priority: 0,
    enabled: true,
    singleton: false,
  },
  init(opts) {
    this.game = opts.game;
  },
  methods: {
    onCreate(...args) {},
    onUpdate(delta) {},
    onEnable() {},
    onDisable() {},
    onRemove() {},
    enable() {
      if (!this.isEnabled()) {
        this.enabled = true;
        this.emit('enable');

        // stop responding to events
        this.stopResponding();
      }

      return this;
    },
    disable() {
      if (this.isEnabled()) {
        this.enabled = false;

        // start responding to events
        this.startResponding();
        this.emit('disable');
      }

      return this;
    },
    isEnabled() {
      return this.enabled;
    },
  },
}, EventEmitter);

export default System;
