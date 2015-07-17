Entropy.State({
    name: 'Loading',
    initialize: function (game, done) {
        this.loadingScreen = document.querySelector('.loading-screen');

        game.plugin.add('loader', Entropy.Loader());

        return done();
    },
    enter: function (game, done) {
        var self = this;
        var progressBar = document.querySelector('.progress-bar-inner');


        game.loader.loadManifest([
            //some libs
            "./lib/pixi.min.js",
            "./lib/howler.min.js",
            "./lib/p2.min.js",
            //states
            "./js/states/Initialize.js",
            "./js/states/Menu.js",
            "./js/states/Gameplay.js",
            //components
            "./js/components/Animation.js",
            "./js/components/Position.js",
            //entities
            "./js/entities/Ball.js",
            "./js/entities/Pad.js",
            "./js/entities/Counter.js",
            "./js/entities/Block.js",
            "./js/entities/PowerUp.js",
            //systems
            "./js/systems/AnimationUpdater.js",
            {
                id: 'breakout',
                src: './assets/textures/breakout.json',
                type: Entropy.Loader.TEXTUREATLAS
            }
        ])


        game.loader.on('progress', function (e) {
            progressBar.style.width = e.progress * 320 + 'px';
        })

        game.loader.on('complete', function () {
            self.loadingScreen.classList.remove('fade-in')
            self.loadingScreen.classList.add('fade-out');

            setTimeout(function () {
                self.loadingScreen.classList.remove('active');
                
                game.state.change('Initialize');

                return done();
            }, 500)
        });
    }
})