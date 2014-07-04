(function (Entropy) {

    var Utils = Entropy.Utils;
    var EventEmitter = Entropy.EventEmitter;
    
    var VERSION = 0.1;

    Entropy.DEBUG = true;
    Entropy.MAX_COMPONENTS_COUNT = 100;

    Entropy.getVersion = function () {
        return "v" + VERSION;
    };

    Entropy.log = function () {
        if (Entropy.DEBUG) {
            console.log(["Entropy:"].concat(Utils.slice(arguments)).join(" "));
        }
    };

    Entropy.error = function () { 
        throw new Error(["Entropy:"].concat(Utils.slice(arguments)).join(" "));
    };

    Entropy.warning = function () {
        if (Entropy.DEBUG) {
            console.warn(["Entropy:"].concat(Utils.slice(arguments)).join(" "));
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