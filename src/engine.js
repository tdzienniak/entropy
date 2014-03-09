(function (app) {
    var _component_pattern = {};
    var _system_pattern = {};
    var _entity_pattern = {};
    var _can_modify = true;
    var _next_component_id = 0;

    function Engine (game) {
        this.game = game;

        this._greatest_entity_id = 0;
        this._entity_ids_to_reuse = [];
        this._entities = [];
        this._entities_count = 0;

        this._components_index = [];
        this._components_pool = new app.Pool();

        this._entities_pool = new app.Pool();

        this._systems = new app.OrderedLinkedList();

        this._families = {
            none: new app.Family("none")
        };

        this._entity_to_family_mapping = [];

        this._entities_to_remove = [];

        this.BLANK_FAMILY = new app.Family("empty");

        this._updating = false;

        _can_modify = false;

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

    var p = Engine.prototype;

    p.getComponentPattern = function (name) {
        return _component_pattern[name][1];
    }

    p.getNewComponent = function (name) {
        var id = _component_pattern[name][0];

        if (this._components_pool.exists(id)) {

            var new_component = this._components_pool.get(id);
            new_component.deleted = false;

            return new_component;
        } else {
            return {
                id: id,
                name: name,
                deleted: false
            };
        }
    }

    p.addComponentToPool = function (name, obj) {
        var id = _component_pattern[name][0];

        return this._components_pool.add(id, obj);
    }

    p.setComponentsIndex = function (entity_id, c_id) {
        this._components_index[entity_id][c_id] = true;
    }

    p.unsetComponentsIndex = function (entity_id, c_id) {
        this._components_index[entity_id][c_id] = false;
    }

    

    p.create = function (name) {
        var args = slice.call(arguments, 1);
        args.unshift(this.game);

        var entity = this._getNewEntity(name);
        var pattern = this._getEntityPattern(name);

        pattern.create.apply(entity, args);

        this._addEntityToFamilies(entity);
        this._addEntityToSystem(entity);
    }

    p.remove = function (entity) {
        var args;
        var id = entity.id;
        var f, e_f_id;
        var families = this._getFamiliesOfEntity(entity.name);

        //already removed
        if (typeof this._entities[id] === "undefined") {          
            return;
        }

        args = slice.call(arguments, 2);
        args.unshift(this.game);

        for (var i = 0, max = families.length; i < max; i += 1) {
            f = families[i];
            
            this._families[f].remove(entity);
        }

        var pattern = this._getEntityPattern(entity.name);

        pattern.remove && pattern.remove.apply(entity, args);

        entity.removeAllComponents(true);

        this._entities_pool.add(entity.name, entity);

        delete this._entities[id];
        delete this._entity_to_family_mapping[id];

        this._entity_ids_to_reuse.push(id);

        this._entities_count -= 1;
    }

    p.removeAllEntities = function () {
        if ( ! this.isUpdating()) {
            this._entities.forEach(function (entity) {
                this.remove(entity);
            }, this);
        } else {
            app.Game.warning("entities couldn't be removed due to engine's still running.");
        }

        return this;
    }

    p.markForRemoval = function (e) {
        this._entities_to_remove.push(e);
    }

    p.getEntity = function (id) {
        if ( ! isUndefined(this._entities[id])) {
            return this._entities[id];
        } else {
            return null;
        }
    }

    p.getEntitiesWith = function (c_array) {
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
    }

    p.getAllEntities = function () {
        return this._entities.map(function (entity) {
            return entity;
        });
    }

    p.getFamily = function (family) {
        if ( ! isString(family)) {
            app.Game.error("family name must be a string.");
        }

        if (this._families.hasOwnProperty(family)) {
            return this._families[family];
        } else {
            return this.BLANK_FAMILY;
        }
    }

    p.addSystem = function (name, priority) {
        var args = Array.prototype.slice.call(arguments, 2);

        var system = _system_pattern[name];

        system.name = name;
        system.game = this.game;
        system.engine = this;

        system.init && system.init.apply(system, args);

        this._systems.insert(system, priority);

        return this;
    }

    p.addSystems = function () {
        for (var i = 0; i < arguments.length; i += 1) {
            this.addSystem.apply(this, arguments[i]);
        }

        return this;
    }

    p.removeSystem = function (system) {
        if ( ! this.isUpdating()) {
            var args = Array.prototype.slice.call(arguments, 1);

            system.remove && system.remove.apply(system, args);

            this._systems.remove(system);
        }

        return this;
    }

    p.removeAllSystems = function () {
        while (this._systems.head) {
            this.removeSystem(this._systems.head.data);
        }

        return this;
    }

    p.isSystemActive = function (name) {
        var node = this._systems.head;

        while (node) {
            if (node.data.name === name) {
                return true;
            }

            node = node.next;
        }

        return false;
    }

    p.update = function (delta, event) {
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
    }

    p.clear = function () {
        app.addEventListener("afterupdate", function (e) {
            this.removeAllSystems();
            this.removeAllEntities();

        }, true);
    }

    p.canModify = function () {
        return _can_modify;
    }

    p.isUpdating = function () {
        return this._updating;
    }

    p.getComponentPoolSize = function () {
        return this._component_pool_size;
    }

    p._createComponentsIndex = function (entity_id) {
        this._components_index[entity_id] = [];

        for (var i = 0; i < _next_component_id; i += 1) {
            this._components_index[entity_id][i] = false;
        }
    }

    p._addEntityToFamilies = function (entity) {
        var families =  this._getFamiliesOfEntity(entity.name);

        for (var i = 0, max = families.length; i < max; i += 1) {
            var family = families[i];

            if ( ! (family in this._families)) {
                this._families[family] = new app.Family(family);
            }

            this._families[family].append(entity);
        }
    }

    p._getFamiliesOfEntity = function(name) {
        return _entity_pattern[name].families;
    }

    /*p._createPoolForEntity = function (name) {
        if (!this._entities_pool.hasOwnProperty(name)) {
            this._entities_pool[name] = [];
        }
    }*/

    p._addEntityToSystem = function (entity) {
        this._entities[entity.id] = entity;

        this._entities_count += 1;
    }

    p._getIdForNewEntity = function () {
        var id;

        if (this._entity_ids_to_reuse.length !== 0) {
            id = this._entity_ids_to_reuse.pop();
        } else {
            id = this._greatest_entity_id;
            this._greatest_entity_id += 1;

            this._createComponentsIndex(id);
        }

        return id;
    }

    p._getNewEntity = function (name) {
        var entity = this._entities_pool.get(name) || new app.Entity(name, this.game);
        entity.setId(this._getIdForNewEntity());

        return entity;
    }

    p._getEntityPattern = function (name) {
        if (name in _entity_pattern) {
            return _entity_pattern[name].pattern;
        } else {
            app.Game.error(["pattern for entity", name, "does not exist."].join(" "));
        }
    }



    app["Engine"] = Engine;
})(app);