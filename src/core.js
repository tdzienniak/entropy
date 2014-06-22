(function (Entropy) {

    var Utils = Entropy.Utils;
    var EventEmitter = Entropy.EventEmitter;
    
    var VERSION = 0.1;

    Entropy.DEBUG = true;

    Entropy.getVersion = function () {
        return "v" + VERSION;
    };

    Entropy.log = function (message) {
        if (Entropy.DEBUG) {
            console.log(["Entropy:", message].join(" "));
        }
    };

    Entropy.error = function (message) { 
        throw new Error(["Entropy:", message].join(" "));
    };

    Entropy.warning = function (message) {
        if (Entropy.DEBUG) {
            console.warn(["Entropy:", message].join(" "));
        }
    };

    Entropy.Const = function (name, value) {
        if (typeof name !== "string" || name === "") {
            Entropy.error("constans name should be non-empty string.");
        }

        name = name.toUpperCase();

        if (Entropy.hasOwnProperty(name)) {
            Entropy.error("can't define same constans twice.");
        } else {
            Object.defineProperty(Entropy, name, {
                value: value
            });
        }
    };

    EventEmitter.call(Entropy);
    Utils.extend(Entropy, EventEmitter.prototype);

})(root);