__Note: this engine is still in active developement. It lacks many tests, documentation is not complete and breaking API changes are very likely to happen. It is not production ready, but I was able to build a bunch of games with it, so if you want to experiment or help with developement, you are welcome.__

__Documentation note: all "classes" in docs are not real classes, they are factory functions and should be called without `new`. JSDocs has no convenient way to describe factory functions.__

# Entropy

_JavaScript entity system framework for games._

Entropy is literally just a framework, variation on an entity system, that can help you organize and write your game in very specific way. It also does many things for you, such as game state management, input handling. It is not tied to any graphics library, sound library, or other fancy stuff. If you are not familiar with entity system idea, check out these articles: [one](http://www.gamedev.net/page/resources/_/technical/game-programming/understanding-component-entity-systems-r3013) [two](http://entity-systems.wikidot.com/es-tutorials).

## Key features

- entity system, which mean very good game code organization and simple constructs
- easy integration with any library (see examples for p2.js physics library integration)
- plugins

## Installation

Recommended way to install and use Entropy is to use `npm`:
```
npm install --save entropy.js
```

Then require it in your project and use your favourite bundling tool to package your game for browser use.

If you prefer to just include script as standalone lib, put reference to `entropy.min.js` file in the script tag or add it to you assets loader. Use global variable `Entropy` to interact with the framework.

## Getting started

The best way to get a grasp of Entropy is to read the [wiki](https://github.com/tdzienniak/entropy/wiki).

You can also read the [docs](http://tdzienniak.github.io/entropy/docs/entropy.js/1.0.0-alpha.1/) and check out examples:

1. [Bunnies (benchmark and PIXI.js rendering)](http://tdzienniak.github.io/entropy/example/bunnies/)
2. [Breakout (complete game with p2.js physics, PIXI rendering and plugins)](http://tdzienniak.github.io/entropy/example/breakout/)

## Building and testing

After cloning the repo run:
```
npm install
```

Then to build and to create minified file for browsers:
```
npm run build
```

To run tests:
```
npm test
```

## Docs

Documentation is located in `docs` folder. You can also read it online: [http://tdzienniak.github.io/entropy/docs/entropy.js/1.0.0-alpha.1/](http://tdzienniak.github.io/entropy/docs/entropy.js/1.0.0-alpha.1/).

## Testers and people who have helped

[@DarkEngineer](https://github.com/DarkEngineer)  
[@Tanner](https://github.com/tannernetwork)

## License

MIT
