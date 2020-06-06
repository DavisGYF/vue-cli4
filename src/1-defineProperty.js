function defineReactive(obj, key, val) {
  observe(val);

  Object.defineProperty(obj, key, {
    get() {
      console.log("get---", key, val);
      return val;
    },

    set(newVal) {
      if (newVal !== val) {
        // observe(newVal);

        console.log(val, "--val---set函数-key--newVal--", key, newVal);
        val = newVal;
      }
    },
  });
}

function set(obj, key, val) {
  defineReactive(obj, key, val);
}

function observe(obj) {
  if (typeof obj !== "object" || obj == null) {
    return;
  }

  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, obj[key]);
  });
}

const obj = { a: 1, b: 2, c: { c1: 11, c2: 22 } };
observe(obj);
obj.a;
// obj.c = { c3: 33 };
obj.d;
set(obj, "e", "e");
