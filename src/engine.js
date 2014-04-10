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

        this._greatest_entity_id = 0;
        this._entity_ids_to_reuse = [];
        this._entities = [];
        this._entitiesCount = 0;

        this._componentsIndex = [];
        this._componentsPool = new Pool();

        this._entitiesPool = new Pool();

        this._systems = new OrderedLinkedList();

        this._families = {
            none: new Family("none")
        };

        this._entity_to_family_mapping = [];

        this._entitiesToRemove = [];

        this.BLANK_FAMILY = new Family("empty");

        this._updating = false;

        _can_modify = false;

        //initializing component pool
        /*for (var i = 0; i < _next_component_id; i += 1) {
            this._componentsPool[i] = [];
        }*/
        EventEmitter.call(this);

        this.on("updateFinished", this._removeMarkedEntities, this);
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

        _componentPatterns[component.name] = [
            _next_component_id,
            component
        ];

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
            return _componentPatterns[name][1];
        },
        getNewComponent: function (name) {
            var id = _componentPatterns[name][0];

            if (this._componentsPool.has(id)) {
                var component = this._componentsPool.pop(id);
                component.deleted = false;

                return component;
            } else {
                return {
                    id: id,
                    name: name,
                    deleted: false
                };
            }
        },
        addComponentToPool: function (name, obj) {
            var id = _componentPatterns[name][0];

            return this._componentsPool.push(id, obj);
        },
        setComponentsIndex: function (entityId, componentId) {
            this._componentsIndex[entityId][componentId] = true;
        },
        unsetComponentsIndex: function (entityId, componentId) {
            this._componentsIndex[entityId][componentId] = false;
        },
        create: function (name) {
            var args = Utils.slice.call(arguments, 1);
            args.unshift(this.game);

            var entity = this._getNewEntity(name);
            var pattern = this._getEntityPattern(name);

            pattern.create.apply(entity, args);

            this._addEntityToFamilies(entity);
            this._addEntityToEngine(entity);

            return this;
        },
        remove: function (entity) {
            var args;
            var id = entity.id;
            var f, e_f_id;
            var families = this._getFamiliesOfEntity(entity.name);

            //already removed
            if (typeof this._entities[id] === "undefined") {          
                return;
            }

            args = Utils.slice.call(arguments, 2);
            args.unshift(this.game);

            for (var i = 0, max = families.length; i < max; i += 1) {
                f = families[i];
                
                this._families[f].remove(entity);
            }

            var pattern = this._getEntityPattern(entity.name);

            pattern.remove && pattern.remove.apply(entity, args);

            entity.removeAllComponents(true);

            this._entitiesPool.push(entity.name, entity);

            delete this._entities[id];
            delete this._entity_to_family_mapping[id];

            this._entity_ids_to_reuse.push(id);

            this._entitiesCount -= 1;

            return this;
        },
        removeAllEntities: function () {
            if ( ! this.isUpdating()) {
                this._entities.forEach(function (entity) {
                    this.remove(entity);
                }, this);
            } else {
                Entropy.Game.warning("entities couldn't be removed due to engine's still running.");
            }

            return this;
        },
        markForRemoval: function (e) {
            this._entitiesToRemove.push(e);
        },
        getEntity: function (id) {
            if (!Utils.isUndefined(this._entities[id])) {
                return this._entities[id];
            } else {
                return null;
            }
        },
        getEntitiesWith: function (c_array) {
            var e_matched = [];
            var i, max1, max2;
            var entity_id, c_id, found;

            c_array = c_array.map(function (name) {
                return _componentPatterns[name][0];
            });

            max1 = this._componentsIndex.length;
            for (entity_id = 0; entity_id < max1; entity_id += 1) {
                found = 0;

                max2 = c_array.length;
                for (i = 0; i < max2; i += 1) {
                    c_id = c_array[i];

                    if (this._componentsIndex[entity_id][c_id]) {
                        found += 1;
                    }
                }

                if (found === c_array.length) {
                    e_matched.push(this._entities[entity_id]); //copying temp array
                }
            }

            return e_matched;
        },
        getAllEntities: function () {
            return this._entities.map(function (entity) {
                return entity;
            });
        },
        getFamily: function (family) {
            if (!Utils.isString(family)) {
                Entropy.Game.error("Family name must be a string.");
            }

            if (family in this._families) {
                return this._families[family];
            } else {
                return this.BLANK_FAMILY;
            }
        },
        addSystem: function (name, priority) {
            var args = Utils.slice.call(arguments, 2);
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
                var args = Utils.slice.call(arguments, 1);
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

            this.emit("updateFinished", null);
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
        clear: function () {
            this.once("updateFinished", function (e) {
                this.removeAllSystems();
                this.removeAllEntities();
            }, this);
        },
        _createComponentsIndex: function (entityId) {
            this._componentsIndex[entityId] = [];

            for (var i = 0; i < _next_component_id; i += 1) {
                this._componentsIndex[entityId][i] = false;
            }
        },
        _addEntityToFamilies: function (entity) {
            var families =  this._getFamiliesOfEntity(entity.name);

            for (var i = 0, max = families.length; i < max; i += 1) {
                var family = families[i];

                if (!(family in this._families)) {
                    this._families[family] = new Family(family);
                }

                this._families[family].append(entity);
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

            if (this._entity_ids_to_reuse.length !== 0) {
                id = this._entity_ids_to_reuse.pop();
            } else {
                id = this._greatest_entity_id;
                this._greatest_entity_id += 1;

                this._createComponentsIndex(id);
            }

            return id;
        },
        _getNewEntity: function (name) {
            var entity = this._entitiesPool.pop(name) || new Entity(name, this.game);
            entity.setId(this._getIdForNewEntity());

            return entity;
        },
        _getEntityPattern: function (name) {
            if (name in _entityPatterns) {
                return _entityPatterns[name].pattern;
            } else {
                Entropy.Game.error(["pattern for entity", name, "does not exist."].join(" "));
            }
        }
    });


    Entropy.Engine = Engine;

})(root);