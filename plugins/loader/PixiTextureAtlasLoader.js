var path = require('path');

function PixiTextureAtlasLoader (item) {
    this.AbstractLoader_constructor(item, true, "pixitextureatlas");
}

PixiTextureAtlasLoader.getPreloadHandlers = function () {
    return {
        types: ["pixitextureatlas"],
        callback: PixiTextureAtlasLoader.preloadHandler
    }
}

PixiTextureAtlasLoader.preloadHandler = function (loadItem) {
    var loader = new PixiTextureAtlasLoader(loadItem);

    return loader;
}

var s = PixiTextureAtlasLoader;

s.PROGRESS = 0.25;

s.canLoadItem = function (item) {
    return PIXI != null && createjs != null && item.type === "pixitextureatlas";
};

var p = createjs.extend(PixiTextureAtlasLoader, createjs.AbstractLoader);

p._createRequest = function() {
    this._request = new createjs.JSONLoader(this._item);
};

p.handleEvent = function (event) {
    switch (event.type) {
        case "complete":
            this._rawResult = event.target.getResult(true);
            this._result = event.target.getResult();
            this._sendProgress(s.PROGRESS);
            this._loadManifest(this._result);
            
            return;
        case "progress":
            event.loaded *= s.PROGRESS;
            this.progress = event.loaded / event.total;
            if (isNaN(this.progress) || this.progress == Infinity) { this.progress = 0; }
            this._sendProgress(event);

            return;
    }

    this.AbstractLoader_handleEvent(event);
};


p._loadManifest = function (json) {
    if (json && json.frames) {
        var queue = this._manifestQueue = new createjs.LoadQueue();

        queue.on("complete", this._handleManifestComplete, this, true);
        queue.on("progress", this._handleManifestProgress, this);
        queue.on("error", this._handleManifestError, this, true);

        queue.loadFile({
            id: json.meta.image,
            src: path.join(path.dirname(this._item.src), json.meta.image),
            data: json
        })
    }
};


p._handleManifestComplete = function (event) {
    var loadedItems = this._manifestQueue.getItems(true);

    if (!loadedItems.length) {
        var newEvent = new createjs.Event("fileerror");
        newEvent.item = event.data;
        this.dispatchEvent(newEvent);

        return;
    }

    var item = loadedItems[0];
    var textures = {};
    var frames = item.item.data.frames;
    var resolution = PIXI.utils.getResolutionOfUrl(this._item.src);
    var mainTexture = new PIXI.Texture(new PIXI.BaseTexture(item.result));

    PIXI.utils.TextureCache[item.item.id] = mainTexture;

    /**
     * This code comes from PIXIs default loader:
     * https://github.com/GoodBoyDigital/pixi.js/blob/master/src/loaders/spritesheetParser.js
     */
    for (var i in frames) {
        var rect = frames[i].frame;

        if (rect) {
            var size = null;
            var trim = null;

            if (frames[i].rotated) {
                size = new PIXI.Rectangle(rect.x, rect.y, rect.h, rect.w);
            } else {
                size = new PIXI.Rectangle(rect.x, rect.y, rect.w, rect.h);
            }

            //  Check to see if the sprite is trimmed
            if (frames[i].trimmed) {
                trim = new PIXI.Rectangle(
                    frames[i].spriteSourceSize.x / resolution,
                    frames[i].spriteSourceSize.y / resolution,
                    frames[i].sourceSize.w / resolution,
                    frames[i].sourceSize.h / resolution
                );
            }

            // flip the width and height!
            if (frames[i].rotated) {
                var temp = size.width;
                size.width = size.height;
                size.height = temp;
            }

            size.x /= resolution;
            size.y /= resolution;
            size.width /= resolution;
            size.height /= resolution;

            PIXI.utils.TextureCache[i] = new PIXI.Texture(mainTexture.baseTexture, size, size.clone(), trim, frames[i].rotated);
        }
    }

    this._sendComplete();
};

p._handleManifestProgress = function (event) {
    this.progress = event.progress * (1 - s.PROGRESS) + s.PROGRESS;
    this._sendProgress(this.progress);
};

p._handleManifestError = function (event) {
    var newEvent = new createjs.Event("fileerror");
    newEvent.item = event.data;
    this.dispatchEvent(newEvent);
};

module.exports = createjs.promote(PixiTextureAtlasLoader, "AbstractLoader");