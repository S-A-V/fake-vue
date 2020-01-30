import Dep from './dep';
import { arrayMethods } from './array';

class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep();

    // 当数组使用 7 种重写方法时，是无法进行依赖收集和派发更新的，此属性主要辅助数组更新
    Object.defineProperty(value, '__ob__', {
      value: this, // Observer 的实例
      enumerable: false, // 不可枚举
      writable: true,
      configurable: true,
    });

    if (Array.isArray(value)) {
      // 这里对数组做了额外判断
      // 通过重写数组原型方法来对数组的 7 种方法进行拦截
      protoAugment(value, arrayMethods);
      // 如果数组里面还包含数组，递归判断
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk(obj) {
    // 观测对象上的所有属性
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = obj[key];
      defineReactive(obj, key, value);
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray(items) {
    for (let i = 0; i < items.length; i++) {
      observe(items[i]);
    }
  }
}

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target, src) {
  target.__proto__ = src;
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe(value) {
  // 递归进行属性劫持
  if (typeof value !== 'object' || value === null) {
    return;
  }
  return new Observer(value);
}

/**
 * Define a reactive property on an Object.
 */
// 数据劫持核心
function defineReactive(obj, key, value) {
  // 为每个属性实例化一个 Dep
  let dep = new Dep();

  // 递归关键，如果 value 是对象，会继续走一遍 defineReactive，层层遍历直到 value 不是对象为止
  let childOb = observe(value);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      // 依赖收集。取值的时候把 watcher 收集到 dep 里面
      if (Dep.target) {
        // 如果有 watcher，dep 就会保存 watcher；同时 watcher 也会保存 dep
        dep.depend();
        // 属性的值依然是一个对象，包含数组和对象。childOb 指代的就是 Observer 实例对象，里面的 dep 进行依赖收集
        // 比如，{ a: [1, 2, 3] } 的属性 a 对应的值是一个数组，观测数组的返回值就是对应数组的 Observer 实例对象
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            // 如果数据结构类似 { a: [1, 2, [3, 4, [5, 6]]] } 这种多层嵌套数组
            // 那么访问 a 的时候，只是对第一层的数组进行了依赖收集。里面的数组因为没有访问到，所以无法收集依赖
            // 如果改变了 a 里面第二层数组的值，需要更新页面，所以需要对数组递归进行依赖收集
            debugger;
            dependArray(value);
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newValue) {
      if (newValue === value) {
        return;
      }
      value = newValue;
      // 如果新值也是对象，需要进行观测
      childOb = observe(newValue);
      // 派发更新，通知渲染 watcher 去更新
      dep.notify();
    },
  });
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
// 递归收集数组依赖
function dependArray(value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    // e.__ob__ 代表 e 已经被响应式观测了，但是没有收集依赖，所以把它们收集到自己的 Observer 实例的 dep 里面
    e && e.__ob__ && e.__ob__.dep.depend();
    // 如果数组里面还有数组，递归收集依赖
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}
