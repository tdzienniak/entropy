(function (Entropy) {
    "use strict";

    var Utils = Entropy.Utils;
    var EventEmitter = Entropy.EventEmitter;

    function Entity (name, game) {
        this.id = 0;
        this.name = name;
        
        this.engine = game.engine;
        this.game = game;
        
        this.components = {};

        this.recycled = false;
        this.bitset = new BitSet(Entropy.MAX_COMPONENTS_COUNT);
        this.pattern = {};

        this._inFinalState = false;
        this._stateChanges = [];
        this._stateObject = {};
        this._currentStates = [];

        this.engine.on("engine:updateFinished", this._applyStateChanges, this);
    }

    Utils.extend(Entity.prototype, {
        add: function (name) {
            var args = [];

            if (arguments.length > 1) {
                args = Utils.slice(arguments, 1);
            }

            var lowercase_name = name.toLowerCase();

            var component_pattern = this.engine.getComponentPattern(name);
        
            if (!(lowercase_name in this.components)) {
                this.components[lowercase_name] = this.engine.getNewComponent(name);
            } else {
                this.components[lowercase_name].deleted = false;
            }

            component_pattern.initialize.apply(
                this.components[lowercase_name],
                args
            );

            this.bitset.set(this.components[lowercase_name].bit);

            return this;
        },

        remove: function (name, soft_delete) {
            var lowercase_name = name.toLowerCase();
            
            if (soft_delete && this.components[lowercase_name].deleted) {
                //nothing to soft delete
                return this;
            }

            if (lowercase_name in this.components) {
                var component_pattern = this.engine.getComponentPattern(name);

                if (!soft_delete) {
                    this.engine.addComponentToPool(name, this.components[lowercase_name]);

                    delete this.components[lowercase_name];
                } else {
                    this.components[lowercase_name].deleted = true;
                }

                this.bitset.clear(this.components[lowercase_name].bit);

            }

            return this;
        },

        has: function (name) {
            return name.toLowerCase() in this.components;
        },

        removeAllComponents: function (soft_delete) {
            for (var lowercase_name in this.components) {
                if (this.components.hasOwnProperty(lowercase_name)) {
                    this.remove(this.components[lowercase_name].name, soft_delete);
                }
            }

            return this;
        },

        setId: function (id) {
            this.id = id;
        },
        getPattern: function () {
            return this.pattern;
        },
        setPattern: function (pattern) {
            this.pattern = pattern;
        },
        setRecycled: function () {
            this.recycled = true;
        },
        enter: function (name) {
            if (this._inFinalState) {
                Entropy.log("entity ", this.name, " is in its final state.");
                return this;
            }

            var args = Utils.slice(arguments, 1);

            if (this.pattern.states && !this.pattern.states[name]) {
                Entropy.warning("there is no state " + name + " for entity " + this.name);
                return this;
            }

            var pattern = this.pattern.states[name];

            if (pattern.excluding) {
                this._exitAllStates();
            }

            this._stateChanges.push({
                name: name,
                action: "enter",
                args: args
            });

            return this;
        },
        exit: function (name) {
            if (this._inFinalState) {
                Entropy.warning("entity " + this.name + " is in its final state.");

                return this;
            }

            if (!this.in(name)) {
                Entropy.warning("entity " + this.name + " is not in state " + name + ". No exiting required.");

                return this;
            }

            var args = Utils.slice(arguments, 1);

            this._stateChanges.push({
                name: name,
                action: "exit",
                args: args
            });

            return this;
        },
        in: function () {
            if (arguments.length === 0) {
                return false;
            }

            var states = Utils.slice(arguments, 0);

            for (var i = states.length - 1; i > -1; i--) {
                var state = states[i];
                if (this._currentStates.indexOf(state) === -1) {
                    return false;
                }
            }

            return true;
        },
        _getStatePattern: function (name) {
            return this.engine._getStatePattern(this.name, name);
        },
        _exitAllStates: function () {
            this._currentStates.forEach(function (state) {
                this.exit(this.state);
            }, this);

            return this;
        },
        _applyStateChanges: function () {

            var change;

            while (change = this._stateChanges.shift()) {
                if (this._inFinalState) {
                    return;
                }

                if ("states" in this.pattern && change.name in this.pattern.states) {
                    if (
                        change.action === "enter" && this.in(change.name) ||
                        change.action === "exit" && !this.in(change.name)
                    ) {
                        continue;
                    }

                    var pattern = this.pattern.states[change.name];

                    this._stateObject[change.name] = this._stateObject[change.name] || {};

                    change.args.unshift(this._stateObject[change.name]);

                    pattern[change.action] && pattern[change.action].apply(this, change.args);

                    if (change.action === "enter") {
                        this._currentStates.push(change.name);
                    } else if (change.action === "exit") {
                        this._currentStates.splice(this._currentStates.indexOf(change.name), 1);
                        delete this._stateObject[change.name];
                    }

                    if (pattern.final) {
                        this._inFinalState = true;
                    }
                }
            }
        }
    });

    Entropy.Entity = Entity;

})(root);