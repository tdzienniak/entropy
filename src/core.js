var app;

var VERSION = "0.1";

var Entropy = {
    getVersion: function () {
        return "v" + VERSION;
    }
};

/* -- pseudo-global helper functions -- */
/*  I call them pseudo global, cause they are visible only in the scope of Entropy modules,
    not in the global scope. */

function isString(val) {
    return typeof val === "string" || val instanceof String;
}

global["Entropy"] = app = Entropy;