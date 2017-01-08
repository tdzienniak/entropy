module.exports = {
  type: "AnimationUpdater",
  onCreate: function () {
    this.query = this.game.createQuery(['Animation']);
  },
  onUpdate: function (delta, event) {
    var animations = this.game.getEntities(this.query);
    var e;

    var i = 0;

    while (e = animations.entities[i]) {
      e.components.animation.animation.update(delta);
      
      i++;
    }
  }
}