module.exports = {
  type: "Ball",
  onCreate: function (x, y, vx, vy, material) {
    var frames = [1, 2, 3, 4, 5].map(function (num) {
      return PIXI.utils.TextureCache['ball_0' + num + '.png'];
    })

    var body = new p2.Body({
      mass: 1,
      position: [x, y],
      angle: 0,
      velocity: [vx, vy],
      angularVelocity: 0,
      damping: 0,
      angularDamping: 0
    });

    body.entId = "ball";
    
    var ballShape = new p2.Circle({
      radius: 0.8
    });

    ballShape.material = game.materials.ballMaterial;

    body.addShape(ballShape);
    this.game.world.addBody(body);

    var animation = new PIXI.extras.AnimatedSprite(frames);

    animation.position.x = x;
    animation.position.y = y;
    animation.anchor.x = 0.5;
    animation.anchor.y = 0.5;
    animation.scale.y = -1 / Entropy.ZOOM;
    animation.scale.x = 1 / Entropy.ZOOM;

    animation.loop = true;

    this.game.stage.addChild(animation);

    animation.play();

    this.addComponent("Animation", animation)
      .addComponent("Body", body);
  },
  onRemove: function () {
    game.world.removeBody(this.components.body.body);
    game.stage.removeChild(this.components.animation.animation);
  }
}