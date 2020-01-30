import { createElement } from '../../vdom/create-element';
import { createTextVNode } from '../../vdom/vnode';

// render 函数里的 _c、_s、_v 方法需要定义
export function installRenderHelpers(target) {
  // 创建虚拟 dom 元素
  target._c = function (...args) {
    return createElement(this, ...args);
  };

  // toString，如果模板里是一个对象，需要 JSON.stringify
  target._s = function (val) {
    return val === null ? '' : typeof val === 'object' ? JSON.stringify(val) : val;
  };

  // 创建虚拟 dom 文本
  target._v = createTextVNode;
}
