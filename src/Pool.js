import stampit from 'stampit';
import FastArray from 'fast-array';

const Pool = stampit({
  init(options) {
    this._pool = FastArray();

    this._new = options._new;
    this._reuse = options._reuse;
  },
  methods: {
    free(obj) {
      if (this._free) {
        this._free(obj);
      }

      this._pool.push(obj);
    },
    allocate(...args) {
      let obj;

      if (this._pool.length) {
        if (this._reuse) {
          obj = this._reuse(this._pool.pop(), ...args);
        } else {
          obj = this._pool.pop();
        }
      } else {
        obj = this._new(...args);
      }

      return obj;
    },
  },
});

export default Pool;
