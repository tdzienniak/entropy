config = require '../config/config'
type = require '../utils/type'
debug = require '../debug/debug'

EventEmitter = require './event'
config = require '../config/config'

register = require './register'

BitSet = require('bitset.js').BitSet

class Entity extends EventEmitter
    constructor: (name, @engine) ->
        super()

        @_id = @engine.generateEntityId()
        @_bitset = new BitSet config 'max_components_count'
        @_pattern = register.getEntityPattern(name)
        #@_recycled = false
        
        @_setDefaults()

        @name = name
        @components = {}

        @engine.on 'engine:updateFinished', @_applyStateChanges, @

    getId: ->
        return @_id

    getPattern: ->
        return @_pattern

    add: (name, args...) ->
        if not type.of.string name
            debug.warning 'component name should be string'
            return @

        lowercaseName = name.toLowerCase()

        component = @components[lowercaseName] ? @engine.getNewComponent lowercaseName
        component._pattern.initialize.apply component, args

        @components[lowercaseName] = component

        @_bitset.set component._pattern._bit

        return @

    remove: (name, hardDelete=false) ->
        if not type.of.string name
            debug.warning 'component name should be string'
            return @

        lowercaseName = name.toLowerCase()
        component = @components[lowercaseName]

        if component?
            bit = component._pattern._bit

            return @ if @_bitset.get(bit) is 0 and not hardDelete

            if hardDelete
                @engine.addComponentToPool lowercaseName, component
                delete @components[lowercaseName]

            @_bitset.clear bit

        return @

    removeAllComponents: (hardDelete=false) ->
        if not hardDelete
            @_bitset.clear()
            return @
        else
            for componentName of @components
                @remove componentName, true
            return @

    has: (name) ->
        if type.of.string name
            return @bitset.get(@components[name.toLowerCase()]?._pattern._bit) is 1
        else
            return false

    renovate: ->
        @_id = @engine.generateEntityId()
        @_setDefaults()

        return @

    _setDefaults: ->
        @_inFinalState = false
        @_remainingStateChanges = []
        @_stateObject = {}
        @_currentStates = []

    

    enter: (stateName) ->
    exit: (stateName) ->
    in: (states...) ->
    _getStatePattern: (stateName) ->
    _exitAllStates: ->
    _applyStateChanges: ->


module.exports = Entity