import VNode from '../vdom/vnode';
import { createComponent } from './create-component';
import { isReservedTag } from '../util/index';

// 创建元素 vnode，等同于 render 函数里的 h => h(App)
export function createElement(context, tag, data = {}, ...children) {
  let vnode;
  if (isReservedTag(tag)) {
    // platform built-in elements
    // 如果是普通 HTML 标签
    vnode = new VNode(tag, data, children);
  } else {
    // 否则就是组件
    // 获取组件的构造函数
    let Ctor = context.$options.components[tag];
    vnode = createComponent(Ctor, data, context, children, tag);
  }
  return vnode;
}
