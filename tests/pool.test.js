(function () {
    module("Pool test module.", {
        setup: function () {
            this.newPool = new Entropy.Pool();
        },
        teardown: function () {

        }
    });

    test("adding to empty pool", function () {

        var result = this.newPool.add("myKey1", {foo: "bar"});

        ok(result, "result is true");
        deepEqual(this.newPool.pool["myKey1"][0], {foo: "bar"}, "pool was created for given key and value was added");
    });
})();