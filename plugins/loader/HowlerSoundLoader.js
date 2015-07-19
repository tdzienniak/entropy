var path = require('path');

var extMimeMap = {
    ogg: 'audio/ogg',
    mp3: 'audio/mpeg3',
    wav: 'audio/wav'
}

function HowlerSoundLoader (loadItem) {
    this.AbstractLoader_constructor(loadItem, true, "howlersound");
}

HowlerSoundLoader.getPreloadHandlers = function () {
    return {
        types: ["howlersound"],
        callback: HowlerSoundLoader.preloadHandler
    }
}

HowlerSoundLoader.preloadHandler = function (loadItem) {
    var loader = new HowlerSoundLoader(loadItem);

    return loader;
}

var s = HowlerSoundLoader;

s.PROGRESS = 0.25;

s.canLoadItem = function (item) {
    return item.type === "howlersound";
};

var p = createjs.extend(HowlerSoundLoader, createjs.AbstractLoader);

p._createRequest = function() {
    var queue = this._manifestQueue = new createjs.LoadQueue();

   // queue.on("complete", this._handleManifestComplete, this, true);
    //queue.on("progress", this._handleManifestProgress, this);
    //queue.on("error", this._handleManifestError, this, true);

    this._item.data.forEach(function (sound, index) {
        queue.loadFile({
            src: sound,
            type: createjs.AbstractLoader.BINARY
        })
    })

    this._request = queue;
};

p.handleEvent = function (event) {
    switch (event.type) {
        case "complete":
            var sounds = this._manifestQueue.getItems(true)
            
            sounds = sounds.map(function (sound) {
                return 'data:' + extMimeMap[sound.item.ext] + ';base64,' + base64ArrayBuffer(sound.result);
            })

            var howl = new Howl({
                src: sounds,
                id: this._item.id
            })

            this._result = howl;
            this._sendComplete();
            
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

//This function comes from: https://gist.github.com/jonleighton/958841
function base64ArrayBuffer(arrayBuffer) {
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
 
  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder
 
  var a, b, c, d
  var chunk
 
  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
 
    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1
 
    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }
 
  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]
 
    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2
 
    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1
 
    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]
 
    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4
 
    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1
 
    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }
  
  return base64
}


module.exports = createjs.promote(HowlerSoundLoader, "AbstractLoader");