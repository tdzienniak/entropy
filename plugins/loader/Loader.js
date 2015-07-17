var PixiTextureAtlasLoader = require('./PixiTextureAtlasLoader');

function Loader () {
    var loader = new createjs.LoadQueue();

    loader.installPlugin(PixiTextureAtlasLoader);

    return loader;
}

Loader.TEXTUREATLAS = "pixitextureatlas";
Loader.SOUND = "howlersound";

Entropy.Loader = Loader;