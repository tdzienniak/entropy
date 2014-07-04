(function (Entropy) {
    var Entity = Entropy.Entity;
    var Utils = Entropy.Utils;
    /**
     * Internal node constructor.
     * @param {any} data any type of data, in most cases an Entity instance
     * @private
     * @constructor
     */
    function Node (data) {
        this.data = data;
        this.next = null;
    }

    Node.prototype = {
        getComponents: function () {
            return this.data.components;
        }
    };

    /**
     * Family implemented as singly linked list.
     * @param {String} name Family name
     * @constructor
     */
    function Family (name) {
        /**
         * Family name.
         * @type {String}
         */
        this.name = name;

        /**
         * Linked list head. Null if list is empty.
         * @type {Node|null}
         */
        this.head = null;

        /**
         * Helper variable indicating whether brake current iteration or not.
         * @type {Boolean}
         */
        this.break_iteration = false;

        this._current_node = this.head;
    }

    Family.prototype = {
        /**
         * Appends data (entity) at the beginnig of the list. Appended node becomes new head.
         * @param  {Entity} entity entity object
         * @return {Family} Family instance
         */
        append: function (entity) {
            var node = new Node(entity);

            node.next = this.head;
            this.head = node;

            return this;
        },

        /**
         * Removes given node/entity from the family.
         * @param  {Node|Entity} data entity or node to remove
         * @return {Family}      Family instance
         */
        remove: function (data) {
            var node = this.findPrecedingNode(data);
            
            if (node === null) { //remove head
                this.head = this.head.next;
            } else if (node !== -1) {
                var obolete_node = node.next;
                node.next = node.next.next;
                //prepare for removal by GC
                obolete_node = null;
            }
        },

        /**
         * Finds node preceding given data.
         * @param  {Node|Entity} data Entity or Node instance
         * @returns {Node} if data is found
         * @returns {null} if data is head
         * @returns {Number} -1 if there is no such data
         */
        findPrecedingNode: function (data) {
            //if data is head, there is no preceiding node, null returned
            if (data instanceof Node && data === this.head ||
                data instanceof Entity && this.head.data === data) {
                return null;
            }

            var node = this.head;
            while (node) {
                if ((data instanceof Node && node.next === data) ||
                    (data instanceof Entity && node.next !== null && node.next.data === data)) {
                    return node;
                }

                node = node.next;
            }

            return -1;
        },

        /**
         * Calls given callback for each node in the family.
         * @param  {Function} fn      callback function
         * @param  {object}   binding [description]
         */
        iterate: function (fn, binding) {
            binding = binding || (function () { return this; })();
            var args = Utils.slice(arguments, 2);

            var node = this.head;

            while (node) {
                 fn.call(binding, node.data, node.data.components, node, this);

                if (this.break_iteration) break;

                node = node.next;
            }

            this.break_iteration = false;
        },
        reset: function () {
            this._currentNode = this.head;

            return this;
        },
        next: function () {
            if (this._currentNode === null) {
                return null;
            }

            var returnNode = this._currentNode;
            this._currentNode = this._currentNode.next;

            return returnNode;
        },
        components: function (name) {
            if (this._currentNode === null) {
                return null;
            }

            if (typeof name === "string") {
                if (name in this._currentNode.data.components) {
                    return this._currentNode.data.components[name];
                } else {
                    Entropy.warning(["component", name, "is not present in entity", this._currentNode.data.name, "(", this._currentNode.data.id, ")"].join(" "));

                    return null;
                }
            } else {
                return this._currentNode.data.components;
            }
        },
        breakIteration: function () {
            this.break_iteration = true;
        },
        one: function () {
            return this.head.data;
        }
    };

    Entropy.Family = Family;

})(root);