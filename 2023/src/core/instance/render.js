import { nextTick } from '../util/next-tick';
import { createElement } from '../vdom/create-element';
import { installRenderHelpers } from './render-helpers/index';

export function initRender(vm) {
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d);
}

export function renderMixin(Vue) {
  installRenderHelpers(Vue.prototype);

  // 挂载在原型上的 nextTick 方法
  Vue.prototype.$nextTick = nextTick;

  Vue.prototype._render = function () {
    const vm = this;
    // 获取模板编译生成的 render 方法
    const { render } = vm.$options;

    // 生成 vnode，虚拟 dom
    const vnode = render.call(vm, vm.$createElement);
    return vnode;
  };
}
