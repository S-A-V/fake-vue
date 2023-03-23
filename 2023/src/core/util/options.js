import { ASSET_TYPES, LIFECYCLE_HOOKS } from '../../shared/constants';
import { extend } from '../../shared/util';

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
// 合并策略
const strats = {};

/**
 * Hooks and props are merged as arrays.
 */
// 生命周期合并策略
function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal);
    } else {
      return Array.isArray(childVal) ? childVal : [childVal];
    }
  } else {
    return parentVal;
  }
}

LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets(parentVal, childVal) {
  /**
   * 如果有同名的全局组件和自定义的局部组件
   * parentVal 代表全局组件，childVal 代表自定义组件
   *
   * 首先会查找局部组件，有就使用，没有就从原型继承全局组件。res.__proto__ === parentVal
   */
  const res = Object.create(parentVal);
  if (childVal) {
    return extend(res, childVal);
  } else {
    return res;
  }
}

// 组件/指令/过滤器的合并策略
ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
export function mergeOptions(parent, child) {
  const options = {};
  let key;
  // 遍历父亲
  for (key in parent) {
    mergeFiled(key);
  }
  // 父亲没有但儿子有
  for (key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeFiled(key);
    }
  }
  function mergeFiled(key) {
    // 真正合并字段方法
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key]);
    } else {
      // 默认策略
      options[key] = child[key] ? child[key] : parent[key];
    }
  }
  return options;
}
