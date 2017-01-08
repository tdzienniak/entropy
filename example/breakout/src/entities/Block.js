module.exports = {
  type: "Block",
  onCreate: function (x, y, color, material) {
    var body = new p2.Body({
      mass: 0,
      position: [x, y],
      angle: 0
    })

    body.entId = 'block'

    var blockShape = new p2.Box({
      height: 1.6,
      width: 3.2
    });

    blockShape.material = game.materials.wallMaterial;

    body.addShape(blockShape);
    game.world.addBody(body);

    var frames = [1, 2, 3, 4, 5].map(function (num) {
      return PIXI.utils.TextureCache[color + "_0" + num + ".png"];
    }).reverse();

    var animation = this.game.animation.create(frames);

    animation.standardFrameDuration = 100;
    animation.loop = false;

    animation.position.x = x;
    animation.position.y = y;
    animation.anchor.x = 0.5;
    animation.anchor.y = 0.5;
    animation.scale.y = -1 / Entropy.ZOOM;
    animation.scale.x = 1 / Entropy.ZOOM;

    game.stage.addChild(animation);

    animation.onComplete = function () {
      // animation.reverse()
    };

    animation.play()

    this.addComponent("Animation", animation)
      .addComponent("Body", body);
  },
  onRemove: function () {
    game.stage.removeChild(this.components.animation.animation);
    game.world.removeBody(this.components.body.body);
  }
}
