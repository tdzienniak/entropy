var extend = require('node.extend');

/**
 * Simple implemenation of stack.
 *
 * @class Pool
 * @param {Number} initialSize initial pool size
 */
function Pool(initialSize) {
    this._maxSize = initialSize;
    this._currentSize = 0;
    this._pool = new Array(initialSize);

    for (var i = 0; i < initialSize; i++) {
        this._pool[i] = 0;
    }
}

extend(Pool.prototype, {
    /**
     * Puts value in the pool. Named pool, because it is used to implement pooling of various object in engine.
     *
     * @method put
     * @param  {Any} thing value to put in pool
     */
    put: function (thing) {
        if (this._currentSize === this._maxSize) {
            this._maxSize = Math.round(this._currentSize * 1.5);
            this._pool.lenght = this._maxSize;

            for (var i = this._currentSize + 1; i < this._maxSize; i++) {
                this._pool[i] = 0;
            }
        }

        this._pool[this._currentSize++] = thing;
    },
    /**
     * Gets value from the pool. Returns last put value.
     *
     * @method get
     * @return {Any} value from the pool
     */
    get: function () {
        if (this._currentSize === 0) {
            return null;
        }

        return this._pool[--this._currentSize];
    },
    /**
     * Returns current size of the pool (not maximum size).
     *
     * @method size
     * @return {Number} pool size
     */
    size: function () {
        return this._currentSize;
    }
});

module.exports = Pool;