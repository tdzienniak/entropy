Entropy.System({
    name: "BallDeathChecker",
    initialize: function () {
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
            this.engine.create('Ball', -8, 0, 11, -11);
            this.engine.create('Counter');

            this.engine.addSystem('CountdownSystem');
            this.engine.removeSystem('PhysicsStep');

            console.log('Wszystko stracone.')
        }
    }
});