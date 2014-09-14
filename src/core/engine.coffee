type = require '../utils/type'
debug = require '../debug/debug'

EventEmitter = require './event'
Pool = require '../collection/pool'
#config = require '../config/config'

_componentPatterns = {}
_systemPatterns = {}
_entityPatterns = {}
_canModify = true
_nextComponentId = 0

class Engine extends EventEmitter
    @Component: (component) ->
        if not _canModify
            debug.error 'you can\'t define new component during system work'
            return

        if not type.of.object component
            debug.error 'component pattern must be an object'
            return 

        if not ('name' of component) or not ('initialize' of component)
            debug.error 'you must define both "name" and "initialize" of component pattern'
            return

        if component.name of _componentPatterns
            debug.error 'you can\'t define same component twice'
            return

        _componentPatterns[component.name] =
            bit: _nextComponentId++
            pattern: component

    @System: (system) ->
        if not _canModify
            debug.error 'you can\'t define new system during system work'
            return
            
        if not type.of.object system
            debug.error 'system pattern must be an object'
            return 

        if not ('name' of system) or not ('update' of system)
            debug.error 'you must define both "name" and "update" of system pattern'
            return

        if system.name of _systemPatterns
            debug.error 'you can\'t define same system twice'
            return

        _systemPatterns[system.name] = system

    @Entity: (entity) ->
        

    constructor: ->
        @componetsPool = []

module.exports = Engine