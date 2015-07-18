Entropy.Entity({
    name: "Ball",
    create: function (game, material) {

        var body = new p2.Body({
            //type: p2.Body.KINEMATIC,
            mass: 1,
            position: [0, 0],
            angle: 0,
            velocity: [5, 5],
            angularVelocity: 0,
            damping: 0,
            angularDamping: 0
        });
        
        var ballShape = new p2.Circle({
            radius: 0.8
        });

        ballShape.material = material;

        // Add a circular shape to the body
        body.addShape(ballShape);
        
        // Add the body to the world
        game.world.addBody(body);

        var sprite = new PIXI.Sprite(PIXI.utils.TextureCache["ball_01.png"]);

        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        sprite.scale.y = -1 / Entropy.ZOOM;
        sprite.scale.x = 1 / Entropy.ZOOM;

        game.stage.addChild(sprite);

        this.add("Sprite", sprite)
            .add("Body", body);
    }
});