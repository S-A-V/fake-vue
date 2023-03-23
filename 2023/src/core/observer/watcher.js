import { isObject } from '../util/index';
import { queueWatcher } from './scheduler';
import { pushTarget, popTarget } from './dep';

// 全局变量，每次 new Watcher 都会自增
let id = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export default class Watcher {
  constructor(vm, exprOrFn, cb, options, isRenderWatcher) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    if (options) {
      this.user = !!options.user; // 标识用户 watcher
      this.lazy = !!options.lazy; // 标识计算属性 watcher
    } else {
      this.user = this.lazy = false;
    }
    this.options = options; // 额外的选项，true 代表渲染 watcher
    this.cb = cb; // 回调函数，比如在 watcher 更新之前可以执行 beforeUpdate 方法
    this.id = id++; // watcher 的唯一标识
    this.dirty = this.lazy; // dirty，可变。表示计算 watcher 是否需要重新计算（执行用户定义的方法）
    this.deps = []; // 存放 dep 的容器
    this.depIds = new Set(); // 用来去重 dep
    this.exprOrFn = exprOrFn;
    // 如果表达式是一个函数
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn;
    } else {
      // 用户 watcher 传过来的可能是一个字符串，类似 a.b.c.d
      this.getter = function () {
        let obj = vm;
        let segments = exprOrFn.split('.');
        for (let i = 0; i < segments.length; i++) {
          obj = obj[segments[i]]; // vm.a.b.c.d
        }
        return obj;
      };
    }
    // 非计算属性实例化就会默认调用 get 方法进行取值，保留结果
    this.value = this.lazy ? undefined : this.get();
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get() {
    // 在调用方法之前先把当前 watcher 实例推到全局 Dep.target 上
    pushTarget(this);
    let value;
    const vm = this.vm;
    /**
     * 如果是渲染 watcher，相当于执行 vm._update(vm._render())
     * render 函数执行的时候会取值，从而实现依赖收集
     */
    value = this.getter.call(vm);
    // 在调用方法之后把当前 watcher 实例从全局 Dep.target 移除
    popTarget();
    return value;
  }

  /**
   * 把 dep 放到 deps 里面，同时保证同一个 dep 只被保存到 watcher 一次
   * 同样，同一个 watcher 也只会保存在 dep 一次
   */
  addDep(dep) {
    const id = dep.id;
    if (!this.depIds.has(id)) {
      this.depIds.add(id);
      this.deps.push(dep);
      // 调用 dep 的 addSub 方法，把自己（watcher 实例）添加到 dep 的 subs 容器里
      dep.addSub(this);
    }
  }

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  // 简单执行一下 get 方法，之后涉及到计算属性就不一样了
  update() {
    // 计算属性依赖的值发生变化，只需要把 dirty 置为 true，下次访问到了重新计算
    if (this.lazy) {
      this.dirty = true;
    } else {
      // 每次 watcher 进行更新的时候，可以让他们先缓存起来，之后再一起调用
      // 异步队列机制
      queueWatcher(this);
    }
  }

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  run() {
    const newVal = this.get(); // 新值
    const oldVal = this.value; // 老值
    this.value = newVal;
    if (this.user) {
      if (newVal !== oldVal || isObject(newVal)) {
        this.cb.call(this.vm, newVal, oldVal);
      }
    } else {
      // 渲染 watcher
      this.cb.call(this.vm);
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }

  /**
   * Depend on all deps collected by this watcher.
   */
  depend() {
    // 计算属性的 watcher 存储了依赖项的 dep
    let i = this.deps.length;
    while (i--) {
      // 调用依赖项的 dep 去收集渲染 watcher
      this.deps[i].depend();
    }
  }
}
