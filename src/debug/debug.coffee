config = require '../config/config'

module.exports = 
    log: (message) ->
        if config('debug')
            console.log message
    warning: (message) ->
        if config('debug')
            console.log message
    error: (message) ->
        if config('debug')
            console.log message

    #     Entropy.log = function () {
    #     if (Entropy.DEBUG) {
    #         console.log(["Entropy:"].concat(Utils.slice(arguments)).join(" "));
    #     }
    # };

    # Entropy.error = function () { 
    #     throw new Error(["Entropy:"].concat(Utils.slice(arguments)).join(" "));
    # };

    # Entropy.warning = function () {
    #     if (Entropy.DEBUG) {
    #         console.warn(["Entropy:"].concat(Utils.slice(arguments)).join(" "));
    #     }
    # };