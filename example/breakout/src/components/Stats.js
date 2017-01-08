module.exports = {
  type: "Stats",
  onCreate: function (lives, livesTextNode, scoreTextNode, levelTextNode) {
    this.lives = lives == null ? 3 : lives;
    this.score = 0;
    this.level = 1;
    this.livesTextNode = livesTextNode;
    this.scoreTextNode = scoreTextNode;
    this.levelTextNode = levelTextNode;
  }
}

