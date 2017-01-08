module.exports = {
  type: "BallDeathChecker",
  onCreate: function () {
    this.query = this.game.createQuery({
      entityType: "Ball"
    });

    this.playerQuery = this.game.createQuery({
      entityType: "Player"
    })
  },
  onUpdate: function (delta, event) {
    var balls = this.game.getEntities(this.query);
    var player = this.game.getEntities(this.playerQuery).entities[0];

    var lostBalls = 0;
    var totalBalls = 0;

    var e;
    var i = 0;

    while (e = balls.entities[i]) {
      if (e.components.body.body.position[1] < -22) {
        this.game.removeEntity(e);
        lostBalls++;
      }
       
      i++;
    }

    if (lostBalls === i && i !== 0) {
      player.components.stats.lives--;

      if (player.components.stats.lives === -1) {
        console.log('Wszystko stracone.')
        this.game.engine.clear();

        this.game.engine.once('clear', () => {
          this.game.stop();
          this.game.state.change('GameOver');
        })
      } else {
        player.components.stats.livesTextNode.text = 'life:' + player.components.stats.lives;

        this.game.addEntity('Ball', -8, 0, 11, -11);
        this.game.addEntity('Counter');

        this.game.addSystem('CountdownSystem');         
        this.game.removeSystem('PhysicsStep');
      }
    }
  }
}