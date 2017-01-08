// webpack context requires

const systems = [];
const requireSystems = require.context('./systems');
requireSystems.keys().forEach((file) => {
  systems.push(requireSystems(file));
});

const entities = [];
const requireEntities = require.context('./entities');
requireEntities.keys().forEach((file) => {
  entities.push(requireEntities(file));
});

const components = [];
const requireComponents = require.context('./components');
requireComponents.keys().forEach((file) => {
  components.push(requireComponents(file));
});

const states = [];
const requireStates = require.context('./states');
requireStates.keys().forEach((file) => {
  states.push(requireStates(file));
});

// wait for it...
window.addEventListener('load', function () {
  Entropy.registerPlugin(EntropyStatePlugin);
  Entropy.registerPlugin(EntropyLoaderPlugin);
  Entropy.registerPlugin(EntropyAnimationPlugin);

  var game = Entropy();

  window.game = game;

  game.registerComponents(components);
  game.registerEntities(entities);
  game.registerSystems(systems);

  states.forEach((state) => {
    game.state.define(state);
  });

  fadeInScreen('.loading-screen').then(function () {
    game.state.change('Loading');
  });
})

//Some helper CSS animation functions
function fadeOutScreen(screen) {
  var screenElement = document.querySelector(screen);

  return Velocity(screenElement, {
    opacity: 0,
  }, {
    display: "none",
    duration: 500
  });
}

function fadeInScreen(screen, done) {
  var screenElement = document.querySelector(screen);

  return Velocity(screenElement, {
    opacity: 1,
  }, {
    display: "block",
    duration: 500
  });
}

function on(element, type, callback) {
  var pfx = ["webkit", "moz", "MS", "o", ""];
  for (var p = 0; p < pfx.length; p++) {
    if (!pfx[p]) type = type.toLowerCase();
    element.addEventListener(pfx[p]+type, callback, false);
  }
}

function off(element, type, callback) {
  var pfx = ["webkit", "moz", "MS", "o", ""];
  for (var p = 0; p < pfx.length; p++) {
    if (!pfx[p]) type = type.toLowerCase();
    element.removeEventListener(pfx[p]+type, callback, false);
  }
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function clamp(value, min, max) {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

window.fadeOutScreen = fadeOutScreen;
window.fadeInScreen = fadeInScreen;
window.pad = pad;
window.clamp = clamp;
