(function (Entropy) {
    "use strict";

    var Utils = Entropy.Utils;
    var EventEmitter = Entropy.EventEmitter;
    var Entity = Entropy.Entity;
    var Family = Entropy.Family;
    var Pool = Entropy.Pool;
    var OrderedLinkedList = Entropy.OrderedLinkedList;

    var _componentPatterns = {};
    var _systemPatterns = {};
    var _entityPatterns = {};
    var _can_modify = true;
    var _next_component_id = 0;

    function Engine (game) {
        this.game = game;

        this._greatestEntityId = 0;
        this._entityIdsToReuse = [];
        this._entities = [];
        this._entitiesCount = 0;

        /**
         * BitSet object used as bitmask when searching entities (with components).
         * @type {BitSet}
         */
        this._searchingBitSet = new BitSet(Entropy.MAX_COMPONENTS_COUNT);

        /**
         * BitSet object used as bitmask when searching entities (without components).
         * @type {BitSet}
         */
        this._excludingBitSet = new BitSet(Entropy.MAX_COMPONENTS_COUNT);

        /**
         * Pool with deleted components. For GC friendliness.
         * @type {Pool}
         */
        this._componentsPool = new Pool();

        /**
         * Pool with deleted entities. For GC friendliness.
         * @type {Pool}
         */
        this._entitiesPool = new Pool();

        this._systems = new OrderedLinkedList();

        this._families = {
            NONE: new Family("NONE")
        };

        /**
         * Pool with functional families - used as generic linked list containers.
         * @type {Array}
         */
        this._functionalFamiliesPool = [];

        /**
         * Used functional families. This array is cleared after each update. Its members are transfered to
         * functional families pool.
         * @type {Array}
         */
        this._usedFunctionalFamilies = [];

        /**
         * Initializing functional families pool.
         */
        for (var i = 0; i < 20; i++) {
            this._functionalFamiliesPool.push(new Family('FUNC_' + i));
        }

        /**
         * Entities marked for removal at the end of 'update' loop.
         * @type {Array}
         */
        this._entitiesToRemove = [];

        /**
         * Placeholder family, currently not used.
         * @type {Family}
         */
        this.BLANK_FAMILY = new Family("BLANK_FAMILY");

        /**
         * Flag indicating whether engine is updating (is in its 'update' loop) or not.
         * @type {Boolean}
         */
        this._updating = false;

        /*
         * Setting this flag to 'false' prevent further engine modifications (adding entities, components etc.).
         */
        _can_modify = false;


        EventEmitter.call(this);

        /*
         * Adding standard event listeners.
         */
        this.on("engine:updateFinished", this._removeMarkedEntities, this);
        this.on("engine:updateFinished", this._transferFunctionalFamilies, this);
    }

    Engine.Component = function (component) {
        if (!_can_modify) {
            Entropy.Game.error("Entropy: you can't specify components during system work - do it before initialization.");
        }

        if (typeof component !== "object") {
            Entropy.Game.error("Entropy: component should be plain object.");
        }

        if (typeof _componentPatterns[component.name] !== "undefined") {
            Entropy.Game.error("Entropy: you can't specify same component twice.");
        }

        _componentPatterns[component.name] = {
            bit: _next_component_id,
            pattern: component
        };

        _next_component_id += 1;
    };

    Engine.System = function (system) {
        if (!_can_modify) {
            Entropy.Game.error("Entropy: you can't specify systems during system work - do it before initialization.");
        }

        if (typeof system !== "object") {
            Entropy.Game.error("Entropy: system should be plain object.");
        }

        if (typeof _systemPatterns[system.name] !== "undefined") {
            Entropy.Game.error("Entropy: you can't specify same system twice.");
        }

        _systemPatterns[system.name] = system;
    };

    Engine.Entity = function (entity) {
        if (entity.family === "") {
            family = "none";
        }

        _entityPatterns[entity.name] = {
            families: entity.family.split("|"),
            pattern: entity
        };
    };

    Utils.extend(Engine.prototype, EventEmitter.prototype);

    Utils.extend(Engine.prototype, {
        canModify: function () {
            return _can_modify;
        },
        isUpdating: function () {
            return this._updating;
        },
        getComponentPoolSize: function () {
            return this._componentsPool.size();
        },
        getComponentPattern: function (name) {
            return _componentPatterns[name].pattern;
        },
        getNewComponent: function (name) {
            var bit = _componentPatterns[name].bit;

            if (this._componentsPool.has(bit)) {
                var component = this._componentsPool.pop(bit);
                component.deleted = false;

                return component;
            } else {
                return {
                    bit: bit,
                    name: name,
                    deleted: false
                };
            }
        },
        addComponentToPool: function (name, obj) {
            return this._componentsPool.push(_componentPatterns[name].bit, obj);
        },
        create: function (name) {
            var args = Utils.slice(arguments, 1);
            args.unshift(this.game);

            var entity = this._getNewEntity(name);
            var pattern = this._getEntityPattern(name);

            pattern.create.apply(entity, args);

            this._addEntityToFamilies(entity);
            this._addEntityToEngine(entity);

            return this;
        },
        remove: function (entity) {
            //already removed
            if (Utils.isUndefined(this._entities[entity.id])) {          
                return;
            }

            var args = Utils.slice(arguments, 2);
            args.unshift(this.game);

            var pattern = entity.getPattern();

            pattern.remove && pattern.remove.apply(entity, args);

            this._removeEntityFromFamilies(entity);
            entity.removeAllComponents(true);

            this._entitiesPool.push(entity.name, entity);

            delete this._entities[entity.id];

            this._entityIdsToReuse.push(entity.id);

            this._entitiesCount -= 1;

            return this;
        },
        removeAllEntities: function () {
            if ( ! this.isUpdating()) {
                this._entities.forEach(function (entity) {
                    this.remove(entity);
                }, this);
            } else {
                Entropy.Game.warning("entities couldn't be removed because engine's still running.");
            }

            return this;
        },
        markForRemoval: function (entity) {
            this._entitiesToRemove.push(entity);
        },
        getEntity: function (id) {
            if (!Utils.isUndefined(this._entities[id])) {
                return this._entities[id];
            } else {
                return null;
            }
        },
        getEntitiesWith: function (components) {
            var matchedEntities = [];

            this._searchingBitSet.clear();
            this._excludingBitSet.clear();

            if (!Utils.isArray(components) && Utils.isObject(components)) {
                components.without && components.without.forEach(function (component) {
                    this._excludingBitSet.set(_componentPatterns[component].bit);
                }, this);

                components = components.with;
            }

            if (Utils.isArray(components)) {
                components.forEach(function (component) {
                    this._searchingBitSet.set(_componentPatterns[component].bit);
                }, this);
            }

            for (var entityId = 0, max = this._entities.length; entityId < max; entityId += 1) {
                if (
                    !Utils.isUndefined(this._entities[entityId]) &&
                    this._searchingBitSet.subsetOf(this._entities[entityId].bitset) &&
                    this._excludingBitSet.and(this._entities[entityId].bitset).isEmpty()
                ) {
                    matchedEntities.push(this._entities[entityId]);
                }
            }

            return matchedEntities;
        },
        getEntitiesByName: function (names) {

        },
        getAllEntities: function () {
            return this._entities.map(function (entity) {
                return entity;
            });
        },
        getFamily: function (family) {
            if (!Utils.isString(family)) {
                Entropy.error("family name must be a string.");
            }

            if (family in this._families) {
                this._families[family].reset();

                return this._families[family];
            } else {
                return this.BLANK_FAMILY;
            }
        },
        addSystem: function (name, priority) {
            var args = Utils.slice(arguments, 2);
            var pattern = _systemPatterns[name];

            var system = {};

            system.game = this.game;
            system.engine = this;

            Utils.extend(system, pattern);

            pattern.initialize && pattern.initialize.apply(system, args);

            this._systems.insert(system, priority);

            return this;
        },
        addSystems: function () {
            for (var i = 0; i < arguments.length; i += 1) {
                this.addSystem.apply(this, arguments[i]);
            }

            return this;
        },
        removeSystem: function (system) {
            if ( ! this.isUpdating()) {
                var args = Utils.slice(arguments, 1);
                var pattern = _systemPatterns[system.name];

                pattern.remove && pattern.remove.apply(system, args);

                this._systems.remove(system);
            }

            return this;
        },
        removeAllSystems: function () {
            while (this._systems.head) {
                this.removeSystem(this._systems.head.data);
            }

            return this;
        },
        clear: function () {
            this.once("engine:updateFinished", function (e) {
                this.removeAllSystems();
                this.removeAllEntities();
            }, this);
        },
        isSystemActive: function (name) {
            var node = this._systems.head;

            while (node) {
                if (node.data.name === name) {
                    return true;
                }

                node = node.next;
            }

            return false;
        },
        update: function (event) {
            var delta = event.delta;

            this._beforeUpdate(delta, event);

            this._updating = true;

            var node = this._systems.head;
            while (node) {
                node.data.update(delta, event);
                node = node.next;
            }

            this._updating = false;

            this._afterUpdate(delta, event);

            this.emit("engine:updateFinished", null);
        },
        _beforeUpdate: function (delta, event) {
            var node = this._systems.head;
            while (node) {
                node.data.beforeUpdate && node.data.beforeUpdate(delta, event);

                node = node.next;
            }
        },
        _afterUpdate: function (delta, event) {
            var node = this._systems.head;
            while (node) {
                node.data.afterUpdate && node.data.afterUpdate(delta, event);

                node = node.next;
            }
        },
        _removeMarkedEntities: function () {
            for (var i = 0, max = this._entitiesToRemove.length; i < max; i++) {
                this.remove(this._entitiesToRemove[i]);
            }

            this._entitiesToRemove.length = 0;
        },
        _addEntityToFamilies: function (entity) {
            var families = this._getFamiliesOfEntity(entity.name);

            for (var i = 0, max = families.length; i < max; i += 1) {
                var family = families[i];

                if (!(family in this._families)) {
                    this._families[family] = new Family(family);
                    //this.on('engine:updateFinished', this._families[family].reset, this._families[family]);
                }

                this._families[family].append(entity);
            }
        },
        _removeEntityFromFamilies: function (entity) {
            var families = this._getFamiliesOfEntity(entity.name);

            for (var i = 0, max = families.length; i < max; i += 1) {
                var family = families[i];
                
                this._families[family].remove(entity);
            }
        },
        _getFamiliesOfEntity: function(name) {
            return _entityPatterns[name].families;
        },

        /*_createPoolForEntity: function (name) {
            if (!this._entitiesPool.hasOwnProperty(name)) {
                this._entitiesPool[name] = [];
            }
        }*/
        _addEntityToEngine: function (entity) {
            this._entities[entity.id] = entity;

            this._entitiesCount += 1;
        },
        _getIdForNewEntity: function () {
            var id;

            if (this._entityIdsToReuse.length !== 0) {
                id = this._entityIdsToReuse.pop();
            } else {
                id = this._greatestEntityId;
                this._greatestEntityId += 1;

                this._createComponentsIndex(id);
            }

            return id;
        },
        _getNewEntity: function (name) {
            var entity = this._entitiesPool.pop(name);

            if (!entity) {
                entity = new Entity(name, this.game);   
                entity.setPattern(this._getEntityPattern(name));
            }

            entity.setId(this._getIdForNewEntity());

            return entity;
        },
        _getEntityPattern: function (name) {
            if (name in _entityPatterns) {
                return _entityPatterns[name].pattern;
            } else {
                Entropy.error(["pattern for entity", name, "does not exist."].join(" "));
            }
        },
        _transferFunctionalFamilies: function () {
            var usedFunctionalFamily;

            while (usedFunctionalFamily = this._usedFunctionalFamilies.pop()) {
                usedFunctionalFamily.clear();
                this._functionalFamiliesPool.push(usedFunctionalFamily);
            }

            return this;
        }
    });

    Entropy.Engine = Engine;

})(root);