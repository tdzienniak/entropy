Entropy
=======

_JavaScript entity system framework for games._

Entropy is literally just a framework, variation on an entity system, that can help you organize and write your game in very specific way. It also does many things for you, such as game state management, input handling. It is not tied to any graphics library, sound library, or other fancy stuff. If you are not familiar with entity system idea, check out these articles: [one](http://www.gamedev.net/page/resources/_/technical/game-programming/understanding-component-entity-systems-r3013) [two](http://entity-systems.wikidot.com/es-tutorials).

##Installation##

To start using Entropy just put the reference to `entropy.min.js` file in the script tag or add it to you assets loader.

##Getting started##

To get started read these tutorials:

1. [Basics](tutorial/basics.md)

and check out examples:

1. [Bunnies (benchmark and PIXI.js rendering)](http://rainphilosopher.github.io/entropy/example/bunnies/)
2. [Physics (integration with p2.js)](http://rainphilosopher.github.io/entropy/example/physics/)

##Building##

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
grunt
```

##Docs##

Documentation is located in `docs` folder. You can also read it online: [http://rainphilosopher.github.io/entropy/docs/](http://rainphilosopher.github.io/entropy/docs/).

##License##

MIT