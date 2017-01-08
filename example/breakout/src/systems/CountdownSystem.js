module.exports = {
  type: "CountdownSystem",
  onCreate: function () {
    this.counterQuery = this.game.createQuery({
      entityType: "Counter"
    });

    this.hasRun = false;
  },
  onUpdate: function (delta, event) {
    if (this.hasRun) {
      return;
    }

    var counter = this.game.getEntities(this.counterQuery).entities[0];
    var animation = counter.components.animation.animation;

    animation.onComplete = () => {
      this.game.removeEntity(counter);
      this.game.addSystem('PhysicsStep');
      this.game.removeSystem(this);
    };

    animation.play();
    game.SOUND_CACHE.countdownBlip.play();

    this.hasRun = true;
  }
}