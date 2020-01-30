import { initState } from './state';
import { initRender } from './render';
import { callHook } from './lifecycle';
import { mergeOptions } from '../util/index';

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;

    // 这里的 this 代表调用 _init 方法的对象，即实例对象
    // this.$options 就是 new Vue 时候传入的属性和全局 Vue.options 合并之后的结果
    vm.$options = mergeOptions(vm.constructor.options, options);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initState(vm); // 初始化状态
    callHook(vm, 'created');

    // 如果有 el 属性，进行模板渲染
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}
