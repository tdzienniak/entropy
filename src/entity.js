(function (app) {
    var COMP_ID = 0;
    var COMP_OBJ = 1;

    function Entity (id, engine, recycled) {
        this.id = id;
        this.engine = engine;
        this.components = {};
        this.recycled = false;

        this.states = {
            default: {
                onEnter: function () {},
                onExit: function () {}
            }
        };
        this.current_state = "default";
    }

    var p = Entity.prototype;

    p.add = function (name) {
        var args = [];

        if (arguments.length > 1) {
            args = Array.prototype.slice.call(arguments, 1);
        }

        var lowercase_name = name.toLowerCase();

        var component_pattern = this.engine._getComponentPattern(name);
    
        if (!this.components.hasOwnProperty(lowercase_name)) {
            this.components[lowercase_name] = this.engine._getComponentObject(name);
        } else {
            if (!this.recycled) {
                app.Game.warning(" you are trying to add same component twice. Existing component will be overridden.");
            }
        }

        component_pattern.init.apply(
            this.components[lowercase_name],
            args);

        return this;
    };

    p.remove = function (name) {
        var args = [];

        if (arguments.length > 1) {
            args = Array.prototype.slice.call(arguments, 1);
        }

        var lowercase_name = name.toLowerCase();

        if (!this.components.hasOwnProperty(lowercase_name)) {
            var component_pattern = this.engine._getComponentPattern(name);

            component_pattern.remove && component_pattern.remove.apply(
                this.components[lowercase_name],
                args);

            this.engine._addComponentToPool(name, this.components[lowercase_name]);

            delete this.components[lowercase_name];
        } else {
            app.Game.warning("there is no such component it this entity.");
        }

        return this;
    };

    p.addState = function (name, obj) {
        if (!this.states.hasOwnProperty(name)) {
            this.states[name] = obj;
        } else {
            app.Game.warning("such state already exists.");
        }

        return this;
    };

    p.state = function (name) {
        var args = [];

        if (arguments.length > 1) {
            args = Array.prototype.slice.call(arguments, 1);
        }

        this.states[this.current_state].onExit.apply(
            this.states[this.current_state],
            args);

        this.current_state = name;

        return this;
    };


    app["Entity"] = Entity;

})(app);