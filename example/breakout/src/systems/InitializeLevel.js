 module.exports = {
  type: "InitializeLevel",
  singleton: true,
  onCreate: function (levelNum) {
    this.blocksQuery = this.game.createQuery({
      entityType: "Block"
    });

    this.ballQuery = this.game.createQuery({
      entityType: "Ball"
    });

    this.playerQuery = this.game.createQuery({
      entityType: "Player"
    })

    this.counterQuery = this.game.createQuery({
      entityType: "Counter"
    })

    this.level = game.levels[levelNum - 1];
    this.hasRun = false;
  },
  onUpdate: function (delta, event) {
    if (this.hasRun) {
      return;
    }

    var ball = this.game.getEntities(this.ballQuery).entities[0];
    var counter = this.game.getEntities(this.counterQuery).entities[0];
    var player = this.game.getEntities(this.playerQuery).entities[0];
    var blocks = this.game.getEntities(this.blocksQuery);

    //Do some cleanup first
    this.game.removeSystem('PhysicsStep')

    if (ball) {
      this.game.removeEntity(ball);
    }

    if (counter) {
      this.game.removeEntity(counter);
    }

    var block, i = 0;
    while (block = blocks.entities[i]) {
      this.game.removeEntity(block);

      i++;
    }

    //now construct level
    var blocksLineWidth = this.level.blocks[0].length * 3.2;
    var firstBlockX = -blocksLineWidth / 2 + 1.6;
    var firstBlockY = 15;
    
    for (var y = 0; y < this.level.blocks.length; y++) {
      var blocks = this.level.blocks[y];

      for (var x = 0; x < blocks.length; x++) {
        var blockLetter = blocks[x];

        if (blockLetter === 'X') {
          continue;
        }

        this.game.addEntity('Block', firstBlockX + x * 3.2, firstBlockY - y * 1.6, game.colorMap[blockLetter]);
      }
    }

    game.addEntity('Ball', -8, 0, 11, -11);
    game.addEntity('Counter');

    game.addSystem("CountdownSystem");

    player.components.stats.levelTextNode.text = 'lvl:' + player.components.stats.level;

    this.hasRun = true;

    this.game.removeSystem(this);
  }
}