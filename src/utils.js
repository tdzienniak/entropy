(function (Entropy) {
    "use strict";
    
    var Utils = {
        isString: function (value) {
            return typeof value === "string" || value instanceof String;
        },
        isUndefined: function (value) {
            return typeof value === "undefined";
        },
        extend: function (destination) {
            var sources = this.slice.call(arguments, 1);

            sources.forEach(function (source) {
                for (var property in source) {
                    if (source.hasOwnProperty(property)) {
                        destination[property] = source[property];
                    }
                }
            });
        },
        slice: Array.prototype.slice
    };

    Entropy.Utils = Utils;
    
})(root);