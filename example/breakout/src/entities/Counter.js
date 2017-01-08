module.exports = {
  type: "Counter",
  onCreate: function () {
    var frames = [
      {
        texture: PIXI.utils.TextureCache["num_3.png"],
        time: 1000,
      },
      {
        texture: PIXI.utils.TextureCache["num_2.png"],
        time: 1000,
      },
      {
        texture: PIXI.utils.TextureCache["num_1.png"],
        time: 1000,
      }
    ]

    var animation = this.game.animation.create(frames);

     // animation.reverse();
    animation.amiationSpeed = 1;
    animation.loop = false;

    
    animation.position.x = 0;
    animation.position.y = 0;
    animation.anchor.x = 0.5;
    animation.anchor.y = 0.5;
    animation.scale.y = -1 / Entropy.ZOOM;
    animation.scale.x = 1 / Entropy.ZOOM;

    game.stage.addChild(animation);

    animation.onFrameChange = function () {
      game.SOUND_CACHE.countdownBlip.play();
    }

    this.addComponent("Animation", animation);
  },
  onRemove: function () {
    var animation = this.components.animation.animation;
    game.stage.removeChild(animation);
  }
}
