// 定义 fake vue 构造函数

class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;

    // 响应化处理
    this.observe(this.$data);

    new Compile(options.el, this);

    if (options.created) {
      options.created.call(this);
    }
  }

  observe(value) {
    if (!value || typeof value !== "object") {
      return;
    }

    // 遍历 value
    Object.keys(value).forEach((key) => {
      // 响应式处理每个值
      this.defineReactive(value, key, value[key]);
      this.proxyData(key);
    });
  }

  defineReactive(obj, key, val) {
    this.observe(val);

    // 定义 Dep
    // 每个 Dep 实例与 data 中每个 key 有一一对应关系
    const dep = new Dep();

    // 给每一个 key 定义拦截
    Object.defineProperty(obj, key, {
      get() {
        // 依赖收集
        Dep.target && dep.addDep(Dep.target);
        return val;
      },
      set(newValue) {
        if (newValue !== val) {
          val = newValue;
          dep.notify();
          // console.log(key, 'update...')
        }
      },
    });
  }

  proxyData(key) {
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key];
      },
      set(newValue) {
        this.$data[key] = newValue;
      },
    });
  }
}

// 管理 watcher

class Dep {
  constructor() {
    // 存储所有依赖
    this.watchers = [];
  }

  addDep(watcher) {
    this.watchers.push(watcher);
  }

  notify() {
    this.watchers.forEach((watcher) => watcher.update());
  }
}

// 创建 watcher：保存 data 中数值和页面挂钩关系

class Watcher {
  constructor(vm, key, cb) {
    // 创建实例时，将该实例指向 Dep target， 便于依赖收集
    this.vm = vm;
    this.key = key;
    this.cb = cb;

    Dep.target = this;
    // 触发依赖收集
    this.vm[this.key];
    Dep.target = null;
  }

  update() {
    console.log(this.key, "updateding...");
    this.cb.call(this.vm, this.vm[this.key]);
  }
}
