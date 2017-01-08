import { stampit } from 'entropy.js';
import AnimatedSprite from './AnimatedSprite';

const Animation = stampit.compose({
  statics: {
    propName: 'animation',
  },
  init() {},
  methods: {
    create(frames) {
      return new AnimatedSprite(frames);
    },
  },
});

module.exports = Animation;
