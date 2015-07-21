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
        this.gameplayScreen.classList.add('active');
        
        //play fade in animation
        move('.gameplay-screen')
            .set('opacity', 1)
            .end();

        //define some materials
        game.materials = {
            ballMaterial: new p2.Material(),
            wallMaterial: new p2.Material()
        }

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

                game.engine.create('Block', firstBlockX + x * 3.2, firstBlockY - y * 1.6, this.colorMap[blockLetter]);
            }
        }

        game.engine.addSystem(["Render", 0]);
        game.engine.addSystem(["AnimationUpdater", 1]);
        game.engine.addSystem(["SpriteBodyUpdater", 2]);
        game.engine.addSystem(["BlockHit", 3]);
        game.engine.addSystem(["CountdownSystem", 3]);
        game.engine.addSystem(["PaddleMovement", 3]);
        game.engine.addSystem(["BallDeathChecker", 3])
        //game.engine.addSystem(["PhysicsStep", 3]);

        game.engine.create('WallTop')
        game.engine.create('WallRight')
        game.engine.create('WallLeft')
        game.engine.create('Ball', -8, 0, 11, -11);
        game.engine.create('Paddle');
        game.engine.create('Counter')

        game.world.addContactMaterial(new p2.ContactMaterial(game.materials.ballMaterial, game.materials.wallMaterial, {
            restitution : 1.0,
            stiffness : Number.MAX_VALUE // We need infinite stiffness to get exact restitution
        }));

        game.world.addContactMaterial(new p2.ContactMaterial(game.materials.ballMaterial, game.materials.ballMaterial, {
            restitution : 1.0,
            stiffness : Number.MAX_VALUE // We need infinite stiffness to get exact restitution
        }));

        //Start da game!
        game.start();

        return done();            
    },
    exit: function (game, done) {
        var self = this;

        //play fade in animation
        move('.gameplay-screen')
            .set('opacity', 0)
            .end(function () {
                self.gameplayScreen.classList.remove('active');

                return done();
            })
    }
})

function parseLevel(game, level) {



}