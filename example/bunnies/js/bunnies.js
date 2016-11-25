// some globals, this is bad practice but in this simple example we can do that
var scene, stage, renderer, game;

var CONST = {
  WIDTH: 600,
  HEIGHT: 400,
  GRAVITY: 200
}

function defineStates(game) {
  game.defineState({
    name: "initialize",
    initialize: function (game, done) {
      var view = document.getElementsByTagName("canvas")[0];

      renderer = new PIXI.autoDetectRenderer(CONST.WIDTH, CONST.HEIGHT, {
          view: view,
          transparent: true,
          antialias: false
      });

      scene = new PIXI.Container();
      stage = new PIXI.ParticleContainer(2000000);

      scene.addChild(stage);

      var bunniesCount = document.getElementById("bunnies-count");
      var bunnyTexture = new PIXI.Texture.fromImage("img/bunny.png");
      var bunnyAdder;

      view.addEventListener("mousedown", function (e) {
        var bunnyAdderFn = function () {
          for (var i = 0; i < 50; i++) {
            // console.log(i)
            game.addEntity("Bunny", 10, 10, bunnyTexture);
          }

          bunniesCount.innerText = game.engine._entitiesCount;

          bunnyAdder = setTimeout(bunnyAdderFn, 1);
        }

        bunnyAdderFn()
      });

      view.addEventListener("mouseup", function () {
        clearTimeout(bunnyAdder);
      });

      return done();
    },
    enter: function (game, done) {
      game.addSystem(game.createSystem("Render"));
      game.addSystem(game.createSystem("BunnyMovement"));


      console.log(game)
      game.start();

      return done();
    }
  })
}

function registerComponents(game) {
  game.registerComponent({
    type: 'Position',
    onCreate(x, y) {
      this.x = x;
      this.y = y;
    },
  });

  game.registerComponent({
    type: 'Velocity',
    onCreate(vx, vy) {
      this.vx = vx;
      this.vy = vy;
    },
  });

  game.registerComponent({
    type: 'Sprite',
    onCreate(sprite) {
      this.sprite = sprite;
    },
  });
}

function registerEntities(game) {
  game.registerEntity({
    type: 'Bunny',
    onCreate(x, y, bunnyTexture) {
      var sprite = new PIXI.Sprite(bunnyTexture);

      sprite.position.x = x;
      sprite.position.y = y;
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 0.5;

      stage.addChild(sprite);

      this.add("Position", x, y)
        .add("Velocity", Math.round(Math.random() * 150), Math.round(Math.random() * 150))
        .add("Sprite", sprite);
    },
  });
}

function registerSystems(game) {
  game.registerSystem({
    type: 'Render',
    onUpdate() {
      renderer.render(scene);
    }
  });

  game.registerSystem({
    type: 'BunnyMovement',
    onCreate() {
      this.bunniesQuery = this.game.createQuery(['Position', 'Velocity']);
    },
    onUpdate(delta) {
      var bunnies = this.game.getEntities(this.bunniesQuery);

      for (var i = 0; i < bunnies.length; i++) {
        var bunny = bunnies.arr[i].cs;

        //update position
        bunny.position.x += delta / 1000 * bunny.velocity.vx;
        bunny.position.y += delta / 1000 * bunny.velocity.vy;

        // bounce!
        if (bunny.position.x < 0) {
            bunny.position.x = 0;
            bunny.velocity.vx *= -1;
        }

        if (bunny.position.x > CONST.WIDTH) {
            bunny.position.x = CONST.WIDTH;
            bunny.velocity.vx *= -1;
        }

        if (bunny.position.y > CONST.HEIGHT) {
            bunny.position.y = CONST.HEIGHT;

            bunny.velocity.vy*= -1;
        }

        // add gravity
        bunny.velocity.vy += delta / 1000 * CONST.GRAVITY;

        bunny.sprite.sprite.position.x = bunny.position.x;
        bunny.sprite.sprite.position.y = bunny.position.y;
      }
    }
  });
}

window.addEventListener("load", function () {
  game = Entropy({
    pauseOnHide: true,
  });

  defineStates(game);
  registerComponents(game);
  registerEntities(game);
  registerSystems(game);

  game.state.change('initialize');
}, false);
