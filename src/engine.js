(function (app) {
    var _component_manifest = {};
    var _system_manifest = {};
    var _can_modify = true;
    var _next_c_id = 0;

    function Engine (game) {
        _can_modify = false;

        this.game = game;

        this._greatest_e_id = 0;
        this._e_ids_to_reuse = [];
        this._entities = [];
        this._current_e_id = null;
        this._components = [];
        this._component_pool = [];
        this._component_pool_size = 0;
        this._nodes = {};
        this._systems = new app.OrderedLinkedList();
        this._updating = false;
        this._entities_mapping = [];
        this._families = {
            none: []
        };
        this._e_family_index = [];

        //initializing component pool
        for (var i = 0; i < _next_c_id; i++) {
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

        if (!("init" in system) || !("update" in system)) {
            app.Game.error("Entropy: system should specify 'init' and 'update' methods.");
        }

        _system_manifest[name] = system;
    };

    Engine.node = function (name, node) {
        //_node_manifest[name] = node;
    };

    Engine.prototype = {
        canModify: function () {
            return _can_modify;
        },
        createEntity: function (family) {
            if (typeof family !== "string") {
                app.Game.error("Entropy: family name should be string.");
            }

            family = family || "none";

            var families = family.split("|");

            if (this._e_ids_to_reuse.length !== 0) {
                var id = this._e_ids_to_reuse.pop();
            } else {
                var id = this._greatest_e_id++;

                this._entities[id] = [];
                this._components[id] = [];

                for (var i = 0; i < this._next_c_id; i++) {
                    this._entities[id][i] = false;
                    this._components[id][i] = false;
                }
            }

            this._entities_mapping[id] = {};

            for (var i = 0, max = families.length; i < max; i += 1) {
                var f = families[i];

                //adding entity to family
                if (!(f in this._families)) {
                    this._families[f] = [];
                }

                this._families[f].push(id);
            }

            this._e_family_index[id] = family;

            this._current_e_id = id;

            return id;
        },
        removeEntity: function (id) {
            for (var i = 0; i < this._entities[id].length; i++) {
                if (this._entities[id][i]) {
                    this._entities[id][i] = false;

                    var component_name = this._components[id][i]._name;
                    var component_id = i;

                    this._component_pool[component_id].push(this._components[id][i]);

                    //for informational purposes
                    this._component_pool_size++;

                    this._components[id][i] = false;
                }
            }

            delete this._entities_mapping[id];

            var family = this._e_famlily_mapping[id];
            var f_id = this._families[family].indexOf(id);

            this._families[family].splice(f_id, 1);

            this._e_ids_to_reuse.push(id);

            return this;
        },
        add: function (id, name) {
            if (typeof id === "number") {
                var args = Array.prototype.slice.call(arguments, 2);
            } else {
                //this function can be used either with two or one parameter
                //if used wiht one, the only parameter is the name of component to add
                //but has been mapped to id argument
                var c_name = id; 

                id = this._current_e_id;

                var args = Array.prototype.slice.call(arguments, 1);
            }
            
            var c_id = _component_manifest[c_name][0];

            if (this._component_pool[c_id].length !== 0) {
                var new_c = this._component_pool[c_id].pop();
                this._component_pool_size--;
            } else {
                var new_c = {};
            }

            this._entities[id][c_id] = true;
            this._entities_mapping[id][c_name.toLowerCase()] = this._components[id][c_id] = _component_manifest[c_name][1].init.apply(new_c, args);

            return this;
        },
        remove: function (id, name) {
            if (typeof id === "number") {
                var args = Array.prototype.slice.call(arguments, 2);
            } else {
                //this function can be used either with two or one parameter
                //if used wiht one, the only parameter is the name of component to add
                //but has been mapped to id argument
                var c_name = id; 

                id = this._current_e_id;

                var args = Array.prototype.slice.call(arguments, 1);
            }

            var c_id = _component_manifest[c_name][0];

            this._component_pool[c_name].push(this._components[id][c_id]);

            this._components[id][c_id] = false;
            this._entities[id][c_id] = false;

            delete this._entities_mapping[c_name.toLowerCase()];

            return this;
        },
        getComponents: function (c_array) {
            var c_matched = [];

            for (var i = 0, len = c_array.length; i < len; i++) {
                c_array[i] = _component_manifest[c_array[i]][0];
            }

            for (var e_id = 0, len = this._entities.length; e_id < len; e_id++) {
                var temp = [];

                for (var c_id = 0, len2 = c_array.length; c_id < len2; c_id++) {
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
        getEntitiesWith: function (c_array) {
            var e_matched = [];

            for (var i = 0, len = c_array.length; i < len; i++) {
                c_array[i] = _component_manifest[c_array[i]][0];
            }

            for (var e_id = 0, len = this._entities.length; e_id < len; e_id++) {
                var found = 0;

                for (var c_id = 0, len2 = c_array.length; c_id < len2; c_id++) {
                    if (this._entities[e_id][c_array[c_id]]) {
                        found += 1;
                    }
                }

                if (found === c_array.length) {
                    e_matched.push(this._entities_mapping[e_id]) //copying temp array
                }
            }

            return e_matched;
        },
        getAllEntities: function () {
            return this._entities_mapping.map(function (entity) {
                return entity;
            });
        },
        getFamily: function (family) {
            if (!isString(family)) {
                app.error("family name should be string.");
            }

            if (!(family in this._families)) {
                app.log("there is no such family, empty array returned.");

                return [];
            }

            return this._families[family].map(function (e_id) {
                return this._entities_mapping[e_id];
            }, this);
        },
        addSystem: function (name, priority) {
            var args = Array.prototype.slice.call(arguments, 2);

            var system = _system_manifest[name];

            system.game = this.game;
            system._name = name;

            system.init.apply(system, args);

            this._systems.insert(system, priority);

            return this;
        },
        removeSystem: function (system) {
            if (!this.isUpdating()) {
                this._systems.remove(system);
            }
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
        update: function (delta) {
            this._updating = true;

            for (var node = this._systems.head; node; node = node.next) {
                node.data.update(delta);
            }

            //Entropy.trigger("updatecomplete");

            this._updating = false;
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