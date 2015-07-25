__Note: this engine is still in active developement. It lacks many tests, documentation is not complete and breaking API changes are very likely to happen. It is not production ready, but I was able to build a bunch of games with it, so if you want to experiment or help with developement, you are welcome.__

Entropy
=======

_JavaScript entity system framework for games._

Entropy is literally just a framework, variation on an entity system, that can help you organize and write your game in very specific way. It also does many things for you, such as game state management, input handling. It is not tied to any graphics library, sound library, or other fancy stuff. If you are not familiar with entity system idea, check out these articles: [one](http://www.gamedev.net/page/resources/_/technical/game-programming/understanding-component-entity-systems-r3013) [two](http://entity-systems.wikidot.com/es-tutorials).

##Key features:##
- entity system, which mean very good game code organization and simple constructs
- plugin system
- built in plugins for sprite animation, user input, assets loading and more
- assets loader compatibile with PIXI (rendering) and howler.js (sound)
- easy integration with any library (see examples for p2.js physics library integration)
- stage manager

##Installation##

To start using Entropy just put reference to `entropy.min.js` file in the script tag or add it to you assets loader. If you want to use provided plugins, put reference to `entropy-plugins.min.js` __after__ main framework script.

##Getting started##

Read the [docs](http://rainphilosopher.github.io/entropy/docs/) and check out examples:

1. [Bunnies (benchmark and PIXI.js rendering)](http://rainphilosopher.github.io/entropy/example/bunnies/)
2. [Breakout (complete game with p2.js physics, PIXI rendering and plugins)](http://rainphilosopher.github.io/entropy/example/breakout/)

##Building and testing##

After cloning the repo run:
```
npm install
```

You have to have `grunt-cli` installed:
```
npm install grunt-cli -g
```

Then, to build run:
```
grunt build
```

To run tests:
```
npm test
```

##Docs##

Documentation is located in `docs` folder. You can also read it online: [http://rainphilosopher.github.io/entropy/docs/](http://rainphilosopher.github.io/entropy/docs/).

##Testers and people who have helped##

[@DarkEngineer](https://github.com/DarkEngineer)

##License##

MIT
