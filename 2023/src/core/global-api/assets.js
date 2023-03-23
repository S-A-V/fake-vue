import { ASSET_TYPES } from '../../shared/constants';

export function initAssetRegisters(Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach((type) => {
    Vue[type] = function (id, definition) {
      if (type === 'component') {
        // 全局组件注册
        // 子组件可能也有 extend 方法，VueComponent.component 方法
        definition.name = definition.name || id;
        definition = this.options._base.extend(definition);
      } else if (type === 'filter') {
      } else if (type === 'directive') {
      }
      this.options[type + 's'][id] = definition;
      return definition;
    };
  });
}
