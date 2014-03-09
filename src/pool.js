(function (Entropy) {

    function Pool () {
        this.size = 0;
        this.pool = {};
    }

    Entropy.Utils.extend(Pool.prototype, {
        add: function (key, value) {
            if ( ! (key in this.pool)) {
                this.pool[key] = [];
            }

            this.size += 1;

            return this.pool[key].push(value);
        },
        get: function (key) {
            if (this.exists(key)) {
                this.size -= 1;

                return this.pool[key].pop();
            } else {
                return false;
            }
        },
        exists: function (key) {
            return key in this.pool && this.pool[key].length > 0;
        }
    });

    Entropy.Pool = Pool;

})(app);