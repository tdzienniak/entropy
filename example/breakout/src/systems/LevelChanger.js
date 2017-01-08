module.exports = {
  type: "LevelChanger",
  onCreate: function () {
    var self = this;

    var playerQuery = this.game.createQuery({
      entityType: "Player"
    })

    this.handleLevelChange = function (e) {
      var player = self.game.getEntities(playerQuery).entities[0];

      if (!player || !player.components || !player.components.stats) {
        return;
      }

      var newLevel;

      if (e.keyCode === 37) { //prev
        newLevel = player.components.stats.level - 1;

        if (newLevel < 1) {
          return;
        }
      } else if (e.keyCode === 39) { //next
        newLevel = player.components.stats.level + 1;

        if (newLevel > 2) {
          return;
        }
      } else {
        return;
      }

      player.components.stats.level = newLevel;
      self.game.addSystem('InitializeLevel', newLevel);
    }

    window.addEventListener('keyup', this.handleLevelChange);
  },
  onUpdate: function (delta, event) {},
  remove: function () {
    window.removeEventListener('keyup', this.handleLevelChange);
  }
}