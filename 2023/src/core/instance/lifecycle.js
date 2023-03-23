import Watcher from '../observer/watcher';

export function lifecycleMixin(Vue) {
  // 把 _update 挂载到 Vue 的原型
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // 缓存上一次的 vnode
    const prevVnode = vm._vnode;
    vm._vnode = vnode;
    if (!prevVnode) {
      // patch 是渲染 vnode 为真实 dom 的核心
      // 初次渲染 vm._vnode 肯定不存在，要通过虚拟节点渲染出真实的 dom，赋值给 $el 属性
      vm.$el = vm.__patch__(vm.$el, vnode);
    } else {
      // 更新时把上次的 vnode 和这次更新的 vnode 传进去，进行 diff 算法
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
  };
}

export function mountComponent(vm, el) {
  /**
   * 上一步模板编译，解析生成了 render 函数
   * 下一步就是执行 vm._render() 方法，调用生成的 render 函数，生成虚拟 dom
   * 最后使用 vm._update() 方法把虚拟 dom 渲染到页面
   */

  // 真实的 el 赋值给实例的 $el 属性
  vm.$el = el;
  callHook(vm, 'beforeMount');

  let updateComponent = () => {
    // _update 和 _render 方法都是挂载在 Vue 原型上的方法，类似 _init
    vm._update(vm._render());
  };

  // 注册一个渲染 watcher，执行 vm._update(vm._render()) 方法渲染视图
  new Watcher(
    vm,
    updateComponent,
    () => {
      callHook(vm, 'beforeUpdate');
    },
    true,
    true /* isRenderWatcher */
  );

  callHook(vm, 'mounted');
  return vm;
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook];
  // 依次执行生命周期对应的方法
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      // 生命周期里面的 this 指向当前实例
      handlers[i].call(vm);
    }
  }
}
