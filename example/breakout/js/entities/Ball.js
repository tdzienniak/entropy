Entropy.Entity({
    name: "Ball",
    create: function (game) {
        var frames = [
            new Entropy.Frame(PIXI.utils.TextureCache["blue_01.png"]),
            new Entropy.Frame(PIXI.utils.TextureCache["blue_02.png"]),
            new Entropy.Frame(PIXI.utils.TextureCache["blue_03.png"]),
            new Entropy.Frame(PIXI.utils.TextureCache["blue_04.png"]),
            new Entropy.Frame(PIXI.utils.TextureCache["blue_05.png"])
        ]

        var animation = new Entropy.Animation(frames, 1, true);
        var animationSprite = animation.getAnimationSprite();
        
        stage.addChild(animationSprite);

        animation.play();

        this.add("Position", 50, 50)
            .add("Velocity", Math.round(Math.random() * 150), Math.round(Math.random() * 150))
            .add("Animation", animation);
    }
});