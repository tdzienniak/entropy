Entropy.Component({
    name: "PlayerStats",
    initialize: function (lives, livesTextNode, scoreTextNode, levelTextNode) {
        this.lives = lives || 3;
        this.score = 0;
        this.level = 1;
        this.livesTextNode = livesTextNode;
        this.scoreTextNode = scoreTextNode;
        this.levelTextNode = levelTextNode;
    }
});

