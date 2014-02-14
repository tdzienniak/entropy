(function (app) {
    var _component_pattern = {};
    var _system_pattern = {};
    var _entity_pattern = {};
    var _can_modify = true;
    var _next_component_id = 0;

    function Engine (game) {
        _can_modify = false;

        /**
         * Main game object reference.
         * @type {Game}
         */
        this.game = game;

        this._greatest_entity_id = 0;

        this._entity_ids_to_reuse = [];

        this._entities = [];

        this._current_entity_id = null;

        this._entities_count = 0;

        this._components_index = [];

        this._components_pool = [];

        this._components_pool_size = 0;
        
        this._entities_pool = {};

        this._entities_pool_size = 0;
        
        /**
         * Ordered singly linked list with system instances. The update method iterates
         * through them on every tick and call their update method.
         * @type {OrderedLinkedList}
         */
        this._systems = new app.OrderedLinkedList();

        this._updating = false;

        this._families = {
            none: new app.Family("none")
        };

        this._entity_to_family_mapping = [];

        this._entities_to_remove = [];

        this.BLANK_FAMILY = new app.Family("empty");

        this._clear = false;

        //initializing component pool
        for (var i = 0; i < _next_component_id; i += 1) {
            this._components_pool[i] = [];
        }
    }

    Engine.component = function (name, component) {
        if (!_can_modify) {
            app.Game.error("Entropy: you can't specify components during system work - do it before initialization.");
        }

        if (typeof name !== "string" && !(name instanceof String)) {
            app.Game.error("Entropy: component name should be string.");
        }

        if (typeof component !== "object") {
            app.Game.error("Entropy: component should be plain object.");
        }

        if (typeof _component_pattern[name] !== "undefined") {
            app.Game.error("Entropy: you can't specify same component twice.");
        }

        _component_pattern[name] = [
            _next_component_id,
            component
        ];

        //Entropy.trigger("componentadded", this._greatest_c_id);

        _next_component_id += 1;
    };

    Engine.system = function (name, system) {
        if (!_can_modify) {
            app.Game.error("Entropy: you can't specify systems during system work - do it before initialization.");
        }

        if (typeof name !== "string" && !(name instanceof String)) {
            app.Game.error("Entropy: system name should be string.");
        }

        if (typeof system !== "object") {
            app.Game.error("Entropy: system should be plain object.");
        }

        if (typeof _system_pattern[name] !== "undefined") {
            app.Game.error("Entropy: you can't specify same system twice.");
        }

        if (!("update" in system)) {
            app.Game.error("Entropy: system should specify 'update' method.");
        }

        _system_pattern[name] = system;
    };

    Engine.entity = function (name, family, pattern) {
        if (family === "") {
            family = "none";
        }

        _entity_pattern[name] = {
            families: family.split("|"),
            pattern: pattern
        };
    };

    Engine.prototype = {
        getComponentPattern: function (name) {
            return _component_pattern[name][1];
        },
        getNewComponent: function (name) {
            var id = _component_pattern[name][0];

            if (this._components_pool[id].length > 0) {
                this._components_pool_size -= 1;

                var new_component = this._components_pool[id].pop();
                new_component.deleted = false;

                return new_component;
            } else {
                return {
                    id: id,
                    name: name,
                    deleted: false
                };
            }
        },
        addComponentToPool: function (name, obj) {
            var id = _component_pattern[name][0];

            this._components_pool_size += 1;

            return this._components_pool[id].push(obj);
        },
        _createComponentsIndex: function (entity_id) {
            this._components_index[entity_id] = [];

            for (var i = 0; i < _next_component_id; i += 1) {
                this._components_index[entity_id][i] = false;
            }
        },
        setComponentsIndex: function (entity_id, c_id) {
            this._components_index[entity_id][c_id] = true;
        },
        unsetComponentsIndex: function (entity_id, c_id) {
            this._components_index[entity_id][c_id] = false;
        },
        _addEntityToFamilies: function (entity) {
            var families =  this._getFamiliesOf(entity.name);
            var family;

            for (var i = 0, max = families.length; i < max; i += 1) {
                family = families[i];

                if (!this._families.hasOwnProperty(family)) {
                    this._families[family] = new app.Family(family);
                }

                this._families[family].append(e);
            }
        },
        _getFamiliesOf: function(name) {
            return this._getEntityPattern(name).families;
        },
        _createPoolForEntity: function (name) {
            if (!this._entities_pool.hasOwnProperty(name)) {
                this._entities_pool[name] = [];
            }
        },
        _addEntityToSystem: function (entity) {
            this._entities[entity.id] = entity;

            this._entities_count += 1;
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
            var entity = this._entities_pool[name].pop() || new app.Entity(name, this.game);
            entity.setId(this._getIdForNewEntity());

            return entity;
        },
        create: function (name) {
            var args = slice.call(arguments, 1);
            args.unshift(this.game);

            this._createPoolForEntity(name);

            var entity = this._getNewEntity(name);
            var pattern = this._getEntityPattern(name);

            pattern.create.apply(entity, args);

            this._addEntityToFamilies(entity);
            this._addEntityToSystem(entity);
        },
        remove: function (e) {
            var args;
            var id = e.id;
            var f, e_f_id;
            var families = _entity_pattern[e.name].families;

            //already removed
            if (typeof this._entities[id] === "undefined") {          
                return;
            }

            args = slice.call(arguments, 2);
            args.unshift(this.game);

            for (var i = 0, max = families.length; i < max; i += 1) {
                f = families[i];
                
                this._families[f].remove(e);
            }

            var pattern = this._getEntityPattern(entity.name);

            pattern.remove  && pattern.remove.apply(e, args);

            e.removeAllComponents(true);

            this._entities_pool[e.name].push(e);
            //this._entities_pool_size += 1;

            delete this._entities[id];
            delete this._entity_to_family_mapping[id];

            this._entity_ids_to_reuse.push(id);

            this._entities_count -= 1;
        },
        removeAllEntities: function () {
            if ( ! this.isUpdating()) {
                this._entities.forEach(function (entity) {
                    this.remove(entity);
                }, this);
            } else {
                app.Game.warning("entities couldn't be removed due to engine's still running.");
            }

            return this;
        },
        markForRemoval: function (e) {
            this._entities_to_remove.push(e);
        },
        getEntity: function (id) {
            if ( ! isUndefined(this._entities[id])) {
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
                return _component_pattern[name][0];
            });

            max1 = this._components_index.length;
            for (entity_id = 0; entity_id < max1; entity_id += 1) {
                found = 0;

                max2 = c_array.length;
                for (i = 0; i < max2; i += 1) {
                    c_id = c_array[i];

                    if (this._components_index[entity_id][c_id]) {
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
            if ( ! isString(family)) {
                app.Game.error("family name must be a string.");
            }

            if (this._families.hasOwnProperty(family)) {
                return this._families[family];
            } else {
                return this.BLANK_FAMILY;
            }
        },
        addSystem: function (name, priority) {
            var args = Array.prototype.slice.call(arguments, 2);

            var system = _system_pattern[name];

            system.name = name;
            system.game = this.game;
            system.engine = this;

            system.init && system.init.apply(system, args);

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
                var args = Array.prototype.slice.call(arguments, 1);

                system.remove && system.remove.apply(system, args);

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
        update: function (delta, event) {
            this._updating = true;

            var node = this._systems.head;
            while (node) {
                node.data.update(delta, event);

                node = node.next;
            }

            this._updating = false;

            node = this._systems.head;
            while (node) {
                node.data.afterUpdate && node.data.afterUpdate(delta, event);

                node = node.next;
            }

            for (var i = 0, max = this._entities_to_remove.length; i < max; i++) {
                this.remove(this._entities_to_remove[i]);
            }

            this._entities_to_remove.length = 0;

            app.trigger("afterupdate", null, this);
        },
        clear: function () {
            app.addEventListener("afterupdate", function (e) {
                this.removeAllSystems();
                this.removeAllEntities();

            }, true);
        },
        canModify: function () {
            return _can_modify;
        },
        isUpdating: function () {
            return this._updating;
        },
        getComponentPoolSize: function () {
            return this._component_pool_size;
        }
    };

    app["Engine"] = Engine;
})(app);