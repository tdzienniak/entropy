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

        // start responding to events
        this.startResponding();
        this.emit('enable');
      }

      return this;
    },
    disable() {
      if (this.isEnabled()) {
        this.enabled = false;

        // stop responding to events
        this.emit('disable');
        this.stopResponding();
      }

      return this;
    },
    isEnabled() {
      return this.enabled;
    },
  },
}, EventEmitter);

export default System;
