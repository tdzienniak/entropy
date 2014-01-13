(function (app) {
    var _component_manifest = {};
    var _system_manifest = {};
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
        this._components = [];

        /**
         * Component pool. Contains componet object that can be reused when creating 
         * or modifying entities. For more GC friendlyness.
         * @type {Array}
         */
        this._component_pool = [];

        /**
         * Size of component pool.
         * @type {Number}
         */
        this._component_pool_size = 0;
        //this._nodes = {};
        
        /**
         * Ordered linked list with system instances. The update method iterates
         * through them on every tick and call their update method.
         * @type {OrderedLinkedList}
         */
        this._systems = new app.OrderedLinkedList();


        this._updating = false;
        this._entities_map = [];
        this._families = {
            none: []
        };
        this._entity_family_map = [];

        this._entities_to_remove = [];

        //initializing component pool
        for (var i = 0; i < _next_c_id; i += 1) {
            this._component_pool[i] = [];
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

        if (!system.hasOwnProperty("update")) {
            app.Game.error("Entropy: system should specify 'update' method.");
        }

        _system_manifest[name] = system;
    };

    // Engine.node = function (name, node) {
    //     //_node_manifest[name] = node;
    // };

    Engine.prototype = {
        canModify: function () {
            return _can_modify;
        },
        createEntity: function (family) {
            if (typeof family !== "string") {
                app.Game.error("Entropy: family name should be string.");
            }

            var id;

            family = family || "none";

            var families = family.split("|");

            if (this._e_ids_to_reuse.length !== 0) {
                id = this._e_ids_to_reuse.pop();
            } else {
                id = this._greatest_e_id;
                this._greatest_e_id += 1;

                this._entities[id] = [];
                this._components[id] = [];

                for (var i = 0; i < this._next_c_id; i += 1) {
                    this._entities[id][i] = false;
                    this._components[id][i] = false;
                }
            }

            this._entities_map[id] = {
                _e_id: id
            };

            for (var i = 0, max = families.length; i < max; i += 1) {
                var f = families[i];

                //adding entity to family
                if (!(f in this._families)) {
                    this._families[f] = [];
                }

                this._families[f].push(id);
            }

            this._entity_family_map[id] = family;

            this._current_e_id = id;

            this._entities_count += 1;

            return id;
        },
        removeEntity: function (e_id) {
            for (var i = 0; i < this._entities[e_id].length; i += 1) {
                if (this._entities[e_id][i]) {
                    var c_name = this._components[e_id][i]._name;

                    this.remove(e_id, c_name);
                }
            }

            delete this._entities_map[e_id];

            var family = this._entity_family_map[e_id];
            var families = family.split("|");

            for (var i = 0, max = families.length; i < max; i += 1) {
                var f = families[i];

                var e_f_id = this._families[f].indexOf(e_id);

                if (e_f_id !== -1) {
                    this._families[f].splice(e_f_id, 1);
                } else {
                    //app.Game.error(" there is no such entity in this family.");
                }
            }

            this._e_ids_to_reuse.push(e_id);

            this._entities_count -= 1;

            return this;
        },
        removeAllEntities: function () {
            for (var i = 0, max = this._entities.length; i < max; i += 1) {
                var e_id = this._entities[i];

                this.removeEntity(e_id);
            }
        },
        add: function (e_id, name) {
            var c_name;
            var new_c;
            var args;
            var c_id;

            if (typeof e_id === "number") {
                args = Array.prototype.slice.call(arguments, 2);
                c_name = name;
            } else {
                //this function can be used either with two or one parameter
                //if used wiht one, the only parameter is the name of component to add
                //but has been mapped to e_id argument
                c_name = e_id; 

                e_id = this._current_e_id;

                args = Array.prototype.slice.call(arguments, 1);
            }
            
            c_id = _component_manifest[c_name][0];

            if (this._component_pool[c_id].length !== 0) {
                new_c = this._component_pool[c_id].pop();
                this._component_pool_size--;
            } else {
                new_c = {};
            }

            this._entities[e_id][c_id] = true;
            this._entities_map[e_id][c_name.toLowerCase()] =
                this._components[e_id][c_id] =
                _component_manifest[c_name][1].init.apply(new_c, args);

            //to which entity component belongs
            this._components[e_id][c_id]._e_id = e_id;

            this._components[e_id][c_id]._name = c_name;

            return this;
        },
        markForRemoval: function (id) {
            this._entities_to_remove.push(id);
        },
        remove: function (e_id, name) {
            var c_name;
            var args;

            if (typeof e_id === "number") {
                args = Array.prototype.slice.call(arguments, 2);
                c_name = name;
            } else {
                //this function can be used either with two or one parameter
                //if used wiht one, the only parameter is the name of component to add
                //but has been mapped to id argument
                c_name = e_id; 

                e_id = this._current_e_id;

                args = Array.prototype.slice.call(arguments, 1);
            }

            args.unshift(this.game);

            var c_id = _component_manifest[c_name][0];
            var c = this._components[e_id][c_id];

            this._component_pool[c_id].push(c);
            this._component_pool_size += 1;

            if (_component_manifest[c_name][1].hasOwnProperty("remove")) {
                _component_manifest[c_name][1].remove.apply(c, args);
            }

            this._components[e_id][c_id] = null;

            this._entities[e_id][c_id] = false;

            delete this._entities_map[e_id][c_name.toLowerCase()];

            return this;
        },
        getComponents: function (c_array) {
            var c_matched = [];

            for (var i = 0, len = c_array.length; i < len; i += 1) {
                c_array[i] = _component_manifest[c_array[i]][0];
            }

            for (var e_id = 0, len = this._entities.length; e_id < len; e_id += 1) {
                var temp = [];

                for (var c_id = 0, len2 = c_array.length; c_id < len2; c_id += 1) {
                    if (this._entities[e_id][c_array[c_id]]) {
                        temp.push(this._components[e_id][c_array[c_id]]);
                    }
                }

                if (temp.length === c_array.length) {
                    c_matched.push(temp.slice(0)) //copying temp array
                }
            }

            return c_matched;
        },
        getEntity: function (e_id) {
            return this._entities_map[e_id];
        },
        getEntitiesWith: function (c_array) {
            var e_matched = [];

            for (var i = 0, max = c_array.length; i < max; i += 1) {
                c_array[i] = _component_manifest[c_array[i]][0];
            }

            for (var e_id = 0, max = this._entities.length; e_id < max; e_id += 1) {
                var found = 0;

                for (var c_id = 0, len2 = c_array.length; c_id < len2; c_id += 1) {
                    if (this._entities[e_id][c_array[c_id]]) {
                        found += 1;
                    }
                }

                if (found === c_array.length) {
                    e_matched.push(this._entities_map[e_id]); //copying temp array
                }
            }

            return e_matched;
        },
        getAllEntities: function () {
            return this._entities_map.map(function (entity) {
                return entity;
            });
        },
        getFamily: function (family) {
            if (!isString(family)) {
                app.Game.error("family name should be string.");
            }

            if (!(family in this._families)) {
                //app.Game.log("there is no such family, empty array returned.");

                return [];
            }

            return this._families[family].map(function (e_id) {
                return this._entities_map[e_id];
            }, this);
        },
        addSystem: function (name, priority) {
            var args = Array.prototype.slice.call(arguments, 2);

            var system = _system_manifest[name];

            system.game = this.game;
            system._name = name;

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
                if (node.data._name === name) {
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
                this.removeEntity(this._entities_to_remove[i]);
            }

            this._entities_to_remove.length = 0;

            //Entropy.trigger("updatecomplete");

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