 Entropy.System({
    name: "BlockHit",
    initialize: function () {
        var query = new Entropy.Query({
            name: "Block"
        });

        var self = this;
        var game = this.game;

        var handleBlockHit = function (e) {
            if (e.bodyA.entId === 'ball' && e.bodyB.entId === 'block') {
                var ball = e.bodyA;
                var blockBody = e.bodyB;
            } else if(e.bodyA.entId === 'block' && e.bodyB.entId === 'ball') {
                var ball = e.bodyB;
                var blockBody = e.bodyA;
            } else {
                return;
            }

            var e, block;
            var blocks = self.engine.getEntities(query);
            var i = 0;

            while (e = blocks[i]) {
                if (e.components.body.body === blockBody) {
                    block = e;
                    
                    break;
                }

                i++;
            }

            if (block == null) {
                return;
            }

            var animation = block.components.animation.animation;

            animation.on('end', function () {
                self.engine.remove(block);
            })

            blockBody.collisionResponse = false;
            
            animation.play();
            game.sounds.brickDeath.play();
        }

        this.game.world.on('beginContact', handleBlockHit);
    },
    update: function (delta, event) {
    
    },
    remove: function () {
        this.game.world.off('beginContact', this.handleBlockHit);
    }
})