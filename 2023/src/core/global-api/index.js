import { initMixin } from './mixin';
import { initExtend } from './extend';
import { initAssetRegisters } from './assets';
import { ASSET_TYPES } from '../../shared/constants';

export function initGlobalAPI(Vue) {
  Vue.options = {};
  // initMixin(Vue);
  // 全局组件/指令/过滤器
  ASSET_TYPES.forEach((type) => {
    Vue.options[type + 's'] = {};
  });

  // _base 是 Vue 构造函数
  Vue.options._base = Vue;

  initMixin(Vue);
  // 注册 extend 方法
  initExtend(Vue);
  // 注册 assets 方法
  initAssetRegisters(Vue);
}
