Entropy.State({
    name: 'Loading',
    initialize: function (game, done) {
        this.loadingScreen = document.querySelector('.loading-screen');

        game.plugin.add('loader', new Entropy.Loader());

        return done();
    },
    enter: function (game, done) {
        var self = this;
        var progressBar = document.querySelector('.progress-bar-inner');

        game.sounds = {};

        //some libs
        game.loader.loadFile('./lib/pixi.js')
            .loadFile('./lib/howler.min.js')
            .loadFile('./lib/p2.min.js')
        //states
            .loadFile('./js/states/Initialize.js')
            .loadFile('./js/states/Menu.js')
            .loadFile('./js/states/Gameplay.js')
            .loadFile('./js/states/GameOver.js')
        //components
            .loadFile('./js/components/Animation.js')
            .loadFile('./js/components/Body.js')
            .loadFile('./js/components/Sprite.js')
            .loadFile('./js/components/PlayerStats.js')
        //entities
            .loadFile('./js/entities/Player.js')
            .loadFile('./js/entities/Ball.js')
            .loadFile('./js/entities/Paddle.js')
            .loadFile('./js/entities/Counter.js')
            .loadFile('./js/entities/Block.js')
            .loadFile('./js/entities/PowerUp.js')
            .loadFile('./js/entities/WallTop.js')
            .loadFile('./js/entities/WallRight.js')
            .loadFile('./js/entities/WallLeft.js')
        //systems
            .loadFile('./js/systems/AnimationUpdater.js')
            .loadFile('./js/systems/PhysicsStep.js')
            .loadFile('./js/systems/SpriteBodyUpdater.js')
            .loadFile('./js/systems/PaddleMovement.js')
            .loadFile('./js/systems/BlockHit.js')
            .loadFile('./js/systems/PaddleHit.js')
            .loadFile('./js/systems/CountdownSystem.js')
            .loadFile('./js/systems/BallDeathChecker.js')
        //texures
            .loadTextureAtlas('./assets/textures/breakout.json')
        //sounds
            .loadSound({
                id: 'brickDeath',
                src: ['./assets/sounds/brickDeath.ogg', './assets/sounds/brickDeath.mp3', './assets/sounds/brickDeath.wav'],
            })
            .loadSound({
                id: 'countdownBlip',
                src: ['./assets/sounds/countdownBlip.ogg', './assets/sounds/countdownBlip.mp3', './assets/sounds/countdownBlip.wav'],
            })
            .loadSound({
                id: 'powerdown',
                src: ['./assets/sounds/powerdown.ogg', './assets/sounds/powerdown.mp3', './assets/sounds/powerdown.wav'],
            })
            .loadSound({
                id: 'powerup',
                src: ['./assets/sounds/powerup.ogg', './assets/sounds/powerup.mp3', './assets/sounds/powerup.wav'],
            })
            .loadSound({
                id: 'recover',
                src: ['./assets/sounds/recover.ogg', './assets/sounds/recover.mp3', './assets/sounds/recover.wav'],
            })

        game.loader.on('fileload', function (e) {
            if (e.item.type === Entropy.Loader.SOUND) {
                game.sounds[e.item.id] = e.result;
            }
        })

        game.loader.on('progress', function (e) {
            progressBar.style.width = e.progress * 320 + 'px';
        })

        game.loader.on('complete', function () { 
            game.state.change('Initialize');

            return done();
        });
    },
    exit: function (game, done) {
        var self = this;

        fadeOutScreen('.loading-screen', function () {
            return done();
        })
    }
})

