(function (Entropy) {
    "use strict";
    
    var Utils = {
        isString: function (value) {
            return typeof value === "string" || value instanceof String;
        },
        isObject: function (value) {
            return typeof value === "object";
        },
        isArray: function (value) {
            return Object.prototype.toString.call(value) === '[object Array]'; 
        },
        isUndefined: function (value) {
            return typeof value === "undefined";
        },
        extend: function (destination) {
            var sources = this.slice(arguments, 1);

            sources.forEach(function (source) {
                for (var property in source) {
                    if (source.hasOwnProperty(property)) {
                        destination[property] = source[property];
                    }
                }
            });
        },
        slice: function (arr, index) {
            return Array.prototype.slice.call(arr, index);
        }
    };

    Entropy.Utils = Utils;
    
})(root);