// 保留数组原型
const arrayProto = Array.prototype;
// 然后将 arrayMethods 继承自数组原型
// 这里是面向切片编程思想（AOP），不破坏封装的前提下，动态地扩展功能
export const arrayMethods = Object.create(arrayProto);

const methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method];
  arrayMethods[method] = function (...args) {
    // 保留原型方法的执行结果
    const result = original.apply(this, args);
    // this 代表的是数据本身。比如数据是 { a: [1, 2, 3] }，那么使用 a.push(4)，this 就是 a，ob 就是 a.__ob__
    // 这个属性代表该数据已经被响应式观测过了，__ob__ 对象指的就是 Observer 实例
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
      default:
        break;
    }
    // 对新增的每一项进行观测
    if (inserted) ob.observeArray(inserted);
    // 派发更新。在 get 的时候判断如果属性的值还是对象，那么就在 Observer 实例的 dep 收集依赖
    // 所以这里是一一对应的，可以直接更新
    ob.dep.notify();
    return result;
  };
});
