(function (app) {

    function Entity (name, game) {
        this.id = 0;
        this.name = name;
        this.engine = game.engine;
        this.game = game;
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

        var component_pattern = this.engine.getComponentPattern(name);
    
        if (!this.components.hasOwnProperty(lowercase_name)) {
            this.components[lowercase_name] = this.engine.getNewComponent(name);
        } else {
            this.components[lowercase_name].deleted = false;
            /*if (!this.recycled) {
                app.Game.warning(" you are trying to add same component twice. Existing component will be overridden.");
            }*/
        }

        component_pattern.init.apply(
            this.components[lowercase_name],
            args
        );

        this.engine.setComponentsIndex(this.id, this.components[lowercase_name].id);

        return this;
    };

    p.remove = function (name, soft_delete) {
        var lowercase_name = name.toLowerCase();

        if (soft_delete && this.components[lowercase_name].deleted) {
            //nothing to soft delete
            return this;
        }

        if (this.components.hasOwnProperty(lowercase_name)) {
            var component_pattern = this.engine.getComponentPattern(name);

            if (!soft_delete) {
                this.engine.addComponentToPool(name, this.components[lowercase_name]);

                delete this.components[lowercase_name];
            } else {
                this.components[lowercase_name].deleted = true;
            }

            this.engine.unsetComponentsIndex(this.id, this.components[lowercase_name].id);
        }

        return this;
    };

    p.removeAllComponents = function (soft_delete) {
        for (var lowercase_name in this.components) {
            this.remove(this.components[lowercase_name].name, soft_delete);
        }

        return this;
    };

    p.setId = function (id) {
        this.id = id;
    };

    p.setRecycled = function () {
        this.recycled = true;
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