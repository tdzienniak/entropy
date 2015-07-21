Entropy.State({
    name: 'Menu',
    initialize: function (game, done) {
        this.menuScreen = document.querySelector('.menu-screen');

        return done();
    },
    enter: function (game, done) {
        var self = this;
        this.menuScreen.classList.add('active');

        console.log('dsada')
        //play fade in animation
        move('.menu-screen').set('opacity', 0).end(function () {
                console.log('menu')
            })


        this.startGameHandler = function (e) {
            game.state.change('Gameplay');
        }

        this.menuScreen.addEventListener('click', this.startGameHandler)
        
        return done();
    },
    exit: function (game, done) {
        var self = this;

        this.menuScreen.removeEventListener('click', this.startGameHandler)

        move('.menu-screen')
            .set('opacity', 0)
            .end(function () {
                self.menuScreen.classList.remove('active');
                
                return done();
            })
    }
})