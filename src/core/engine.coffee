type = require '../utils/type'
debug = require '../debug/debug'
config = require '../config/config'
extend = require '../utils/extend'

register = require './register'

EventEmitter = require './event'
Pool = require '../collection/pool'
OrderedLinkedList = require '../collection/orderedlinkedlist'
DoublyLinkedList = require '../collection/doublylinkedlist'
Entity = require './entity'

BitSet = require('bitset.js').BitSet

class Engine extends EventEmitter
    @Component: register.registerComponent
    @System: register.registerSystem
    @Entity: register.registerEntity

    constructor: (@game) ->
        super()

        @_greatestEntityId = 0
        @_entityIdsToReuse = []

        @_entities = []
        @_systems = new OrderedLinkedList()

        @_singletonSystemsPresentInEngine = {}

        @_searchingBitSet = new BitSet config 'max_components_count'
        @_excludingBitSet = new BitSet config 'max_components_count'

        @_componetsPool = new Pool()
        @_entitiesPool = new Pool()

        @_families =
            NONE: new DoublyLinkedList()

        @_functionalFamiliesPool = []
        @_usedFunctionalFamilies = []

        @_functionalFamiliesPool.push new DoublyLinkedList() for i in [0..20]

        @_entitiesToRemove = []

        @_BLANK_FAMILY = new DoublyLinkedList()

        @_updating = false

        @on 'engine:updateFinished', @_removeMarkedEntities, @
        @on 'engine:updateFinished', @_transferFunctionalFamilies, @

        @_entitiesCount = 0

        register.setCannotModify()

    canModify: ->
        return register.canModify()

    isUpdating: ->
        return @_updating

    generateEntityId: ->
        id = @_entityIdsToReuse.pop()

        if not id?
            id = @_greatestEntityId++

        return id

    getNewComponent: (name) ->
        if @_componetsPool.has name
            return @_componetsPool.pop name
        else
            componentPattern = register.getComponentPattern name

            if componentPattern?
                return {
                    name: componentPattern.name
                    _pattern: componentPattern
                }
            else
                debug.warning 'component "%" does not exist', name
                return {}

    addComponentToPool: (name, component) ->
        @_componetsPool.push name, component

    create: (name, args...) ->
        args.unshift @game

        entity = @_getNewEntity name
        
        entity.getPattern().create.apply entity, args

        @_addEntityToFamilies entity
        @_addEntityToEngine entity

        return @

    _getNewEntity: (name) ->
        if @_entitiesPool.has name
            entity = @_entitiesPool.pop name
            entity.renovate()
        else
            entity = new Entity(name, @)

        return entity

    _addEntityToFamilies: (entity) ->
        families = entity.getPattern()._families

        for family in families
            @_families[family] ?= new DoublyLinkedList()
            @_families[family].append entity

        return @

    _addEntityToEngine: (entity) ->
        @_entities[entity.getId()] = entity
        @_entitiesCount++

        return @

    remove: (entity, args...) ->
        id = entity.getId()
        if not @_entities[id]?
            return @

        args.unshift @game

        pattern = entity.getPattern()

        pattern.remove and pattern.remove.apply entity, args

        @_removeEntityFromFamilies entity
        entity.removeAllComponents()

        @_entitiesPool.push entity.name, entity

        delete @_entities[id]

        @_entityIdsToReuse.push id
        @_entitiesCount--

        return @

    removeAllEntities: ->
        if not @_updating
            @remove entity for entity in @_entities
        else
            debug.warning 'cannot remove entities during engine update'

        return @

    markForRemoval: (entity) ->
        @_entitiesToRemove.push entity

        return @

    _removeMarkedEntities: ->
        @remove entity for entity in @_entitiesToRemove
        @_entitiesToRemove.length = 0

        return @

    _removeEntityFromFamilies: (entity) ->
        families = entity.getPattern()._families

        for family in families
            @_families[family]?.remove entity

        return @

    getEntity: (id) ->
        return @_entities[id] ? null

    getFamily: (family) ->
        return (@_families[family] ? @_BLANK_FAMILY).reset()
    
    getEntitiesByFamily: (family) ->
        @getFamily family

    getEntitiesWith: (components, legacy=false) ->
        if legacy
            matchedEntities = []
        else
            matchedEntities = @_getNewFunctionalFamily()

        @_searchingBitSet.clear()
        @_excludingBitSet.clear()

        if type.of.object components
            if type.of.array components.without
                for component in components.without
                    @_excludingBitSet.set register.getComponentPattern(component)._bit

            components = components.with ? []

        for component in components
            @_searchingBitSet.set register.getComponentPattern(component)._bit

        for entity in @_entities
            if not type.of.undefined(entity) and @_searchingBitSet.subsetOf(entity._bitset) and @_excludingBitSet.and(entity._bitset).isEmpty()
                matchedEntities.push entity

        return matchedEntities

    getEntitiesByName: (name) ->

    _getNewFunctionalFamily: ->
        newFamily = @_functionalFamiliesPool.pop()

        if not newFamily?
            newFamily = new DoublyLinkedList()
            @_usedFunctionalFamilies.push newFamily

        return newFamily

    _transferFunctionalFamilies: ->
        while used = @_usedFunctionalFamilies.pop()
            @_functionalFamiliesPool.push used.clear()
        
        return @

    addSystem: (name, priority, args...) ->
        if name of @_singletonSystemsPresentInEngine
            debug.warning 'system % is defined as singleton and is already present in engine'

            return @

        pattern = register.getSystemPattern name

        system =
            game: @game
            engine: @
            priority: priority

        extend system, pattern
        
        system.initialize and system.initialize.apply system, args

        @_systems.insert system, priority
        
        if system.singleton
            @_singletonSystemsPresentInEngine[name] = true

        return @
    
    addSystems: (args...) ->
        @addSystem arg... for arg in args
        return @

    removeSystem: (system, args...) ->
        if not @_updating
            system.remove and system.remove.apply system, args
            @_systems.remove system, true
            delete @_singletonSystemsPresentInEngine[system.name]

        return @

    removeAllSystems: (args...) ->
        @_systems.reset()

        while node = @_systems.next()
            system = node.data
            system.remove and system.remove.apply system, args

        @_systems.clear()

        return @

    isSystemActive: (name) ->

    update: (event) ->
        delta = event.delta

        @emit 'engine:beforeUpdate', event

        @_updating = true

        @_systems.reset()
        while node = @_systems.next()
            system = node.data

            system.update delta, event

        @_updating = false

        @emit 'engine:afterUpdate', event
        @emit 'engine:updateFinished'

    clear: (immediately) ->
        if immediately
            @removeAllSystems()
            @removeAllEntities()
        else
            @once 'engine:updateFinished', (e) =>
                @removeAllSystems()
                @removeAllEntities()

        return @

module.exports = Engine