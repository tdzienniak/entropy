module.exports = {
  name: 'Loading',
  onInit: function () {
    this.loadingScreen = document.querySelector('.loading-screen');
  },
  onEnter: function () {
    var self = this;
    var progressBar = document.querySelector('.progress-bar-inner');

    //some libs
    const loader = this.game.loader
    //texures
      .loadPixiTextureAtlas({
        url: './assets/textures/breakout.json'
      })
    //sounds
      .loadHowlerSound({
        name: 'brickDeath',
        url: ['./assets/sounds/brickDeath.ogg', './assets/sounds/brickDeath.mp3', './assets/sounds/brickDeath.wav'],
      })
      .loadHowlerSound({
        name: 'countdownBlip',
        url: ['./assets/sounds/countdownBlip.ogg', './assets/sounds/countdownBlip.mp3', './assets/sounds/countdownBlip.wav'],
      })

    loader.start(function () {
      game.state.change('Initialize');
    })


    // game.loader.on('progress', function (e) {
    //   progressBar.style.width = e.progress * 320 + 'px';
    // })

  },
  onExit: function () {
    return fadeOutScreen('.loading-screen');
  }
};
