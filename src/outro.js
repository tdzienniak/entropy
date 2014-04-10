    if (typeof define === "function" && define.amd) {
        define(function () {
            return root;
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = root;
    } else {
        this.Entropy = root;
    }
})();