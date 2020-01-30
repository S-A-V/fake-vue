import Watcher from '../observer/watcher';
import Dep from '../observer/dep';
import { observe } from '../observer/index';
import { noop } from '../util/index';

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
};

export function proxy(target, sourceKey, key) {
  Object.defineProperty(target, key, {
    get() {
      return target[sourceKey][key];
    },
    set(val) {
      target[sourceKey][key] = val;
    },
  });
}

// 初始化状态，顺序依次是：prop > methods > data > computed > watch
export function initState(vm) {
  const opts = vm.$options;
  if (opts.props) initProps(vm, opts.props);
  if (opts.methods) initMethods(vm, opts.methods);
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) initComputed(vm, opts.computed);
  if (opts.watch) {
    initWatch(vm, opts.watch);
  }
}

function initProps() {}

// 初始化 data 数据
function initData(vm) {
  let data = vm.$options.data;
  // 实例的 _data 属性就是传入的 data
  // 组件 data 推荐使用函数，防止数据在组件之间共享
  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {};

  // 把 data 数据代理到 vm，也就是 Vue 实例上面。我们可以使用 this.a 来访问 this._data.a
  for (let key in data) {
    proxy(vm, `_data`, key);
  }

  // 对数据进行观测（响应式数据核心）
  observe(data, true /* asRootData */);
}

function getData(data, vm) {
  try {
    return data.call(vm, vm);
  } catch (e) {
    return {};
  }
}

const computedWatcherOptions = { lazy: true };

function initComputed(vm, computed) {
  // 用来存放计算 watcher
  const watchers = (vm._computedWatchers = {});

  for (let key in computed) {
    // 获取用户定义的计算属性
    const userDef = computed[key];
    const getter = typeof userDef === 'function' ? userDef : userDef.get;
    // 创建计算属性 watcher
    watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
    defineComputed(vm, key, userDef);
  }
}

function defineComputed(target, key, userDef) {
  // 如果是函数
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
  return function computedGetter() {
    // 获取对应的计算属性 watcher
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      // 计算属性取值的时候，如果是脏的，需要重新求值
      if (watcher.dirty) {
        watcher.evaluate();
      }
      // 如果 Dep 还存在 target，这个时候一般为渲染 watcher，计算属性依赖的数据也需要收集
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    }
  };
}

function initMethods() {}

// 初始化 watch
function initWatch(vm, watch) {
  for (let key in watch) {
    const handler = watch[key];
    // 可能是数组/对象/函数/字符串
    if (Array.isArray(handler)) {
      handler.forEach((item) => {
        createWatcher(vm, key, item);
      });
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(vm, expOrFn, handler, options = {}) {
  if (typeof handler === 'object') {
    // 保存用户传入的对象
    options = handler;
    // 是函数
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options);
}

export function stateMixin(Vue) {
  Vue.prototype.$watch = function (expOrFn, cb, options = {}) {
    const vm = this;
    options.user = true;
    // 这里表示是一个用户 watcher
    let watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb();
    }
  };
}
