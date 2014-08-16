config = require '../config/config'

EventEmitter = require './event'
BitSet = require 'bitset'

class Entity extends EventEmitter
    constructor: ->
        super()

        return @