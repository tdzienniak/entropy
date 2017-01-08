module.exports = {
  name: 'Gameplay',
  onInit: function () {
    this.gameplayScreen = document.querySelector('.gameplay-screen');

    this.game.levels = [
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

    this.game.colorMap = {
      o: 'orange',
      b: 'blue',
      g: 'green',
      r: 'red'
    };
  },
  onEnter: function () {
    //define some materials
    this.game.materials = {
      ballMaterial: new p2.Material(),
      wallMaterial: new p2.Material()
    }
    
    this.game.addSystem("Renderer", 0);
    this.game.addSystem("AnimationUpdater", 1);
    this.game.addSystem("SpriteBodyUpdater", 2);
    this.game.addSystem("BlockHit", 3);
    this.game.addSystem("PaddleHit", 3);
    this.game.addSystem("PaddleMovement", 3);
    this.game.addSystem("BallDeathChecker", 3);
    this.game.addSystem("LevelChanger", 3);

    this.game.addEntity('Player')
    this.game.addEntity('Paddle');
    this.game.addEntity('WallTop')
    this.game.addEntity('WallRight')
    this.game.addEntity('WallLeft')

    this.game.world.addContactMaterial(new p2.ContactMaterial(this.game.materials.ballMaterial, this.game.materials.wallMaterial, {
      restitution : 1.0,
      stiffness : Number.MAX_VALUE // We need infinite stiffness to get exact restitution
    }));

    this.game.world.addContactMaterial(new p2.ContactMaterial(this.game.materials.ballMaterial, this.game.materials.ballMaterial, {
      restitution : 1.0,
      stiffness : Number.MAX_VALUE // We need infinite stiffness to get exact restitution
    }));

    this.game.addSystem('InitializeLevel', 1);

    //Start da game!
    return fadeInScreen('.gameplay-screen').then(() => {
      this.game.start();
    });
  },
  onExit() {
    return fadeOutScreen('.gameplay-screen');
  }
}
