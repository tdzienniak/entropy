Entropy.State({
    name: 'Gameplay',
    initialize: function (game, done) {
        this.gameplayScreen = document.querySelector('.gameplay-screen');

        return done();
    },
    enter: function (game, done) {
        //document.body.style.cursor = "none";

        this.gameplayScreen.classList.add('active');
        this.gameplayScreen.classList.add('fade-in');

        setTimeout(function () {
            game.engine.addSystem(["PaddleMovement", 3]);
            game.engine.addSystem(["Render", 0]);
            game.engine.addSystem(["AnimationUpdater", 1]);
            game.engine.addSystem(["SpriteBodyUpdater", 2]);
            game.engine.addSystem(["PhysicsStep", 3]);

            var ballMaterial = new p2.Material();
            var wallMaterial = new p2.Material();

            game.engine.create('WallTop', wallMaterial)
            game.engine.create('WallRight', wallMaterial)
            game.engine.create('WallLeft', wallMaterial)
            game.engine.create('Ball', ballMaterial);
            game.engine.create('Paddle', wallMaterial);
            //game.engine.create('Counter')

            game.world.addContactMaterial(new p2.ContactMaterial(ballMaterial, wallMaterial, {
                restitution : 1.0,
                stiffness : Number.MAX_VALUE // We need infinite stiffness to get exact restitution
            }));

            game.start();

            return done();            
        }, 500)

    },
    exit: function (game, done) {

    }
})