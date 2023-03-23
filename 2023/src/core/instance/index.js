import { initMixin } from './init';
import { stateMixin } from './state';
import { renderMixin } from './render';
import { lifecycleMixin } from './lifecycle';

// Vue 是一个构造函数，通过 new 关键字进行实例化
function Vue(options) {
  // 这里开始进行 Vue 初始化工作
  this._init(options);
}

// _init 方法是挂载在 Vue 原型上的方法，通过引入文件的方式进行原型挂载需要传入 Vue
// 此做法有利于代码分割
initMixin(Vue);
stateMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

export default Vue;
