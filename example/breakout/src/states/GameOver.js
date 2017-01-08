module.exports = {
  name: 'GameOver',
  onEnter: function () {
    return fadeInScreen('.gameover-screen')
  },
  onExit: function () {
    return fadeOutScreen('.gameover-screen')
  }
}