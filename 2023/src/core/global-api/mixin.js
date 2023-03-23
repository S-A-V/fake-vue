import { mergeOptions } from '../util/index';

export function initMixin(Vue) {
  Vue.mixin = function (mixin) {
    // 合并对象
    this.options = mergeOptions(this.options, mixin);
    return this;
  };
}
