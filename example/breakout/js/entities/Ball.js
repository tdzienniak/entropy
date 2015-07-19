Entropy.Entity({
    name: "Ball",
    create: function (game, x, y, vx, vy, material) {
        var frames = [
            new Entropy.Frame(PIXI.utils.TextureCache["ball_01.png"]),
            new Entropy.Frame(PIXI.utils.TextureCache["ball_02.png"]),
            new Entropy.Frame(PIXI.utils.TextureCache["ball_03.png"]),
            new Entropy.Frame(PIXI.utils.TextureCache["ball_04.png"]),
            new Entropy.Frame(PIXI.utils.TextureCache["ball_05.png"])
        ];

        var body = new p2.Body({
            id: "ball",
            mass: 1,
            position: [x, y],
            angle: 0,
            velocity: [vx, vy],
            angularVelocity: 0,
            damping: 0,
            angularDamping: 0
        });
        
        var ballShape = new p2.Circle({
            radius: 0.8
        });

        ballShape.material = material;

        body.addShape(ballShape);
        game.world.addBody(body);

        var animation = new Entropy.Animation(frames, 30, true);
    
        var sprite = animation.getAnimationSprite();

        sprite.position.x = x;
        sprite.position.y = y;

        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        sprite.scale.y = -1 / Entropy.ZOOM;
        sprite.scale.x = 1 / Entropy.ZOOM;

        game.stage.addChild(sprite);

        animation.play();

        this.add("Sprite", sprite)
            .add("Animation", animation)
            .add("Body", body);
    }
});