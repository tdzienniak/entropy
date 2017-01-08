module.exports = {
  type: "BlockHit",
  onCreate: function () {
    var blocksQuery = this.game.createQuery({
      entityType: "Block"
    });

    var playerQuery = this.game.createQuery({
      entityType: "Player"
    })

    var self = this;
    var game = this.game;

    var handleBlockHit = function (e) {
      if (e.bodyA.entId === 'ball' && e.bodyB.entId === 'block') {
        var ball = e.bodyA;
        var blockBody = e.bodyB;
      } else if(e.bodyA.entId === 'block' && e.bodyB.entId === 'ball') {
        var ball = e.bodyB;
        var blockBody = e.bodyA;
      } else {
        return;
      }


      if (blockBody.collisionResponse === false) {
        return;
      }

      var e, block;
      var player = self.game.getEntities(playerQuery).entities[0];
      var blocks = self.game.getEntities(blocksQuery);
      var blocksLength = blocks.length;
      var i = 0;

      while (e = blocks.entities[i]) {
        if (e.components.body.body === blockBody) {
          block = e;
          
          break;
        }

        i++;
      }

      if (block == null) {
        return;
      }

      var animation = block.components.animation.animation;

      player.components.stats.score += 100;
      player.components.stats.scoreTextNode.text = 'score:' + pad(player.components.stats.score, 4);

      blockBody.collisionResponse = false;
      
      game.SOUND_CACHE.brickDeath.play();
      animation.play();

      animation.onComplete = function () {
        //we have removed the last block
        if (blocksLength === 1) {
          var nextLevel = ++player.components.stats.level;

          if (nextLevel <= 2) {
            self.game.addSystem('InitializeLevel', nextLevel);
          } else {
            self.game.engine.clear();

            self.game.engine.once('clear', function () {
              self.game.stop();
              self.game.state.change('GameOver');
            })
          }
        }

        self.game.removeEntity(block);
      };
    }

    this.handleBlockHit = handleBlockHit;
    this.game.world.on('beginContact', handleBlockHit);
  },
  onUpdate: function (delta, event) {
  
  },
  remove: function () {
    this.game.world.off('beginContact', this.handleBlockHit);
  }
}