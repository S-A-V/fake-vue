import { mergeOptions } from '../util/index';

export function initExtend(Vue) {
  let cid = 0;

  // 创建子类继承 Vue 父类，便于属性扩展
  Vue.extend = function (extendOptions = {}) {
    const Super = this;

    // 创建子类的构造函数，并且调用初始化方法
    const Sub = function VueComponent(options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype); // 子类原型指向父类
    Sub.prototype.constructor = Sub; // constructor 指向自己
    Sub.cid = cid++; // 组件的唯一标识
    Sub.options = mergeOptions(Super.options, extendOptions); // 合并自己的 options 和父类的 options
    Sub['super'] = Super;
    return Sub;
  };
}
