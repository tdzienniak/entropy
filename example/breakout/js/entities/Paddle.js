Entropy.Entity({
    name: "Paddle",
    create: function (game, material) {

        var body = new p2.Body({
            id: "paddle",
            //type: p2.Body.KINEMATIC,
            mass: 0,
            position: [0, -16.8],
            angle: 0,
            collisionResponse: false
        });
        
        var paddleShape = new p2.Box({
            height: 1.6,
            width: 4.8
        });

        paddleShape.material = material;

        // Add a circular shape to the body
        body.addShape(paddleShape);
        
        // Add the body to the world
        game.world.addBody(body);

        var sprite = new PIXI.Sprite(PIXI.utils.TextureCache["pad_big.png"]);

        sprite.position.x = body.position[0];
        sprite.position.y = body.position[1];
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.scale.y = -1 / Entropy.ZOOM;
        sprite.scale.x = 1 / Entropy.ZOOM;

        game.stage.addChild(sprite);

        this.add("Sprite", sprite)
            .add("Body", body);
    }
});