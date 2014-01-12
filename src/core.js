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

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(2, x1 - x2) + Math.pow(2, y1 - y2));
}

global["Entropy"] = app = Entropy;