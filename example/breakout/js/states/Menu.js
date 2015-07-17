Entropy.State({
    name: 'Menu',
    initialize: function (game, done) {
        this.menuScreen = document.querySelector('.menu-screen');

        return done();
    },
    enter: function (game, done) {
        var self = this;

        this.menuScreen.classList.add('active');
        this.menuScreen.classList.add('fade-in');

        this.startGameHandler = function (e) {
            game.state.change('Gameplay');
        }

        this.menuScreen.addEventListener('click', this.startGameHandler)
        
        return done();
    },
    exit: function (game, done) {
        var self = this;

        this.menuScreen.removeEventListener('click', this.startGameHandler)

        self.menuScreen.classList.remove('fade-in')
        self.menuScreen.classList.add('fade-out');

        setTimeout(function () {
            self.menuScreen.classList.remove('active');
            
            return done();
        }, 500)
    }
})