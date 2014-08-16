type = require './type'
debug = require '../debug/debug'

module.exports = (key, value) ->
    if not key? or type(key) isnt 'string'
        debug.error 'constans key should be non-empty string'
        return

    key = do key.toUpperCase;

    if key of @
        debug.error 'cannot define same constans twice: %s', key
    else
        Object.defineProperty @, key, value: value
        return value