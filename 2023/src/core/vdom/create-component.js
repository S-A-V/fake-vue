import VNode from './vnode';
import { isObject } from '../util/index';

export function createComponent(Ctor, data, context, children, tag) {
  const baseCtor = context.$options._base;

  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  data = data || {};

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  // 组件 vnode（占位符 vnode），$vnode
  const name = tag;
  const vnode = new VNode(`vue-component-${Ctor.cid}-${name}`, data, undefined, undefined, {
    Ctor,
    tag,
    children,
  });

  return vnode;
}

function installComponentHooks(data) {
  // 声明组件自己内部的生命周期
  data.hook = {
    // 组件创建过程中，自身的初始化方法
    init(vnode) {
      debugger;
      // 实例化组件
      const child = (vnode.componentInstance = new vnode.componentOptions.Ctor({ _isComponent: true }));
      // 因为没有传入 el 属性，需要手动挂载。为了在组件实例上面增加 $el 方法，可用于生成组件的真实渲染节点
      child.$mount();
    },
  };
}
