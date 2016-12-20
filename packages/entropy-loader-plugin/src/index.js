import { compose } from 'stampit';
import { default as ResourceLoader, Resource, base64 } from 'resource-loader';
import path from 'path';

let PIXI;
let Howl;

try {
  PIXI = require('pixi.js');
} catch (e) {}

try {
  Howl = require('howler');
} catch (e) {}

import spritesheetParser from './middlewares/spritesheetParser';
import textureParser from './middlewares/textureParser';

const extMimeMap = {
  ogg: 'audio/ogg',
  mp3: 'audio/mpeg3',
  wav: 'audio/wav',
};

const noop = () => {};

const values = object => Object.keys(object).map(key => object[key]);

const groupBy = (array, fn) => {
  const grouped = {};

  array.forEach(item => {
    const groupKey = fn(item);
    grouped[groupKey] = grouped[groupKey] || [];
    grouped[groupKey].push(item);
  });

  return grouped;
}

const uint8ToBase64 = (buffer) => {
  let binary = '';
  const len = buffer.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }

  return window.btoa(binary);
}

const parseHowlerSounds = (loader, resources) => {
  const groupedSounds = groupBy(
    values(resources).filter(resource => resource.metadata && resource.metadata.howlerSound),
    item => item.metadata.name
  );

  Object.keys(groupedSounds).forEach(soundName => {
    const src = groupedSounds[soundName]
      .map(resource => `data:${extMimeMap[path.extname(resource.url).slice(1)]};base64,${uint8ToBase64(new Uint8Array(resource.data))}`);

    loader.game.SOUND_CACHE[soundName] = new Howl({
      src,
    });
  })
}

const Loader = compose({
  statics: {
    propName: 'loader'
  },
  init({ game, config = {} } = {}) {
    this.loader = new ResourceLoader(config.baseUrl);

    const wrapMiddleware = (fn) => {
      return (resource, next) => fn(this, resource, next);
    }

    if (PIXI) {
      game.TEXTURE_CACHE = PIXI.utils.TextureCache;
      game.BASE_TEXTURE_CACHE = PIXI.utils.BaseTextureCache

      this.loader.use(wrapMiddleware(textureParser(PIXI)));
      this.loader.use(wrapMiddleware(spritesheetParser(PIXI)));
    }

    if (Howl) {
      game.SOUND_CACHE = {};
    }

    this.game = game;
  },
  methods: {
    loadFile({ name = '', url = '', options = {}, onLoad = noop }) {
      this.loader.add(name, url, options, onLoad);
    },
    loadPixiTexture({ name = '', url = '', options = {}, onLoad = noop } = {}) {
      if (!PIXI) {
        return;
      }

      options.metadata = options.metadata || {};
      Object.assign(options.metadata, {
        pixiTexture: true,
      })

      this.loader.add(name, url, options, onLoad);

      return this;
    },
    loadPixiTextureAtlas({ url }) {
      if (!PIXI) {
        return;
      }

      this.loader.add(url, {
        metadata: {
          textureAtlas: true,
        }
      });

      return this;
    },
    loadHowlerSound({ name, url = [], howlOptions = {} }) {
      if (!Howl) {
        return;
      }

      if (!Array.isArray(url)) {
        url = [url];
      }

      url.forEach((url, index) => {
        this.loader.add(name + '_howler_sound_' + index, url, {
          loadType: Resource.LOAD_TYPE.XHR,
          xhrType: Resource.XHR_RESPONSE_TYPE.BUFFER,
          metadata: {
            name,
            howlerSound: true,
          }
        });
      });

      return this;
    },
    start(cb) {
      this.loader.load((loader, resources) => {
        if (Howl) {
          parseHowlerSounds(this, resources);
        }

        cb(this, resources);
      });
    },
    reset() {
      this.loader.reset();
    }
  }
});




module.exports = Loader;