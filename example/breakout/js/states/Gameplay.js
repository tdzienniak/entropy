Entropy.State({
    name: 'Gameplay',
    initialize: function (game, done) {
        this.gameplayScreen = document.querySelector('.gameplay-screen');

        this.levels = [
            {
                blocks: [
                    'XXgogXX',
                    'obgggbo',
                    'XbbbbbX'
                ],
                powerUps: 1,
                powerDowns: 1
            },
            {
                blocks: [
                    'XgogogX',
                    'XbbbbbX',
                    'gbrbrbg',
                    'gbbbbbg',
                    'gbXXXbg',
                    'XbbbbbX'
                ],
                powerUps: 1,
                powerDowns: 1
            }
        ];

        this.colorMap = {
            o: 'orange',
            b: 'blue',
            g: 'green',
            r: 'red'
        };

        return done();
    },
    enter: function (game, done) {
        //document.body.style.cursor = "none";

        this.gameplayScreen.classList.add('active');
        this.gameplayScreen.classList.add('fade-in');

        game.world.on('beginContact', function (e) {
            if (e.bodyA.id === 'ball' && e.bodyB.id === 'paddle') {
                var ball = e.bodyA;
                var paddle = e.bodyB;
            } else if(e.bodyA.id === 'paddle' && e.bodyB.id === 'ball') {
                var ball = e.bodyB;
                var paddle = e.bodyA;
            } else {
                return;
            }

            var currentVelocity = p2.vec2.length(ball.velocity);

            var newVelocity = p2.vec2.create();

            p2.vec2.copy(newVelocity, e.contactEquations[0].contactPointB);

            p2.vec2.add(newVelocity, newVelocity, [0, 1])

            p2.vec2.normalize(newVelocity, newVelocity);

            var coeficient = 1;
            var angle = Math.atan2(newVelocity[1], newVelocity[0]);

            var halfCircleChunk = Math.PI / 8;

            if (angle > 6 * halfCircleChunk || angle < 2 * halfCircleChunk) {
                coeficient = 1.1;
            } else if (angle > 5 * halfCircleChunk || angle < 3 * halfCircleChunk) {
                coeficient = 1;
            } else if (angle < 5 * halfCircleChunk && angle > 3 * halfCircleChunk) {
                coeficient = 0.95;
            }

            
            p2.vec2.scale(newVelocity, newVelocity, currentVelocity * coeficient)

            ball.velocity = newVelocity;
        })

        game.world.on('beginContact', function (e) {
            if (e.bodyA.id === 'ball' && e.bodyB.id === 'block') {
                var ball = e.bodyA;
                var block = e.bodyB;
            } else if(e.bodyA.id === 'block' && e.bodyB.id === 'ball') {
                var ball = e.bodyB;
                var block = e.bodyA;
            } else {
                return;
            }

        })

        var ballMaterial = new p2.Material();
        var wallMaterial = new p2.Material();

        var level = this.levels[0];

        var blocksLineWidth = level.blocks[0].length * 3.2;
        var firstBlockX = -blocksLineWidth / 2 + 1.6;
        var firstBlockY = 15;
        
        for (var y = 0; y < level.blocks.length; y++) {
            var blocks = level.blocks[y];

            for (var x = 0; x < blocks.length; x++) {
                var blockLetter = blocks[x];

                if (blockLetter === 'X') {
                    continue;
                }

                game.engine.create('Block', firstBlockX + x * 3.2, firstBlockY - y * 1.6, this.colorMap[blockLetter], wallMaterial);
            }
        }

        game.engine.addSystem(["PaddleMovement", 3]);
        game.engine.addSystem(["Render", 0]);
        game.engine.addSystem(["AnimationUpdater", 1]);
        game.engine.addSystem(["SpriteBodyUpdater", 2]);
        game.engine.addSystem(["BlockHit", 3]);
        game.engine.addSystem(["CountdownSystem", 3]);
        //game.engine.addSystem(["PhysicsStep", 3]);

        game.engine.create('WallTop', wallMaterial)
        game.engine.create('WallRight', wallMaterial)
        game.engine.create('WallLeft', wallMaterial)
        game.engine.create('Ball', -8, 0, 9, -9, ballMaterial);
        game.engine.create('Paddle', wallMaterial);
        game.engine.create('Counter')

        game.world.addContactMaterial(new p2.ContactMaterial(ballMaterial, wallMaterial, {
            restitution : 1.0,
            stiffness : Number.MAX_VALUE // We need infinite stiffness to get exact restitution
        }));

        setTimeout(function () {
            game.start();

            return done();            
        }, 500)

    },
    exit: function (game, done) {

    }
})

function parseLevel(game, level) {



}