 module.exports = {
  type: "SpriteBodyUpdater",
  onCreate: function () {
    this.query = this.game.createQuery(["Sprite", "Body"]);
    this.queryAnimations = this.game.createQuery(["Animation", "Body"]);
  },
  onUpdate: function (delta, event) {
    var renderableBodies = this.game.getEntities(this.query);
    var animationBodies = this.game.getEntities(this.queryAnimations);
    var e;
    
    var i = 0;
    while (e = renderableBodies.entities[i]) {
      var sprite = e.components.sprite.sprite;
      var body = e.components.body.body;

      sprite.position.x = body.position[0];
      sprite.position.y = body.position[1];

      i++;
    }

    var i = 0;
    while (e = animationBodies.entities[i]) {
      var animation = e.components.animation.animation;
      var body = e.components.body.body;

      animation.position.x = body.position[0];
      animation.position.y = body.position[1];

      i++;
    }
  }
}