 module.exports = {
  type: "PaddleMovement",
  onCreate: function () {
    var stage = this.game.stage;
    var mousePosition = {
      x: 0
    };

    this.mousePosition = mousePosition;

    stage.on('mousemove', function (e) {
      mousePosition.x = stage.toLocal(e.data.global).x;
    });

    this.query = this.game.createQuery({
      entityType: "Paddle"
    });
  },
  onUpdate: function (delta, event) {
    var paddle = this.game.getEntities(this.query).entities[0];
    var paddleBody = paddle.components.body.body;

    var maxLeft = -(Entropy.WIDTH / Entropy.ZOOM / 2) + (paddleBody.shapes[0].width / 2);
    var maxRight = (Entropy.WIDTH / Entropy.ZOOM / 2) - (paddleBody.shapes[0].width / 2);

    var paddlePosition = this.mousePosition.x;


    if (paddlePosition < maxLeft) {
      paddlePosition = maxLeft;
    }

    if (paddlePosition > maxRight) {
      paddlePosition = maxRight;
    }

    paddleBody.position[0] = paddlePosition;
  }
}