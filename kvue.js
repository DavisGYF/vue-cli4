// 数据响应式
function defineReactive(obj, key, val) {
  // 递归处理
  observe(val);

  // 创建一个Dep实例
  const dep = new Dep();

  Object.defineProperty(obj, key, {
    get() {
      // console.log("get", key);

      // 依赖收集: 把watcher和dep关联
      // 希望Watcher实例化时，访问一下对应key，同时把这个实例设置到Dep.target上面
      Dep.target && dep.addDep(Dep.target);

      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        console.log("set", key, newVal);
        observe(newVal);
        val = newVal;

        // 通知更新
        dep.notify();
      }
    },
  });
}

// 让我们使一个对象所有属性都被拦截
function observe(obj) {
  if (typeof obj !== "object" || obj == null) {
    return;
  }

  // 创建Observer实例:以后出现一个对象，就会有一个Observer实例
  new Observer(obj);
}

// 代理data中数据
function proxy(vm) {
  Object.keys(vm.$data).forEach((key) => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key];
      },
      set(v) {
        vm.$data[key] = v;
      },
    });
  });
}

// KVue:
// 1.响应式操作
class KVue {
  constructor(options) {
    // 保存选项
    this.$options = options;
    this.$data = options.data;

    //获取 页面method 里面的 方法
    this.$method = options.method;

    console.log("this.methiod", this.$method);

    // 响应化处理
    observe(this.$data);

    // 代理
    proxy(this);

    // 编译器
    new Compiler("#app", this);
  }
}

// 做数据响应化
class Observer {
  constructor(value) {
    this.value = value;
    this.walk(value);
  }

  // 遍历对象做响应式
  walk(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key]);
    });
  }
}

// Compiler: 解析模板，找到依赖，并和前面拦截的属性关联起来
// new Compiler('#app', vm)
class Compiler {
  constructor(el, vm) {
    console.log(el, "el ---compiler --vm", vm);
    this.$vm = vm;
    this.$el = document.querySelector(el);

    console.log("vm.$options.methods", vm.$options.methods);
    this.compile(this.$el, vm.$options.methods);
  }

  compile(el, method) {
    // 遍历这个el
    el.childNodes.forEach((node) => {
      // 是否是元素
      // console.log("node", node, node.nodeType);
      if (node.nodeType === 1) {
        // console.log(node, "编译元素---method", method);
        this.compileElement(node, method);
      } else if (this.isInter(node)) {
        this.compileText(node);
      }

      if (node.childNodes) {
        this.compile(node);
      }
    });
  }

  // 解析绑定表达式{{}}
  compileText(node) {
    this.update(node, RegExp.$1, "text");
  }

  // 编译元素
  compileElement(node, method) {
    const attrs = node.attributes;
    Array.from(attrs).forEach((attr) => {
      // attr:   {name: 'k-text', value: 'counter'}
      const attrName = attr.name;
      const exp = attr.value;
      if (attrName.indexOf("k-") === 0) {
        const dir = attrName.substring(2);
        this[dir] && this[dir](node, exp);
      }

      console.log("attr--", attr, method);
      if (attrName.indexOf("@") === 0) {
        // 有很多 事件处理啊 @click @foucus 等等 以 @click 为例子
        const dirEvent = attrName.substring(1);
        console.log(
          node,
          dirEvent,
          "exp----这个是click---------clicik-----",
          exp
        );
        // console.log("function--method", method);
        // method[exp]();

        // document.getElementsByTagName("button")[0].addEventListener("click", function() {
        //     document.getElementById("ktext").innerHTML = "Hello World";
        //   });
        const fn = method && method;
        node.addEventListener(dirEvent, method[exp].bind(this.$vm));
        console.log("method-------121", method[exp]);
      }
    });
  }

  // k-text
  text(node, exp) {
    // node.textContent = this.$vm[exp]
    this.update(node, exp, "text");
  }

  // k-html
  html(node, exp) {
    // node.innerHTML = this.$vm[exp]
    this.update(node, exp, "html");
  }

  // k-model
  model(node, exp) {
    // node.innerHTML = this.$vm[exp]
    this.update(node, exp, "model");

    node.addEventListener("input", (e) => {
      console.log(this.$vm, "e", e);
      this.$vm[exp] = e.target.value;
    });
  }

  // dir:要做的指令名称
  // 一旦发现一个动态绑定，都要做两件事情，首先解析动态值；其次创建更新函数
  // 未来如果对应的exp它的值发生变化，执行这个watcher的更新函数
  update(node, exp, dir) {
    // 初始化
    const fn = this[dir + "Updater"];
    fn && fn(node, this.$vm[exp]);

    // 更新，创建一个Watcher实例
    new Watcher(this.$vm, exp, (val) => {
      fn && fn(node, val);
    });
  }

  textUpdater(node, val) {
    node.textContent = val;
  }

  htmlUpdater(node, val) {
    node.innerHTML = val;
  }

  // 文本节点且形如{{xx}}
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }

  modelUpdater(node, value, dir) {
    node.value = value;
    // @input = onInput
  }
}

// 管理一个依赖，未来执行更新
class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn;

    // 读一下当前key，触发依赖收集
    Dep.target = this;
    vm[key];
    Dep.target = null;
  }

  // 未来会被dep调用
  update() {
    this.updateFn.call(this.vm, this.vm[this.key]);
  }
}

// Dep: 保存所有watcher实例，当某个key发生变化，通知他们执行更新
class Dep {
  constructor() {
    this.deps = [];
  }

  addDep(watcher) {
    this.deps.push(watcher);
  }

  notify() {
    this.deps.forEach((dep) => dep.update());
  }
}
