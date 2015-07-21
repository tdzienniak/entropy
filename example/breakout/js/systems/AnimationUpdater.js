 Entropy.System({
    name: "AnimationUpdater",
    initialize: function () {
        this.query = new Entropy.Query(['Animation']);
    },
    update: function (delta, event) {
        var animations = this.engine.getEntities(this.query);
        var e;

        var i = 0;

        while (e = animations[i]) {
            e.components.animation.animation.update(delta);
           
            i++;
        }
    }
});

Entropy.System({
    name: "Render",
    initialize: function () {
        this.stage = this.game.stage;
        this.renderer = this.game.renderer;
    },
    update: function (delta, event) {
        this.renderer.render(this.stage);
    }
});

Entropy.System({
    name: "BallLost",
    initialize: function (ballMaterial) {
        this.ballMaterial = ballMaterial;

        this.query = new Entropy.Query({
            name: "Ball"
        });
    },
    update: function (delta, event) {
        var balls = this.engine.getEntities(this.query);

        var lostBalls = 0;
        var totalBalls = 0;

        var e;
        var i = 0;

        while (e = balls[i]) {
            if (e.components.body.body.position[1] < -22) {
                this.engine.remove(e);
                lostBalls++;
            }
           
            i++;
        }

        if (lostBalls === i && i !== 0) {
            this.engine.create('Ball', 0, 0, 9, 9, this.ballMaterial);
            this.engine.create('Counter');

            this.engine.addSystem('CountdownSystem');
            this.engine.removeSystem('PhysicsStep')

            console.log('Wszystko stracone.')
        }
    }
});