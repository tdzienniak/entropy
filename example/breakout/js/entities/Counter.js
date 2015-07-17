Entropy.Entity({
    name: "Counter",
    create: function (game) {
        var frames = [
            new Entropy.Frame(PIXI.utils.TextureCache["num_3.png"]),
            new Entropy.Frame(PIXI.utils.TextureCache["num_2.png"]),
            new Entropy.Frame(PIXI.utils.TextureCache["num_1.png"])
        ]

        var animation = new Entropy.Animation(frames, 1, true);

       // animation.reverse();

        var animationSprite = animation.getAnimationSprite();
        
        animationSprite.position.x = 160;
        animationSprite.position.y = 200;

        game.stage.addChild(animationSprite);

        animation.play();

        this.add("Animation", animation);
    },
    remove: function () {



    }
});