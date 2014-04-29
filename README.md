Entropy
=======

_JavaScript entity system framework for games._

Entropy is literally just a framework, variation on an entity system, that can help you organize and write your game in very specific way. It also does many things for you, such as game state management, input handling. It is not tied to any graphics library, sound library, or other fancy stuff. If you are not familiar with entity system idea, check out these articles: one two three.

##Installation##

To start using Entropy just put the reference to `entropy.min.js` file in the script tag or add it to you assets loader.

##Getting started##

Getting started with Entropy is rather easy, because its structure is very simple. However, you must learn how to think in the entity system way:
- Entity is just an identificator, that identifies (wow) a single "thing". I don't call it object, because it doesn't have to be one. Some examples of entities in the world of games:
 * Player
 * Level
 * Asteroid
 * Bullet
 * Particle emitter
 * Ball

  Each Entity is composed of Components.
- Component is an aspect of an Entity. For example, _Asteroid_ entity can be composed of following components:
    * Position (x, y)
    * Velocity
    * Bitmap
    * Radius

 Components ar just data, they don't describe any functionality.