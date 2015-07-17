Entropy.State({
    name: 'Initialize',
    initialize: function (game, done) {
        Entropy.Const("WIDTH", 320);
        Entropy.Const("HEIGHT", 416);

        var view = document.querySelector('.game-canvas');

        var renderer = new PIXI.autoDetectRenderer(Entropy.WIDTH, Entropy.HEIGHT, {
            view: view,
            transparent: true,
            antialias: true
        });

        var stage = new PIXI.Container();
        stage.interactive = true;

        game.renderer = renderer;
        game.stage = stage;

        game.state.change('Menu');

        return done();
    }
})