(function (app) {

    function Node (data) {
        this.data = data;
        this.next = null;
    }

    function Family (name) {
        this.name = name;

        this.head = this.tail = null;

        this.break_iteration = false;
    }

    Family.prototype = {
        append: function (entity) {
            var node = new Node(entity);

            if (this.head === null) {
                this.head = node;
                this.tail = this.head;
            } else if (this.head.next === null) {
                this.head.next = node;
                this.tail = this.head.next;
            } else {
                this.tail.next = node;
                this.tail = node;
            }
        },
        remove: function (data) {
            var node = this.findPrecedingNode(data);

            if (node !== -1) {
                var obolete_node = node.next;
                node.next = node.next.next;

                //prepare for removal by GC
                obolete_node = null;
            }
        },
        findPrecedingNode: function (data) {
            var node = this.head;

            while (node) {
                if (data instanceof Node) {
                    if (node.next === data) { return node; }
                } else if (data instanceof app.Entity) {
                    if (node.next !== null && node.next.data === data) { return node; }
                } else {
                    return -1;
                }

                node = node.next;
            }

            return -1;
        },
        iterate: function (fn, binding) {
            binding = binding || (function () { return this; })();

            var node = this.head;

            while (node) {

                fn.call(binding, node.data, node.data.components, node, this);

                if (this.break_iteration) break;

                node = node.next;
            }

            this.break_iteration = false;
        },
        breakIteration: function () {
            this.break_iteration = true;
        },
        one: function () {
            return this.head.data;
        }
    };

    app["Family"] = Family;

})(app);