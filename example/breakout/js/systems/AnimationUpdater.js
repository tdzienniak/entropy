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

            sprite = e.components.animation.animation.update(delta);
           
            i++;
        }
    }
});

Entropy.System({
    name: "AnimationPositionUpdater",
    initialize: function () {
        this.query = new Entropy.Query(['Position', 'Animation']);
    },
    update: function (delta, event) {
        ///var sprites = this.engine.getEntitiesWith(["Sprite", "Position"]);
        var animations = this.engine.getEntities(this.query);
        var e, animation, position;

        var i = 0;
        debugger;
        while (e = animations[i]) {
            animation = e.components.animation;
            position = e.components.position;

            var animationSprite = animation.animation.getAnimationSprite();

            animationSprite.position.x = position.x;
            animationSprite.position.y = position.y;

            i++;
        }
    }
});

Entropy.System({
    name: "SpritePositionUpdater",
    initialize: function () {
        this.query = new Entropy.Engine.Query(['Position', 'Sprite']);
    },
    update: function (delta, event) {
        ///var sprites = this.engine.getEntitiesWith(["Sprite", "Position"]);
        var sprites = this.engine.getEntities(this.query);
        var e, sprite, position;

        var i = 0;

        while (e = sprites[i]) {
            sprite = e.components.sprite;
            position = e.components.position;

            sprite.sprite.position.x = position.x;
            sprite.sprite.position.y = position.y;

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