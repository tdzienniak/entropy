(function (Entropy) {

    function Pool () {
        this.size = 0;
        this.pool = {};
    }

    Entropy.Utils.extend(Pool.prototype, {
        push: function (key, value) {
            if (!(key in this.pool)) {
                this.pool[key] = [];
            }

            this.size += 1;

            return this.pool[key].push(value);
        },
        pop: function (key) {
            if (this.has(key)) {
                this.size -= 1;

                return this.pool[key].pop();
            } else {
                return false;
            }
        },
        has: function (key) {
            return key in this.pool && this.pool[key].length > 0;
        },
        size: function () {
            return this.size;
        }
    });

    Entropy.Pool = Pool;
})(root);