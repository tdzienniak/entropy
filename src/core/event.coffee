type = require '../utils/type'

class EventEmitter
    constructor: ->
        @events = {}

    on: (event, fn, binding, once) ->
        if not type.of.string event or not type.of.function fn
            return undefined

        @events[event] ?= []

        @events[event].push
            fn: fn
            binding: binding ? null
            once: once ? false
        
        return undefined

    once: (event, fn, binding) ->
        @on event, fn, binding

    emit: (event, args...) ->
        if not (event of @events)
            return undefined

        @events[event] = @events[event].filter (listener) ->
            (not listener.fn.apply listener.binding, args) or (not listener.once)

        return undefined

    trigger: (args...) ->
        @emit args...

    off: (event, fn) ->
        if not type.of.string event || not event of @events
            return undefined

        @events[event] = @events[event].filter (listener) ->
            fn? and listener.fn isnt fn

        return undefined

module.exports = EventEmitter