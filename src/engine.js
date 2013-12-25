(function (app) {
    var _component_manifest = {};
    var _system_manifest = {};
    var _can_modify = true;
    var _next_c_id = 0;

    function Engine () {
        _can_modify = false;

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

        //initializing component pool
        for (var i = 0; i < _next_c_id; i++) {
            this._component_pool[i] = [];
        }
    }

    Engine.component = function (name, component) {
        if (!_can_modify) {
            throw new Error("Entropy: you can't specify components during system work - do it before initialization.");
        }

        if (typeof name !== "string" && !(name instanceof String)) {
            throw new Error("Entropy: component name should be string.");
        }

        if (typeof component !== "object") {
            throw new Error("Entropy: component should be plain object.");
        }

        if (typeof _component_manifest[name] !== "undefined") {
            throw new Error("Entropy: you can't specify same component twice.");
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
            throw new Error("Entropy: you can't specify systems during system work - do it before initialization.");
        }

        if (typeof name !== "string" && !(name instanceof String)) {
            throw new Error("Entropy: system name should be string.");
        }

        if (typeof system !== "object") {
            throw new Error("Entropy: system should be plain object.");
        }

        if (typeof _system_manifest[name] !== "undefined") {
            throw new Error("Entropy: you can't specify same system twice.");
        }

        if (!("init" in system) || !("update" in system)) {
            throw new Error("Entropy: system should specify 'init' and 'update' methods.");
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
        createEntity: function () {
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

            this._e_ids_to_reuse.push(id);

            return this;
        },
        add: function (id, name) {
            if (typeof id === "number") {
                var args = Array.prototype.slice.call(arguments, 2);
            } else {
                var name = id; 
                id = this._current_e_id;

                var args = Array.prototype.slice.call(arguments, 1);
            }
            
            var c_id = _component_manifest[name][0];

            if (this._component_pool[c_id].length !== 0) {
                var new_c = this._component_pool[c_id].pop();
                this._component_pool_size--;
            } else {
                var new_c = {};
            }

            this._entities[id][c_id] = true;
            this._components[id][c_id] = _component_manifest[name][1].init.apply(new_c, args);

            return this;
        },
        remove: function (id, name) {

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
        addSystem: function (name, priority) {
            var args = Array.prototype.slice.call(arguments, 2);

            var system = _system_manifest[name];

            system._core = this;
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
        },
        getVersion: function () {
            return "v" + VERSION;
        }
    };

    app["Engine"] = Engine;
})(app);