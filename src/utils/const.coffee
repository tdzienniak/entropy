type = require './type'
debug = require '../debug/debug'

module.exports = (name, value) ->
    if not name? or type(name) isnt 'string'
        debug.error 'constans name should be non-empty string'
        return

    name = do name.toUpperCase;

    if name of @
        debug.error 'cannot define same constans twice: %s', name
    else
        Object.defineProperty @, name, value: value
        return value