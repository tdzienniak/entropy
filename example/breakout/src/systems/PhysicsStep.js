 module.exports = {
  type: "PhysicsStep",
  onUpdate: function (delta, event) {
    this.game.world.step(1/60, delta, 2);
  }
}