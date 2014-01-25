(function (app) {
    var _component_manifest = {};
    var _system_manifest = {};
    var _entity_pattern = {};
    var _can_modify = true;
    var _next_c_id = 0;

    function Engine (game) {
        _can_modify = false;

        /**
         * Main game object reference.
         * @type {Game}
         */
        this.game = game;

        /**
         * Greatest entity id so far.
         * Variable is used to assign unique ids to new entities.
         * @type {Number}
         */
        this._greatest_e_id = 0;

        /**
         * Array with entity ids to reuse. These come from entities removals.
         * @type {Array}
         */
        this._e_ids_to_reuse = [];

        /**
         * 2D array with entity-component idicators. Values are simply true or false.
         * For example, if [2][3] == true, means, that entity with id 2 has component
         * with id 3. Components ids can be obtained via component manifest.
         * 
         * @type {Array}
         */
        this._entities = [];

        /**
         * Helper variable used to simplify using of add and remove methods.
         * It stores id of current worked on entity.
         * @type {Number}
         */
        this._current_e_id = null;

        /**
         * Counter of all entities present at the system.
         * @type {Number}
         */
        this._entities_count = 0;

        /**
         * 2D array similar to entities array. However, istead of bool values
         * it contains plain objects - real component instances. 
         * @type {Array}
         */
        this._components_index = [];

        /**
         * Component pool. Contains componet object that can be reused when creating 
         * or modifying entities. For more GC friendlyness.
         * @type {Array}
         */
        this._components_pool = [];

        /**
         * Size of component pool.
         * @type {Number}
         */
        this._components_pool_size = 0;
        
        /**
         * Entities pool object. Keys are entity pattern names.
         * @type {Object}
         */
        this._entities_pool = {};

        /**
         * Size of entities pool.
         * @type {Number}
         */
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

        this._entity_family_index = [];

        this._entities_to_remove = [];

        this.BLANK_FAMILY = new app.Family("empty");

        //initializing component pool
        for (var i = 0; i < _next_c_id; i += 1) {
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

        if (typeof _component_manifest[name] !== "undefined") {
            app.Game.error("Entropy: you can't specify same component twice.");
        }

        _component_manifest[name] = [
            _next_c_id,
            component
        ];

        //Entropy.trigger("componentadded", this._greatest_c_id);

        _next_c_id += 1;
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

        if (typeof _system_manifest[name] !== "undefined") {
            app.Game.error("Entropy: you can't specify same system twice.");
        }

        if (!("update" in system)) {
            app.Game.error("Entropy: system should specify 'update' method.");
        }

        _system_manifest[name] = system;
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
            return _component_manifest[name][1];
        },
        getNewComponent: function (name) {
            var id = _component_manifest[name][0];

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
            var id = _component_manifest[name][0];

            this._components_pool_size += 1;

            return this._components_pool[id].push(obj);
        },
        setComponentsIndex: function (e_id, c_id) {
            this._components_index[e_id][c_id] = true;
        },
        unsetComponentsIndex: function (e_id, c_id) {
            this._components_index[e_id][c_id] = false;
        },
        createComponentsIndex: function (e_id) {
            this._components_index[e_id] = [];

            for (var i = 0; i < _next_c_id; i += 1) {
                this._components_index[e_id][i] = false;
            }
        },
        obtainEntityId: function () {
            var id;

            if (this._e_ids_to_reuse.length !== 0) {
                id = this._e_ids_to_reuse.pop();
            } else {
                id = this._greatest_e_id;
                this._greatest_e_id += 1;

                this.createComponentsIndex(id);
            }

            return id;
        },
        getNewEntity: function (name, id) {
            var e = this._entities_pool[name].pop() || new app.Entity(name, this.game);
            e.setId(id);

            return e;
        },
        canModify: function () {
            return _can_modify;
        },
        create: function (name) {
            var f, families;

            var args = Array.prototype.slice.call(arguments, 1);
            args.unshift(this.game);
  
            var id = this.obtainEntityId();

            if (!this._entities_pool.hasOwnProperty(name)) {
                this._entities_pool[name] = [];
            }

            var e = this.getNewEntity(name, id);

            _entity_pattern[name].pattern.create.apply(e, args);

            this._entities[id] = e;

            families = _entity_pattern[name].families;

            for (var i = 0, max = families.length; i < max; i += 1) {
                f = families[i];

                if (!this._families.hasOwnProperty(f)) {
                    this._families[f] = new app.Family(f);
                }

                this._families[f].append(e);
            }

            this._entity_family_index[id] = families;

            this._entities_count += 1;
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

            args = Array.prototype.slice.call(arguments, 2);
            args.unshift(this.game);

            for (var i = 0, max = families.length; i < max; i += 1) {
                f = families[i];
                
                this._families[f].remove(e);
            }

            //optionaly call remove method
            _entity_pattern[e.name].pattern.remove  && _entity_pattern[e.name].pattern.remove.apply(e, args);

            //soft delete all components
            e.removeAllComponents(true);

            this._entities_pool[e.name].push(e);
            //this._entities_pool_size += 1;

            delete this._entities[id];
            delete thie._entity_family_index[id];

            this._e_ids_to_reuse.push(id);

            this._entities_count -= 1;
        },
        removeAllEntities: function () {

        },
        markForRemoval: function (e) {
            this._entities_to_remove.push(e);
        },
        getEntity: function (id) {
            if (typeof this._entities[id] !== "undefined") {
                return this._entities[id];
            } else {
                return null;
            }
        },
        getEntitiesWith: function (c_array) {
            var e_matched = [];
            var i, max1, max2;
            var e_id, c_id, found;

            c_array = c_array.map(function (name) {
                return _component_manifest[name][0];
            });

            max1 = this._components_index.length;
            for (e_id = 0; e_id < max1; e_id += 1) {
                found = 0;

                max2 = c_array.length;
                for (i = 0; i < max2; i += 1) {
                    c_id = c_array[i];

                    if (this._components_index[e_id][c_id]) {
                        found += 1;
                    }
                }

                if (found === c_array.length) {
                    e_matched.push(this._entities[e_id]); //copying temp array
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
            if (!isString(family)) {
                app.Game.error("family name must be a string.");
            }

            if (!this._families.hasOwnProperty(family)) {
                return this.BLANK_FAMILY;
            } else {
                return this._families[family];
            }
        },
        addSystem: function (name, priority) {
            var args = Array.prototype.slice.call(arguments, 2);

            var system = _system_manifest[name];

            system.name = name;
            system.game = this.game;
            system.engine = this;

            system.init && system.init.apply(system, args);

            this._systems.insert(system, priority);

            return this;
        },
        removeSystem: function (system) {
            if (!this.isUpdating()) {
                this._systems.remove(system);
            }

            return this;
        },
        removeAllSystems: function () {
            this._systems.clear();
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

            node = this._systems.head;

            while (node) {
                node.data.afterUpdate && node.data.afterUpdate(delta, event);

                node = node.next;
            }

            for (var i = 0, max = this._entities_to_remove.length; i < max; i++) {
                this.remove(this._entities_to_remove[i]);
            }

            this._entities_to_remove.length = 0;

            this._updating = false;
        },
        clear: function () {

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