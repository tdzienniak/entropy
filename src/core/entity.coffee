config = require '../config/config'
type = require '../utils/type'
debug = require '../debug/debug'

EventEmitter = require './event'

register = require './register'

BitSet = require('bitset.js').BitSet

class Entity extends EventEmitter
    constructor: (name, @engine) ->
        super()

        @_id = @engine.generateEntityId()
        @_bitset = new BitSet config 'max_components_count'
        @_pattern = register.getEntityPattern name
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
            return @_bitset.get(@components[name.toLowerCase()]?._pattern._bit) is 1
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
        @_stateChanges = []

    enter: (stateName, args...) ->
        if @_inFinalState
            debug.log "entity %s is in its final state", @name
            return @

        if @_pattern.states? and not (stateName of @_pattern.states)
            debug.warning "there is no state %s for entity %s", stateName, @name
            return @

        statePattern = @_pattern.states[stateName]

        if statePattern.excluding
            @_exitAllStates()

        @_stateChanges.push
            name: stateName
            action: "enter"
            fn: statePattern.enter
            args: args

        return @

    exit: (stateName, args...) ->
        if @_inFinalState
            debug.log "entity %s is in its final state", @name
            return @

        if not @in(stateName)
            debug.warning "entity %s is not ins state %s - no exiting required", @name, stateName
            return @

        if @_pattern.states? and not (stateName of @_pattern.states)
            debug.warning "there is no state %s for entity %s", stateName, @name
            return @

        statePattern = @_pattern.states[stateName]

        @_stateChanges.push
            name: stateName
            action: "exit"
            fn: statePattern.exit
            args: args

        return @

    in: (states...) ->
        if states.length is 0
            return false

        for state in states
            if @_currentStates.indexOf(state) is -1
                return false

        return true

    _exitAllStates: ->
        for state in @_currentStates
            @exit state

    _applyStateChanges: ->
        if @_inFinalState
            return

        while change = @_stateChanges.shift()
            if change.action is "enter" and @in(change.name) or change.action is "exit" and not @in(change.name)
                continue

            stateName = change.name
            statePattern = @_pattern.states[stateName]
            stateObject = @_stateObject[stateName] ?= {}

            change.args.unshift stateObject

            change.fn and change.fn.apply @, change.args

            if change.action is "enter"
                @_currentStates.push stateName
            else if change.action is "exit"
                @_currentStates.splice @_currentStates.indexOf(stateName), 1
                delete @_stateObject[stateName]

            if statePattern.final
                @_inFinalState = true
            
module.exports = Entity