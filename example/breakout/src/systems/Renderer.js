module.exports = {
  type: "Renderer",
  onCreate: function () {
    this.stage = this.game.stage;
    this.renderer = this.game.renderer;
  },
  onUpdate: function (delta, event) {
    this.renderer.render(this.stage);
  }
}