(function (Entropy) {

    var VERSION = 0.1;

    Entropy.getVersion = function () {
        return "v" + VERSION;
    };

    Entropy.log = function (message) {
        console.log(["Entropy: ", message].join(" "));
    };

    Entropy.error = function (message) {
        throw new Error(["Entropy: ", message].join(" "));
    };

    Entropy.warning = function (message) {
        console.warn(["Entropy: ", message].join(" "));
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

})(root);