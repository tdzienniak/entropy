Entropy.State({
    name: 'Gameplay',
    initialize: function (game, done) {
        this.gameplayScreen = document.querySelector('.gameplay-screen');

        return done();
    },
    enter: function (game, done) {
        this.gameplayScreen.classList.add('active');
        this.gameplayScreen.classList.add('fade-in');

        setTimeout(function () {
            game.engine.addSystem(["Render", 0]);
            game.engine.addSystem(["AnimationUpdater", 1]);

            game.engine.create('Counter')

            game.start();

            return done();            
        }, 500)

    },
    exit: function (game, done) {

    }
})