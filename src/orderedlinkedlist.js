(function (Entropy) {
    "use strict";
    
    /**
     * Linked list conctructor.
     * It initializes head and tail properties with null value.
     */
    function OrderedLinkedList () {
        this.head = this.tail = null;
    }

    /**
     * Returns node object.
     * @param {any} data data to store in node
     */
    function Node (data) {
            this.next = null;
            this.priority = null;
            this.data = data;
    }

    OrderedLinkedList.prototype = {

        /**
         * Adds new node at the end of the list.
         * Function is only a syntactic sugar.
         * @param  {any} data any valid JavaScript data
         * @return {OrderedLinkedList} this
         */
        append: function (data) {
            return this.insert(data);
        },

        /**
         * Removes given node (or node with given data) from list.
         * @param  {Node|data} node
         * @return {undefined}
         */
        remove: function (node) {
            if (node === this.head || node === this.head.data) {
                this.head = this.head.next;

                return this;
            }

            var i = this.head;

            while (i.next !== node && i.next.data !== node) {
                i = i.next;
            }

            i.next = node.next;

            if (node === this.tail || node === this.tail.data) {
                this.tail = i;
            }

            node = null;

            return this;
        },
        /**
         * Insert new node into list.
         * 
         * @param  {any} data     data to store in list node
         * @param  {number} priority [optional] if specified, function inserts data before node with higher priority
         * @return {object}       list instance             
         */
        insert: function (data, priority) {
            var node = new Node(data);

            /*
             * list is empty
             */
            if (this.head === null) {
                node.priority = priority || 0;
                this.head = this.tail = node;

                return this;
            }

            var current = this.head;

            node.priority = priority || this.tail.priority;

            /*
             * list contains only one node (head === tail)
             */
            if (current.next === null) {
                if (current.priority <= node.priority) {
                    current.next = node;
                    this.tail = current.next;
                } else {
                    this.head = node;
                    this.head.next = this.tail = current;
                }

                return this;
            }

            /*
             * node priority is greater or equal tail priority
             * node should become tail
             */
            if (node.priority >= this.tail.priority) {
                this.tail.next = node;
                this.tail = node;

                return this;
            }

            /*
             * node priority is less than head priority
             * node should become head
             */
            if (node.priority < this.head.priority) {
                node.next = this.head;
                this.head = node;

                return this;
            }

            /*
             * list has more than one node
             */
            while (current.next !== null) { 
               if (current.next.priority > node.priority) {
                    node.next = current.next;
                    current.next = node;

                    break;
                }

                current = current.next;
            }

            return this;
        },
        /**
         * Iterates over all list nodes, starting from head, calling function for every node.
         * @param  {Function} fn [description]
         * @return {[type]}      [description]
         */
        iterate: function (fn) {
            for (var node = this.head; node; node = node.next) {
                fn(this, node);
            }
        },
        /**
         * Clears list.
         * @return {[type]} [description]
         */
        clear: function () {
            this.head = this.tail = null;
        }
    };

    Entropy.OrderedLinkedList = OrderedLinkedList;
})(root);