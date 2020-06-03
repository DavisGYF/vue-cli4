let Vue;

class Store {
  // function partial(fn, arg) {
  // 	return function() {
  // 		return fn(arg);
  // 	};
  // }

  constructor(options) {
    console.log(this, "--this-options----", options.getters);

    this._mutations = options.mutations;
    this._actions = options.actions;
    this._getters = options.getters;
    /* 
    const objgetters = options.getters;
    this.getters = options.getters;

    const objettersKeysArr = Object.keys(objgetters);

    const computed = {};

    const storeThis = this;
    // {{ doubleCounter(){}  }}
    objettersKeysArr.forEach((itemKey) => {
      console.log(this, this.getters, "000000itemKey111111", itemKey);
      // computed[itemKey] = function() {
      //   return options.getters[itemKey](this.state);
      // };

      // computed[itemKey] = function(fn) { return fn(this.state); };
      const fn = storeThis.getters[itemKey];

      computed[itemKey] = function() {
        return fn(storeThis.state);
      };

      Object.defineProperty(this.getters, itemKey, {
        get() {
          // return objgetters[itemKey](store.state); // this._vm._data.$$state; // get: () => store._vm[key],
          console.log("this----------", this, this._vm, this._vm[itemKey]);
          // return computed[itemKey];
          return this._vm[itemKey];
        },
        enumerable: true,
      });
		}); */

    const computed = {};
    this.getters = {};
    // { doubleCounter(){}  }

    const store = this;

    Object.keys(this._getters).forEach((key) => {
      const fn = store._getters[key];
      computed[key] = function() {
        return fn(store.state);
      };

      Object.defineProperty(store.getters, key, {
        get: () => store._vm[key],
      });
    });

    this._vm = new Vue({
      data: {
        $$state: options.state,
      },
      computed,
      // computed: {

      //   // doubleCounter: this.getFn,
      //   // doubleCounter: options.getters.doubleCounter(store.state),
      //   // doubleCounter: function() {
      //   // doubleCounter: function() {
      //   //   console.log("stroe-couble---------", options.getters[firstKey]);
      //   //   return options.getters.doubleCounter(state);
      //   //   // return options.getters[firstKey];
      //   // },
      // },
    });

    // console.log(computed, "---objetters--------arr", objettersKeysArr);

    console.log("store00000000", store);

    this.getFn = function() {
      console.log("op", options.getters);
      return options.getters.doubleCounter(store.state);
    };

    const { commit, dispatch } = store;
    this.commit = function boundCommit(type, payload) {
      commit.call(store, type, payload);
    };
    this.dispatch = function boundDispatch(type, payload) {
      dispatch.call(store, type, payload);
    };
  }

  get state() {
    return this._vm._data.$$state;
  }

  set state(v) {
    console.error("错误了---");
  }

  commit(type, payload) {
    const entry = this._mutations[type];

    if (!entry) {
      console.error("大兄弟，没有这个mutation");
      return;
    }

    entry(this.state, payload);
  }

  dispatch(type, payload) {
    const entry = this._actions[type];

    if (!entry) {
      console.error("大兄弟，没有这个action");
      return;
    }

    entry(this, payload);
  }
}

function install(_Vue) {
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    },
  });
}

export default { Store, install };
