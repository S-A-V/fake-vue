import Vue from '../../core/index';
import { mountComponent } from '../../core/instance/lifecycle';
import { query } from '../util/index';
import { patch } from './patch';

// install platform patch function
Vue.prototype.__patch__ = patch;

Vue.prototype.$mount = function (el) {
  el = el ? query(el) : undefined;
  // 将当前组件实例挂载到真实的 el 节点上面
  return mountComponent(this, el);
};

export default Vue;
