var PixiTextureAtlasLoader = require('./PixiTextureAtlasLoader');
var HowlerSoundLoader = require('./HowlerSoundLoader');

function Loader () {
    var loader = new createjs.LoadQueue();

    loader.installPlugin(PixiTextureAtlasLoader);
    loader.installPlugin(HowlerSoundLoader);

    this._loader = loader;
}

Entropy.Utils.extend(Loader.prototype, {
    getLoader: function () {
        return this._loader;
    },
    loadFile: function () {
        this._loader.loadFile.apply(this._loader, arguments);

        return this;
    },
    loadTextureAtlas: function (textureAtlasUrl, loadNow) {
        this._loader.loadFile({
            src: textureAtlasUrl,
            type: Entropy.Loader.TEXTUREATLAS
        }, loadNow)

        return this;
    },
    loadSound: function (soundItem, loadNow) {
        this._loader.loadFile({
            id: soundItem.id,
            src: 'this property is not used, but has to be unempty string',
            data: soundItem.src,
            type: Entropy.Loader.SOUND
        }, loadNow)

        return this;
    },
    load: function () {
        this._loader.load();
    },
    on: function () {
        this._loader.on.apply(this._loader, arguments);
    },
    off: function () {
        this._loader.off.apply(this._loader, arguments);
    }
});


Loader.TEXTUREATLAS = "pixitextureatlas";
Loader.SOUND = "howlersound";

Entropy.Loader = Loader;