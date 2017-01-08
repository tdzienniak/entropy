module.exports = {
  name: 'Menu',
  onInit: function () {
    this.menuScreen = document.querySelector('.menu-screen');
  },
  onEnter: function () {
    this.startGameHandler = (e) => {
      game.state.change('Gameplay');
    }

    this.menuScreen.addEventListener('click', this.startGameHandler)
    
    return fadeInScreen('.menu-screen')
  },
  onExit: function () {
    this.menuScreen.removeEventListener('click', this.startGameHandler)

    return fadeOutScreen('.menu-screen')
  }
}