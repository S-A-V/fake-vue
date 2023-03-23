import Vue from './runtime/index';
import { query } from './util/index';
import { compileToFunctions } from './compiler/index';

const mount = Vue.prototype.$mount;
// 代表的是 Vue 源码里面包含了 compile 编译功能，这个和 runtime-only 版本需要区分开
Vue.prototype.$mount = function (el) {
  el = el && query(el);
  const options = this.$options;
  debugger;

  // resolve template/el and convert to render function
  // 如果不存在 render 属性
  if (!options.render) {
    let template = options.template;
    if (template) {
      //
    } else if (el) {
      // 如果不存在 render 和 template，但是存在 el
      // 直接将模板赋值到 el 所在的外层 html 结构（就是 el 本身，并不是父元素）
      template = getOuterHTML(el);
    }
    if (template) {
      // 最终需要把 template 模板转化成 render 函数
      const render = compileToFunctions(template);
      options.render = render;
    }
  }
  return mount.call(this, el);
};

function getOuterHTML(el) {
  if (el.outerHTML) {
    return el.outerHTML;
  } else {
    const container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML;
  }
}

// Vue.compile = compileToFunctions

export default Vue;
