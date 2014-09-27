type = require '../utils/type'
debug = require '../debug/debug'
config = require '../config/config'

canModify = true
componentPatterns = {}
systemPatterns = {}
entityPatterns = {}
nextComponentId = 0

module.exports =
    registerComponent: (component) ->
        if not canModify
            debug.error 'you can\'t define new component during system work'
            return

        if not type.of.object component
            debug.error 'component pattern must be an object'
            return 

        if not ('name' of component) or not ('initialize' of component)
            debug.error 'you must define both "name" and "initialize" of component pattern'
            return

        if component.name of componentPatterns
            debug.error 'you can\'t define same component twice'
            return

        component._bit = nextComponentId++
        componentPatterns[component.name.toLowerCase()] = component

    registerSystem: (system) ->
        if not canModify
            debug.error 'you can\'t define new system during system work'
            return
            
        if not type.of.object system
            debug.error 'system pattern must be an object'
            return 

        if not ('name' of system) or not ('update' of system)
            debug.error 'you must define both "name" and "update" of system pattern'
            return

        if system.name of systemPatterns
            debug.error 'you can\'t define same system twice'
            return

        systemPatterns[system.name] = system

    registerEntity: (entity) ->
        if not canModify
            debug.error 'you can\'t define new system during system work'
            return
            
        if not type.of.object entity
            debug.error 'entity pattern must be an object'
            return 

        if not ('name' of entity) or not ('create' of entity)
            debug.error 'you must define both "name" and "create" of entity pattern'
            return

        if entity.name of entityPatterns
            debug.error 'you can\'t define same entity twice'
            return

        if not entity.family? or entity.family is ''
            entity.family = 'NONE'

        entity._families = entity.family.split '|'
        entityPatterns[entity.name] = entity

    getComponentPattern: (name) ->
        return componentPatterns[name]

    getSystemPattern: (name) ->
        return systemPatterns[name]

    getEntityPattern: (name) ->
        return entityPatterns[name]

    canModify: ->
        return canModify

    setCannotModify: ->
        canModify = false